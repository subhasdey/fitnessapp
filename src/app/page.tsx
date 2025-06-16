import WorkoutForm from '@/components/WorkoutForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Fitness Tracker
        </h1>
        <WorkoutForm />
      </div>
    </main>
  );
}
