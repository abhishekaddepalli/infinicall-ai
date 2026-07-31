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
        voice_id: 'sarvam-roopa-te',
        name: 'Roopa (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Middle-aged', accent: 'Telugu', description: 'Clear and natural Telugu female voice' },
        target_language_code: 'te-IN',
        speaker: 'roopa',
        status: 'active'
      },
      {
        voice_id: 'sarvam-kavitha-te',
        name: 'Kavitha (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Telugu', description: 'Warm and expressive Telugu female voice' },
        target_language_code: 'te-IN',
        speaker: 'kavitha',
        status: 'active'
      },
      {
        voice_id: 'sarvam-vidya-te',
        name: 'Vidya (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Telugu', description: 'Soft melodic Telugu female voice' },
        target_language_code: 'te-IN',
        speaker: 'vidya',
        status: 'active'
      },
      {
        voice_id: 'sarvam-shruti-te',
        name: 'Shruti (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Telugu', description: 'Fluent Telugu female voice' },
        target_language_code: 'te-IN',
        speaker: 'shruti',
        status: 'active'
      },
      {
        voice_id: 'sarvam-vijay-te',
        name: 'Vijay (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Male', age: 'Middle-aged', accent: 'Telugu', description: 'Professional Telugu male voice' },
        target_language_code: 'te-IN',
        speaker: 'vijay',
        status: 'active'
      },
      {
        voice_id: 'sarvam-gokul-te',
        name: 'Gokul (Telugu)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Male', age: 'Young', accent: 'Telugu', description: 'Energetic Telugu male voice' },
        target_language_code: 'te-IN',
        speaker: 'gokul',
        status: 'active'
      },
      {
        voice_id: 'sarvam-kavya-hi',
        name: 'Kavya (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Middle-aged', accent: 'Hindi', description: 'Professional Hindi female voice' },
        target_language_code: 'hi-IN',
        speaker: 'kavya',
        status: 'active'
      },
      {
        voice_id: 'sarvam-pooja-hi',
        name: 'Pooja (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Hindi', description: 'Fluent Hindi female voice' },
        target_language_code: 'hi-IN',
        speaker: 'pooja',
        status: 'active'
      },
      {
        voice_id: 'sarvam-priya-hi',
        name: 'Priya (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Female', age: 'Young', accent: 'Hindi', description: 'Clear Hindi female voice' },
        target_language_code: 'hi-IN',
        speaker: 'priya',
        status: 'active'
      },
      {
        voice_id: 'sarvam-rahul-hi',
        name: 'Rahul (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Male', age: 'Young', accent: 'Hindi', description: 'Professional Hindi male voice' },
        target_language_code: 'hi-IN',
        speaker: 'rahul',
        status: 'active'
      },
      {
        voice_id: 'sarvam-rohan-hi',
        name: 'Rohan (Hindi)',
        provider: 'sarvam',
        category: 'Indian Regional',
        labels: { gender: 'Male', age: 'Middle-aged', accent: 'Hindi', description: 'Deep Hindi male voice' },
        target_language_code: 'hi-IN',
        speaker: 'rohan',
        status: 'active'
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
      const Setting = require('../models/setting.model');
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

    let cleanSpeaker = (voiceId || 'vidya')
      .replace(/^sarvam-/, '')
      .replace(/-(te|hi|en|ta|kn|ml|mr|gu|pa|bn|or)$/, '')
      .toLowerCase();

    const voice = this.defaultVoices.find(v => v.voice_id === voiceId || v.speaker === cleanSpeaker);
    if (voice && voice.speaker) {
      cleanSpeaker = voice.speaker.toLowerCase();
    }

    const speakerMap = {
      roopa: 'vidya',
      meera: 'vidya',
      pavithra: 'arya',
      kavitha: 'arya',
      amrutha: 'vidya',
      shruti: 'arya',
      arvind: 'karun',
      vijay: 'karun',
      gokul: 'abhilash',
      kavya: 'manisha',
      pooja: 'anushka',
      priya: 'manisha',
      rahul: 'hitesh',
      rohan: 'hitesh',
      amit: 'hitesh',
      ananya: 'anushka'
    };

    const validBulbulV2Speakers = ['vidya', 'arya', 'karun', 'abhilash', 'manisha', 'anushka', 'hitesh'];
    const speaker = speakerMap[cleanSpeaker] || (validBulbulV2Speakers.includes(cleanSpeaker) ? cleanSpeaker : 'vidya');
    const targetLanguageCode = ['manisha', 'anushka', 'hitesh'].includes(speaker) ? 'hi-IN' : 'te-IN';

    if (!apiKey) {
      throw new Error('Sarvam AI API Key is not configured. Please enter your Sarvam Subscription Key in System Settings (AI & Voice Providers).');
    }

    try {
      const payload = {
        inputs: [text],
        target_language_code: targetLanguageCode,
        speaker: speaker,
        pitch: typeof options.pitch === 'number' ? options.pitch : 0,
        pace: typeof options.pace === 'number' ? options.pace : 0.98,
        loudness: typeof options.loudness === 'number' ? options.loudness : 1.0,
        speech_sample_rate: options.sample_rate || 16000,
        enable_preprocessing: true,
        model: 'bulbul:v2'
      };

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey.trim()
          }
        }
      );

      if (response.data && response.data.audios && response.data.audios[0]) {
        return Buffer.from(response.data.audios[0], 'base64');
      } else {
        throw new Error('No audio output returned from Sarvam AI');
      }
    } catch (error) {
      let rawErr = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data || error.message;
      if (typeof rawErr === 'object') {
        rawErr = rawErr.message || rawErr.detail || JSON.stringify(rawErr);
      }
      console.error('[SarvamService] Speech generation failed:', error?.response?.data || error.message);
      throw new Error(`Sarvam AI Error: ${rawErr}`);
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
