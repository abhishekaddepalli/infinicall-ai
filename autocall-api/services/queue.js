const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const { db } = require('../models');
const Campaign = db.Campaign;
const UserSettings = db.UserSettings;
const PhoneNumber = db.PhoneNumber;
const Agent = db.Agent;
const Call = db.Call;
const ContactGroup = db.ContactGroup;
const SMSCampaign = db.SMSCampaign;
const Contact = db.Contact;
const SMSLog = db.SMSLog;
const twilioService = require('./twilioService');
const plivoService = require('./plivoService');
const vobizService = require('./vobizService');
const elevenLabsService = require('./elevenlabsService');
const fs = require('fs');
const csv = require('fast-csv');
const whatsappService = require('./whatsappService');
const whatsappCallingService = require('./whatsappCallingService');
const whatsappWebrtcService = require('./whatsappWebrtcService');
const notificationHelper = require('../utils/notificationHelper');
const { getUserLimits } = require('../utils/limitHelper');
const creditService = require('./creditService');
const webhookDispatcher = require('./webhookDispatcher');
const SmsSession = require('../models/sms-session.model');
const SmsMessage = require('../models/sms-message.model');

let connection;
let campaignQueue;

if (process.env.REDIS_URL) {

  const client = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  });
  const subscriber = client.duplicate();
  const publisher = client.duplicate();

  connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
  campaignQueue = new Queue('campaign-queue', { connection });

  const worker = new Worker('campaign-queue', async (job) => {
    const { campaignId, type } = job.data;

    if (type === 'process-campaign') {
      await executeCampaignDirectly(campaignId);
    } else if (type === 'process-sms-campaign') {
      await executeSmsCampaignDirectly(campaignId);
    }
  }, {
    connection,
    concurrency: 5
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });
}

