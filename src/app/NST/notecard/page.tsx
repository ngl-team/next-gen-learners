'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';

export default function NotecardPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/nst/me').then((r) => r.json());
      if (!me.name) {
        router.push('/NST/login');
        return;
      }
      setName(me.name);
    })();
  }, [router]);

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>3 × 5 Notecard</h1>
        <p className="muted">
          A 3×5 fits ~50 lines of small handwriting total. Transcribe this onto your card by hand — the act of writing it locks it in. Print this page or just copy from screen.
        </p>

        <section className="nc-why">
          <h2>Why this info made the cut</h2>
          <p>
            48 open response questions across the course follow a 3-part structure: <strong>(a) define · (b) apply · (c) name a real example</strong>. Most points get lost on (c) — the named example — because that&rsquo;s pure recall. The card is built around the things you can&rsquo;t reason out in the moment.
          </p>
          <ul className="nc-why-list">
            <li>
              <strong>Mission and target tables</strong> — ~25 questions ask you to name a mission, observatory, or instrument. Cannot be derived from first principles. Front of card.
            </li>
            <li>
              <strong>Numbered lists</strong> (4 forces, 4 evolution mechanisms, 4 telescope properties, CHNOPS, 3 life definitions, 7 Drake terms) — questions explicitly ask for the count. Forget one and you lose a chunk.
            </li>
            <li>
              <strong>Formulas with constants</strong> — Tsiolkovsky, Wien, Foucault, c=λf, time dilation. You either know the form or you don&rsquo;t.
            </li>
            <li>
              <strong>Specific numbers</strong> — mirror sizes (JWST 6.5m, Hubble 2.4m, Rubin 8.4m, LIGO 4km), c, g, axial tilt, $/kg. These appear verbatim in rubrics.
            </li>
            <li>
              <strong>Star type tradeoffs</strong> (G/K/M) and <strong>TRAPPIST-1 finding</strong> — the rubric awards bonus credit for choosing K-dwarfs as Goldilocks targets and citing JWST&rsquo;s no-atmosphere result on TRAPPIST-1d.
            </li>
            <li>
              <strong>Two-body comparison (Mars + Enceladus)</strong> — Q34 asks for two bodies with different terrains, two techs each, and what was found. Mars (rocky) vs Enceladus (icy crust + plumes) maximizes the contrast and both have <em>actual</em> mission results to cite (Europa Clipper hasn&rsquo;t arrived). Side 3.
            </li>
            <li>
              <strong>Lorentz factor + kinetic energy</strong> — γ shows up in any relativity question; KE = ½mv² and ⟨KE⟩ = (3/2)kT bridge mechanics and kinetic molecular theory. Both formulas, both unforgiving if you forget the form.
            </li>
            <li>
              <strong>Rocket force diagram</strong> — Q22, Q24 ask you to identify the four forces on a rocket and which is hardest to overcome at launch. A drawn diagram is the fastest way to recall thrust/drag/lift/weight in the moment.
            </li>
          </ul>
          <p>
            <strong>What is NOT on the card:</strong> definitions of basic terms (wavelength, mass) you already know, and the 3-part answer template — drill that into muscle memory instead. The card is for facts, not structure.
          </p>
        </section>

        <h2>Front side</h2>
        <div className="notecard">
          <div className="nc-redline" />
          <div className="nc-content">
            <div className="nc-section">
              <div className="nc-h">TELESCOPE → MISSION → SCIENCE</div>
              <div className="nc-row"><span className="nc-k">Gamma</span><span>Fermi · GRBs, pulsars</span></div>
              <div className="nc-row"><span className="nc-k">X-ray</span><span>Chandra / NuSTAR / IXPE · BH disks, SN remnants <em>(grazing incidence, in space — atm blocks)</em></span></div>
              <div className="nc-row"><span className="nc-k">UV/Vis</span><span>Hubble 2.4m · ladder, planets</span></div>
              <div className="nc-row"><span className="nc-k">Vis</span><span>Rubin 8.4m · LSST survey, transients</span></div>
              <div className="nc-row"><span className="nc-k">IR</span><span>JWST 6.5m · cool stars, far galaxies, dust</span></div>
              <div className="nc-row"><span className="nc-k">Radio/mm</span><span>ALMA · VLA · MWA · cold gas, AGN, interferometry</span></div>
              <div className="nc-row"><span className="nc-k">GW</span><span>LIGO 4km · BH/NS mergers (NOT EM)</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">SOLAR SYSTEM → MISSION → WHY</div>
              <div className="nc-row"><span className="nc-k">Mars</span><span>Perseverance · Jezero, biosignatures, sample cache</span></div>
              <div className="nc-row"><span className="nc-k">Europa</span><span>Europa Clipper · subsurface ocean, ice 10–25 km</span></div>
              <div className="nc-row"><span className="nc-k">Enceladus</span><span>Cassini → Orbilander · cryo plumes, ocean</span></div>
              <div className="nc-row"><span className="nc-k">Titan</span><span>Cassini/Huygens → Dragonfly · N₂ atm, CH₄ lakes, organics</span></div>
              <div className="nc-row"><span className="nc-k">Bennu</span><span>OSIRIS-REx · C-type asteroid, amino acids (exogenous)</span></div>
              <div className="nc-row"><span className="nc-k">Galileo</span><span>crashed into Jupiter — planetary protection ★</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">STAR TYPES (priority for life: K ⭐)</div>
              <div className="nc-row"><span className="nc-k">G (Sun)</span><span>~10 Gyr · moderate · rare (only ~10%)</span></div>
              <div className="nc-row"><span className="nc-k">K orange</span><span>10s Gyr · 3× G · Goldilocks ★</span></div>
              <div className="nc-row"><span className="nc-k">M red</span><span>100+ Gyr · ~75% · flares, tidal lock, atm stripping</span></div>
              <div className="nc-row"><em>TRAPPIST-1: M-dwarf, 7 planets, JWST showed 1d has NO atmosphere</em></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">EXOPLANET METHODS</div>
              <div className="nc-row">Transit (Kepler/TESS): periodic dim · needs temporal + area</div>
              <div className="nc-row">Radial velocity: Doppler wobble of host star</div>
            </div>
          </div>
        </div>

        <h2>Back side</h2>
        <div className="notecard">
          <div className="nc-redline" />
          <div className="nc-content">
            <div className="nc-section">
              <div className="nc-h">DRAKE EQUATION</div>
              <div className="nc-row"><strong>N = R* · fp · ne · fl · fi · fc · L</strong></div>
              <div className="nc-row">R* stars/yr (5–10) · fp ≈ 1 · ne ≈ 1 · fl life · fi intel · fc comm · L lifetime ★ MOST UNCERTAIN</div>
            </div>

            <div className="nc-section">
              <div className="nc-h">CORE LISTS</div>
              <div className="nc-row"><span className="nc-k">Evolution (4)</span><span>Natural sel. · Mutation (NEW only ★) · Drift · Gene flow</span></div>
              <div className="nc-row"><span className="nc-k">Life defs (3)</span><span>Chemical · Biological · Astronomical (biosignature)</span></div>
              <div className="nc-row"><span className="nc-k">CHNOPS</span><span>C-H-N-O-P-S · Carbon = 4 stable bonds</span></div>
              <div className="nc-row"><span className="nc-k">Water</span><span>solvent · high Cp · ice floats · polar</span></div>
              <div className="nc-row"><span className="nc-k">Asteroids</span><span>C (carb) · S (stony) · M (metal) · Heavy Bomb 4.1–3.8 Gya</span></div>
              <div className="nc-row"><span className="nc-k">Forces fund (4)</span><span>Gravity · EM · Strong · Weak</span></div>
              <div className="nc-row"><span className="nc-k">Flight (4)</span><span>Thrust · Drag · Lift · Weight</span></div>
              <div className="nc-row"><span className="nc-k">Scope props (4)</span><span>Area · Spatial · Spectral · Temporal</span></div>
              <div className="nc-row"><span className="nc-k">Spectra (Lab 2)</span><span>Continuous (hot dense) · Emission (hot gas) · Absorption (cool gas)</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">FORMULAS</div>
              <div className="nc-row"><span className="nc-k">Newton</span>F = ma · a_liftoff = (T − mg)/m</div>
              <div className="nc-row"><span className="nc-k">Tsiolkovsky</span>Δv = Isp · g · ln(m_i / m_f)</div>
              <div className="nc-row"><span className="nc-k">Light</span>c = λf · E = hf</div>
              <div className="nc-row"><span className="nc-k">Pendulum</span>T = 2π√(L/g) [Lab 1: T=8.75s → L≈19m]</div>
              <div className="nc-row"><span className="nc-k">Wien</span>λ_peak ∝ 1/T (Sun 5800K vis · M 3000K red)</div>
              <div className="nc-row"><span className="nc-k">Hubble</span>v = H₀ · d · ladder: parallax → Cepheid → Ia SN → Hubble</div>
              <div className="nc-row"><span className="nc-k">Relativity</span>γ = 1/√(1−v²/c²) · at 0.95c ≈ 3.2×</div>
            </div>

            <div className="nc-section">
              <div className="nc-h">NUMBERS</div>
              <div className="nc-row">c = 3×10⁸ m/s · g = 9.8 m/s² · Earth: 15°/hr · 23h 56m sidereal · 23.5° tilt</div>
              <div className="nc-row">LEO orbit ~7.8 km/s · escape 11.2 km/s · Falcon 9 ~$1,500/kg</div>
              <div className="nc-row">Alpha Centauri 4.25 ly · CMB 2.7 K</div>
              <div className="nc-row"><strong>Lab errors (any):</strong> timing precision · calibration · environmental noise · small N</div>
            </div>
          </div>
        </div>

        <h2>Third side</h2>
        <p className="muted small">Denser than a real 3×5 — squeeze it onto a back-of-back overflow card or shrink your handwriting. Worth the space; this whole card answers Q34 plus relativity and KE.</p>
        <div className="notecard nc-tall">
          <div className="nc-redline" />
          <div className="nc-content">
            <div className="nc-section">
              <div className="nc-h">TWO BODIES · DIFFERENT TERRAINS · 2 TECHS EACH</div>
              <div className="nc-row"><span className="nc-k">MARS (rocky)</span><span><strong>Perseverance</strong> at Jezero Crater</span></div>
              <div className="nc-row"><span className="nc-k">  → SHERLOC</span><span>UV Raman/fluorescence · finds ORGANIC molecules in rocks (biosignatures)</span></div>
              <div className="nc-row"><span className="nc-k">  → PIXL</span><span>X-ray fluorescence · maps elemental composition, textures of past life</span></div>
              <div className="nc-row"><em>Found: organic carbon compounds, ancient lakebed, sample cache for Mars Sample Return</em></div>
              <div className="nc-row"><span className="nc-k">ENCELADUS (icy + plumes)</span><span><strong>Cassini</strong> (1997–2017)</span></div>
              <div className="nc-row"><span className="nc-k">  → INMS</span><span>Ion/Neutral Mass Spec · flew through plumes · detected H₂O, CO₂, CH₄, NH₃, complex organics, H₂</span></div>
              <div className="nc-row"><span className="nc-k">  → CDA</span><span>Cosmic Dust Analyzer · caught ice grains · silica nanoparticles → hydrothermal vents on ocean floor</span></div>
              <div className="nc-row"><em>Found: subsurface ocean, organics + H₂ (energy source), seafloor vents — Earth-life-cradle analogue</em></div>
              <div className="nc-row"><strong>Why different tech:</strong> Mars = dry rocky surface needs in-situ rock analysis (rover + arm). Enceladus = active plumes, fly-through sampling enough — no lander needed.</div>
            </div>

            <div className="nc-section">
              <div className="nc-h">LORENTZ FACTOR · KINETIC ENERGY</div>
              <div className="nc-row"><span className="nc-k">γ =</span><span>1 / √(1 − v²/c²) · at v=0.95c, γ ≈ 3.2</span></div>
              <div className="nc-row"><span className="nc-k">  uses</span><span>time dilation Δt&prime; = γΔt · length contraction L&prime; = L/γ · mass-energy E = γmc²</span></div>
              <div className="nc-row"><span className="nc-k">KE</span><span>= ½ m v²  (single particle)</span></div>
              <div className="nc-row"><span className="nc-k">⟨KE⟩</span><span>= (3/2) k T  (kinetic molecular theory · k = Boltzmann 1.38×10⁻²³ J/K)</span></div>
              <div className="nc-row"><em>Higher T → higher avg KE → faster molecules. Why hot gas radiates at higher freq (Wien).</em></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">ROCKET — FOUR FORCES</div>
              <div className="nc-rocket">
                <svg viewBox="0 0 280 220" className="nc-rocket-svg" aria-label="Rocket force diagram">
                  <line x1="140" y1="20" x2="140" y2="200" stroke="#1a1a2e" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="40" y1="120" x2="240" y2="120" stroke="#1a1a2e" strokeWidth="0.5" strokeDasharray="2,2" />
                  <g>
                    <polygon points="140,75 130,105 150,105" fill="#fefdf6" stroke="#1a1a2e" strokeWidth="1.5" />
                    <rect x="130" y="105" width="20" height="40" fill="#fefdf6" stroke="#1a1a2e" strokeWidth="1.5" />
                    <polygon points="130,145 122,155 130,155" fill="#fefdf6" stroke="#1a1a2e" strokeWidth="1.5" />
                    <polygon points="150,145 158,155 150,155" fill="#fefdf6" stroke="#1a1a2e" strokeWidth="1.5" />
                    <polygon points="135,145 145,145 142,158 138,158" fill="#f87171" stroke="#1a1a2e" strokeWidth="0.8" />
                  </g>
                  <g stroke="#2a3a8e" strokeWidth="2" fill="#2a3a8e">
                    <line x1="140" y1="105" x2="140" y2="35" />
                    <polygon points="140,30 135,40 145,40" />
                    <text x="148" y="55" fontSize="13" fontWeight="700" fill="#2a3a8e">THRUST ↑</text>
                  </g>
                  <g stroke="#1a1a2e" strokeWidth="2" fill="#1a1a2e">
                    <line x1="140" y1="160" x2="140" y2="200" />
                    <polygon points="140,205 135,195 145,195" />
                    <text x="148" y="195" fontSize="13" fontWeight="700">WEIGHT ↓ (mg)</text>
                  </g>
                  <g stroke="#b45309" strokeWidth="2" fill="#b45309">
                    <line x1="155" y1="125" x2="220" y2="125" />
                    <polygon points="225,125 215,120 215,130" />
                    <text x="170" y="142" fontSize="13" fontWeight="700">DRAG →</text>
                  </g>
                  <g stroke="#15803d" strokeWidth="2" fill="#15803d">
                    <line x1="125" y1="125" x2="60" y2="125" />
                    <polygon points="55,125 65,120 65,130" />
                    <text x="60" y="142" fontSize="13" fontWeight="700">LIFT ←</text>
                  </g>
                </svg>
                <div className="nc-rocket-notes">
                  <div className="nc-row"><span className="nc-k">Thrust ↑</span><span>from expelled exhaust (Newton 3rd)</span></div>
                  <div className="nc-row"><span className="nc-k">Weight ↓</span><span>= m·g · HARDEST to overcome at launch</span></div>
                  <div className="nc-row"><span className="nc-k">Drag</span><span>aerodynamic resistance · max near sea level, zero in vacuum</span></div>
                  <div className="nc-row"><span className="nc-k">Lift</span><span>perpendicular to motion · matters for winged vehicles</span></div>
                  <div className="nc-row"><strong>Net: a = (T − mg)/m</strong> — must be &gt; 0 for liftoff</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="nc-tips">
          <h2>How to use it</h2>
          <ol>
            <li><strong>Transcribe by hand.</strong> Don&rsquo;t print and tape — the act of writing locks it in. By exam day you may not need the card at all.</li>
            <li><strong>Cross out what you can recite cold</strong> the morning of the test. Replace with weaker spots that still need reinforcement.</li>
            <li><strong>Star (★) the highest-leverage facts:</strong> K-dwarf priority, Galileo planetary protection, &ldquo;Mutation = NEW only,&rdquo; L = most uncertain Drake term. These are one-word answers that earn full credit on multi-point questions.</li>
            <li><strong>Do NOT write the 3-part answer template on the card.</strong> Drill it into your head: every open response = <strong>(a) define · (b) apply · (c) name + justify</strong>. That&rsquo;s structure, not facts — memorize it.</li>
          </ol>
          <button className="primary big" onClick={() => window.print()}>Print this page</button>
        </section>
      </main>
    </>
  );
}
