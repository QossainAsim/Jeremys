import { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';

type Lang = 'da' | 'en';
type BakeStatus = 'Bagt i dag' | 'Kommer senere' | 'Udsolgt' | null;
type Bake = { name: string; status: BakeStatus; image: string };
type Hours = Record<string, null | { open: string; close: string }>;
declare global {
  interface Window {
    JeremysConfig: {
      hours: Hours;
      holidayClosedNote: string;
      todayBakes: Bake[];
      messengerUrl: string;
      visitNote: string;
    };
  }
}
const cfg = window.JeremysConfig;
const phone = '+4522162267';
const address = 'Yrsavej 34, 8230 Åbyhøj, Aarhus, Denmark';
const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const sms = `sms:${phone}?body=${encodeURIComponent('Hej Jeremys, jeg vil gerne spørge om...')}`;
const weekdayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const weekdayDa = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const weekdayEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const categories = ['Brød', 'Boller', 'Wienerbrød', 'Kager', 'Sæson'] as const;
const categoryEn: Record<string, string> = { 'Alle': 'All', 'Brød': 'Bread', 'Boller': 'Buns', 'Wienerbrød': 'Pastries', 'Kager': 'Cakes', 'Sæson': 'Seasonal' };
const names: Record<string, string[]> = {
  Brød: ['Surdejsbrød', 'Mørkt frøbrød', 'Lange frøbrød', 'Landbrød', 'Ciabatta', 'Focaccia med rosmarin', 'Fladbrød med urter'],
  Boller: ['Birkes/valmuefrøboller', 'Frøboller', 'Hvide boller', 'Hot cross buns'],
  Wienerbrød: ['Croissanter', 'Chokoladecroissanter', 'Mandelcroissanter', 'Kanelsnegle', 'Nøddesnegle', 'Wienerbrød med creme', 'Wienerbrød med jordbær'],
  Kager: ['Jordbærsnitter', 'Pavlova med bær', 'Citrontærte med marengs', 'Karamel-chokoladesnitter', 'Hindbærkage', 'Chokoladekage med hindbær', 'Gulerodskage', 'Tartelettes', 'Vandbakkelser', 'Eclairs', 'Småkager'],
  Sæson: ['Fastelavnsboller', 'Påskeboller', 'Sommerkager med bær'],
};
const englishNames: Record<string, string> = {
  'Surdejsbrød': 'Sourdough loaf', 'Mørkt frøbrød': 'Dark seeded bread', 'Lange frøbrød': 'Long seeded loaves', 'Landbrød': 'Country loaf',
  'Ciabatta': 'Ciabatta', 'Focaccia med rosmarin': 'Rosemary focaccia', 'Fladbrød med urter': 'Herb flatbread',
  'Birkes/valmuefrøboller': 'Poppy seed buns', 'Frøboller': 'Seeded buns', 'Hvide boller': 'White rolls', 'Hot cross buns': 'Hot cross buns',
  'Croissanter': 'Croissants', 'Chokoladecroissanter': 'Chocolate croissants', 'Mandelcroissanter': 'Almond croissants', 'Kanelsnegle': 'Cinnamon swirls',
  'Nøddesnegle': 'Nut swirls', 'Wienerbrød med creme': 'Custard pastry', 'Wienerbrød med jordbær': 'Strawberry pastry',
  'Jordbærsnitter': 'Strawberry slices', 'Pavlova med bær': 'Berry pavlova', 'Citrontærte med marengs': 'Lemon meringue tart',
  'Karamel-chokoladesnitter': 'Caramel chocolate slices', 'Hindbærkage': 'Raspberry cake', 'Chokoladekage med hindbær': 'Chocolate raspberry cake',
  'Gulerodskage': 'Carrot cake', 'Tartelettes': 'Tartlets', 'Vandbakkelser': 'Cream puffs', 'Eclairs': 'Éclairs', 'Småkager': 'Biscuits',
  'Fastelavnsboller': 'Fastelavnsboller', 'Påskeboller': 'Easter buns', 'Sommerkager med bær': 'Summer berry cakes',
};
const imageForCategory: Record<string, string> = {
  Brød: '/images/jeremys-bread.jpg', Boller: '/images/jeremys-buns.jpg',
  Wienerbrød: '/images/jeremys-pastries.jpg', Kager: '/images/jeremys-cakes.jpg', Sæson: '/images/jeremys-pastries.jpg',
};
const description = (lang: Lang, category: string) => {
  if (lang === 'en') return ({
    Brød: 'Small-batch bread, made with time.', Boller: 'A little something for the table.',
    Wienerbrød: 'Layered pastries, baked by hand.', Kager: 'A sweet bake, made in small batches.',
    Sæson: 'A seasonal bake; ask us what is possible.',
  } as Record<string, string>)[category];
  return ({
    Brød: 'Brød bagt i små hold med tid og omhu.', Boller: 'En lille bolle til bordet eller turen hjem.',
    Wienerbrød: 'Lag på lag, bagt i hånden.', Kager: 'Sødt bagværk i små hold.',
    Sæson: 'Sæsonens bagværk – spørg os, hvad der er muligt.',
  } as Record<string, string>)[category];
};

function hoursView(hours: Hours, lang: Lang, date: Date) {
  const weekday = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Copenhagen', weekday: 'short' }).format(date);
  const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(weekday);
  const keys = weekdayKeys;
  const day = hours[keys[dayIndex]];
  const display = (value: Hours[string]) => value ? `${value.open}–${value.close}` : (lang === 'da' ? 'Opdateres' : 'To be updated');
  const todayHours = day ? `${day.open}–${day.close}` : null;
  let status = lang === 'da' ? 'Åbningstider opdateres' : 'Hours to be updated';
  if (day) {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date).split(':');
    const minute = Number(parts[0]) * 60 + Number(parts[1]);
    const [oh, om] = day.open.split(':').map(Number);
    const [ch, cm] = day.close.split(':').map(Number);
    status = minute >= oh * 60 + om && minute < ch * 60 + cm ? (lang === 'da' ? 'Åbent nu' : 'Open now') : (lang === 'da' ? 'Lukket nu' : 'Closed now');
  }
  return { status, today: todayHours, list: weekdayKeys.map((key, index) => `${lang === 'da' ? weekdayDa[index] : weekdayEn[index]} · ${display(hours[key])}`) };
}

