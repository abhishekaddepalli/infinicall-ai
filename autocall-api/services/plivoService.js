'use strict';

const axios = require('axios');
const Setting = require('../models/setting.model');
const UserSettings = require('../models/user-settings.model');

class PlivoService {
  constructor() {
    this.baseUrl = 'https://api.plivo.com/v1/Account';
  }

  async getCredentials(userId = null) {
    let authId = process.env.PLIVO_AUTH_ID;
    let authToken = process.env.PLIVO_AUTH_TOKEN;
    let phoneNumber = process.env.PLIVO_PHONE_NUMBER;

    if (userId) {
      const userSettings = await UserSettings.findOne({ user: userId });
      if (userSettings?.plivo_auth_id) authId = userSettings.plivo_auth_id;
      if (userSettings?.plivo_auth_token) authToken = userSettings.plivo_auth_token;
      if (userSettings?.plivo_phone_number) phoneNumber = userSettings.plivo_phone_number;
    }

    if (!authId || !authToken) {
      const setting = await Setting.findOne();
      if (setting?.plivo_auth_id) authId = setting.plivo_auth_id;
      if (setting?.plivo_auth_token) authToken = setting.plivo_auth_token;
      if (setting?.plivo_phone_number) phoneNumber = setting.plivo_phone_number;
    }

    return { authId, authToken, phoneNumber };
  }

  async makeCall({ from, to, answerUrl, userId = null }) {
    const { authId, authToken, phoneNumber } = await this.getCredentials(userId);
    const callerId = from || phoneNumber;

    if (!authId || !authToken) {
      console.warn('[PlivoService] Plivo credentials missing.');
      throw new Error('Plivo credentials (Auth ID / Token) are not configured.');
    }

    try {
      const auth = Buffer.from(`${authId}:${authToken}`).toString('base64');
      const response = await axios.post(
        `${this.baseUrl}/${authId}/Call/`,
        {
          from: callerId,
          to: to,
          answer_url: answerUrl,
          answer_method: 'POST'
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('[PlivoService] Make Call Error:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Plivo call creation failed');
    }
  }

  generateXmlResponse(elements = []) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';
    elements.forEach(el => {
      if (el.type === 'Speak') {
        xml += `  <Speak voice="${el.voice || 'WOMAN'}" language="${el.language || 'en-US'}">${el.text}</Speak>\n`;
      } else if (el.type === 'Play') {
        xml += `  <Play>${el.url}</Play>\n`;
      } else if (el.type === 'GetInput') {
        xml += `  <GetInput action="${el.action}" method="POST" inputType="speech" speechEngine="sarvam">\n`;
        if (el.speak) xml += `    <Speak>${el.speak}</Speak>\n`;
        xml += `  </GetInput>\n`;
      } else if (el.type === 'Dial') {
        xml += `  <Dial><Number>${el.number}</Number></Dial>\n`;
      } else if (el.type === 'Hangup') {
        xml += `  <Hangup/>\n`;
      }
    });
    xml += '</Response>';
    return xml;
  }
}

module.exports = new PlivoService();
