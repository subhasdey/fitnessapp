'use client';

import { useState } from 'react';

interface WorkoutFormData {
  workoutType: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
}

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

export default function WorkoutForm() {
  const [formData, setFormData] = useState<WorkoutFormData>({
    workoutType: '',
    duration: 0,
    intensity: 'medium',
  });
  const [calories, setCalories] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCalories = (workoutType: string, duration: number, intensity: 'low' | 'medium' | 'high') => {
    const normalizedType = workoutType.toLowerCase();
    const activityRates = CALORIE_RATES[normalizedType] || CALORIE_RATES.default;
    const rate = activityRates[intensity];
    return Math.round(rate * duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calculate-calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate calories');
      }

      const data = await response.json();
      setCalories(data.calories);
    } catch (error) {
      console.error('Error calculating calories:', error);
      setError('Failed to calculate calories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Track Your Workout</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700">
            Workout Type
          </label>
          <input
            type="text"
            id="workoutType"
            value={formData.workoutType}
            onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Running, Swimming, Weightlifting"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="intensity" className="block text-sm font-medium text-gray-700">
            Intensity
          </label>
          <select
            id="intensity"
            value={formData.intensity}
            onChange={(e) => setFormData({ ...formData, intensity: e.target.value as 'low' | 'medium' | 'high' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Calories'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-md">
          <p className="text-lg font-semibold text-red-800">{error}</p>
        </div>
      )}

      {calories !== null && !error && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <p className="text-lg font-semibold text-green-800">
            Estimated calories burned: {calories} kcal
          </p>
        </div>
      )}
    </div>
  );
} 