function ContactChoices({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const da = lang === 'da';
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', closeOnEscape);
    document.querySelector<HTMLButtonElement>('.choice-close')?.focus();
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);
  return <div className="choice-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="choice-dialog" role="dialog" aria-modal="true" aria-labelledby="choice-title" data-testid="dialog-contact-choices">
      <button className="choice-close" onClick={onClose} aria-label={da ? 'Luk' : 'Close'} data-testid="button-close-choices">×</button>
      <p className="eyebrow">{da ? 'En hurtig forespørgsel' : 'A quick question'}</p>
      <h2 id="choice-title">{da ? 'Spørg os' : 'Get in touch'}</h2>
      <p>{da ? 'Fortæl os, hvad du er nysgerrig på.' : 'Tell us what you would like to ask about.'}</p>
      <div className="choice-links">
        <a href={`tel:${phone}`} className="button" data-testid="link-dialog-call">{da ? 'Ring' : 'Call'} <span>↗</span></a>
        <a href={sms} className="button button-outline" data-testid="link-dialog-sms">SMS <span>↗</span></a>
        {cfg.messengerUrl.trim() ? <a href={cfg.messengerUrl} target="_blank" rel="noopener noreferrer" className="button button-outline" data-testid="link-dialog-messenger">Messenger <span>↗</span></a> : <span className="disabled-choice" aria-disabled="true">{da ? 'Messenger (ikke opsat)' : 'Messenger (not set up)'}</span>}
      </div>
      <p className="request-note">{da ? 'Det er en forespørgsel, ikke en bestilling, før vi bekræfter.' : 'This is an inquiry, not an order, until we confirm.'}</p>
    </section>
  </div>;
}

