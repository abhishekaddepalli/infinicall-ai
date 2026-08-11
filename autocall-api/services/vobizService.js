'use strict';

const axios = require('axios');

class VobizService {
  constructor() {
    this.baseUrl = process.env.VOBIZ_API_BASE_URL || 'https://api.vobiz.ai/api/v1';
  }

  async getNumbers(authId, authToken) {
    let response;
    let lastError = null;

    const endpoints = [
      `${this.baseUrl}/Account/${authId}/Number/`,
      `${this.baseUrl}/Account/${authId}/PhoneNumber/`,
      `${this.baseUrl}/Numbers/`,
      `${this.baseUrl}/phone-numbers/`
    ];

    const authConfigs = [
      { headers: { 'X-Auth-ID': authId, 'X-Auth-Token': authToken, 'Content-Type': 'application/json' } },
      { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' } },
      { auth: { username: authId, password: authToken }, headers: { 'Content-Type': 'application/json' } }
    ];

    for (const url of endpoints) {
      for (const config of authConfigs) {
        try {
          response = await axios.get(url, config);
          if (response && response.data) {
            break;
          }
        } catch (err) {
          lastError = err;
        }
      }
      if (response && response.data) break;
    }

    if (!response || !response.data) {
      let rawErr = lastError?.response?.data?.message || lastError?.response?.data?.error || lastError?.response?.data || lastError?.message || 'Failed to connect to Vobiz API';
      let errMsg = typeof rawErr === 'object' ? (rawErr.message || rawErr.error || JSON.stringify(rawErr)) : String(rawErr);
      console.error('Vobiz Get Numbers Error:', errMsg);
      throw new Error(`Vobiz API Error: ${errMsg}`);
    }

    const rawList = response.data?.objects || response.data?.numbers || response.data?.data || (Array.isArray(response.data) ? response.data : []);
    const parsedList = Array.isArray(rawList) ? rawList : [];

    return {
      purchased: parsedList.map(n => {
        const rawNum = typeof n === 'string' ? n : (n.number || n.phone_number || n.phoneNumber || n.e164 || '');
        const numStr = String(rawNum).trim();
        const formattedNum = numStr.startsWith('+') ? numStr : '+' + numStr;
        return {
          phone_number: formattedNum,
          sid: n.number || n.id || n.uuid || n.sid || `vobiz_${formattedNum}`,
          friendly_name: n.alias || n.friendly_name || n.name || formattedNum,
          type: 'purchased',
          provider: 'vobiz'
        };
      }).filter(n => n.phone_number.length > 3),
      verified: []
    };
  }

  async makeCall(authId, authToken, from, to, answerUrl, statusCallbackUrl = null) {
    try {
      const payload = {
        from: from,
        to: to,
        answer_url: answerUrl,
        answer_method: 'POST'
      };

      if (statusCallbackUrl) {
        payload.hangup_url = statusCallbackUrl;
        payload.status_url = statusCallbackUrl;
        payload.status_method = 'POST';
      }

      const response = await axios.post(
        `${this.baseUrl}/Account/${authId}/Call/`,
        payload,
        {
          headers: {
            'X-Auth-ID': authId,
            'X-Auth-Token': authToken,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data || {};
      return {
        sid: data.request_uuid || data.call_uuid || data.id || `vobiz_${Date.now()}`,
        requestUuid: data.request_uuid || data.call_uuid || data.id || `vobiz_${Date.now()}`,
        status: data.status || 'queued',
        raw: data
      };
    } catch (error) {
      console.error('Vobiz Make Call Error:', error?.response?.data || error.message);
      throw new Error(`Failed to place call via Vobiz AI: ${error?.response?.data?.message || error.message}`);
    }
  }

  async getCallStatus(authId, authToken, callUuid) {
    try {
      const response = await axios.get(`${this.baseUrl}/Account/${authId}/Call/${callUuid}/`, {
        headers: {
          'X-Auth-ID': authId,
          'X-Auth-Token': authToken,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data || {};
      return data.call_state || data.status || 'completed';
    } catch (error) {
      console.error('Vobiz Get Call Status Error:', error?.response?.data || error.message);
      return 'completed';
    }
  }
}

module.exports = new VobizService();
