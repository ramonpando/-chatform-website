export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to ChatForm
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Your conversational form builder SaaS platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Easy to Use</h2>
            <p className="text-gray-600">
              Create engaging conversational forms with our intuitive builder
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Powerful</h2>
            <p className="text-gray-600">
              Advanced logic and integrations to streamline your workflow
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600">
              Track responses and gain insights from your forms
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
