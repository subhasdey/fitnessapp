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