async function executeCampaignDirectly(campaignId) {
  const app = require('../app');
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

  console.log(`Executing campaign: ${campaign.name}`);

      const userSettings = await UserSettings.findOne({ user: campaign.userId });
      const globalSettings = await db.Setting.findOne();
      const twilioAccountSid = userSettings?.twilio_account_sid || globalSettings?.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = userSettings?.twilio_auth_token || globalSettings?.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN;
      const elevenlabsApiKey = userSettings?.elevenlabs_api_key || globalSettings?.elevenlabs_api_key || process.env.ELEVENLABS_API_KEY;
      const plivoAuthId = userSettings?.plivo_auth_id || globalSettings?.plivo_auth_id || process.env.PLIVO_AUTH_ID;
      const plivoAuthToken = userSettings?.plivo_auth_token || globalSettings?.plivo_auth_token || process.env.PLIVO_AUTH_TOKEN;
      const vobizAuthId = userSettings?.vobiz_auth_id || globalSettings?.vobiz_auth_id || process.env.VOBIZ_AUTH_ID;
      const vobizAuthToken = userSettings?.vobiz_auth_token || globalSettings?.vobiz_auth_token || process.env.VOBIZ_AUTH_TOKEN;

      if (!twilioAccountSid || !twilioAuthToken) {
        console.warn('Twilio credentials not found in UserSettings, System Settings, or .env');
      }

      let phoneNumberDoc;
      let fromNumber;
      if (campaign.phoneNumberModel === 'WhatsappPhoneNumber') {
        const WhatsappPhoneNumber = db.WhatsappPhoneNumber;
        phoneNumberDoc = await WhatsappPhoneNumber.findById(campaign.phoneNumberId).lean();
        if (phoneNumberDoc) {
          phoneNumberDoc.type = 'whatsapp';
          phoneNumberDoc.phone_number = phoneNumberDoc.display_phone_number;
          fromNumber = phoneNumberDoc.display_phone_number;
        }
      } else {
        const PhoneNumber = db.PhoneNumber;
        phoneNumberDoc = await PhoneNumber.findById(campaign.phoneNumberId).lean();
        if (phoneNumberDoc) fromNumber = phoneNumberDoc.phone_number;
      }

      if (!phoneNumberDoc) {
        throw new Error('Phone number not found');
      }

      const agent = await Agent.findById(campaign.agentId);
      const flowId = agent ? agent.flow_id : null;
      const Contact = db.Contact;
      const appUrl = process.env.APP_URL || 'http://localhost:3000';

      const rawContacts = [];

      if (campaign.contactFile && fs.existsSync(campaign.contactFile)) {
        await new Promise((resolve, reject) => {
          fs.createReadStream(campaign.contactFile)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row) => {
              const to = row.phone_number || row.phone || row.phoneNumber;
              const name = row.first_name || row.name || row.lead_name || '';
              if (to) {
                rawContacts.push({ phone: to, name });
              }
            })
            .on('end', resolve)
            .on('error', reject);
        });
      }

      if (campaign.contactIds && campaign.contactIds.length > 0) {
        const dbContacts = await Contact.find({ _id: { $in: campaign.contactIds } });
        for (const dbContact of dbContacts) {
          if (dbContact.phone_number) {
            rawContacts.push({
              phone: dbContact.phone_number,
              name: [dbContact.first_name, dbContact.last_name].filter(Boolean).join(' ') || ''
            });
          }
        }
      }

      if (campaign.contactGroupIds && campaign.contactGroupIds.length > 0) {
        const groups = await ContactGroup.find({
          _id: { $in: campaign.contactGroupIds }
        }).populate('group_contacts');
        for (const group of groups) {
          for (const dbContact of group.group_contacts) {
            if (dbContact.phone_number) {
              rawContacts.push({
                phone: dbContact.phone_number,
                name: [dbContact.first_name, dbContact.last_name].filter(Boolean).join(' ') || ''
              });
            }
          }
        }
      }

      const uniqueContacts = [];
      const seenPhones = new Set();
      const existingCalls = await Call.find({ campaign_id: campaignId }).select('to_number');
      const processedNumbers = new Set(existingCalls.map(c => c.to_number.replace(/\s+/g, '')));

      for (const contact of rawContacts) {
        const normalizedPhone = contact.phone.replace(/\s+/g, '');
        if (!seenPhones.has(normalizedPhone) && !processedNumbers.has(normalizedPhone)) {
          seenPhones.add(normalizedPhone);
          uniqueContacts.push({ to: contact.phone, name: contact.name });
        }
      }

      let successCount = 0;
      let failCount = 0;
      let lastErrorMsg = '';

      let isStopped = false;
      if (uniqueContacts.length > 0) {
        for (const row of uniqueContacts) {
          const currentCampaign = await Campaign.findById(campaignId).select('campaignStatus');
          if (currentCampaign && ['Paused', 'Cancelled'].includes(currentCampaign.campaignStatus)) {
            console.log(`Campaign ${campaignId} was ${currentCampaign.campaignStatus}. Stopping execution.`);
            isStopped = true;
            break;
          }

          const to = row.to;
          const name = row.name;

          const contactCheck = await Contact.findOne({ user_id: campaign.userId, phone_number: to });
          if (contactCheck && contactCheck.is_blocked) {
            console.log(`Skipping call to blocked contact: ${to}`);
            failCount++;
            lastErrorMsg = 'Contact is blocked due to policy violations.';
            await Call.create({
              user_id: campaign.userId,
              flow_id: flowId,
              agent_id: campaign.agentId,
              campaign_id: campaign._id,
              twilio_call_sid: 'blocked_' + Date.now(),
              from_number: fromNumber,
              to_number: to,
              status: 'failed',
              direction: 'outbound',
              lead_name: name,
              fail_reason: lastErrorMsg
            });
            const CampaignHistory = db.CampaignHistory;
            await CampaignHistory.create({
              campaignId: campaign._id,
              leadName: name,
              leadPhone: to,
              callStatus: 'CALL FAILED',
              callFailReason: lastErrorMsg,
              callTime: new Date()
            });
            continue;
          }

          const twimlUrl = `${appUrl}/api/calls/twiml?flowId=${flowId}&userId=${campaign.userId}&agentId=${campaign.agentId}`;

          try {
            if (agent.telephony_provider === 'meta_whatsapp' || phoneNumberDoc.type === 'whatsapp') {
              let phoneNumberId;
              if (campaign.phoneNumberModel === 'WhatsappPhoneNumber') {
                phoneNumberId = phoneNumberDoc.whatsapp_phone_number_id;
              } else {
                const waPhoneDoc = await db.WhatsappPhoneNumber.findOne({ phone_number: phoneNumberDoc.phone_number, user_id: campaign.userId });
                if (!waPhoneDoc) {
                  throw new Error('WhatsApp phone number configuration not found');
                }
                phoneNumberId = waPhoneDoc.whatsapp_phone_number_id || waPhoneDoc.phone_number_id;
              }

              const contactForCall = await db.Contact.findOne({ phone_number: to });

              const { sdp, pc, audioSource } = await whatsappWebrtcService.initiateOutboundCall(
                phoneNumberId,
                to,
                agent,
                contactForCall
              );

              const internalCallId = `wa_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              const callIdRes = await whatsappCallingService.initiateOutboundCallApi(phoneNumberId, to, sdp, {
                is_outbound: true,
                contact_id: contactForCall?._id,
                agent_id: campaign.agentId,
                user_id: campaign.userId,
                campaign_id: campaign._id,
                internal_call_id: internalCallId
              });
              const callSid = internalCallId;
              whatsappWebrtcService.storeOutboundConnection(callSid, pc, audioSource, phoneNumberId);

              await Call.create({
                user_id: campaign.userId,
                flow_id: flowId,
                agent_id: campaign.agentId,
                campaign_id: campaign._id,
                twilio_call_sid: callSid,
                from_number: fromNumber,
                to_number: to,
                status: 'queued',
                direction: 'outbound',
                lead_name: name,
              });

              await new Promise(resolve => setTimeout(resolve, 3000));
              console.log(`WhatsApp Call to ${to} initiated with ID: ${callSid}`);
              successCount++;
            } else if (phoneNumberDoc.type === 'sip' && phoneNumberDoc.elevenlabs_phone_number_id && elevenlabsApiKey) {
              try {
                let elevenlabsAgentId = agent ? agent.elevenlabs_agent_id : null;
                if (!elevenlabsAgentId) {
                  try {
                    const newAgent = await elevenLabsService.createAgent({
                      name: agent ? agent.name : 'AI Campaign Assistant',
                      conversation_config: {
                        agent: {
                          prompt: { prompt: (agent && (agent.system_prompt || agent.personality)) || 'You are a helpful AI voice assistant.' },
                          first_message: (agent && agent.first_message) || 'Hello! How can I help you today?'
                        }
                      }
                    }, elevenlabsApiKey);
                    if (newAgent && (newAgent.agent_id || newAgent.id)) {
                      elevenlabsAgentId = newAgent.agent_id || newAgent.id;
                      if (agent) await Agent.findByIdAndUpdate(agent._id, { elevenlabs_agent_id: elevenlabsAgentId });
                    }
                  } catch (e) {
                    console.error('Failed to auto-create ElevenLabs agent ID for campaign:', e);
                  }
                }

                if (!elevenlabsAgentId) throw new Error('ElevenLabs agent ID not configured');

                const sipResponse = await elevenLabsService.makeSipOutboundCall(
                  elevenlabsAgentId,
                  phoneNumberDoc.elevenlabs_phone_number_id,
                  to,
                  elevenlabsApiKey
                );

                const callSid = sipResponse.sip_call_id || sipResponse.conversation_id || `sip_${Date.now()}`;

                await Call.create({
                  user_id: campaign.userId,
                  flow_id: flowId,
                  agent_id: campaign.agentId,
                  campaign_id: campaign._id,
                  twilio_call_sid: callSid,
                  from_number: fromNumber,
                  to_number: to,
                  status: 'queued',
                  direction: 'outbound',
                  lead_name: name,
                });

                await new Promise(resolve => setTimeout(resolve, 3000));
                console.log(`SIP Call to ${to} initiated with ID: ${callSid}`);
                successCount++;
                continue;
              } catch (sipErr) {
                console.warn(`ElevenLabs SIP Outbound Call failed (${sipErr.message}), falling back to Twilio dispatch.`);
              }
            }

            if (phoneNumberDoc.provider === 'plivo') {
              if (!plivoAuthId || !plivoAuthToken) {
                throw new Error('Plivo credentials not found for this user');
              }
              const xmlUrl = `${appUrl}/api/calls/plivo-xml?flowId=${flowId}&userId=${campaign.userId}&agentId=${campaign.agentId}`;
              const statusCallbackUrl = `${appUrl}/api/calls/plivo-status`;

              const plivoCall = await plivoService.makeCall(
                plivoAuthId,
                plivoAuthToken,
                fromNumber,
                to,
                xmlUrl,
                statusCallbackUrl
              );

              await Call.create({
                user_id: campaign.userId,
                flow_id: flowId,
                agent_id: campaign.agentId,
                campaign_id: campaign._id,
                twilio_call_sid: plivoCall.requestUuid,
                from_number: fromNumber,
                to_number: to,
                status: 'queued',
                direction: 'outbound',
                lead_name: name,
              });

              let callStatus = 'queued';
              let pollAttempts = 0;
              while (!['completed', 'failed', 'busy', 'no-answer', 'canceled', 'declined', 'missed'].includes(callStatus) && pollAttempts < 12) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                pollAttempts++;
                try {
                  callStatus = await plivoService.getCallStatus(
                    plivoAuthId,
                    plivoAuthToken,
                    plivoCall.requestUuid
                  );
                } catch (statusError) {
                  console.error(`Error fetching status for Plivo call ${plivoCall.requestUuid}:`, statusError);
                  break;
                }
              }
              console.log(`Plivo Call to ${to} finished with status: ${callStatus}`);

              let mappedCallStatus = callStatus;
              if (callStatus === 'busy') mappedCallStatus = 'declined';
              if (callStatus === 'no-answer') mappedCallStatus = 'missed';

              await Call.findOneAndUpdate(
                { twilio_call_sid: plivoCall.requestUuid },
                { status: mappedCallStatus, ended_at: new Date() }
              );

              successCount++;
            } else if (phoneNumberDoc.provider === 'vobiz') {
              if (!vobizAuthId || !vobizAuthToken) {
                throw new Error('Vobiz credentials not found for this user');
              }
              const xmlUrl = `${appUrl}/api/calls/vobiz-xml?flowId=${flowId}&userId=${campaign.userId}&agentId=${campaign.agentId}`;
              const statusCallbackUrl = `${appUrl}/api/calls/vobiz-status`;

              const vobizCall = await vobizService.makeCall(
                vobizAuthId,
                vobizAuthToken,
                fromNumber,
                to,
                xmlUrl,
                statusCallbackUrl
              );

              await Call.create({
                user_id: campaign.userId,
                flow_id: flowId,
                agent_id: campaign.agentId,
                campaign_id: campaign._id,
                twilio_call_sid: vobizCall.requestUuid,
                from_number: fromNumber,
                to_number: to,
                status: 'queued',
                direction: 'outbound',
                lead_name: name,
              });

              let callStatus = 'queued';
              let pollAttempts = 0;
              while (!['completed', 'failed', 'busy', 'no-answer', 'canceled', 'declined', 'missed'].includes(callStatus) && pollAttempts < 12) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                pollAttempts++;
                try {
                  callStatus = await vobizService.getCallStatus(
                    vobizAuthId,
                    vobizAuthToken,
                    vobizCall.requestUuid
                  );
                } catch (statusError) {
                  console.error(`Error fetching status for Vobiz call ${vobizCall.requestUuid}:`, statusError);
                  break;
                }
              }
              console.log(`Vobiz Call to ${to} finished with status: ${callStatus}`);

              let mappedCallStatus = callStatus;
              if (callStatus === 'busy') mappedCallStatus = 'declined';
              if (callStatus === 'no-answer') mappedCallStatus = 'missed';

              await Call.findOneAndUpdate(
                { twilio_call_sid: vobizCall.requestUuid },
                { status: mappedCallStatus, ended_at: new Date() }
              );

              successCount++;
            } else {
              try {
                if (!twilioAccountSid || !twilioAuthToken) {
                  throw new Error('Twilio credentials not configured in settings or .env');
                }
                const statusCallbackUrl = `${appUrl}/api/calls/status`;
                const call = await twilioService.makeCall(
                  twilioAccountSid,
                  twilioAuthToken,
                  fromNumber,
                  to,
                  twimlUrl,
                  statusCallbackUrl
                );

                await Call.create({
                  user_id: campaign.userId,
                  flow_id: flowId,
                  agent_id: campaign.agentId,
                  campaign_id: campaign._id,
                  twilio_call_sid: call.sid,
                  from_number: fromNumber,
                  to_number: to,
                  status: 'queued',
                  direction: 'outbound',
                  lead_name: name,
                });

                let callStatus = call.status || 'queued';
                let pollAttempts = 0;
                while (!['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(callStatus) && pollAttempts < 12) {
                  await new Promise(resolve => setTimeout(resolve, 5000));
                  pollAttempts++;
                  try {
                    callStatus = await twilioService.getCallStatus(
                      twilioAccountSid,
                      twilioAuthToken,
                      call.sid
                    );
                  } catch (statusError) {
                    console.error(`Error fetching status for call ${call.sid}:`, statusError);
                    break;
                  }
                }
                console.log(`Call to ${to} finished with status: ${callStatus}`);

                let mappedCallStatus = callStatus;
                if (callStatus === 'busy') mappedCallStatus = 'declined';
                if (callStatus === 'no-answer') mappedCallStatus = 'missed';

                await Call.findOneAndUpdate(
                  { twilio_call_sid: call.sid },
                  { status: mappedCallStatus, ended_at: new Date() }
                );

                successCount++;
              } catch (callErr) {
                console.error(`Call failed for contact ${to}:`, callErr.message);
                failCount++;
                lastErrorMsg = callErr.message || 'Call failed';
                await Call.create({
                  user_id: campaign.userId,
                  flow_id: flowId,
                  agent_id: campaign.agentId,
                  campaign_id: campaign._id,
                  twilio_call_sid: 'failed_' + Date.now(),
                  from_number: fromNumber,
                  to_number: to,
                  status: 'failed',
                  direction: 'outbound',
                  lead_name: name,
                  fail_reason: lastErrorMsg
                });
                await db.CampaignHistory.create({
                  campaignId: campaign._id,
                  leadName: name,
                  leadPhone: to,
                  callStatus: 'CALL FAILED',
                  callFailReason: lastErrorMsg,
                  callTime: new Date()
                });
              }
            }
          } catch (error) {
            failCount++;
            lastErrorMsg = error.message;
            await Call.create({
              user_id: campaign.userId,
              flow_id: flowId,
              agent_id: campaign.agentId,
              campaign_id: campaign._id,
              twilio_call_sid: 'failed_' + Date.now() + '_' + Math.random().toString(36).substring(7),
              from_number: fromNumber,
              to_number: to,
              status: 'failed',
              direction: 'outbound',
              lead_name: name,
              fail_reason: error.message
            });


          }
        }
      }

      if (isStopped) return;

      if (uniqueContacts.length > 0 && failCount === uniqueContacts.length) {
        await Campaign.findByIdAndUpdate(campaignId, { campaignStatus: 'Failed', fail_reason: lastErrorMsg });
        webhookDispatcher.dispatchEvent(campaign.userId, 'Campaign Errored', { campaignId: campaign._id, reason: lastErrorMsg });
        console.log(`Campaign ${campaignId} failed.`);

        try {
          await notificationHelper.sendNotification(
            app,
            campaign.userId,
            'CAMPAIGN_STATUS',
            'Campaign Failed',
            `Your campaign "${campaign.name}" failed: ${lastErrorMsg}`
          );
        } catch (notifErr) {
          console.error(`Failed to send notification for campaign ${campaignId}:`, notifErr);
        }
      } else {
        await Campaign.findByIdAndUpdate(campaignId, { campaignStatus: 'Completed' });
        webhookDispatcher.dispatchEvent(campaign.userId, 'Campaign Finished', { campaignId: campaign._id });
        console.log(`Campaign ${campaignId} processed successfully.`);

        try {
          await notificationHelper.sendNotification(
            app,
            campaign.userId,
            'CAMPAIGN_STATUS',
            'Campaign Completed',
            `Your campaign "${campaign.name}" has been completed.`
          );
        } catch (notifErr) {
          console.error(`Failed to send notification for campaign ${campaignId}:`, notifErr);
        }
      }

      if (settings.post_campaign_whatsapp_template) {
        console.log(`Triggering post-campaign WhatsApp for campaign ${campaignId}`);
        for (const contact of uniqueContacts) {
          try {
            await whatsappService.sendTemplateMessage({
              userId: campaign.userId,
              to: contact.to,
              templateId: settings.post_campaign_whatsapp_template,
              dynamicData: {
                contact: { first_name: contact.name, phone_number: contact.to },
                campaign: { name: campaign.name }
              },
              campaignId: campaign._id
            });
          } catch (waErr) {
            console.error(`Post-campaign WhatsApp failed for ${contact.to}:`, waErr.message);
      }
    }
  }
}

async function executeSmsCampaignDirectly(campaignId) {
  const app = require('../app');
  const campaign = await SMSCampaign.findById(campaignId);
      if (!campaign) throw new Error(`SMS Campaign ${campaignId} not found`);

      console.log(`Executing SMS campaign: ${campaign.name}`);

      const settings = await UserSettings.findOne({ user: campaign.user_id });
      if (!settings || !settings.twilio_account_sid || !settings.twilio_auth_token) {
        throw new Error('Twilio credentials not found for this user');
      }

      const phoneNumberDoc = await PhoneNumber.findById(campaign.phoneNumberId);
      if (!phoneNumberDoc) {
        throw new Error('Phone number not found');
      }
      const fromNumber = phoneNumberDoc.phone_number;

      const rawContacts = [];

      if (campaign.contact_file && fs.existsSync(campaign.contact_file)) {
        await new Promise((resolve, reject) => {
          fs.createReadStream(campaign.contact_file)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row) => {
              const to = row.phone_number || row.phone || row.phoneNumber;
              const name = row.first_name || row.name || row.lead_name || '';
              const custom_data = { ...row };
              if (to) {
                rawContacts.push({ phone: to, name, custom_data });
              }
            })
            .on('end', resolve)
            .on('error', reject);
        });
      }

      if (campaign.contactIds && campaign.contactIds.length > 0) {
        const dbContacts = await Contact.find({ _id: { $in: campaign.contactIds } });
        for (const dbContact of dbContacts) {
          if (dbContact.phone_number) {
            rawContacts.push({
              phone: dbContact.phone_number,
              name: [dbContact.first_name, dbContact.last_name].filter(Boolean).join(' ') || '',
              custom_data: {}
            });
          }
        }
      }

      if (campaign.contactGroupIds && campaign.contactGroupIds.length > 0) {
        const groups = await ContactGroup.find({
          _id: { $in: campaign.contactGroupIds }
        }).populate('group_contacts');
        for (const group of groups) {
          for (const dbContact of group.group_contacts) {
            if (dbContact.phone_number) {
              rawContacts.push({
                phone: dbContact.phone_number,
                name: [dbContact.first_name, dbContact.last_name].filter(Boolean).join(' ') || '',
                custom_data: {}
              });
            }
          }
        }
      }

      const uniqueContacts = [];
      const seenPhones = new Set();
      const existingSMS = await SMSLog.find({ campaign_id: campaignId }).select('to_number');
      const processedNumbers = new Set(existingSMS.map(c => c.to_number.replace(/\s+/g, '')));

      for (const contact of rawContacts) {
        const normalizedPhone = contact.phone.replace(/\s+/g, '');
        if (!seenPhones.has(normalizedPhone) && !processedNumbers.has(normalizedPhone)) {
          seenPhones.add(normalizedPhone);
          uniqueContacts.push({ to: contact.phone, name: contact.name, custom_data: contact.custom_data });
        }
      }

      const limits = await getUserLimits(campaign.user_id);
      const smsLimit = limits.campaign_sms_limit;

      let contactsToProcess = uniqueContacts;
      if (smsLimit !== -1 && smsLimit !== null && smsLimit !== undefined) {
        const currentUsage = await SMSLog.countDocuments({ user_id: campaign.user_id, status: 'sent' });
        const remaining = Math.max(0, smsLimit - currentUsage);
        contactsToProcess = uniqueContacts.slice(0, remaining);
      }

      let messageBody = campaign.content;

      let successCount = 0;
      let failCount = 0;
      let lastErrorMsg = '';

      const Setting = db.Setting;
      const globalSettings = await Setting.findOne();
      const creditsPerSms = globalSettings ? (globalSettings.credits_per_sms || 1) : 1;

      let isStopped = false;
      if (contactsToProcess.length > 0) {
        for (const row of contactsToProcess) {
          const currentCampaign = await SMSCampaign.findById(campaignId).select('status');
          if (currentCampaign && ['Paused', 'Cancelled'].includes(currentCampaign.status)) {
            console.log(`SMS Campaign ${campaignId} was ${currentCampaign.status}. Stopping execution.`);
            isStopped = true;
            break;
          }

          const to = row.to;
          const name = row.name;

          const contactCheck = await Contact.findOne({ user_id: campaign.user_id, phone_number: to });
          if (contactCheck && contactCheck.is_blocked) {
            console.log(`Skipping SMS to blocked contact: ${to}`);
            failCount++;
            lastErrorMsg = 'Contact is blocked due to policy violations.';
            await SMSLog.create({
              user_id: campaign.user_id,
              campaign_id: campaign._id,
              lead_name: name,
              from_number: fromNumber,
              to_number: to,
              message_body: 'Message skipped (Contact blocked)',
              status: 'failed',
              fail_reason: lastErrorMsg
            });
            continue;
          }

          let personalizedBody = messageBody.replace(/{{name}}/g, name || 'there');

          if (row.custom_data) {
            for (const [key, value] of Object.entries(row.custom_data)) {
              const regex = new RegExp(`{{${key}}}`, 'gi');
              personalizedBody = personalizedBody.replace(regex, value || '');
            }
          }

          try {
            const balance = await creditService.getCreditBalance(campaign.user_id);
            if (!balance.is_admin && balance.available_credits < creditsPerSms) {
              throw new Error(`Insufficient credits. Available: ${balance.available_credits}, Required: ${creditsPerSms}`);
            }

            let sentMessage = null;
            let twilioMessageSid = null;
            
            if (phoneNumberDoc.provider === 'plivo') {
              if (!settings.plivo_auth_id || !settings.plivo_auth_token) {
                throw new Error('Plivo credentials not found for this user');
              }
              sentMessage = await plivoService.sendSMS(
                settings.plivo_auth_id,
                settings.plivo_auth_token,
                fromNumber,
                to,
                personalizedBody
              );
              twilioMessageSid = sentMessage.messageUuid ? sentMessage.messageUuid[0] : null;
            } else {
              sentMessage = await twilioService.sendSMS(
                settings.twilio_account_sid,
                settings.twilio_auth_token,
                fromNumber,
                to,
                personalizedBody
              );
              twilioMessageSid = sentMessage ? sentMessage.sid : null;
            }

            if (!balance.is_admin) {
              await creditService.deductCredits(
                campaign.user_id,
                creditsPerSms,
                'sms_deduction',
                `SMS Campaign: ${campaign.name} (To: ${to})`,
                campaign._id,
                'sms_campaign'
              );
            }

            await SMSLog.create({
              user_id: campaign.user_id,
              campaign_id: campaign._id,
              lead_name: name,
              from_number: fromNumber,
              to_number: to,
              message_body: personalizedBody,
              status: 'sent',
              twilio_message_sid: twilioMessageSid
            });

            console.log(`SMS sent to ${to} for campaign ${campaignId}`);
            successCount++;
          } catch (error) {
            console.error(`Failed to send SMS to ${to}:`, error.message);
            failCount++;
            lastErrorMsg = error.message;

            await SMSLog.create({
              user_id: campaign.user_id,
              campaign_id: campaign._id,
              lead_name: name,
              from_number: fromNumber,
              to_number: to,
              message_body: personalizedBody,
              status: 'failed',
              fail_reason: error.message
            });
          }
        }
      }

      if (isStopped) return;

      if (contactsToProcess.length > 0 && failCount === contactsToProcess.length) {
        await SMSCampaign.findByIdAndUpdate(campaignId, { status: 'Failed', fail_reason: lastErrorMsg });
        webhookDispatcher.dispatchEvent(campaign.user_id, 'Campaign Errored', { campaignId: campaign._id, reason: lastErrorMsg });
        console.log(`SMS Campaign ${campaignId} failed.`);

        try {
          await notificationHelper.sendNotification(
            app,
            campaign.user_id,
            'CAMPAIGN_STATUS',
            'SMS Campaign Failed',
            `Your SMS campaign "${campaign.name}" failed: ${lastErrorMsg}`
          );
        } catch (notifErr) {
          console.error(`Failed to send notification for SMS campaign ${campaignId}:`, notifErr);
        }
      } else {
        await SMSCampaign.findByIdAndUpdate(campaignId, { status: 'Completed' });
        webhookDispatcher.dispatchEvent(campaign.user_id, 'Campaign Finished', { campaignId: campaign._id });
        console.log(`SMS Campaign ${campaignId} processed successfully.`);

        try {
          await notificationHelper.sendNotification(
            app,
            campaign.user_id,
            'CAMPAIGN_STATUS',
            'SMS Campaign Completed',
            `Your SMS campaign "${campaign.name}" has been completed.`
          );
        } catch (notifErr) {
          console.error(`Failed to send notification for SMS campaign ${campaignId}:`, notifErr);
        }
        }
      }

const removeCampaignJob = async (campaignId) => {
  if (campaignQueue) {
    try {
      const jobs = await campaignQueue.getJobs(['waiting', 'delayed', 'active', 'paused', 'completed', 'failed']);
      for (const job of jobs) {
        if (job.data && job.data.campaignId === campaignId.toString()) {
          await job.remove();
          console.log(`Removed job ${job.id} for campaign ${campaignId} from BullMQ/Redis`);
        }
      }
    } catch (error) {
      console.error(`Error removing jobs for campaign ${campaignId}:`, error);
    }
  }
};

module.exports = { campaignQueue, removeCampaignJob, executeCampaignDirectly };
