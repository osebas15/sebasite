const { OpenAI } = require('openai');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { messages } = JSON.parse(event.body || '{}');
  if (!messages) {
    return {
      statusCode: 400,
      body: 'Missing messages',
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ content: response.choices[0].message.content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
