'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Workout {
  id: number;
  type: string;
  duration: number;
  intensity: string;
  calories: number;
  createdAt: string;
}

export default function WorkoutStats() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to load workout statistics');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (workouts.length === 0) return null;

    const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const avgCaloriesPerWorkout = Math.round(totalCalories / workouts.length);
    const avgDuration = Math.round(totalDuration / workouts.length);

    // Get the last 7 workouts for the chart
    const recentWorkouts = [...workouts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 7)
      .reverse();

    const chartData: ChartData<'line'> = {
      labels: recentWorkouts.map(workout => 
        new Date(workout.createdAt).toLocaleDateString()
      ),
      datasets: [
        {
          label: 'Calories Burned',
          data: recentWorkouts.map(workout => workout.calories),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
      ],
    };

    return {
      totalCalories,
      avgCaloriesPerWorkout,
      avgDuration,
      chartData,
    };
  };

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const stats = calculateStats();
  if (!stats) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No workout data available yet. Start tracking your workouts to see statistics!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Workout Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Calories Burned</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCalories} kcal</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Calories per Workout</h3>
          <p className="text-3xl font-bold text-green-600">{stats.avgCaloriesPerWorkout} kcal</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Workout Duration</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.avgDuration} min</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Calories Burned (Last 7 Workouts)</h3>
        <div className="h-64">
          <Line
            data={stats.chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Calories'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 