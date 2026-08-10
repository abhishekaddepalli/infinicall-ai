'use strict';

const axios = require('axios');

class VobizService {
  constructor() {
    this.baseUrl = process.env.VOBIZ_API_BASE_URL || 'https://api.vobiz.ai/api/v1';
  }

  async getNumbers(authId, authToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/Account/${authId}/Number/`, {
        headers: {
          'X-Auth-ID': authId,
          'X-Auth-Token': authToken,
          'Content-Type': 'application/json'
        }
      });

      const numbers = response.data?.objects || response.data?.numbers || response.data || [];
      return {
        purchased: numbers.map(n => ({
          phone_number: (n.number || n.phone_number || '').startsWith('+') ? (n.number || n.phone_number) : '+' + (n.number || n.phone_number),
          sid: n.number || n.id || n.uuid,
          friendly_name: n.alias || n.friendly_name || n.number,
          type: 'purchased',
          provider: 'vobiz'
        })),
        verified: []
      };
    } catch (error) {
      console.error('Vobiz Get Numbers Error:', error?.response?.data || error.message);
      return { purchased: [], verified: [] };
    }
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
