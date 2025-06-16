import OpenAI from 'openai';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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