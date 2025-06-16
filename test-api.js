import OpenAI from 'openai';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: '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',
});

async function testAPI() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello! How are you?"
        }
      ],
    });

    console.log('API Test Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

testAPI(); 