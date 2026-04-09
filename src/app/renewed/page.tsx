import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IVIG & IV Hydration - Who to Contact at Specialty Pharmacies | Renewed",
  description:
    "Find the exact contacts at specialty and infusion pharmacies who manage nursing agency onboarding, credentialing, and contracts for IVIG and IV hydration services.",
};

export default function RenewedPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/20 via-transparent to-[#06B6D4]/10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-[0.16em] px-5 py-2 rounded-full mb-8 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            IVIG &amp; IV Hydration
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Who to Contact at{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
              Specialty Pharmacies
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            If you run an IVIG or IV hydration nursing agency, this is the exact
            guide to finding the right person at each pharmacy - not the general
            line, not the pharmacy manager - the person who handles nursing
            agency onboarding and contracts.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">The Problem</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Specialty pharmacies contract with outside nursing agencies to
            deliver IVIG and IV hydration services in patients&apos; homes. But
            when you call the pharmacy, you get routed to the wrong department.
            The pharmacy manager doesn&apos;t handle agency onboarding. The
            front desk doesn&apos;t know who does. You need the{" "}
            <strong className="text-white">exact title</strong> and{" "}
            <strong className="text-white">exact department</strong> to ask for.
          </p>
        </div>
      </section>

      {/* What to Say */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 border border-[#4F46E5]/30 rounded-2xl p-8 md:p-10">
          <h2 className="text-xl font-bold mb-3 text-[#a5b4fc]">
            What to Say When You Call
          </h2>
          <p className="text-white text-lg italic">
            &ldquo;I&apos;d like to speak with whoever handles nursing agency
            onboarding and credentialing for your infusion services.&rdquo;
          </p>
          <p className="text-gray-400 mt-3 text-sm">
            This gets you routed to the right person regardless of what their
            internal title is.
          </p>
        </div>
      </section>

      {/* Direct Contact Titles */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Direct Contact Titles
        </h2>
        <p className="text-gray-400 mb-8">
          These are the people who handle agency onboarding, credentialing, and
          scheduling day-to-day.
        </p>

        <div className="grid gap-4">
          {[
            {
              title: "Patient Care Coordinator",
              where: "Optum Infusion Services",
              dept: "National Agency Management Team",
              description:
                "Liaison between pharmacy, nursing agencies, and patients. Coordinates scheduling of contracted nurses and manages agency onboarding.",
            },
            {
              title: "Nursing Care Coordinator",
              where: "Orsini Healthcare, mid-size specialty pharmacies",
              dept: "Clinical Operations",
              description:
                "Locates and sources prequalified infusion nurses, performs prequalification screening, verifies documents and agreements, communicates with home health agencies.",
            },
            {
              title: "Contract Nursing Specialist",
              where: "Home infusion pharmacies (often remote roles)",
              dept: "Nursing Operations",
              description:
                "Negotiates and finalizes contracts with nursing agencies and staffing firms. Coordinates onboarding including credentialing and training. Monitors contract performance.",
            },
            {
              title: "Nursing Intake Specialist",
              where: "CSI Pharmacy (Clinical Specialty Infusions)",
              dept: "Intake / Referral Services",
              description:
                "Coordinates nursing services for the pharmacy, handles referral intake, coordinates transfers to nursing agencies, functions as liaison between referral source and infusion service.",
            },
            {
              title: "Intake Coordinator",
              where:
                "Soleo Health, Premier Infusion Care, WellSpan, Medix Infusion",
              dept: "Intake Services",
              description:
                "Coordinates infusion and nursing services, communicates with and documents all communications with nursing agencies, assists with coordination of care.",
            },
            {
              title: "Staffing Coordinator",
              where: "Various specialty pharmacies",
              dept: "Operations",
              description:
                "Manages scheduling and placement of contracted nurses for home infusion services.",
            },
          ].map((role) => (
            <div
              key={role.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#4F46E5]/40 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">{role.title}</h3>
                <span className="inline-flex items-center bg-[#4F46E5]/20 text-[#a5b4fc] text-xs font-medium px-3 py-1 rounded-full border border-[#4F46E5]/30 whitespace-nowrap">
                  {role.dept}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                <strong className="text-gray-300">Where:</strong> {role.where}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Management-Level Titles */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Management-Level Titles
        </h2>
        <p className="text-gray-400 mb-8">
          If you need to go higher or the coordinator-level contact
          isn&apos;t available, ask for these titles.
        </p>

        <div className="grid gap-4">
          {[
            {
              title: "Director / Sr. Director of Nursing Operations",
              where: "Naven Health (formerly SPNN), Option Care Health",
              description:
                "Oversees all field nursing operations, quality, regulatory, and education. Manages the nursing network including contracted agencies.",
            },
            {
              title: "VP of Clinical Services / VP of Operations",
              where: "Naven Health, Specialty Pharmacy Nursing Network",
              description:
                "Oversees all manufacturer programs, specialty pharmacies, nursing, and staff.",
            },
            {
              title: "Regional Nurse Manager",
              where: "Option Care Health",
              description:
                "Management, administration, and coordination of nursing in the agency. Serves as Administrator/Director of Nursing per Medicare Conditions of Participation.",
            },
            {
              title: "Vendor Management Manager",
              where: "CVS Health, larger pharmacy organizations",
              description:
                "Manages third-party vendor operations, service level agreements, and contracted nursing providers.",
            },
            {
              title: "Clinical Operations Manager",
              where: "Various specialty pharmacies",
              description:
                "Supports day-to-day clinical operations, policy/process oversight, coordination of patient experience initiatives.",
            },
          ].map((role) => (
            <div
              key={role.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#7C3AED]/40 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                <strong className="text-gray-300">Where:</strong> {role.where}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Reference by Pharmacy Size */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Quick Reference by Pharmacy Size
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Mid-Size Pharmacies</h3>
            <p className="text-sm text-gray-400 mb-3">
              Orsini, CSI Pharmacy, Soleo Health
            </p>
            <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-3">
              <p className="text-[#6ee7b7] font-semibold text-sm">Ask for:</p>
              <p className="text-white font-bold">
                Nursing Care Coordinator
              </p>
              <p className="text-white font-bold">or Intake Coordinator</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[#4F46E5]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Large Pharmacies</h3>
            <p className="text-sm text-gray-400 mb-3">
              Optum, Option Care Health, BioMatrix
            </p>
            <div className="bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-lg p-3">
              <p className="text-[#a5b4fc] font-semibold text-sm">Ask for:</p>
              <p className="text-white font-bold">
                Patient Care Coordinator
              </p>
              <p className="text-white font-bold">
                or Agency Management Team
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Enterprise</h3>
            <p className="text-sm text-gray-400 mb-3">
              CVS Health, BrightSpring
            </p>
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-lg p-3">
              <p className="text-[#c4b5fd] font-semibold text-sm">Ask for:</p>
              <p className="text-white font-bold">Vendor Management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Department Names */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Department Names to Ask For
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="py-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Company
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                ["National Agency Management Team", "Optum Infusion Services"],
                ["Nursing Operations", "Option Care Health, Naven Health"],
                ["Clinical Operations", "Most specialty pharmacies"],
                ["Clinical Services", "SPNN (now Naven Health)"],
                ["Provider Relations", "Larger pharmacy organizations"],
                ["Vendor Management", "CVS Health, large PBMs"],
                ["Intake / Referral Services", "CSI Pharmacy, Soleo Health"],
                ["Field Operations", "Option Care Health, Naven Health"],
              ].map(([dept, company]) => (
                <tr
                  key={dept}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 pr-4 font-medium text-white">{dept}</td>
                  <td className="py-3 text-gray-400">{company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Adjacent Titles */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Other Related Titles
        </h2>
        <p className="text-gray-400 mb-8">
          These roles touch nursing agency management as part of a broader
          scope. They may be able to connect you to the right person.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Provider Relations Specialist / Manager",
            "Network Development Manager",
            "Clinical Coordinator",
            "Infusion Services Coordinator",
            "Home Health Liaison",
          ].map((title) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-300 text-sm"
            >
              {title}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-gray-500 text-sm px-6">
        <p>
          Questions? Reach out at{" "}
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            className="text-[#a5b4fc] hover:text-white transition-colors underline"
          >
            brayan@nextgenerationlearners.com
          </a>
        </p>
      </footer>
    </main>
  );
}
