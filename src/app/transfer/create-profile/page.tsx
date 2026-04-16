import CreateProfileForm from "@/components/transfer/CreateProfileForm";

export const metadata = {
  title: "Create Player Profile - One Ball One Dream",
  description: "Build your player profile and get seen by every club coach in Connecticut.",
};

export default function CreateProfilePage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/transfer" className="text-lg font-bold text-stone-900 hover:text-stone-700 transition-colors">
              One Ball One Dream
            </a>
            <a href="/transfer" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
              Browse Clubs
            </a>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Build Your Player Profile
          </h1>
          <p className="text-stone-500 mt-2 max-w-xl mx-auto">
            This is what coaches will see. Fill it in, watch it come to life, and publish when you are ready.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateProfileForm />
      </main>
    </div>
  );
}
