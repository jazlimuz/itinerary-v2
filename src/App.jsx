import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeftRight, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleDollarSign, Clock3, CloudDownload, Coffee, Compass, CreditCard, Download,
  FileUp, Hotel, Luggage, MapPin, Moon, Plane, Plus, RotateCcw, Save, Settings,
  Share2, Sparkles, Sun, Trash2, Undo2, Redo2, Wallet, X
} from 'lucide-react';

const KEY = 'bandung_family_adventure_v1';
const RATE = 12900; // Editable planning estimate only; not a live quote.
const makeDefaults = () => ({
  theme: 'dark', completedActivities: {}, tripName: 'Bandung Family Adventure',
  tripNotes: 'Family trip for 2 adults and Melissa (4). Balanced pace, nature and scenery, unique attractions, local food and cafes, shopping, photography and family-friendly stops. Halal-preferred; verify each venue directly.',
  flights: {
    outbound: { airline: 'Scoot', flight: '', date: '2026-11-22', from: 'Singapore (SIN)', to: 'Jakarta (CGK)', departure: '07:55', arrival: '08:50', status: 'Booked', reference: '' },
    inbound: { airline: 'Garuda Indonesia', flight: '', date: '2026-11-27', from: 'Jakarta (CGK)', to: 'Singapore (SIN)', departure: '18:45', arrival: '21:45', status: 'Booked', reference: '' }
  },
  hotels: [
    { id: 'h1', name: 'Bobocabin Signature Sukawana', checkIn: '2026-11-22', checkOut: '2026-11-24', nights: 2, notes: 'Nature stay · 22–24 November 2026' },
    { id: 'h2', name: 'voco Bandung Setiabudi', checkIn: '2026-11-24', checkOut: '2026-11-27', nights: 3, notes: 'City / Setiabudi stay · 24–27 November 2026' }
  ],
  whoosh: { outbound: 'Halim → Padalarang · 22 Nov · Business Class intended; buy at station subject to availability', inbound: 'Padalarang → Halim · 27 Nov · schedule to be confirmed', notes: 'Check live timetable, child fare, seat availability and station transfer time before travel.' },
  transport: {
    day1: 'Soekarno-Hatta Airport → Halim Station → Whoosh to Padalarang → transfer to Bobocabin Signature Sukawana. Decide between Grab and a pre-arranged driver for Padalarang–Bobocabin.',
    driverName: '', driverRate: 650000, driverDays: 1,
    driverNotes: 'Latest discussed quote: Rp650,000/day. Driver and vehicle are not confirmed. Confirm car type, child seat, luggage capacity, fuel, tolls, parking, overtime and waiting time.',
    day2: 'Private driver for Lembang / Orchid Forest Cikole sightseeing. Confirm pickup and return timing.',
    day3: 'Check out Bobocabin, transfer to voco Bandung Setiabudi, then keep the afternoon relaxed. Cihampelas Walk is an optional stop.',
    day4: 'Kawah Putih / Ciwidey is optional. It is a long drive; decide based on weather, family energy and whether the visit is comfortable for Melissa.',
    day5: 'Braga and central Bandung. Use Grab for practical city hops.',
    day6: 'voco → Padalarang → Whoosh to Halim → Grab to Soekarno-Hatta Airport. Leave a generous buffer before the 18:45 Garuda flight.'
  },
  days: [
    { date: '22 Nov · Sun', title: 'Arrival & settle in', area: 'Jakarta → Padalarang → Sukawana', focus: 'Keep this day light after the flight and rail transfer.', activities: ['Land at Soekarno-Hatta Airport', 'Grab to Halim Station', 'Whoosh to Padalarang (Business Class intended; purchase subject to availability)', 'Transfer to Bobocabin Signature Sukawana', 'Check in, settle in and enjoy the cabin'], meals: ['Breakfast at airport / en route', 'Lunch during transfer', 'Dinner near Bobocabin or takeaway'] },
    { date: '23 Nov · Mon', title: 'Lembang & pine forest day', area: 'Lembang / North Bandung', focus: 'Main nature day. Keep the number of stops realistic and allow rest.', activities: ['Breakfast at Bobocabin', 'Explore Lembang at a relaxed pace', 'Orchid Forest Cikole', 'Scenic and photography stops', 'Return to Bobocabin'], meals: ['Breakfast at Bobocabin', 'Lunch in Lembang', 'Dinner in Lembang or near accommodation'] },
    { date: '24 Nov · Tue', title: 'Hotel transfer & easy afternoon', area: 'Sukawana → Setiabudi', focus: 'Avoid stacking too many activities on the accommodation-change day.', activities: ['Breakfast and check out Bobocabin', 'Transfer to voco Bandung Setiabudi', 'Check in / leave luggage', 'Optional Cihampelas Walk', 'Relax at hotel'], meals: ['Breakfast at Bobocabin', 'Lunch around Setiabudi', 'Dinner near hotel / Cihampelas'] },
    { date: '25 Nov · Wed', title: 'Ciwidey option day', area: 'Kawah Putih / Ciwidey', focus: 'Kawah Putih remains optional, not a fixed commitment. Reassess drive time, weather and family comfort.', activities: ['Decide whether to proceed to Kawah Putih', 'Explore nearby Ciwidey scenery if comfortable', 'Return to voco and rest'], meals: ['Breakfast at voco', 'Lunch around Ciwidey if travelling', 'Dinner near hotel'] },
    { date: '26 Nov · Thu', title: 'Braga & Bandung city', area: 'Braga / Central Bandung', focus: 'A flexible city day for heritage, photography, local food and shopping.', activities: ['Explore Braga Street', 'Walk around Asia-Afrika heritage area', 'Photography and relaxed sightseeing', 'Local shopping / souvenirs', 'Return to voco'], meals: ['Breakfast at voco', 'Lunch in central Bandung', 'Dinner around Braga / city centre'] },
    { date: '27 Nov · Fri', title: 'Checkout & return to Singapore', area: 'Bandung → Jakarta → Singapore', focus: 'Prioritise a smooth airport transfer. Do not leave the Whoosh connection too late.', activities: ['Breakfast at voco', 'Check out and travel to Padalarang', 'Whoosh to Halim', 'Grab to Soekarno-Hatta Airport', 'Garuda Indonesia flight at 18:45'], meals: ['Breakfast at voco', 'Lunch before departure', 'Early dinner / meal at airport'] }
  ],
  bookings: [
    { name: 'Scoot outbound flight', status: 'Booked' }, { name: 'Garuda return flight', status: 'Booked' },
    { name: 'Bobocabin Signature Sukawana', status: 'Booked' }, { name: 'voco Bandung Setiabudi', status: 'Booked' },
    { name: 'Travel insurance', status: 'To confirm' }, { name: 'Whoosh tickets', status: 'To buy / confirm' },
    { name: 'Private driver', status: 'To confirm' }, { name: 'Airport transfers', status: 'To arrange' }
  ],
  budget: { total: 1200, cash: 500, youtrip: 700, exchangeRate: RATE,
    categories: [
      { id: 'c1', name: 'Food & drinks', amount: 250 }, { id: 'c2', name: 'Local transport / Grab', amount: 150 },
      { id: 'c3', name: 'Private driver', amount: 250 }, { id: 'c4', name: 'Activities / entrance fees', amount: 150 },
      { id: 'c5', name: 'Shopping & souvenirs', amount: 150 }, { id: 'c6', name: 'Snacks / child expenses', amount: 100 },
      { id: 'c7', name: 'Contingency', amount: 150 }
    ] },
  expenses: [],
  packing: ['Passports (all 3)', 'Flight tickets / booking confirmations', 'Whoosh tickets / booking details', 'Hotel confirmations', 'Travel insurance details', 'YouTrip card and backup bank card', 'Indonesian Rupiah cash', 'Phone chargers and cables', 'Power bank', 'Universal travel adapter', 'Clothes for 6 days', 'Underwear and socks', 'Comfortable walking shoes', 'Jacket / warmer layers for Sukawana', "Melissa’s spare clothes", 'Child essentials / favourite comfort item', 'Toiletries and skincare', 'Medication and basic first-aid kit', 'Wet wipes, tissues and hand sanitiser', 'Small backpack / day bag', 'Water bottles and snacks for Melissa'],
  packed: [],
  ideas: ['Floating Market Lembang', 'The Great Asia Africa', 'Farmhouse Lembang', 'Dusun Bambu', 'Tangkuban Perahu', 'Ranca Upas', 'Kawah Putih', 'Braga Street', 'Asia-Afrika Street', 'Gedung Sate', 'Cihampelas Walk', 'Paris Van Java Mall', 'Rumah Mode Factory Outlet', 'Lembang Park & Zoo', 'Dago Dreampark', 'Saung Angklung Udjo', 'Sudut Pandang Bandung', 'Teras Cikapundung'],
  foodIdeas: ['Halal Sundanese food', 'Nasi Padang', 'Bakso / soto', 'Local Bandung snacks', 'Cafe / dessert stop', 'Hotel or mall dining'],
  selectedDay: 0
});