function Home() {
  const [lang, setLang] = useState<Lang>('da');
  const [category, setCategory] = useState<string>('Alle');
  const [askedBake, setAskedBake] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const da = lang === 'da';
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const time = useMemo(() => hoursView(cfg.hours, lang, now), [lang, now]);
  const products = useMemo(() => Object.entries(names).flatMap(([group, items]) => items.map((name) => ({ group, name }))).filter((item) => category === 'Alle' || item.group === category), [category]);
  const openChoices = (name?: string) => setAskedBake(name ?? 'general');
  const labelName = (name: string) => da ? name : (englishNames[name] ?? name);
  const messenger = cfg.messengerUrl.trim();
  const awards = da ? ['Stiftstidende: Byens Bedste 2026', '90–100% økologi'] : ['Stiftstidende: Best in the City 2026', '90–100% organic'];
  const currentBakes = cfg.todayBakes;
  return <div className="site-shell">
    <div className="topline" data-testid="text-topline"><span>{da ? 'Økologiske råvarer' : 'Organic ingredients'}</span><i aria-hidden="true" /><span>{da ? 'Lang fermentering' : 'Slow fermentation'}</span><i aria-hidden="true" /><span>{da ? 'Bagt i Åbyhøj' : 'Baked in Åbyhøj'}</span></div>
    <header className="header" id="home">
      <a className="wordmark" href="#home" aria-label={da ? 'Jeremys Bread Kitchen hjem' : 'Jeremys Bread Kitchen home'} data-testid="link-home-logo"><span>jeremys</span><small>bread kitchen · aarhus</small></a>
      <nav className="nav" aria-label={da ? 'Hovednavigation' : 'Main navigation'}>
        <a href="#this-week" data-testid="link-nav-bakes">{da ? 'Brødet' : 'The bakes'}</a><a href="#process" data-testid="link-nav-process">{da ? 'Vores håndværk' : 'Our craft'}</a><a href="#our-story" data-testid="link-nav-story">{da ? 'Jeremy og Mette' : 'Our story'}</a><a href="#visit" data-testid="link-nav-visit">{da ? 'Find os' : 'Find us'}</a><a href="#contact" className="nav-order" data-testid="link-nav-contact">{da ? 'Spørg os' : 'Get in touch'} ↗</a>
        <div className="language-switch" aria-label="Language"><button type="button" aria-pressed={da} onClick={() => setLang('da')} data-testid="button-language-da">DA</button><span>/</span><button type="button" aria-pressed={!da} onClick={() => setLang('en')} data-testid="button-language-en">EN</button></div>
      </nav>
    </header>
    <main>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-photo" role="img" aria-label={da ? 'Friskbagt brød i Jeremys bageri' : 'Freshly baked bread at Jeremys bakery'} /><div className="hero-wash" />
        <div className="hero-copy-wrap">
          <p className="eyebrow">{da ? 'Et lille bageri · Åbyhøj, Aarhus' : 'A neighbourhood bakery · Åbyhøj, Aarhus'}</p>
          <h1 id="hero-heading">{da ? <>Godt brød<br />tager <em>sin tid.</em></> : <>Good bread<br />takes <em>its time.</em></>}</h1>
          <div className="hero-facts">
            <p className="hero-address" data-testid="text-hero-address">Yrsavej 34<br />8230 Åbyhøj, Aarhus</p>
            <div className="hero-hours" data-testid="status-opening-hours"><strong>{time.status}</strong><span>{time.today ? `${da ? 'I dag' : 'Today'} · ${time.today}` : (da ? 'Åbningstider opdateres' : 'Hours to be updated')}</span><details open={!da}><summary>{da ? 'Se alle dage' : 'Opening hours'}</summary><ul>{time.list.map((row) => <li key={row}>{row}</li>)}</ul>{cfg.holidayClosedNote.trim() && <p>{cfg.holidayClosedNote}</p>}</details></div>
            <p className="hero-copy">{da ? 'Økologisk bagværk i små hold, bagt med omhu i Åbyhøj.' : 'Organic small-batch bakery in Åbyhøj, Aarhus'}</p>
          </div>
          <div className="actions"><a className="button" href="#this-week" data-testid="button-discover-bakes">{da ? 'Se dagens brød' : 'See today’s bakes'} <span>↘</span></a><a className="hero-text-link" href={maps} target="_blank" rel="noopener noreferrer" data-testid="link-hero-directions">{da ? 'Find vej' : 'Directions'} ↗</a></div>
          <div className="hero-contact-links"><a href={`tel:${phone}`} data-testid="link-hero-call">{da ? 'Ring' : 'Call'}</a><a href={sms} data-testid="link-hero-sms">SMS</a>{messenger ? <a href={messenger} target="_blank" rel="noopener noreferrer" data-testid="link-hero-messenger">Messenger</a> : <span aria-disabled="true" data-testid="text-messenger-unconfigured">Messenger · {da ? 'ikke opsat' : 'not set up'}</span>}</div>
          <div className="award-row">{awards.map((award) => <span className="award-mark" key={award} data-testid={`text-award-${award.slice(0, 3)}`}>{award}</span>)}</div>
        </div>
        <div className="hero-side-note"><span>{da ? 'Små hold' : 'Small batch'}</span><span className="hero-side-rule" /><span>Åbyhøj · Aarhus</span></div>
        <a className="hero-scroll" href="#this-week" aria-label={da ? 'Gå til dagens bagværk' : 'Scroll to today’s bakes'} data-testid="link-hero-scroll"><span>{da ? 'Dagens bagværk' : 'Today’s bakes'}</span><b aria-hidden="true">↓</b></a>
        <div className="hero-counter">01 <span>/</span> {da ? 'BAGT MED TID' : 'MADE WITH TIME'}</div>
      </section>

      <section className="section weekly daily-section" id="this-week" aria-labelledby="week-heading">
        <div className="section-inner">
          <div className="section-heading"><div><p className="eyebrow">{da ? 'Et lille udvalg, der skifter' : 'A small, changing selection'}</p><h2 id="week-heading">{da ? <>I dag hos<br /><em>Jeremys</em></> : <>Today at<br /><em>Jeremys</em></>}</h2></div><p className="section-intro">{da ? 'Udvalget følger dejen og dagen. Spørg os, hvad der er klar.' : 'The selection follows the dough and the day. Ask what is ready.'}</p></div>
          <div className="daily-grid" data-testid="content-daily-bakes">{currentBakes.map((bake, index) => <article className="daily-card" key={bake.name} data-testid={`card-daily-${index}`}>
            <div className="daily-image"><img src={bake.image} alt={da ? `${bake.name} fra dagens bageudvalg` : `${bake.name}, a draft from today’s bake selection`} width="480" height="480" loading="lazy" /><span className="bake-number">0{index + 1}</span></div>
            <div className="daily-copy"><h3>{labelName(bake.name)}</h3><span className={`status-pill ${bake.status ? 'status-confirmed' : ''}`} data-testid={`status-daily-${index}`}>{bake.status ? (da ? bake.status : ({ 'Bagt i dag': 'Baked today', 'Kommer senere': 'Coming later', Udsolgt: 'Sold out' } as Record<string, string>)[bake.status]) : (da ? 'Spørg os' : 'Ask us')}</span></div>
          </article>)}</div>
          <p className="daily-note" data-testid="text-daily-note">{da ? 'Priser får du i butikken eller på telefon. Udvalget skifter fra dag til dag.' : 'Ask in the shop or by phone for prices. The selection changes from day to day.'}</p>
        </div>
      </section>

      <section className="section catalog-section" aria-labelledby="catalog-heading">
        <div className="section-inner">
          <div className="section-heading"><div><p className="eyebrow">{da ? 'Bageriets udkast · bekræft med os' : 'Bakery drafts · please confirm with us'}</p><h2 id="catalog-heading">{da ? <>Fra vores<br /><em>ovn.</em></> : <>From our<br /><em>oven.</em></>}</h2></div><div className="catalog-intro"><p className="section-intro">{da ? 'En oversigt over det, vi bager. Navnene er forslag og ikke en aktuel lagerliste.' : 'A guide to what we bake. Names are drafts, not a live stock list.'}</p><p className="allergen-note">{da ? 'Spørg os om allergener.' : 'Ask us about allergens.'}</p></div></div>
          <div className="filter-chips" role="group" aria-label={da ? 'Filtrér bagværk' : 'Filter bakes'}>{['Alle', ...categories].map((item) => <button type="button" key={item} className={category === item ? 'filter-chip active' : 'filter-chip'} aria-pressed={category === item} onClick={() => setCategory(item)} data-testid={`button-filter-${item}`}>{da ? item : categoryEn[item]}</button>)}</div>
          <div className="bake-grid catalog-grid" data-testid="content-bake-catalog">{products.map(({ group, name }, index) => <article className="bake-card" key={name} data-testid={`card-product-${index}`}>
            <div className="bake-photo-wrap"><img className="bake-photo" src={imageForCategory[group]} alt={da ? `Foto af ${name.toLowerCase()}` : `Photo of ${labelName(name).toLowerCase()}`} width="640" height="450" loading="lazy" /><span className="bake-number">{da ? group : categoryEn[group]}</span></div>
            <div className="bake-card-copy"><div className="bake-card-title"><h3>{labelName(name)}</h3><span>{da ? 'Udkast' : 'Draft'}</span></div><p>{description(lang, group)}</p><div className="bake-card-foot"><span>{da ? 'Ikke en live lagerliste' : 'Not a live stock list'}</span><button type="button" className="card-action" onClick={() => openChoices(name)} data-testid={`button-ask-bake-${index}`}>{da ? 'Spørg om det' : 'Ask about it'} <span aria-hidden="true">↗</span></button></div></div>
          </article>)}</div>
          <p className="disclaimer" data-testid="text-draft-note">{da ? 'Bagværksnavnene er udkast til ejerbekræftelse. Spørg os om dagens udvalg og tilgængelighed.' : 'Bake names are drafts for owner confirmation. Ask us about today’s selection and availability.'}</p>
        </div>
      </section>

      <section className="process-section" id="process" aria-labelledby="process-heading">
        <div className="process-copy"><p className="eyebrow">{da ? 'Tid gør forskellen' : 'Time makes the difference'}</p><h2 id="process-heading">{da ? <>Sådan<br />bager <em>vi.</em></> : <>How we<br /><em>bake.</em></>}</h2><p>{da ? 'Vi arbejder med økologisk mel og langsom fermentering. Dejen får tid, og hvert hold bliver formet og bagt med hænderne.' : 'We work with organic flour and slow fermentation. The dough takes its time, and each small batch is handled by hand.'}</p></div>
        <div className="process-grid">{[
          ['process-dough.webp', da ? 'Dej formes på arbejdsbordet' : 'Dough shaped on the workbench', da ? 'Dej' : 'Dough'],
          ['process-trays.webp', da ? 'Brøddej lagt på bageplader' : 'Bread dough arranged on trays', da ? 'Plader' : 'Trays'],
          ['process-ovens.webp', da ? 'Bageriets ovne' : 'The bakery ovens', da ? 'Ovne' : 'Ovens'],
          ['process-racks.webp', da ? 'Bageriets bage- og afkølingsracks' : 'Bakery baking and cooling racks', da ? 'Racks' : 'Racks'],
        ].map(([file, alt, caption], index) => <figure key={file}><img src={`/images/${file}`} alt={alt} width="640" height="420" loading="lazy" data-testid={`image-process-${index}`} /><figcaption>0{index + 1} · {caption}</figcaption></figure>)}</div>
      </section>

      <section className="story" id="our-story" aria-labelledby="story-heading">
        <div className="story-image"><img src="/images/jeremys-team.webp" alt={da ? 'Jeremy og Mette i bageriet' : 'Jeremy and Mette at the bakery'} width="640" height="640" loading="lazy" data-testid="image-team" /></div>
        <div className="story-copy"><p className="eyebrow">{da ? 'To mennesker, ét bageri' : 'Two people, one bakery'}</p><h2 id="story-heading">{da ? <>Mød Jeremy<br />og <em>Mette.</em></> : <>Meet Jeremy<br />and <em>Mette.</em></>}</h2>
          <div className="edit-copy"><p><b>EDIT</b> {da ? 'Skriv med egne ord, hvordan I fandt vej til bageriet.' : 'Rewrite in your own words how you found your way to the bakery.'}</p><p><b>EDIT</b> {da ? 'Fortæl kort om jeres tilgang til brød og bagning.' : 'Share a little about your approach to bread and baking.'}</p><p><b>EDIT</b> {da ? 'Tilføj en detalje fra hverdagen i bageriet.' : 'Add a detail from a day at the bakery.'}</p></div>
          <div className="timeline" data-testid="text-bakery-timeline">Mejlgade <span>→</span> Yrsavej</div>
        </div>
      </section>

      <section className="customer-love" aria-labelledby="customer-love-heading">
        <div className="review-orbit" aria-hidden="true"><div className="review-orbit-ring" /><div className="review-orbit-core"><span>{da ? 'Lokalt bagværk' : 'Local baking'}</span><b>Å</b><span>{da ? 'Aarhus' : 'Aarhus'}</span></div><span className="orbit-word orbit-word-one">{da ? 'BYENS BEDSTE' : 'BEST IN TOWN'}</span><span className="orbit-word orbit-word-two">2026</span><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" /></div>
        <div className="customer-love-copy"><p className="eyebrow">{da ? 'Et lokalt skulderklap' : 'A local nod'}</p><h2 id="customer-love-heading">{da ? <>Byens<br /><em>Bedste.</em></> : <>Best in<br /><em>town.</em></>}</h2><p>{da ? 'Stiftstidende: Byens Bedste 2026. Anmeldelser kan læses hos Google.' : 'Stiftstidende: Best in the City 2026. Read reviews on Google.'}</p><a className="text-link" href="https://www.google.com/search?q=Jeremys+Bread+Kitchen+Aarhus+reviews" target="_blank" rel="noopener noreferrer" data-testid="link-customer-reviews">{da ? 'Se anmeldelser på Google' : 'See reviews on Google'} ↗</a><p className="review-edit"><b>EDIT</b> {da ? 'Plads til ægte kundeudtalelser – kun med kundens tilladelse.' : 'Space for real customer quotes — only with permission.'}</p></div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-heading"><div className="section-inner contact-grid">
        <div className="contact-intro"><p className="eyebrow">{da ? 'Et spørgsmål er altid velkomment' : 'Questions are always welcome'}</p><h2 id="contact-heading">{da ? <>Spørg efter<br /><em>brød.</em></> : <>Ask about<br /><em>bread.</em></>}</h2><p className="section-intro">{da ? 'Ring eller skriv, hvis du vil høre om dagens bagværk.' : 'Call or text if you would like to ask about today’s bakes.'}</p></div>
        <div className="contact-details"><div className="contact-cta"><a href={`tel:${phone}`} className="button contact-button" data-testid="button-contact-call">{da ? 'Ring' : 'Call'} <span>↗</span></a><a href={sms} className="button button-outline contact-button" data-testid="button-contact-sms">SMS <span>↗</span></a>{messenger ? <a href={messenger} target="_blank" rel="noopener noreferrer" className="button button-outline contact-button" data-testid="button-contact-messenger">Messenger <span>↗</span></a> : <span className="button button-outline contact-button disabled-choice" aria-disabled="true" data-testid="button-contact-messenger-disabled">Messenger · {da ? 'ikke opsat' : 'not set up'}</span>}</div><p className="request-note contact-request-note" data-testid="text-inquiry-note">{da ? 'Det er en forespørgsel, ikke en bestilling, før vi bekræfter.' : 'This is an inquiry, not an order, until we confirm.'}</p></div>
      </div></section>

      <section className="visit" id="visit" aria-labelledby="visit-heading"><div className="visit-image"><img src="/images/jeremys-hero.jpg" alt={da ? 'Indgangen til Jeremys Bread Kitchen i Åbyhøj' : 'The entrance to Jeremys Bread Kitchen in Åbyhøj'} width="900" height="700" loading="lazy" data-testid="image-shopfront" /></div>
        <div className="visit-copy"><p className="eyebrow">{da ? 'Kig forbi i Åbyhøj' : 'Find us in Åbyhøj'}</p><h2 id="visit-heading">{da ? <>Find vej<br />til <em>os.</em></> : <>Come find<br /><em>us.</em></>}</h2><div className="address" data-testid="text-bakery-address">Jeremys Bread Kitchen<br />Yrsavej 34<br />8230 Åbyhøj, Aarhus</div>
          <div className="visit-hours"><strong data-testid="status-visit-hours">{time.status}</strong><ul>{time.list.map((row) => <li key={row}>{row}</li>)}</ul>{cfg.holidayClosedNote.trim() && <p>{cfg.holidayClosedNote}</p>}</div>
          <p className="visit-edit"><b>EDIT</b> {cfg.visitNote.trim() || (da ? 'Parkering / besøgsnote – tilføjes af bageriet.' : 'Parking / visitor note – to be added by the bakery.')}</p>
          <div className="actions"><a className="button" href={maps} target="_blank" rel="noopener noreferrer" data-testid="link-directions">{da ? 'Find vej' : 'Directions'} ↗</a><a className="button button-outline" href={`tel:${phone}`} data-testid="link-call-bakery">{da ? 'Ring til bageriet' : 'Call the bakery'}</a></div>
        </div>
      </section>
    </main>
    <footer className="footer"><a className="footer-mark" href="#home" data-testid="link-footer-home">jeremys <span>bread kitchen · aarhus</span></a><span>{da ? 'Åbyhøj, Aarhus · Små hold, godt brød.' : 'Åbyhøj, Aarhus · Small batches, good bread.'}</span><a href="#home" className="back-top" data-testid="link-back-top">{da ? 'Til toppen ↑' : 'Back to top ↑'}</a></footer>
    <div className="mobile-order" aria-label={da ? 'Hurtige kontaktlinks' : 'Quick contact links'}><a href={`tel:${phone}`} data-testid="link-mobile-call">{da ? 'Ring' : 'Call'}</a><a href={maps} target="_blank" rel="noopener noreferrer" data-testid="link-mobile-directions">{da ? 'Find vej' : 'Directions'}</a><a href="#contact" data-testid="link-mobile-ask">{da ? 'Spørg' : 'Ask'}</a></div>
    {askedBake && <ContactChoices lang={lang} onClose={() => setAskedBake(null)} />}
  </div>;
}

export default function App() {
  return <ErrorBoundary><Home /></ErrorBoundary>;
}
