const Voice = require('../models/voice.model');
const elevenlabsService = require('../services/elevenlabsService');
const sarvamService = require('../services/sarvamService');

const voices = [
  { name: 'Leo', category: 'Premium', labels: { gender: 'Male', age: 'Middle-aged', accent: 'American', description: 'Well-rounded and clear' } },
  { name: 'Luna', category: 'Premium', labels: { gender: 'Female', age: 'Young', accent: 'American', description: 'Soft and calm' } },
  { name: 'Sophie', category: 'Premium', labels: { gender: 'Female', age: 'Young', accent: 'American', description: 'Helpful and guiding' } },
  { name: 'Jackson', category: 'Premium', labels: { gender: 'Male', age: 'Young', accent: 'American', description: 'Deep and confident' } },
];

exports.up = async () => {
  try {
    // 1. Seed Sarvam AI Voices (Telugu & Hindi)
    const sarvamVoices = sarvamService.fetchVoices();
    for (const sv of sarvamVoices) {
      await Voice.findOneAndUpdate(
        { voice_id: sv.voice_id },
        { ...sv, status: 'active' },
        { upsert: true, new: true }
      );
    }
    console.log('Sarvam AI Telugu & Indian voices seeded successfully!');

    // 2. Try seeding ElevenLabs Voices
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
        }
      }
    } catch (elError) {
      console.warn('Skipping ElevenLabs voice auto-sync during seeding (API key optional):', elError.message);
    }

    console.log('Voices seeded successfully!');
  } catch (error) {
    console.error('Error seeding voices:', error.message);
  }
};