const clone = value => JSON.parse(JSON.stringify(value));
const money = n => `S$${Number(n || 0).toLocaleString('en-SG', { maximumFractionDigits: 2 })}`;
const rupiah = n => `Rp${Math.round(Number(n || 0)).toLocaleString('id-ID')}`;
const safeLoad = () => { try { const raw = localStorage.getItem(KEY); return raw ? { ...makeDefaults(), ...JSON.parse(raw) } : makeDefaults(); } catch { return makeDefaults(); } };

function Field({ label, value, onChange, type = 'text', placeholder, multiline = false, min, step }) {
  return <label className="field"><span>{label}</span>{multiline ? <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} /> : <input type={type} value={value ?? ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} placeholder={placeholder} min={min} step={step} />}</label>;
}
function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section>; }
function SectionHead({ eyebrow, title, action }) { return <div className="section-head"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{action}</div>; }

export default function App() {
  const [data, setData] = useState(safeLoad);
  const [page, setPage] = useState('overview');
  const [savedAt, setSavedAt] = useState(Date.now());
  const [dirty, setDirty] = useState(false);
  const [expenseDraft, setExpenseDraft] = useState({ name: '', amount: '', currency: 'IDR', day: 'Day 1', method: 'Cash' });
  const [ideaDraft, setIdeaDraft] = useState('');
  const [packingDraft, setPackingDraft] = useState('');
  const [foodDraft, setFoodDraft] = useState('');
  const [sgdValue, setSgdValue] = useState('10');
  const [rateMessage, setRateMessage] = useState('Editable planning estimate. Refresh online before relying on it.');
  const [toast, setToast] = useState('');
  const undoRef = useRef([]);
  const redoRef = useRef([]);
  const fileRef = useRef(null);
  const saveTimer = useRef(null);

  const update = useCallback(fn => {
    setData(prev => {
      const next = clone(prev);
      fn(next);
      undoRef.current = [...undoRef.current.slice(-19), clone(prev)];
      redoRef.current = [];
      return next;
    });
    setDirty(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = data.theme === 'system' ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : data.theme;
  }, [data.theme]);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(data)); setSavedAt(Date.now()); setDirty(false); }
      catch { setToast('Could not save locally. Export a backup to protect your changes.'); }
    }, 350);
    return () => clearTimeout(saveTimer.current);
  }, [data]);

  const persistNow = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); setSavedAt(Date.now()); setDirty(false); setToast('Changes saved on this device.'); }
    catch { setToast('Save failed. Export a backup instead.'); }
  };
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);

  const totals = useMemo(() => {
    const spent = data.expenses.reduce((sum, e) => sum + Number(e.sgd || 0), 0);
    const packed = data.packed.length;
    const total = data.packing.length;
    const hotelNights = data.hotels.reduce((s, h) => s + Number(h.nights || 0), 0);
    return { spent, remaining: Number(data.budget.total || 0) - spent, packed, total, hotelNights };
  }, [data]);
  const daysAway = Math.max(0, Math.ceil((new Date('2026-11-22T00:00:00+08:00') - new Date()) / 86400000));

  const undo = () => { if (!undoRef.current.length) return; const prev = undoRef.current.pop(); redoRef.current.push(clone(data)); setData(prev); setDirty(true); };
  const redo = () => { if (!redoRef.current.length) return; const next = redoRef.current.pop(); undoRef.current.push(clone(data)); setData(next); setDirty(true); };
  const exportBackup = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'Bandung_Family_Trip_Backup.json'; a.click(); URL.revokeObjectURL(url); };
  const importBackup = file => { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(reader.result); if (!parsed.days || !parsed.flights || !parsed.budget) throw new Error('Invalid backup'); setData({ ...makeDefaults(), ...parsed }); setDirty(true); setToast('Backup restored.'); } catch { setToast('That file is not a valid Bandung trip backup.'); } }; reader.readAsText(file); };
  const resetData = () => { if (window.confirm('Reset all trip details to the original Bandung plan? Export a backup first if you want to keep your edits.')) { setData(makeDefaults()); undoRef.current = []; redoRef.current = []; setDirty(true); setToast('Original plan restored.'); } };

  const nav = [
    ['overview', 'Overview', Compass], ['itinerary', 'Itinerary', CalendarDays], ['travel', 'Travel', Plane],
    ['budget', 'Budget', Wallet], ['packing', 'Packing', Luggage], ['bookings', 'Bookings', Check], ['ideas', 'Saved', Sparkles], ['settings', 'More', Settings]
  ];
  const change = (path, value) => update(d => { let obj = d; for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]]; obj[path[path.length - 1]] = value; });
  const changeFlight = (which, key, value) => update(d => { d.flights[which][key] = value; });
  const changeDay = (idx, key, value) => update(d => { d.days[idx][key] = value; });
  const addDayItem = (idx, key, value) => { if (!value.trim()) return; update(d => d.days[idx][key].push(value.trim())); };
  const removeDayItem = (idx, key, itemIdx) => update(d => { d.days[idx][key].splice(itemIdx, 1); if (key === 'activities') { d.completedActivities ||= {}; d.completedActivities[idx] = (d.completedActivities[idx] || []).filter(x => x !== itemIdx).map(x => x > itemIdx ? x - 1 : x); } });
  const addExpense = () => {
    const amount = Number(expenseDraft.amount);
    if (!expenseDraft.name.trim() || !(amount > 0)) { setToast('Enter an expense description and a valid amount.'); return; }
    const sgd = expenseDraft.currency === 'IDR' ? amount / Number(data.budget.exchangeRate || RATE) : amount;
    update(d => d.expenses.unshift({ id: crypto.randomUUID?.() || String(Date.now()), ...expenseDraft, amount, sgd }));
    setExpenseDraft({ name: '', amount: '', currency: 'IDR', day: 'Day 1', method: 'Cash' });
  };
  const addHotel = () => update(d => d.hotels.push({ id: String(Date.now()), name: 'New accommodation', checkIn: '', checkOut: '', nights: 1, notes: '' }));
  const addIdea = () => { if (!ideaDraft.trim()) return; update(d => d.ideas.push(ideaDraft.trim())); setIdeaDraft(''); };
  const addPacking = () => { if (!packingDraft.trim()) return; update(d => { d.packing.push(packingDraft.trim()); }); setPackingDraft(''); };
  const addFood = () => { if (!foodDraft.trim()) return; update(d => d.foodIdeas.push(foodDraft.trim())); setFoodDraft(''); };
  const refreshRate = async () => { setRateMessage('Checking indicative online rate…'); try { const res = await fetch('https://open.er-api.com/v6/latest/SGD'); const json = await res.json(); if (!json?.rates?.IDR) throw new Error('No IDR rate'); const rate = Math.round(json.rates.IDR * 100) / 100; change(['budget', 'exchangeRate'], rate); setRateMessage(`Indicative mid-market rate refreshed: 1 SGD = ${rate.toLocaleString('en-SG')} IDR · ${new Date().toLocaleString()}`); } catch { setRateMessage('Could not refresh. Your saved planning rate is still available.'); } };
  const share = async () => { const url = location.href; try { if (navigator.share) await navigator.share({ title: data.tripName, text: 'Our Bandung family trip planner', url }); else { await navigator.clipboard.writeText(url); setToast('Page link copied.'); } } catch { /* user dismissed share sheet */ } };

  const renderOverview = () => <>
    <SectionHead eyebrow="Your trip at a glance" title="Trip overview" />
    <Card className="intro-card"><div className="row-between"><span className="eyebrow pale">22—27 NOVEMBER 2026</span><span className="tag-light">2 adults · Melissa (4)</span></div><h2>{data.tripName}</h2><p>{data.tripNotes}</p><div className="hero-metrics"><div><b>{String(daysAway).padStart(2, '0')}</b><span>Days away</span></div><div><b>{totals.packed}/{totals.total}</b><span>Packing done</span></div><div><b>{money(totals.spent)}</b><span>Spent so far</span></div></div></Card>
    <div className="two-col">
      <Card><div className="card-title"><Plane size={18}/><h3>Flights</h3></div><div className="flight-mini"><div className="row-between"><b>Outbound · 22 Nov</b><span className="pill">{data.flights.outbound.airline}</span></div><strong>{data.flights.outbound.departure} <span>→</span> {data.flights.outbound.arrival}</strong><small>{data.flights.outbound.from} → {data.flights.outbound.to}</small></div><div className="divider"/><div className="flight-mini"><div className="row-between"><b>Return · 27 Nov</b><span className="pill">{data.flights.inbound.airline}</span></div><strong>{data.flights.inbound.departure} <span>→</span> {data.flights.inbound.arrival}</strong><small>{data.flights.inbound.from} → {data.flights.inbound.to}</small></div><button className="text-action" onClick={() => setPage('travel')}>Edit flight details <ChevronRight size={15}/></button></Card>
      <Card><div className="card-title"><Hotel size={18}/><h3>Where you're staying</h3></div>{data.hotels.map((h,i)=><div className="hotel-mini" key={h.id}><span className="hotel-number">0{i+1}</span><div><b>{h.name}</b><small>{h.checkIn || 'Check-in'} → {h.checkOut || 'Check-out'} · {h.nights} nights</small></div></div>)}<button className="text-action" onClick={() => setPage('travel')}>Manage stays <ChevronRight size={15}/></button></Card>
    </div>
    <Card><div className="row-between"><div className="card-title"><Check size={18}/><h3>Booking checklist</h3></div><span className="tiny">{data.bookings.filter(x=>x.status==='Booked').length}/{data.bookings.length} booked</span></div>{data.bookings.map((b,i)=><div className="booking-row" key={i}><span>{b.name}</span><select value={b.status} onChange={e=>update(d=>{d.bookings[i].status=e.target.value;})}><option>Booked</option><option>To confirm</option><option>To buy / confirm</option><option>To arrange</option></select></div>)}</Card>
    <Card><div className="card-title"><Clock3 size={18}/><h3>Next decisions</h3></div><ul className="decision-list"><li>Confirm Whoosh timings and Business Class availability.</li><li>Decide Grab versus driver for Padalarang → Bobocabin.</li><li>Confirm private driver, child seat and inclusions.</li><li>Reassess optional Kawah Putih day trip closer to departure.</li></ul></Card>
  </>;

  const renderItinerary = () => { const idx = Math.min(data.selectedDay, data.days.length-1); const day = data.days[idx]; return <>
    <SectionHead eyebrow="Six days, at your pace" title="Day-by-day itinerary" />
    <div className="day-tabs">{data.days.map((d,i)=><button key={i} className={idx===i?'active':''} onClick={()=>change(['selectedDay'],i)}><b>Day {i+1}</b><span>{d.date.split('·')[0]}</span></button>)}</div>
    <Card><div className="row-between"><span className="eyebrow">{day.date}</span><span className="pill">{day.area}</span></div><Field label="Day title" value={day.title} onChange={v=>changeDay(idx,'title',v)}/><Field label="Area / route" value={day.area} onChange={v=>changeDay(idx,'area',v)}/><Field label="Pacing notes" value={day.focus} onChange={v=>changeDay(idx,'focus',v)} multiline/></Card>
    <div className="two-col"><Card><div className="card-title"><MapPin size={18}/><h3>Activities & places</h3><span className="pill">{(data.completedActivities?.[idx]||[]).length}/{day.activities.length} done</span></div>{day.activities.map((a,i)=><div className={`editable-row activity-row ${(data.completedActivities?.[idx]||[]).includes(i)?'activity-done':''}`} key={i}><input className="activity-check" type="checkbox" checked={(data.completedActivities?.[idx]||[]).includes(i)} onChange={e=>update(d=>{d.completedActivities ||= {};const done=d.completedActivities[idx]||[];d.completedActivities[idx]=e.target.checked?[...done,i]:done.filter(x=>x!==i);})}/><input value={a} onChange={e=>update(d=>{d.days[idx].activities[i]=e.target.value;})}/><button className="icon-btn" aria-label="Remove activity" onClick={()=>removeDayItem(idx,'activities',i)}><X size={16}/></button></div>)}<AddLine placeholder="Add an activity or place" onAdd={v=>addDayItem(idx,'activities',v)}/></Card><Card><div className="card-title"><Coffee size={18}/><h3>Meals & food stops</h3></div>{day.meals.map((a,i)=><div className="editable-row" key={i}><input value={a} onChange={e=>update(d=>{d.days[idx].meals[i]=e.target.value;})}/><button className="icon-btn" aria-label="Remove meal" onClick={()=>removeDayItem(idx,'meals',i)}><X size={16}/></button></div>)}<AddLine placeholder="Add a meal / restaurant" onAdd={v=>addDayItem(idx,'meals',v)}/></Card></div>
    <div className="row-between day-controls"><button className="btn secondary" disabled={idx===0} onClick={()=>change(['selectedDay'],idx-1)}><ChevronLeft size={16}/> Previous</button><span className="tiny">{idx+1} of {data.days.length}</span><button className="btn" disabled={idx===data.days.length-1} onClick={()=>change(['selectedDay'],idx+1)}>Next day <ChevronRight size={16}/></button></div>
  </>; };

  const renderTravel = () => <>
    <SectionHead eyebrow="Flights, stays & ground movement" title="Travel details" />
    {['outbound','inbound'].map((which,i)=><Card key={which}><div className="card-title"><Plane size={18}/><h3>{i===0?'Outbound flight · 22 November':'Return flight · 27 November'}</h3></div><div className="two-col"><Field label="Airline" value={data.flights[which].airline} onChange={v=>changeFlight(which,'airline',v)}/><Field label="Flight number" value={data.flights[which].flight} onChange={v=>changeFlight(which,'flight',v)}/><Field label="Departure time" value={data.flights[which].departure} onChange={v=>changeFlight(which,'departure',v)}/><Field label="Arrival time" value={data.flights[which].arrival} onChange={v=>changeFlight(which,'arrival',v)}/><Field label="From" value={data.flights[which].from} onChange={v=>changeFlight(which,'from',v)}/><Field label="To" value={data.flights[which].to} onChange={v=>changeFlight(which,'to',v)}/><Field label="Date" type="date" value={data.flights[which].date} onChange={v=>changeFlight(which,'date',v)}/><Field label="Booking reference" value={data.flights[which].reference} onChange={v=>changeFlight(which,'reference',v)} placeholder="Optional"/></div></Card>)}
    <Card><div className="card-title"><ArrowLeftRight size={18}/><h3>Whoosh high-speed rail</h3></div><Field label="Outbound · Halim to Padalarang" value={data.whoosh.outbound} onChange={v=>change(['whoosh','outbound'],v)} multiline/><Field label="Return · Padalarang to Halim" value={data.whoosh.inbound} onChange={v=>change(['whoosh','inbound'],v)} multiline/><Field label="Notes" value={data.whoosh.notes} onChange={v=>change(['whoosh','notes'],v)} multiline/></Card>
    <Card><div className="card-title"><Hotel size={18}/><h3>Accommodation bookings</h3></div>{data.hotels.map((h,i)=><div className="hotel-editor" key={h.id}><div className="row-between"><b>Stay {i+1}</b><button className="icon-btn danger-text" onClick={()=>update(d=>d.hotels.splice(i,1))}><Trash2 size={16}/></button></div><Field label="Property" value={h.name} onChange={v=>update(d=>{d.hotels[i].name=v;})}/><div className="two-col"><Field label="Check-in" type="date" value={h.checkIn} onChange={v=>update(d=>{d.hotels[i].checkIn=v;})}/><Field label="Check-out" type="date" value={h.checkOut} onChange={v=>update(d=>{d.hotels[i].checkOut=v;})}/></div><Field label="Nights" type="number" min="0" value={h.nights} onChange={v=>update(d=>{d.hotels[i].nights=v;})}/><Field label="Notes" value={h.notes} onChange={v=>update(d=>{d.hotels[i].notes=v;})}/></div>)}<button className="btn secondary" onClick={addHotel}><Plus size={16}/> Add accommodation</button></Card>
    <Card><div className="card-title"><Wallet size={18}/><h3>Private driver & local transport</h3></div><div className="two-col"><Field label="Driver name" value={data.transport.driverName} onChange={v=>change(['transport','driverName'],v)} placeholder="Not confirmed"/><Field label="Daily quote (IDR)" type="number" value={data.transport.driverRate} onChange={v=>change(['transport','driverRate'],v)}/><Field label="Number of charter days" type="number" value={data.transport.driverDays} onChange={v=>change(['transport','driverDays'],v)}/><div className="metric"><span>Estimated driver total</span><b>{rupiah(data.transport.driverRate*data.transport.driverDays)}</b></div></div><Field label="Driver / booking notes" value={data.transport.driverNotes} onChange={v=>change(['transport','driverNotes'],v)} multiline/>{[['Day 1 transfer', 'day1'],['Day 2 Lembang', 'day2'],['Day 3 hotel move', 'day3'],['Day 4 Ciwidey option', 'day4'],['Day 5 city transport', 'day5'],['Day 6 airport return', 'day6']].map(([label,key])=><Field key={key} label={label} value={data.transport[key]} onChange={v=>change(['transport',key],v)} multiline/>)}</Card>
  </>;

  const renderBudget = () => { const spent = totals.spent, rate = Number(data.budget.exchangeRate||RATE); return <>
    <SectionHead eyebrow="Keep the spending intentional" title="Budget & daily spending" />
    <div className="metric-grid"><div className="metric"><span>On-ground budget</span><b>{money(data.budget.total)}</b></div><div className="metric"><span>Spent so far</span><b>{money(spent)}</b></div><div className="metric"><span>Remaining</span><b className={totals.remaining<0?'danger-text':''}>{money(totals.remaining)}</b></div></div>
    <Card><div className="card-title"><Wallet size={18}/><h3>Cash and YouTrip allocation</h3></div><div className="two-col"><Field label="Total budget (SGD)" type="number" value={data.budget.total} onChange={v=>change(['budget','total'],v)}/><Field label="Physical cash (SGD equivalent)" type="number" value={data.budget.cash} onChange={v=>change(['budget','cash'],v)}/><Field label="YouTrip allocation (SGD)" type="number" value={data.budget.youtrip} onChange={v=>change(['budget','youtrip'],v)}/><div className="metric"><span>Unallocated</span><b>{money(data.budget.total-data.budget.cash-data.budget.youtrip)}</b></div></div><p className="hint">Current working split: S$500 cash + S$700 YouTrip = S$1,200. Adjust this to match the amount you actually load and exchange.</p></Card>
    <Card><div className="card-title"><ArrowLeftRight size={18}/><h3>SGD ↔ IDR converter</h3></div><Field label="Planning exchange rate · IDR per S$1" type="number" value={data.budget.exchangeRate} onChange={v=>change(['budget','exchangeRate'],v)}/><div className="two-col"><Field label="SGD amount" type="number" value={sgdValue} onChange={setSgdValue}/><div className="metric"><span>Approximate IDR</span><b>{rupiah(Number(sgdValue||0)*rate)}</b></div></div><button className="btn secondary" onClick={refreshRate}>Refresh indicative rate</button><p className="hint">{rateMessage}</p></Card>
    <Card><div className="card-title"><CreditCard size={18}/><h3>Daily spending tracker</h3><span className="pill">{data.expenses.length} entries</span></div><div className="two-col"><Field label="What did you spend on?" value={expenseDraft.name} onChange={v=>setExpenseDraft(p=>({...p,name:v}))} placeholder="e.g. Lunch in Lembang"/><Field label="Amount" type="number" value={expenseDraft.amount} onChange={v=>setExpenseDraft(p=>({...p,amount:v}))}/><label className="field"><span>Currency</span><select value={expenseDraft.currency} onChange={e=>setExpenseDraft(p=>({...p,currency:e.target.value}))}><option value="IDR">IDR</option><option value="SGD">SGD</option></select></label><label className="field"><span>Day</span><select value={expenseDraft.day} onChange={e=>setExpenseDraft(p=>({...p,day:e.target.value}))}>{data.days.map((d,i)=><option key={i}>Day {i+1}</option>)}</select></label><label className="field"><span>Paid with</span><select value={expenseDraft.method} onChange={e=>setExpenseDraft(p=>({...p,method:e.target.value}))}><option>Cash</option><option>YouTrip</option><option>Other</option></select></label></div><button className="btn primary-wide" onClick={addExpense}><Plus size={16}/> Add expense</button><div className="expense-list">{data.expenses.length===0?<p className="empty">No spending logged yet. Add the first purchase while travelling.</p>:data.expenses.map(e=><div className="expense-row" key={e.id}><div><b>{e.name}</b><small>{e.day} · {e.method} · {e.currency}</small></div><strong>{money(e.sgd)}</strong><button className="icon-btn" onClick={()=>update(d=>{d.expenses=d.expenses.filter(x=>x.id!==e.id);})}><X size={15}/></button></div>)}</div></Card>
    <Card><div className="card-title"><CircleDollarSign size={18}/><h3>Budget categories</h3></div>{data.budget.categories.map((c,i)=><div className="category-row" key={c.id}><input value={c.name} onChange={e=>update(d=>{d.budget.categories[i].name=e.target.value;})}/><div className="amount-input"><span>S$</span><input type="number" value={c.amount} onChange={e=>update(d=>{d.budget.categories[i].amount=Number(e.target.value);})}/></div><button className="icon-btn" onClick={()=>update(d=>d.budget.categories.splice(i,1))}><Trash2 size={15}/></button></div>)}<AddCategory onAdd={(name,amount)=>update(d=>d.budget.categories.push({id:String(Date.now()),name,amount}))}/></Card>
  </>; };

  const renderPacking = () => <><SectionHead eyebrow="Travel lighter, forget less" title="Family packing list"/><Card><div className="row-between"><b>{totals.packed} of {totals.total} packed</b><b>{totals.total?Math.round(totals.packed/totals.total*100):0}%</b></div><div className="progress"><span style={{width:`${totals.total?totals.packed/totals.total*100:0}%`}}/></div><div className="packing-list">{data.packing.map((item,i)=><div className={`packing-row ${data.packed.includes(i)?'checked':''}`} key={`${item}-${i}`}><input type="checkbox" checked={data.packed.includes(i)} onChange={e=>update(d=>{d.packed=e.target.checked?[...d.packed,i]:d.packed.filter(x=>x!==i);})}/><span>{item}</span><button className="icon-btn" onClick={()=>update(d=>{d.packing.splice(i,1);d.packed=d.packed.filter(x=>x!==i).map(x=>x>i?x-1:x);})}><X size={15}/></button></div>)}</div><AddLine placeholder="Add a packing item" onAdd={v=>update(d=>d.packing.push(v))}/><button className="text-action" onClick={()=>update(d=>{d.packed=[];})}>Uncheck all items</button></Card></>;

  const renderIdeas = () => <><SectionHead eyebrow="Keep good alternatives handy" title="Ideas & food bank"/><Card><div className="card-title"><Sparkles size={18}/><h3>Activity ideas</h3></div><AddLine placeholder="Add an attraction or activity" value={ideaDraft} onValue={setIdeaDraft} onAdd={addIdea}/>{data.ideas.map((idea,i)=><div className="idea-row" key={`${idea}-${i}`}><span>{idea}</span><select aria-label="Choose day" defaultValue="0" onChange={e=>{const day=Number(e.target.value);update(d=>{d.days[day].activities.push(idea);});setToast(`Added to Day ${day+1}.`);}}><option value="0">Add to day…</option>{data.days.map((d,j)=><option value={j} key={j}>Day {j+1}</option>)}</select><button className="icon-btn" onClick={()=>update(d=>d.ideas.splice(i,1))}><X size={15}/></button></div>)}</Card><Card><div className="card-title"><Coffee size={18}/><h3>Food ideas</h3></div><p className="hint">Halal-preferred. Confirm halal certification, ingredients and preparation directly with each venue.</p><AddLine placeholder="Add a food idea" value={foodDraft} onValue={setFoodDraft} onAdd={addFood}/>{data.foodIdeas.map((x,i)=><div className="idea-row" key={`${x}-${i}`}><span>{x}</span><button className="icon-btn" onClick={()=>update(d=>d.foodIdeas.splice(i,1))}><X size={15}/></button></div>)}</Card></>;

  const renderBookings = () => <>
    <SectionHead eyebrow="Reservations & confirmations" title="Booking checklist" />
    <Card><div className="row-between"><div><div className="eyebrow">Trip readiness</div><h3>{data.bookings.filter(x=>x.status==='Booked').length} of {data.bookings.length} confirmed</h3></div><span className="pill">{Math.round(data.bookings.filter(x=>x.status==='Booked').length/Math.max(1,data.bookings.length)*100)}%</span></div><div className="progress"><span style={{width:`${data.bookings.filter(x=>x.status==='Booked').length/Math.max(1,data.bookings.length)*100}%`}}/></div><p className="hint">Keep each booking status current. Flight and accommodation details are already reflected in Travel.</p></Card>
    <Card><div className="card-title"><Check size={18}/><h3>Bookings & arrangements</h3></div>{data.bookings.map((b,i)=><div className="booking-row" key={i}><span>{b.name}</span><select value={b.status} onChange={e=>update(d=>{d.bookings[i].status=e.target.value;})}><option>Booked</option><option>To confirm</option><option>To buy / confirm</option><option>To arrange</option></select></div>)}<AddLine placeholder="Add a booking or arrangement" onAdd={v=>update(d=>d.bookings.push({name:v,status:'To confirm'}))}/></Card>
    <Card><div className="card-title"><MapPin size={18}/><h3>Important trip notes</h3></div><Field label="Trip notes & preferences" value={data.tripNotes} onChange={v=>change(['tripNotes'],v)} multiline/><p className="hint">Halal-preferred: verify certification, ingredients and preparation directly with each venue.</p></Card>
  </>;

  const renderSettings = () => <><SectionHead eyebrow="Your app, your preferences" title="Settings & backups"/><Card><div className="card-title"><Sparkles size={18}/><h3>Appearance</h3></div><div className="theme-options">{[['system','System',Settings],['light','Light',Sun],['dark','Dark',Moon]].map(([value,label,Icon])=><button className={data.theme===value?'selected':''} key={value} onClick={()=>change(['theme'],value)}><Icon size={17}/>{label}{data.theme===value&&<Check size={15}/>}</button>)}</div></Card><Card><div className="card-title"><Save size={18}/><h3>Save & backup</h3></div><p className="hint">Your edits autosave on this device. Export a JSON backup before changing phones or clearing Safari website data. Import it later to restore the trip.</p><div className="settings-actions"><button className="btn" onClick={persistNow}><Save size={16}/> Save now</button><button className="btn secondary" onClick={exportBackup}><Download size={16}/> Export backup</button><button className="btn secondary" onClick={()=>fileRef.current?.click()}><FileUp size={16}/> Import backup</button><button className="btn secondary" onClick={share}><Share2 size={16}/> Share app link</button></div><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e=>{importBackup(e.target.files?.[0]);e.target.value='';}}/><div className="save-meta">{dirty?'Unsaved changes · saving automatically':`Saved on this device · ${new Date(savedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`}</div></Card><Card><div className="card-title"><Undo2 size={18}/><h3>Edit history</h3></div><div className="history-actions"><button className="btn secondary" onClick={undo} disabled={!undoRef.current.length}><Undo2 size={16}/> Undo</button><button className="btn secondary" onClick={redo} disabled={!redoRef.current.length}><Redo2 size={16}/> Redo</button></div><p className="hint">Undo and redo apply to edits made during this open session.</p></Card><Card className="reset-card"><h3>Reset trip data</h3><p className="hint">Restore the original trip details and clear your edits on this device. This does not affect exported backups.</p><button className="btn danger" onClick={resetData}><RotateCcw size={16}/> Reset to original plan</button></Card></>;

  const content = ({overview:renderOverview,itinerary:renderItinerary,travel:renderTravel,budget:renderBudget,packing:renderPacking,bookings:renderBookings,ideas:renderIdeas,settings:renderSettings}[page] || renderOverview)();
  return <div className="app-shell">
    <header className="hero"><div className="hero-top"><span className="brand-lockup"><span className="brand-gem"><Sparkles size={17}/></span> BANDUNG TRIP</span><span>22—27 NOV 2026</span></div><div className="hero-title-row"><div><h1>{data.tripName}</h1><p>6 days · 5 nights · 2 adults + Melissa (4)</p></div><img className="hero-mark" src="./icon-192.png" alt="Bandung trip app icon" /></div><div className="hero-stats"><div><b>{String(daysAway).padStart(2,'0')}</b><span>Days away</span></div><div><b>{totals.packed}/{totals.total}</b><span>Packing done</span></div><div><b>{money(totals.spent)}</b><span>Spent so far</span></div></div><div className="save-line"><span className="save-dot"/>{dirty?'Saving changes…':`Saved on this device · ${new Date(savedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`}</div></header>
    <nav className="nav-strip">{nav.map(([id,label,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}><Icon size={16}/><span>{label}</span></button>)}</nav>
    <main className="main-content">{content}</main>
    <div className="mobile-dock"><button className="dock-save" onClick={persistNow}><Save size={16}/><span>Save</span></button><button onClick={exportBackup}><Download size={16}/><span>Backup</span></button><button onClick={()=>fileRef.current?.click()}><FileUp size={16}/><span>Import</span></button><button onClick={share}><Share2 size={16}/><span>Share</span></button></div>
    <footer>Bandung Family Trip · Edits are stored locally in this browser.</footer>
    {toast&&<div className="toast">{toast}</div>}
  </div>;
}
function AddLine({placeholder,value,onValue,onAdd}) { const [local,setLocal]=useState(''); const current=value??local; const setter=onValue??setLocal; return <div className="add-line"><input value={current} onChange={e=>setter(e.target.value)} placeholder={placeholder} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();onAdd(current);if(!onValue)setLocal('');}}}/><button className="btn teal" onClick={()=>{onAdd(current);if(!onValue)setLocal('');}}><Plus size={16}/></button></div>; }
function AddCategory({onAdd}) { const [name,setName]=useState(''); const [amount,setAmount]=useState(''); return <div className="add-line"><input value={name} onChange={e=>setName(e.target.value)} placeholder="New budget category"/><input className="short-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="SGD"/><button className="btn teal" onClick={()=>{if(name.trim()){onAdd(name.trim(),Number(amount)||0);setName('');setAmount('');}}}><Plus size={16}/></button></div>; }
