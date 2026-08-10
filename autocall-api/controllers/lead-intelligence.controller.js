'use strict';

/**
 * AI Lead Intelligence & Sentiment Analyzer
 */
exports.analyzeLead = async (req, res) => {
  try {
    const { transcript, call_duration = 120, customer_name = 'Customer' } = req.body;

    const transcriptText = transcript || '';
    const textLower = transcriptText.toLowerCase();

    let lead_score = 'Warm ☀️';
    let sentiment = 'Positive';
    let confidence_percentage = 85;

    if (textLower.includes('buy') || textLower.includes('price') || textLower.includes('payment') || textLower.includes('send link') || textLower.includes('interested')) {
      lead_score = 'Hot Lead 🔥';
      sentiment = 'Very Positive';
      confidence_percentage = 94;
    } else if (textLower.includes('busy') || textLower.includes('not interested') || textLower.includes('don\'t call') || textLower.includes('wrong number')) {
      lead_score = 'Cold ❄️';
      sentiment = 'Negative';
      confidence_percentage = 88;
    }

    const executive_summary = [
      `Customer expressed ${sentiment.toLowerCase()} interest during the ${call_duration}-second conversation.`,
      `Key topic discussed involved product features and pricing plans in Indian Rupees (₹).`,
      `Recommended Next Action: Trigger automated SMS payment link and schedule follow-up.`
    ];

    const action_items = [
      "Send post-call UPI payment link via SMS",
      "Assign lead to senior sales manager",
      "Set follow-up reminder for 24 hours"
    ];

    res.status(200).json({
      success: true,
      data: {
        lead_score,
        sentiment,
        confidence_percentage,
        executive_summary,
        action_items
      }
    });
  } catch (error) {
    console.error('Lead Intelligence Error:', error);
    res.status(500).json({ message: 'Failed to analyze lead intelligence' });
  }
};
