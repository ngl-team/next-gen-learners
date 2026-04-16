import AnonymousReview from "@/components/transfer/AnonymousReview";

export const metadata = {
  title: "Rate Your Club - One Ball One Dream",
  description: "Anonymous club reviews by real parents. No login. No tracking. Help other families.",
};

export default function ReviewPage() {
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
                Browse Clubs
              </a>
              <a href="/transfer/create-profile" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
                Create Profile
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-stone-900">$1,188</div>
              <div className="text-xs text-stone-500">avg annual cost per kid</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">59%</div>
              <div className="text-xs text-stone-500">leave within 3 years</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">60%</div>
              <div className="text-xs text-stone-500">leave because of the coach</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">0.9%</div>
              <div className="text-xs text-stone-500">make a D1 roster</div>
            </div>
          </div>
          <p className="text-sm text-red-800 mt-4 font-medium">
            Parents spend thousands with zero transparency. That changes here.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnonymousReview />
      </main>

      <div className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-lg font-bold text-stone-900 text-center mb-6">Why Parents Stay Silent</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-500 text-xl">&#128556;</span>
              </div>
              <h4 className="font-medium text-stone-900 text-sm mb-1">Fear of Retaliation</h4>
              <p className="text-xs text-stone-500">Parents worry their kid gets benched or cut if they speak up about problems.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-500 text-xl">&#128566;</span>
              </div>
              <h4 className="font-medium text-stone-900 text-sm mb-1">Social Pressure</h4>
              <p className="text-xs text-stone-500">Nobody wants to be &quot;that parent.&quot; So everyone stays quiet and nothing changes.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-500 text-xl">&#129300;</span>
              </div>
              <h4 className="font-medium text-stone-900 text-sm mb-1">No Platform</h4>
              <p className="text-xs text-stone-500">Until now, there was no safe place to share honest feedback about your club.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
