const AIModel = require('../models/ai-model.model');

const defaultAIModels = [
  {
    name: 'sarvam-2b',
    display_name: 'Sarvam 2B (Indian Languages)',
    provider: 'sarvam',
    model_id: 'sarvam-2b',
    is_default: false,
    status: 'active',
    description: 'Sarvam AI 2B model optimized for Indic languages (Telugu, Hindi, Tamil, Kannada).'
  },
  {
    name: 'sarvam-m-2b',
    display_name: 'Sarvam Multilingual 2B',
    provider: 'sarvam',
    model_id: 'sarvam-m-2b',
    is_default: false,
    status: 'active',
    description: 'Sarvam Multilingual 2B LLM for fast real-time regional voice conversations.'
  },
  {
    name: 'gpt-4o',
    display_name: 'OpenAI GPT-4o',
    provider: 'openai',
    model_id: 'gpt-4o',
    is_default: true,
    status: 'active',
    description: 'OpenAI GPT-4o flagship multimodal conversational intelligence.'
  },
  {
    name: 'gpt-4o-mini',
    display_name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    model_id: 'gpt-4o-mini',
    is_default: false,
    status: 'active',
    description: 'Fast and lightweight OpenAI GPT-4o Mini model.'
  },
  {
    name: 'llama-3.3-70b',
    display_name: 'Groq LLaMA 3.3 70B',
    provider: 'groq',
    model_id: 'llama-3.3-70b-versatile',
    is_default: false,
    status: 'active',
    description: 'Ultra-low latency Groq LLaMA 3.3 70B for instant voice replies.'
  },
  {
    name: 'deepseek-chat',
    display_name: 'DeepSeek V3 Chat',
    provider: 'deepseek',
    model_id: 'deepseek-chat',
    is_default: false,
    status: 'active',
    description: 'DeepSeek V3 high intelligence conversational AI model.'
  }
];

exports.up = async () => {
  try {
    for (const modelData of defaultAIModels) {
      await AIModel.findOneAndUpdate(
        { name: modelData.name },
        modelData,
        { upsert: true, new: true }
      );
    }
    console.log('Sarvam AI & Default AI Models seeded successfully!');
  } catch (error) {
    console.error('Error seeding AI Models:', error.message);
  }
};
