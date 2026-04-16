import ClubDirectory from "@/components/transfer/ClubDirectory";

export const metadata = {
  title: "One Ball One Dream - Find the Right Club for Your Kid",
  description: "Compare youth soccer clubs in Connecticut. See levels, costs, and what real families say.",
};

export default function TransferHome() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/transfer" className="text-lg font-bold text-stone-900">One Ball One Dream</a>
            <div className="flex items-center gap-4">
              <a href="/transfer/review" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
                Rate Your Club
              </a>
              <a href="/transfer/profiles" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
                For Coaches
              </a>
              <a
                href="/transfer/create-profile"
                className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors"
              >
                Create Player Profile
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              Your kid deserves the right club.<br />
              Not just the one you happened to hear about.
            </h2>
            <p className="text-stone-500 mt-4 text-lg max-w-2xl">
              Every youth soccer club in Connecticut. Their levels, what they cost, what they actually offer.
              No more Googling. No more guessing. No more paying $5,000 a year without knowing
              what else is 20 minutes away.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href="/transfer/create-profile"
                className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
              >
                Create a Free Player Profile
              </a>
              <a
                href="#clubs"
                className="inline-flex items-center justify-center bg-white border border-stone-200 text-stone-700 px-6 py-3 rounded-lg font-medium hover:bg-stone-50 transition-colors text-center"
              >
                Browse All CT Clubs
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stone-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">1</div>
              <h3 className="font-semibold text-stone-900 mb-1">Browse Clubs</h3>
              <p className="text-sm text-stone-500">See every club near you. Filter by level, cost, and distance. Know your options.</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">2</div>
              <h3 className="font-semibold text-stone-900 mb-1">Create a Profile</h3>
              <p className="text-sm text-stone-500">2 minutes. Position, level, video. Coaches across CT can find your player.</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">3</div>
              <h3 className="font-semibold text-stone-900 mb-1">Get Found</h3>
              <p className="text-sm text-stone-500">Clubs come to you. We connect you when a coach is interested. You stay in control.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="text-center">
              <span className="font-bold text-stone-900 text-lg">30+</span>
              <span className="text-stone-500 ml-1">clubs tracked</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-stone-900 text-lg">5</span>
              <span className="text-stone-500 ml-1">CT counties</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-stone-900 text-lg">9</span>
              <span className="text-stone-500 ml-1">competition levels</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-stone-900 text-lg">$150 - $12,000+</span>
              <span className="text-stone-500 ml-1">cost range</span>
            </div>
          </div>
        </div>
      </div>

      <main id="clubs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClubDirectory />
      </main>

      <div className="bg-red-50 border-t border-red-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Paying thousands and not sure it is worth it?</h2>
          <p className="text-stone-600 mb-2">
            59% of families leave their club within 3 years. 60% leave because of the coach.
            Parents stay silent because they fear retaliation.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Rate your club anonymously. No login. No email. No one will ever know it was you.
          </p>
          <a
            href="/transfer/review"
            className="inline-flex items-center justify-center bg-stone-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Rate Your Club Anonymously
          </a>
        </div>
      </div>

      <div className="bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Stop waiting to be found. Put your player out there.</h2>
          <p className="text-stone-400 mb-6">
            Free profile. 2 minutes. Visible to every club coach in Connecticut.
          </p>
          <a
            href="/transfer/create-profile"
            className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Create Player Profile
          </a>
        </div>
      </div>

      <footer className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">One Ball One Dream</h3>
              <p className="text-sm text-stone-500">
                Transparency for youth soccer families in Connecticut.
                Every player deserves to know their options.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">Is your club missing?</h3>
              <p className="text-sm text-stone-500">
                We want every CT club represented accurately. If your club is missing or the info needs updating,
                reach out and we will fix it.
              </p>
              <a href="mailto:brayan@nextgenerationlearners.com" className="text-sm text-stone-700 hover:text-stone-900 underline underline-offset-2 mt-1 inline-block">
                brayan@nextgenerationlearners.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">For Clubs</h3>
              <p className="text-sm text-stone-500">
                Want to update your listing or browse player profiles?
                This platform helps good clubs get found by the right families.
              </p>
            </div>
          </div>
          <div className="border-t border-stone-100 mt-6 pt-6 text-center">
            <p className="text-xs text-stone-400">
              Data gathered from public sources and club websites. Costs are estimates and vary by team, age group, and season.
              Always confirm directly with clubs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
