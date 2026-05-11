'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const PRICING = {
  baseShinglePerSqFt: 5.5,
  designerPerSqFt: 8.0,
  metalPerSqFt: 12.0,
  pitchMultiplier: { low: 1.0, medium: 1.15, steep: 1.35 },
  tearOffPerSqFt: 1.25,
  minimumJob: 8500,
  rangeSpread: 0.12,
};

const TILE_Z = 19;

type Material = 'architectural' | 'designer' | 'metal';
type Pitch = 'low' | 'medium' | 'steep';

type GeoResult = {
  lat: number;
  lon: number;
  display_name: string;
};

type Box = { x: number; y: number; w: number; h: number };
type Stage = 'idle' | 'scanning' | 'results' | 'leadForm' | 'confirmed';

function lng2tileFloat(lng: number, z: number) {
  return ((lng + 180) / 360) * Math.pow(2, z);
}
function lat2tileFloat(lat: number, z: number) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * Math.pow(2, z);
}

function mppNative(lat: number, z: number) {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, z);
}

function fmtMoney(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function TecturalEstimator() {
  const [address, setAddress] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [geo, setGeo] = useState<GeoResult | null>(null);
  const [material, setMaterial] = useState<Material>('architectural');
  const [pitch, setPitch] = useState<Pitch>('medium');
  const [tearOff, setTearOff] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: 0, h: 0 });

  const handleSize = useCallback((w: number, h: number) => {
    setContainerSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
  }, []);

  const pricePerSqFt =
    material === 'architectural'
      ? PRICING.baseShinglePerSqFt
      : material === 'designer'
        ? PRICING.designerPerSqFt
        : PRICING.metalPerSqFt;

  const mppDisplayed = useMemo(() => {
    if (!geo || !containerSize.w) return 0;
    return (mppNative(geo.lat, TILE_Z) * 3 * 256) / containerSize.w;
  }, [geo, containerSize.w]);

  const footprintSqFt = useMemo(() => {
    if (!mppDisplayed || box.w <= 0 || box.h <= 0) return 0;
    const wM = box.w * mppDisplayed;
    const hM = box.h * mppDisplayed;
    return wM * hM * 10.7639;
  }, [box, mppDisplayed]);

  const roofSqFt = Math.round(footprintSqFt * PRICING.pitchMultiplier[pitch]);

  const { low, high } = useMemo(() => {
    if (!roofSqFt) return { low: 0, high: 0 };
    const tearOffCost = tearOff ? roofSqFt * PRICING.tearOffPerSqFt : 0;
    const subtotal = roofSqFt * pricePerSqFt + tearOffCost;
    const final = Math.max(subtotal, PRICING.minimumJob);
    const spread = final * PRICING.rangeSpread;
    return {
      low: Math.round((final - spread) / 100) * 100,
      high: Math.round((final + spread) / 100) * 100,
    };
  }, [roofSqFt, pricePerSqFt, tearOff]);

  useEffect(() => {
    if (stage !== 'scanning') return;
    const start = performance.now();
    const duration = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setScanProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setStage('results');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  useEffect(() => {
    if (!geo || !containerSize.w || !mppDisplayed) return;
    const defaultMeters = 15.5;
    const defaultPx = defaultMeters / mppDisplayed;
    setBox({
      x: containerSize.w / 2 - defaultPx / 2,
      y: containerSize.h / 2 - defaultPx / 2,
      w: defaultPx,
      h: defaultPx,
    });
  }, [geo, containerSize.w, containerSize.h, mppDisplayed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setError(null);
    setStage('scanning');
    setScanProgress(0);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (!data || data.length === 0) {
        setError("We couldn't find that address. Try adding city and state.");
        setStage('idle');
        return;
      }
      const result = data[0];
      setGeo({ lat: parseFloat(result.lat), lon: parseFloat(result.lon), display_name: result.display_name });
    } catch {
      setError('Network error reaching the satellite service. Try again.');
      setStage('idle');
    }
  }

  function reset() {
    setStage('idle');
    setGeo(null);
    setAddress('');
    setLead({ name: '', email: '', phone: '' });
    setError(null);
    setBox({ x: 0, y: 0, w: 0, h: 0 });
  }

  function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.name || !lead.email) return;
    setStage('confirmed');
    if (typeof window !== 'undefined') {
      console.log('[Tectural lead]', {
        ...lead,
        address: geo?.display_name,
        footprintSqFt: Math.round(footprintSqFt),
        roofSqFt,
        material,
        pitch,
        tearOff,
        priceLow: low,
        priceHigh: high,
      });
    }
  }

  return (
    <main
      style={{
        background: '#0f172a',
        minHeight: '100vh',
        color: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 24px',
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#15803d', borderRadius: 8, display: 'grid', placeItems: 'center', fontWeight: 800 }}>T</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Tectural Construction</div>
            <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.05em' }}>INSTANT ROOF ESTIMATE</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#cbd5e1' }}>Roofing · Connecticut</div>
      </header>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px, 6vw, 64px) 24px' }}>
        {stage === 'idle' && (
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.18em', color: '#86efac', margin: '0 0 16px', fontWeight: 700 }}>
              FREE · NO PHONE CALL REQUIRED
            </p>
            <h1
              style={{
                fontSize: 'clamp(36px, 6vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.05,
                margin: '0 0 20px',
                letterSpacing: '-0.02em',
              }}
            >
              Get your roof estimate in 30 seconds.
            </h1>
            <p style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 32px' }}>
              Enter your address. We pull satellite imagery. You drag the green box over your roof and
              see a price range built from Tectural&apos;s real pricing. No salesman.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                placeholder="123 Main St, Danbury, CT"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  fontSize: 17,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '18px 24px',
                  fontSize: 17,
                  fontWeight: 700,
                  borderRadius: 12,
                  border: 'none',
                  background: '#15803d',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Get my estimate
              </button>
              {error && (
                <p style={{ fontSize: 14, color: '#fca5a5', margin: '4px 0 0' }}>{error}</p>
              )}
            </form>

            <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
              {[
                { k: 'Satellite measurement', v: 'No tape measure needed' },
                { k: 'Real Tectural pricing', v: 'Same numbers Jamil would quote' },
                { k: 'Zero pressure', v: 'See the price, then decide' },
              ].map((b) => (
                <div key={b.k}>
                  <div style={{ fontSize: 12, letterSpacing: '0.12em', color: '#86efac', fontWeight: 700, marginBottom: 6 }}>
                    {b.k.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 }}>{b.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'scanning' && (
          <ScanView address={address} progress={scanProgress} />
        )}

        {(stage === 'results' || stage === 'leadForm') && geo && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 32 }}>
            <div>
              <SatelliteView
                geo={geo}
                box={box}
                setBox={setBox}
                onSize={handleSize}
              />
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '10px 4px 0', lineHeight: 1.5 }}>
                Drag the green box over your roof. Drag the corners to resize it to match the roof outline.
              </p>
              <div style={{ marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>MEASURED ROOF AREA</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#86efac', letterSpacing: '-0.02em' }}>
                  {roofSqFt.toLocaleString()} <span style={{ fontSize: 18, color: '#cbd5e1', fontWeight: 600 }}>sq ft</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Footprint {Math.round(footprintSqFt).toLocaleString()} sq ft × {PRICING.pitchMultiplier[pitch].toFixed(2)} pitch factor
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{geo.display_name}</div>
              </div>
            </div>

            <div>
              {stage === 'results' && (
                <>
                  <PriceCard low={low} high={high} />
                  <div style={{ marginTop: 24 }}>
                    <OptionGroup
                      label="Material"
                      value={material}
                      onChange={(v) => setMaterial(v as Material)}
                      options={[
                        { value: 'architectural', label: 'Architectural', sub: `$${PRICING.baseShinglePerSqFt.toFixed(2)}/sq ft` },
                        { value: 'designer', label: 'Designer', sub: `$${PRICING.designerPerSqFt.toFixed(2)}/sq ft` },
                        { value: 'metal', label: 'Standing seam metal', sub: `$${PRICING.metalPerSqFt.toFixed(2)}/sq ft` },
                      ]}
                    />
                    <OptionGroup
                      label="Pitch"
                      value={pitch}
                      onChange={(v) => setPitch(v as Pitch)}
                      options={[
                        { value: 'low', label: 'Low (under 6/12)' },
                        { value: 'medium', label: 'Medium (6/12 - 9/12)' },
                        { value: 'steep', label: 'Steep (9/12+)' },
                      ]}
                    />
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 16px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        marginTop: 16,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tearOff}
                        onChange={(e) => setTearOff(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: '#15803d' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Tear off old roof</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>Adds ${PRICING.tearOffPerSqFt.toFixed(2)}/sq ft</div>
                      </div>
                    </label>
                  </div>
                  <button
                    onClick={() => setStage('leadForm')}
                    style={{
                      width: '100%',
                      marginTop: 24,
                      padding: '18px',
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 12,
                      border: 'none',
                      background: '#15803d',
                      color: '#fff',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Get my full breakdown
                  </button>
                  <button
                    onClick={reset}
                    style={{
                      width: '100%',
                      marginTop: 8,
                      padding: '12px',
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'transparent',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Try a different address
                  </button>
                </>
              )}

              {stage === 'leadForm' && (
                <form onSubmit={submitLead} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Where do we send the full breakdown?</h2>
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 12px' }}>
                    Jamil reaches out within one business day. No autodialer.
                  </p>
                  <Input placeholder="Full name" value={lead.name} onChange={(v) => setLead({ ...lead, name: v })} />
                  <Input placeholder="Email" type="email" value={lead.email} onChange={(v) => setLead({ ...lead, email: v })} />
                  <Input placeholder="Phone (optional)" type="tel" value={lead.phone} onChange={(v) => setLead({ ...lead, phone: v })} />
                  <button
                    type="submit"
                    style={{
                      padding: '16px',
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: 12,
                      border: 'none',
                      background: '#15803d',
                      color: '#fff',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      marginTop: 8,
                    }}
                  >
                    Send me the breakdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage('results')}
                    style={{
                      padding: '10px',
                      fontSize: 13,
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    Back to estimate
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {stage === 'confirmed' && (
          <div style={{ maxWidth: 560, textAlign: 'center', margin: '40px auto' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#15803d', margin: '0 auto 24px', display: 'grid', placeItems: 'center', fontSize: 36 }}>
              <span aria-hidden>✓</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px' }}>Estimate sent.</h2>
            <p style={{ fontSize: 17, color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 32px' }}>
              Jamil will email the full breakdown to <strong style={{ color: '#fff' }}>{lead.email}</strong> within one business day. Watch for the subject line &quot;Your Tectural roof estimate.&quot;
            </p>
            <button
              onClick={reset}
              style={{
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'transparent',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Run another estimate
            </button>
          </div>
        )}
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>
        Tectural Construction · Estimates are preliminary and may change after on-site inspection.
      </footer>
    </main>
  );
}

function ScanView({ address, progress }: { address: string; progress: number }) {
  const pct = Math.round(progress * 100);
  const steps = [
    { at: 0.0, label: 'Locating property' },
    { at: 0.25, label: 'Pulling satellite imagery' },
    { at: 0.55, label: 'Centering on your address' },
    { at: 0.8, label: 'Ready to measure' },
  ];
  return (
    <div style={{ maxWidth: 560, margin: '40px auto', textAlign: 'center' }}>
      <div
        style={{
          width: 80,
          height: 80,
          margin: '0 auto 24px',
          borderRadius: '50%',
          border: '3px solid rgba(134,239,172,0.2)',
          borderTopColor: '#86efac',
          animation: 'spin 1s linear infinite',
        }}
      />
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Loading your property</h2>
      <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 32px' }}>{address}</p>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#15803d', transition: 'width 80ms linear' }} />
      </div>
      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((s) => {
          const done = progress >= s.at + 0.2 || progress >= 0.95;
          const active = progress >= s.at && !done;
          return (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: done || active ? '#cbd5e1' : '#475569' }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: done ? '#15803d' : active ? 'rgba(134,239,172,0.2)' : 'rgba(255,255,255,0.06)',
                display: 'grid', placeItems: 'center', fontSize: 11, color: '#fff',
              }}>
                {done ? '✓' : ''}
              </span>
              {s.label}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SatelliteView({
  geo,
  box,
  setBox,
  onSize,
}: {
  geo: GeoResult;
  box: Box;
  setBox: (b: Box) => void;
  onSize: (w: number, h: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ kind: 'move' | 'nw' | 'ne' | 'sw' | 'se'; start: Box; sx: number; sy: number } | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      onSize(r.width, r.height);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onSize]);

  const xFloat = lng2tileFloat(geo.lon, TILE_Z);
  const yFloat = lat2tileFloat(geo.lat, TILE_Z);
  const cx = Math.floor(xFloat);
  const cy = Math.floor(yFloat);
  const fracX = xFloat - cx;
  const fracY = yFloat - cy;

  const tiles: { x: number; y: number }[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: cx + dx, y: cy + dy });
    }
  }

  const translateX = -(0.5 + fracX) * (100 / 3);
  const translateY = -(0.5 + fracY) * (100 / 3);

  const startDrag = useCallback(
    (kind: 'move' | 'nw' | 'ne' | 'sw' | 'se') => (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      (e.target as Element).setPointerCapture(e.pointerId);
      dragRef.current = { kind, start: { ...box }, sx: e.clientX, sy: e.clientY };
    },
    [box],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d || !ref.current) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      const W = ref.current.clientWidth;
      const H = ref.current.clientHeight;
      let nb: Box = { ...d.start };
      const MIN = 24;
      if (d.kind === 'move') {
        nb.x = Math.max(0, Math.min(W - d.start.w, d.start.x + dx));
        nb.y = Math.max(0, Math.min(H - d.start.h, d.start.y + dy));
      } else if (d.kind === 'se') {
        nb.w = Math.max(MIN, Math.min(W - d.start.x, d.start.w + dx));
        nb.h = Math.max(MIN, Math.min(H - d.start.y, d.start.h + dy));
      } else if (d.kind === 'sw') {
        const newW = Math.max(MIN, d.start.w - dx);
        nb.x = d.start.x + (d.start.w - newW);
        nb.w = newW;
        nb.h = Math.max(MIN, Math.min(H - d.start.y, d.start.h + dy));
      } else if (d.kind === 'ne') {
        const newH = Math.max(MIN, d.start.h - dy);
        nb.y = d.start.y + (d.start.h - newH);
        nb.h = newH;
        nb.w = Math.max(MIN, Math.min(W - d.start.x, d.start.w + dx));
      } else if (d.kind === 'nw') {
        const newW = Math.max(MIN, d.start.w - dx);
        const newH = Math.max(MIN, d.start.h - dy);
        nb.x = d.start.x + (d.start.w - newW);
        nb.y = d.start.y + (d.start.h - newH);
        nb.w = newW;
        nb.h = newH;
      }
      setBox(nb);
    },
    [setBox],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 18,
    height: 18,
    background: '#86efac',
    border: '2px solid #0f172a',
    borderRadius: 4,
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    touchAction: 'none',
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        background: '#020617',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '300%',
          height: '300%',
          left: 0,
          top: 0,
          transform: `translate(${translateX}%, ${translateY}%)`,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
        }}
      >
        {tiles.map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${t.x}-${t.y}`}
            src={`https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/${TILE_Z}/${t.y}/${t.x}`}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        ))}
      </div>

      {box.w > 0 && (
        <div
          onPointerDown={startDrag('move')}
          style={{
            position: 'absolute',
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            border: '2px solid #86efac',
            borderRadius: 6,
            background: 'rgba(134,239,172,0.12)',
            cursor: 'move',
            touchAction: 'none',
            boxShadow: '0 0 0 9999px rgba(15,23,42,0.45)',
          }}
        >
          <div onPointerDown={startDrag('nw')} style={{ ...handleStyle, left: -10, top: -10, cursor: 'nwse-resize' }} />
          <div onPointerDown={startDrag('ne')} style={{ ...handleStyle, right: -10, top: -10, cursor: 'nesw-resize' }} />
          <div onPointerDown={startDrag('sw')} style={{ ...handleStyle, left: -10, bottom: -10, cursor: 'nesw-resize' }} />
          <div onPointerDown={startDrag('se')} style={{ ...handleStyle, right: -10, bottom: -10, cursor: 'nwse-resize' }} />
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 10, color: '#cbd5e1', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, pointerEvents: 'none' }}>
        Imagery: Esri World Imagery
      </div>
    </div>
  );
}

function PriceCard({ low, high }: { low: number; high: number }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
        padding: 28,
        borderRadius: 16,
        color: '#fff',
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>YOUR ESTIMATED RANGE</div>
      <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
        {fmtMoney(low)} <span style={{ opacity: 0.7 }}>to</span> {fmtMoney(high)}
      </div>
      <div style={{ fontSize: 13, opacity: 0.85, marginTop: 10, lineHeight: 1.5 }}>
        Range accounts for material variation and site conditions. Final number set after Jamil walks the roof.
      </div>
    </div>
  );
}

function OptionGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; sub?: string }[];
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.14em', color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>{label.toUpperCase()}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 10,
                border: active ? '1px solid #15803d' : '1px solid rgba(255,255,255,0.12)',
                background: active ? 'rgba(21,128,61,0.18)' : 'rgba(255,255,255,0.03)',
                color: '#f8fafc',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>{o.label}</span>
              {o.sub && <span style={{ fontSize: 12, color: '#94a3b8' }}>{o.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={type !== 'tel'}
      style={{
        padding: '14px 16px',
        fontSize: 15,
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.16)',
        background: 'rgba(255,255,255,0.04)',
        color: '#fff',
        outline: 'none',
        fontFamily: 'inherit',
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  );
}
