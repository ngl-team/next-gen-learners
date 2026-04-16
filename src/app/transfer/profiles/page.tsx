import ProfileBrowser from "@/components/transfer/ProfileBrowser";

export const metadata = {
  title: "Player Profiles - One Ball One Dream",
  description: "Browse registered player profiles in Connecticut.",
};

export default function ProfilesPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/transfer" className="text-lg font-bold text-stone-900 hover:text-stone-700 transition-colors">
              One Ball One Dream
            </a>
            <div className="flex items-center gap-4">
              <a href="/transfer" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
                Club Directory
              </a>
              <a
                href="/transfer/create-profile"
                className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors"
              >
                Create Profile
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Player Profiles</h1>
          <p className="text-stone-500 mt-2">
            Browse registered players looking for clubs in Connecticut. Filter by position, level, and age group.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBrowser />
      </main>
    </div>
  );
}
