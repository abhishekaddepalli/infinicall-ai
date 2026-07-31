const Voice = require('../models/voice.model');
const elevenlabsService = require('../services/elevenlabsService');
const sarvamService = require('../services/sarvamService');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

exports.getAllVoices = async (req, res) => {
  try {
    const voices = await Voice.find({ status: 'active' }).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: voices
    });
  } catch (error) {
    console.error('Get Voices Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch voices'
    });
  }
};

exports.synthesizeSpeech = async (req, res) => {
  try {
    const { text, voice_id, stability, similarity_boost } = req.body;

    if (!text || !voice_id) {
      return res.status(400).json({
        success: false,
        message: 'Text and voice_id are required'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Text is too long (max 5000 characters)'
      });
    }

    let audioBuffer;
    if (voice_id.startsWith('sarvam-')) {
      audioBuffer = await sarvamService.generateSpeech(text, voice_id);
    } else {
      audioBuffer = await elevenlabsService.generateSpeech(text, voice_id, {
        stability,
        similarity_boost
      });
    }

    const uploadDir = path.join(__dirname, '../uploads/tts');
    await fs.ensureDir(uploadDir);

    const fileName = `tts-${crypto.randomUUID()}.mp3`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, audioBuffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/tts/${fileName}`;

    return res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        fileName: fileName
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Speech synthesis failed' });
  }
};

exports.syncVoices = async (req, res) => {
  try {
    let syncedCount = 0;

    // Sync Sarvam AI Voices (Telugu & Hindi)
    const sarvamVoices = sarvamService.fetchVoices();
    for (const sv of sarvamVoices) {
      await Voice.findOneAndUpdate(
        { voice_id: sv.voice_id },
        { ...sv, status: 'active' },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    // Sync ElevenLabs Voices if available
    try {
      const elevenLabsVoices = await elevenlabsService.fetchVoices();
      if (Array.isArray(elevenLabsVoices)) {
        for (const ev of elevenLabsVoices) {
          const voiceData = {
            name: ev.name,
            voice_id: ev.voice_id,
            category: (ev.category && ev.category.toLowerCase() === 'premade') ? 'Predefined' : (ev.category || 'Predefined'),
            preview_url: ev.preview_url,
            labels: {
              gender: ev.labels?.gender || null,
              age: ev.labels?.age || null,
              accent: ev.labels?.accent || null,
              description: ev.labels?.description || null
            },
            provider: 'elevenlabs',
            status: 'active'
          };
          await Voice.findOneAndUpdate(
            { voice_id: voiceData.voice_id },
            voiceData,
            { upsert: true, new: true }
          );
          syncedCount++;
        }
      }
    } catch (elError) {
      console.warn('ElevenLabs voice sync warning:', elError.message);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully synced ${syncedCount} voices`,
      data: {
        synced_count: syncedCount
      }
    });
  } catch (error) {
    console.error('Sync Voices Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to sync voices'
    });
  }
};

