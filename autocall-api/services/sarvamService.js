'use strict';

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const Setting = require('../models/setting.model');

class SarvamService {
  constructor() {
    this.baseUrl = 'https://api.sarvam.ai';
    this.defaultVoices = [
      {
        voice_id: 'sarvam-meera-te',
        name: 'Meera (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Telugu', description: 'Clear and natural Telugu voice' },
        target_language_code: 'te-IN',
        speaker: 'meera'
      },
      {
        voice_id: 'sarvam-pavithra-te',
        name: 'Pavithra (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Middle-aged', accent: 'Telugu', description: 'Warm and expressive Telugu voice' },
        target_language_code: 'te-IN',
        speaker: 'pavithra'
      },
      {
        voice_id: 'sarvam-arvind-te',
        name: 'Arvind (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Male', age: 'Middle-aged', accent: 'Telugu', description: 'Professional Telugu voice' },
        target_language_code: 'te-IN',
        speaker: 'arvind'
      },
      {
        voice_id: 'sarvam-amrutha-te',
        name: 'Amrutha (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Telugu', description: 'Soft melodic Telugu voice' },
        target_language_code: 'te-IN',
        speaker: 'amrutha'
      },
      {
        voice_id: 'sarvam-ananya-hi',
        name: 'Ananya (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Hindi', description: 'Fluent Hindi voice' },
        target_language_code: 'hi-IN',
        speaker: 'ananya'
      },
      {
        voice_id: 'sarvam-kavya-hi',
        name: 'Kavya (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Middle-aged', accent: 'Hindi', description: 'Professional Hindi voice' },
        target_language_code: 'hi-IN',
        speaker: 'kavya'
      }
    ];
  }

  async getApiKey(userId = null) {
    try {
      if (userId) {
        const UserSettings = require('../models/user-settings.model');
        const userSetting = await UserSettings.findOne({ user: userId });
        if (userSetting?.sarvam_api_key) {
          return userSetting.sarvam_api_key;
        }
      }
      if (process.env.SARVAM_API_KEY) {
        return process.env.SARVAM_API_KEY;
      }
      const setting = await Setting.findOne();
      return setting?.sarvam_api_key || null;
    } catch (e) {
      return process.env.SARVAM_API_KEY || null;
    }
  }

  fetchVoices() {
    return this.defaultVoices;
  }

  async generateSpeech(text, voiceId, options = {}) {
    const apiKey = await this.getApiKey(options.userId || options.user_id);
    const voice = this.defaultVoices.find(v => v.voice_id === voiceId || v.speaker === voiceId) || this.defaultVoices[0];
    const speaker = voice.speaker || 'meera';
    const targetLanguageCode = voice.target_language_code || options.target_language_code || 'te-IN';

    if (!apiKey) {
      console.warn('[SarvamService] SARVAM_API_KEY missing. Returning dummy speech fallback.');
      return Buffer.from('RIFF....WAVEfmt ....data....');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech`,
        {
          inputs: [text],
          target_language_code: targetLanguageCode,
          speaker: speaker,
          pitch: options.pitch || 0,
          pace: options.pace || 1.0,
          loudness: options.loudness || 1.5,
          speech_sample_rate: options.sample_rate || 8000,
          enable_preprocessing: true,
          model: 'bulbul:v1'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey
          }
        }
      );

      if (response.data && response.data.audios && response.data.audios[0]) {
        return Buffer.from(response.data.audios[0], 'base64');
      } else {
        throw new Error('No audio output returned from Sarvam AI');
      }
    } catch (error) {
      console.error('[SarvamService] Speech generation failed:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Sarvam AI Speech Synthesis Failed');
    }
  }

  async transcribeAudio(audioBuffer, options = {}) {
    const apiKey = await this.getApiKey(options.userId || options.user_id);
    if (!apiKey) {
      return { transcript: '', language_code: options.language_code || 'te-IN' };
    }

    try {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', audioBuffer, { filename: 'audio.wav', contentType: 'audio/wav' });
      form.append('model', 'saaras:v1');
      form.append('language_code', options.language_code || 'te-IN');

      const response = await axios.post(`${this.baseUrl}/speech-to-text`, form, {
        headers: {
          ...form.getHeaders(),
          'api-subscription-key': apiKey
        }
      });

      return {
        transcript: response.data?.transcript || '',
        language_code: response.data?.language_code || 'te-IN'
      };
    } catch (error) {
      console.error('[SarvamService] STT Transcribe failed:', error?.response?.data || error.message);
      return { transcript: '', error: error.message };
    }
  }
}

module.exports = new SarvamService();
