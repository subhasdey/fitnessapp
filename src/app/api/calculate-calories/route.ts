import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: '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',
});

// Calorie burn rates per minute for different activities (average values)
const CALORIE_RATES: { [key: string]: { low: number; medium: number; high: number } } = {
  running: { low: 7, medium: 10, high: 13 },
  walking: { low: 3, medium: 4, high: 5 },
  swimming: { low: 6, medium: 8, high: 10 },
  cycling: { low: 5, medium: 7, high: 9 },
  weightlifting: { low: 4, medium: 6, high: 8 },
  yoga: { low: 2, medium: 3, high: 4 },
  dancing: { low: 4, medium: 6, high: 8 },
  // Default for other activities
  default: { low: 4, medium: 6, high: 8 },
};

export async function POST(request: Request) {
  try {
    const { workoutType, duration, intensity } = await request.json();

    const prompt = `Calculate the estimated calories burned for the following workout:
    - Type: ${workoutType}
    - Duration: ${duration} minutes
    - Intensity: ${intensity}
    
    Please provide only the number of calories burned as a single number, based on average values for this type of exercise.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a fitness expert. Provide only the number of calories burned as a single number, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const calories = parseInt(completion.choices[0].message.content || "0");

    return NextResponse.json({ calories });
  } catch (error) {
    console.error('Error calculating calories:', error);
    return NextResponse.json(
      { error: 'Failed to calculate calories' },
      { status: 500 }
    );
  }
} 