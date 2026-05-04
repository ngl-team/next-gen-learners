'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';

export default function SpectroscopyPage() {
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
        <h1>Spectroscopy Notecard</h1>
        <p className="muted">
          Spectroscopy is how astronomers turn light into data. It shows up in Lab 2 (three spectra), Lab 5 (reflectance/ALTA II), Class 5 (Bohr model), Class 7 (Chandra gratings), Class 14 (mineral ID), and the Q35–Q37 distance ladder questions. One topic, many answers.
        </p>

        <section className="nc-why">
          <h2>Why spectroscopy matters across the whole course</h2>
          <p>
            Almost every &ldquo;how do we know X about a distant object&rdquo; answer routes through spectroscopy. Composition? Spectral lines. Velocity? Doppler shift. Temperature? Wien&rsquo;s peak. Mineral ID? Reflectance. Atmospheric biosignatures? Transmission spectra. Lock down these and you cover six different open response questions with one body of knowledge.
          </p>
          <ul className="nc-why-list">
            <li><strong>Three spectra types (Lab 2)</strong> — Kirchhoff&rsquo;s laws. Continuous · Emission · Absorption. The exam asks for all three by name and what produces each.</li>
            <li><strong>Why lines exist</strong> — Bohr model: quantized energy levels. E = hf. Each element = unique fingerprint. Comes up in Class 5 MC and any &ldquo;how do we know what stars are made of&rdquo; question.</li>
            <li><strong>Specific techniques + instruments</strong> — ALTA II (Lab 5), SHERLOC and PIXL (Mars), HETG/LETG (Chandra), VIMS (Cassini). Named instruments earn the (c) example points.</li>
            <li><strong>Applications</strong> — Doppler/redshift drives Hubble&rsquo;s Law and the radial velocity method. Reflectance ID&rsquo;s minerals on Mars analogs. Transmission spectra search exoplanet atmospheres (JWST + TRAPPIST-1d).</li>
            <li><strong>Spectroscopy vs photometry</strong> — Q7 explicitly asks the difference. Spectroscopy = wavelength-resolved (composition, velocity). Photometry = total photon count (brightness, transits).</li>
          </ul>
        </section>

        <h2>Front side — three spectra + line physics</h2>
        <div className="notecard nc-tall">
          <div className="nc-redline" />
          <div className="nc-content">
            <div className="nc-section">
              <div className="nc-h">WHAT SPECTROSCOPY DOES</div>
              <div className="nc-row"><strong>Splits light by wavelength to extract:</strong> composition · velocity (Doppler) · temperature (Wien) · density · distance</div>
              <div className="nc-row"><span className="nc-k">vs photometry</span><span>Photometry = total photon count (brightness). Spectroscopy = wavelength-resolved.</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">THREE SPECTRA TYPES (KIRCHHOFF · LAB 2)</div>
              <div className="nc-row"><span className="nc-k">Continuous</span><span>Hot DENSE object (incandescent solid, liquid, or dense gas) → all wavelengths smoothly</span></div>
              <div className="nc-row"><span className="nc-k">Emission</span><span>Hot LOW-DENSITY gas → BRIGHT lines at specific wavelengths · element fingerprint</span></div>
              <div className="nc-row"><span className="nc-k">Absorption</span><span>COOL gas in front of continuous source → DARK lines at specific wavelengths</span></div>
              <div className="nc-row"><em>Sun has continuous (hot dense interior) + absorption (cooler outer atmosphere) = solar spectrum we see.</em></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">WHY LINES EXIST · BOHR MODEL</div>
              <div className="nc-row">Electrons occupy <strong>quantized energy levels</strong> — only specific orbits allowed.</div>
              <div className="nc-row">Transition between levels emits/absorbs photon: <strong>E = hf = ΔE_levels</strong></div>
              <div className="nc-row">Each element has a unique level structure → unique line pattern → cosmic fingerprint.</div>
              <div className="nc-row"><em>This is how we know stars are mostly H + He without ever touching one.</em></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">WIEN + CONTINUOUS SPECTRUM</div>
              <div className="nc-row"><strong>λ_peak = b / T</strong> &nbsp; b ≈ 2.898 × 10⁻³ m·K</div>
              <div className="nc-row"><span className="nc-k">Sun 5800 K</span><span>peaks in visible (green-yellow) → looks white</span></div>
              <div className="nc-row"><span className="nc-k">Wolf 359 ~3000 K</span><span>peaks in red/near-IR → looks red</span></div>
              <div className="nc-row"><span className="nc-k">Hot O-star ~30,000 K</span><span>peaks in UV → looks blue</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">DOPPLER SHIFT (in spectra)</div>
              <div className="nc-row"><strong>Δλ / λ ≈ v / c</strong> &nbsp; (non-relativistic)</div>
              <div className="nc-row"><span className="nc-k">Redshift</span><span>source moving AWAY → λ longer → lines shifted toward red</span></div>
              <div className="nc-row"><span className="nc-k">Blueshift</span><span>source moving TOWARD → λ shorter → lines shifted toward blue</span></div>
              <div className="nc-row"><em>Drives Hubble&rsquo;s Law (galaxy recession) AND radial velocity exoplanet detection.</em></div>
            </div>
          </div>
        </div>

        <h2>Back side — techniques, instruments, applications</h2>
        <div className="notecard nc-tall">
          <div className="nc-redline" />
          <div className="nc-content">
            <div className="nc-section">
              <div className="nc-h">SPECTROSCOPY TECHNIQUES</div>
              <div className="nc-row"><span className="nc-k">Emission</span><span>Analyze light object emits → ID gas composition (nebulae, plasmas)</span></div>
              <div className="nc-row"><span className="nc-k">Absorption</span><span>Analyze what light is absorbed → ID stellar atmospheres, exoplanet atms (transmission)</span></div>
              <div className="nc-row"><span className="nc-k">Reflectance</span><span>Light bounced off surface → ID minerals on Mars analogs (Lab 5 / ALTA II)</span></div>
              <div className="nc-row"><span className="nc-k">Raman</span><span>Inelastic scattering of laser light → reveals MOLECULAR vibrations (organics)</span></div>
              <div className="nc-row"><span className="nc-k">X-ray fluorescence (XRF)</span><span>Excited atoms emit X-rays at characteristic energies → ELEMENTAL composition</span></div>
              <div className="nc-row"><span className="nc-k">Mass spectrometry</span><span>Separates particles by mass/charge (not photon spec, but same goal: composition)</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">INSTRUMENTS IN THE COURSE</div>
              <div className="nc-row"><span className="nc-k">ALTA II</span><span>Lab 5 reflectance spectrometer · 11 LEDs · Mars-analog soil mineral ID</span></div>
              <div className="nc-row"><span className="nc-k">SHERLOC</span><span>Perseverance · UV Raman + fluorescence → ORGANICS in Mars rocks</span></div>
              <div className="nc-row"><span className="nc-k">PIXL</span><span>Perseverance · X-ray fluorescence → fine-scale elemental maps, life-relevant textures</span></div>
              <div className="nc-row"><span className="nc-k">SuperCam</span><span>Perseverance · laser-induced breakdown spec (LIBS) → vaporize rock at distance</span></div>
              <div className="nc-row"><span className="nc-k">HETG / LETG</span><span>Chandra · X-ray transmission GRATINGS → high-res X-ray spectra</span></div>
              <div className="nc-row"><span className="nc-k">VIMS</span><span>Cassini · visible + IR mapping spec → Titan/Enceladus surface composition</span></div>
              <div className="nc-row"><span className="nc-k">JWST NIRSpec/MIRI</span><span>Transmission spec of exoplanet atms · TRAPPIST-1d → no detectable atm</span></div>
              <div className="nc-row"><span className="nc-k">INMS / MASPEX</span><span>Cassini / Europa Clipper · MASS spec of plume material → H₂, organics</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">KEY APPLICATIONS (one-line answers)</div>
              <div className="nc-row"><span className="nc-k">Star composition</span><span>Absorption lines in stellar spectrum → elements in atmosphere</span></div>
              <div className="nc-row"><span className="nc-k">Galaxy distance</span><span>Redshift of spectral lines → recession velocity → Hubble&rsquo;s Law → distance</span></div>
              <div className="nc-row"><span className="nc-k">Exoplanet atms</span><span>Transit transmission spec (JWST) → biosignature gases (O₂, CH₄, H₂O)</span></div>
              <div className="nc-row"><span className="nc-k">Radial velocity</span><span>Doppler wobble of star&rsquo;s lines → exoplanet mass</span></div>
              <div className="nc-row"><span className="nc-k">Mineral ID</span><span>Reflectance spec → match to lab library (ALTA II workflow)</span></div>
              <div className="nc-row"><span className="nc-k">Plume composition</span><span>Mass spec fly-through → H₂ + organics on Enceladus = energy + chem for life</span></div>
              <div className="nc-row"><span className="nc-k">Temperature</span><span>Continuous spectrum peak (Wien) → effective T of star or thermal emitter</span></div>
            </div>

            <div className="nc-section">
              <div className="nc-h">CHECKLIST FOR ANY SPECTROSCOPY QUESTION</div>
              <div className="nc-row">1. <strong>What spectrum type</strong> (continuous / emission / absorption / reflectance)?</div>
              <div className="nc-row">2. <strong>What produces it</strong> (hot dense source / hot gas / cool gas / reflected)?</div>
              <div className="nc-row">3. <strong>What does it tell you</strong> (composition / velocity / temperature / mineral)?</div>
              <div className="nc-row">4. <strong>Name an instrument</strong> that does it (front of card or this side).</div>
            </div>
          </div>
        </div>

        <section className="nc-tips">
          <h2>How to use it</h2>
          <ol>
            <li><strong>Memorize the three Kirchhoff types cold.</strong> &ldquo;Hot dense → continuous. Hot gas → emission. Cool gas in front → absorption.&rdquo; That single sentence answers Lab 2 question 41 alone.</li>
            <li><strong>Pair every technique with an instrument.</strong> Don&rsquo;t just say &ldquo;reflectance spectroscopy&rdquo; — say &ldquo;reflectance, like ALTA II in Lab 5.&rdquo; Named example = full credit.</li>
            <li><strong>The 4-step checklist on the back is your fallback structure</strong> for any spectroscopy question you didn&rsquo;t fully prep for.</li>
            <li><strong>Don&rsquo;t copy this whole page onto your physical card</strong> — it&rsquo;s richer than what fits. Pull the Kirchhoff three, Wien&rsquo;s constant, and your two highest-leverage instruments (ALTA II + JWST or SHERLOC). Keep the rest in your head.</li>
          </ol>
          <button className="primary big" onClick={() => window.print()}>Print this page</button>
        </section>
      </main>
    </>
  );
}
