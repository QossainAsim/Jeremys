import { useEffect, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const email = 'kontakt@jeremys.dk';
const phone = '+45 22 16 22 67';
const address = 'Yrsavej 34, 8230 Åbyhøj, Aarhus, Denmark';
const productOptions = ['Bread', 'Sourdough', 'Pastries', 'Cakes', 'Buns', 'Pizza dough'];
const bakeCards = [
  { name: 'Bread', description: 'Ask what loaf is coming out of the oven this week.', note: 'Small batch · price on request', art: 'bread' },
  { name: 'Sourdough', description: 'Slow-fermented bread, made with time and care.', note: 'Availability changes · ask first', art: 'sourdough' },
  { name: 'Pastries', description: 'Find out what is sweet or savory in the next bake.', note: 'Small batch · price on request', art: 'pastry' },
  { name: 'Cakes', description: 'Ask about the week’s cakes or share a special request.', note: 'By request · details confirmed by email', art: 'cake' },
  { name: 'Buns', description: 'Handmade little bakes for the table or the walk home.', note: 'Availability changes · ask first', art: 'bun' },
  { name: 'Pizza dough', description: 'Ask when the next small batch of dough will be ready.', note: 'Small batch · price on request', art: 'dough' },
];
const inquiryTypes = ['General question', 'Bread order', 'Cake order', 'Event / catering', 'Wholesale', 'Other'];

function setMeta(name: string, content: string, property = false) {
  const attribute = property ? 'property' : 'name';
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function Home() {
  const [formStatus, setFormStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  useEffect(() => {
    document.title = 'Jeremys Bread Kitchen — slow bread, close to home';
    setMeta('description', 'Organic artisan bread and pastries, handmade in small batches in Åbyhøj, Aarhus. Discover this week’s bakes, request a pre-order, or plan a visit.');
    setMeta('og:title', 'Jeremys Bread Kitchen — slow bread, close to home', true);
    setMeta('og:description', 'A neighborhood bakery in Åbyhøj, Aarhus. Organic ingredients, long fermentation, and bread made by hand.', true);
    setMeta('og:type', 'website', true);
  }, []);

  function submitPreorder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = String(form.get('product'));
    const quantity = String(form.get('quantity'));
    const pickup = String(form.get('pickup'));
    const name = String(form.get('name'));
    const contact = String(form.get('contact'));
    const details = String(form.get('details') || '').trim();
    const subject = `Pre-order request — ${product}`;
    const body = [
      'Hello Jeremys,',
      '',
      'I would like to ask about a pre-order:',
      `Product: ${product}`,
      `Quantity: ${quantity}`,
      `Preferred pickup date: ${pickup}`,
      `Name: ${name}`,
      `Contact: ${contact}`,
      ...(details ? [`Additional note: ${details}`] : []),
      '',
      'I understand availability and acceptance are confirmed by Jeremys.',
    ].join('\n');
    setFormStatus('Your email draft is ready. Please send it to complete your request; Jeremys will confirm availability and acceptance.');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('inquiry-name'));
    const replyTo = String(form.get('inquiry-email'));
    const type = String(form.get('inquiry-type'));
    const message = String(form.get('inquiry-message'));
    const subject = `${type} — ${name}`;
    const body = ['Hello Jeremys,', '', `Name: ${name}`, `Reply to: ${replyTo}`, `Topic: ${type}`, '', message].join('\n');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function askAboutBake(product: string) {
    setSelectedProduct(product);
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="site-shell">
      <div className="topline" data-testid="text-small-batch-note">Organic ingredients · Slow fermentation · Made by hand in Åbyhøj</div>
      <header className="header" id="home">
        <a className="wordmark" href="#home" data-testid="link-home-logo" aria-label="Jeremys Bread Kitchen home">
          jeremys
          <small>bread kitchen · aarhus</small>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="#home" data-testid="link-nav-home">Home</a>
          <a href="#order" className="nav-order" data-testid="link-nav-order">Order</a>
          <a href="#this-week" data-testid="link-nav-this-week">This Week</a>
          <a href="#our-story" data-testid="link-nav-story">Our Story</a>
          <a href="#visit" data-testid="link-nav-visit">Visit</a>
          <a href="#contact" data-testid="link-nav-contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy-wrap">
            <p className="eyebrow">A little bakery in Åbyhøj, Aarhus</p>
            <h1 id="hero-heading">Organic bread,<br />baked with care<br />in Åbyhøj.</h1>
            <p className="hero-copy">Sourdough bread, pastries, cakes and more — handmade in small batches with carefully selected ingredients.</p>
            <div className="actions">
              <a className="button" href="#order" data-testid="button-hero-order">ORDER / PRE-ORDER <span aria-hidden="true">↘</span></a>
              <a className="button button-outline" href="#this-week" data-testid="button-discover-bakes">SEE THIS WEEK’S BAKES</a>
            </div>
            <p className="hero-note">Baked slowly. Shared locally. Never more than the day allows.</p>
          </div>
          <div className="bread-art" role="img" aria-label="Original illustrated artwork of a golden artisan loaf">
            <div className="art-sun" />
            <div className="loaf"><span className="crumb" /></div>
            <div className="art-caption">A loaf, given its time</div>
            <div className="art-stamp">SMALL<br />BATCH<br />ÅBYHØJ</div>
          </div>
        </section>

        <div className="ticker" aria-label="Handmade in small batches">
          <span>Long fermentation</span><span aria-hidden="true">·</span><span>Organic ingredients</span><span aria-hidden="true">·</span><span>Hands in the dough</span><span aria-hidden="true">·</span><span>Made in Åbyhøj</span><span aria-hidden="true">·</span><span>Long fermentation</span><span aria-hidden="true">·</span><span>Organic ingredients</span>
        </div>

        <section className="section weekly" id="this-week" aria-labelledby="week-heading">
          <div className="section-inner">
            <div className="section-heading">
              <div><p className="eyebrow">This week at Jeremys</p><h2 id="week-heading">Fresh from the bakery</h2></div>
              <p className="section-intro">A small-batch bakery follows the dough, the day, and what there is time to make. Get in touch to find out what is coming out of the oven now.</p>
            </div>
            <div className="weekly-board">
              <div className="weekly-feature">
                <h3>Small batches.<br />When they’re gone, they’re gone.</h3>
                <p>Our bread and pastries are made in limited quantities. Ask ahead so we can let you know what is available and whether we can set something aside.</p>
              </div>
              <div className="week-side">
                <span className="stamp">A note from the oven</span>
                <p>We make what we can make well. When a batch is gone, it is gone until the next time the dough is ready.</p>
                <a href={`mailto:${email}?subject=${encodeURIComponent('This week at Jeremys')}`} className="text-link" data-testid="link-ask-this-week">Ask what’s baking this week ↗</a>
              </div>
            </div>
            <div className="bake-grid" aria-label="Bake categories">
              {bakeCards.map((bake) => (
                <article className="bake-card" key={bake.name} data-testid={`card-product-${bake.art}`}>
                  <div className={`bake-art bake-art-${bake.art}`} role="img" aria-label={`Original illustration representing ${bake.name.toLowerCase()}`}>
                    <span className="bake-sun" />
                    <span className="bake-shape" />
                    <span className="bake-score" />
                    <span className="bake-art-note">A little time in every bake</span>
                  </div>
                  <div className="bake-card-copy">
                    <div className="bake-card-title"><h3>{bake.name}</h3><span>Ask for today’s price</span></div>
                    <p>{bake.description}</p>
                    <div className="bake-card-foot"><span>{bake.note}</span><button type="button" className="card-action" onClick={() => askAboutBake(bake.name)} data-testid={`button-ask-${bake.art}`}>Ask about this bake <span aria-hidden="true">↗</span></button></div>
                  </div>
                </article>
              ))}
            </div>
            <p className="disclaimer" data-testid="text-availability-note">Availability and prices vary and must be confirmed directly with Jeremys. This page is a guide to what the bakery makes, not a live menu or stock list.</p>
          </div>
        </section>

        <section className="section story" id="our-story" aria-labelledby="story-heading">
          <div className="section-inner story-grid">
            <div className="story-art" role="img" aria-label="Hand-drawn-style circular flour and grain motif, an original bakery illustration">
              <div className="circle">A little more<br />time in every<br />loaf.</div>
              <div className="art-caption">Flour · water · patience</div>
            </div>
            <div className="story-copy">
              <p className="eyebrow">Our story, in the dough</p>
              <h2 id="story-heading">Good things<br />aren’t rushed.</h2>
              <p>Jeremys Bread Kitchen is an independent neighborhood bakery in Åbyhøj. We work with organic ingredients, long fermentation and hands-on methods, making bread and pastries in careful small batches.</p>
              <p>There is no need for every loaf to look exactly alike. Each one gets its own time and care, and the day’s baking is shaped by what is ready. Come by for a quick stop, or say hello and ask what is in the works.</p>
              <div className="story-signoff">See you around the oven.</div>
            </div>
          </div>
        </section>

        <section className="section customer-love" aria-labelledby="customer-love-heading">
          <div className="section-inner customer-love-inner">
            <div>
              <p className="eyebrow">A neighborhood bakery is made together</p>
              <h2 id="customer-love-heading">Let the neighbors<br />tell you.</h2>
            </div>
            <div className="customer-love-copy">
              <p>We’d rather let real customers speak for themselves. Find Jeremys’ public reviews, or get in touch with us directly.</p>
              <a className="text-link" href="https://www.google.com/search?q=Jeremys+Bread+Kitchen+Aarhus+reviews" target="_blank" rel="noreferrer" data-testid="link-customer-reviews">Look for public reviews on Google ↗</a>
            </div>
          </div>
        </section>

        <section className="section order-section" id="order" aria-labelledby="order-heading">
          <div className="section-inner order-grid">
            <div className="order-copy">
              <p className="eyebrow">A good loaf with your name on it</p>
              <h2 id="order-heading">Ask for a<br />pre-order.</h2>
              <p>Tell us what you have in mind. This form prepares an email request to the bakery, so we can check what is possible and get back to you.</p>
              <p className="hero-note">Sending a request does not confirm availability or reserve an item. Jeremys will confirm acceptance directly.</p>
            </div>
            <form className="order-card" onSubmit={submitPreorder} data-testid="form-preorder">
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="product">What would you like to ask about?</label>
                  <select id="product" name="product" value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} required data-testid="input-product">
                    <option value="" disabled>Choose a bake</option>
                    {productOptions.map((product) => <option key={product} value={product}>{product}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="quantity">Quantity</label>
                  <input id="quantity" name="quantity" type="number" min="1" max="99" defaultValue="1" required data-testid="input-quantity" />
                </div>
                <div className="field">
                  <label htmlFor="pickup">Preferred pickup date</label>
                  <input id="pickup" name="pickup" type="date" required data-testid="input-pickup-date" />
                </div>
                <div className="field">
                  <label htmlFor="name">Your name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required placeholder="Name" data-testid="input-name" />
                </div>
                <div className="field">
                  <label htmlFor="contact-detail">Email or phone</label>
                  <input id="contact-detail" name="contact" type="text" autoComplete="email" required placeholder="How to reach you" data-testid="input-contact" />
                </div>
                <div className="field full">
                  <label htmlFor="details">A note, if you like</label>
                  <textarea id="details" name="details" placeholder="Anything else we should know?" data-testid="input-order-note" />
                </div>
              </div>
              <p className="form-foot">Your email app will open with the request prepared for kontakt@jeremys.dk. No payment is taken here. Availability, price and acceptance are confirmed by Jeremys.</p>
              <button type="submit" className="button" data-testid="button-send-preorder">Prepare email request <span aria-hidden="true">↗</span></button>
              {formStatus && <p className="form-status" role="status" data-testid="status-preorder">{formStatus}</p>}
            </form>
          </div>
        </section>

        <section className="section visit" id="visit" aria-labelledby="visit-heading">
          <div className="section-inner visit-grid">
            <div className="visit-copy">
              <p className="eyebrow">Come say hello</p>
              <h2 id="visit-heading">Aarhus, a<br />few good loaves.</h2>
              <p>Find the bakery in Åbyhøj. Before setting off, check with us about this week’s availability and hours; they are not listed here and may change.</p>
              <div className="address" data-testid="text-bakery-address">Jeremys Bread Kitchen<br />Yrsavej 34<br />8230 Åbyhøj, Aarhus<br />Denmark</div>
              <p className="hours-note">Please check this week’s opening hours by email or Facebook before your visit.</p>
              <div className="actions">
                <a className="button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" data-testid="link-directions">Directions on Google Maps ↗</a>
                <a className="button button-outline" href={`tel:${phone.replaceAll(' ', '')}`} data-testid="link-call-bakery">Call the bakery</a>
              </div>
            </div>
            <a className="map-panel" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" aria-label="Open Google Maps search for Jeremys Bread Kitchen" data-testid="map-panel">
              <span className="map-label">Map & directions</span>
              <span className="map-pin">JEREMYS<br />ÅBYHØJ</span>
              <span className="map-label">Yrsavej 34 · 8230 Åbyhøj</span>
            </a>
          </div>
        </section>

        <section className="section community" aria-labelledby="community-heading">
          <div className="section-inner">
            <p className="eyebrow">Keep up with the bake</p>
            <h2 id="community-heading">The next batch<br />starts with a hello.</h2>
            <p>For this week’s bakes and hours, look for Jeremys Bread Kitchen on Facebook or ask us directly. No account link is listed here; contact us if you need the latest word from the oven.</p>
            <div className="community-actions">
              <a className="button" href="https://www.facebook.com/search/top?q=Jeremys%20Bread%20Kitchen%20Aarhus" target="_blank" rel="noreferrer" data-testid="link-facebook-discovery">Find us on Facebook ↗</a>
              <a className="button button-outline" href={`mailto:${email}?subject=${encodeURIComponent('A note for Jeremys')}`} data-testid="link-community-email">Send a note</a>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-heading">
          <div className="section-inner contact-grid">
            <div>
              <p className="eyebrow">Questions, requests, or just hello</p>
              <h2 id="contact-heading">We’re easy<br />to reach.</h2>
              <p className="section-intro">Ask about this week, check hours before visiting, or tell us what you would like to request. We’ll confirm what is possible.</p>
            </div>
            <div className="contact-details">
              <div className="contact-links">
                <a href={`mailto:${email}`} data-testid="link-email"><span>{email}</span><span aria-hidden="true">↗</span></a>
                <a href={`tel:${phone.replaceAll(' ', '')}`} data-testid="link-phone"><span>{phone}</span><span aria-hidden="true">↗</span></a>
                <a href={`mailto:${email}?subject=${encodeURIComponent('General question for Jeremys')}&body=${encodeURIComponent('Hello Jeremys,\n\n')}`} data-testid="link-general-inquiry"><span>General inquiry / special order</span><span aria-hidden="true">Write an email ↗</span></a>
                <a href="https://www.google.com/maps/search/?api=1&query=Jeremys%20Bread%20Kitchen%2C%20Yrsavej%2034%2C%208230%20%C3%85byh%C3%B8j%2C%20Aarhus" target="_blank" rel="noreferrer" data-testid="link-map-contact"><span>Yrsavej 34, 8230 Åbyhøj, Aarhus</span><span aria-hidden="true">Map ↗</span></a>
                <a href="https://www.google.com/search?q=Jeremys+Bread+Kitchen+Aarhus+reviews" target="_blank" rel="noreferrer" data-testid="link-public-reviews"><span>Discover public reviews</span><span aria-hidden="true">Google search ↗</span></a>
              </div>
              <form className="inquiry-card" onSubmit={submitInquiry} data-testid="form-contact">
                <p className="eyebrow">Something on your mind?</p>
                <h3>Send a note</h3>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="inquiry-name">Your name</label>
                    <input id="inquiry-name" name="inquiry-name" type="text" autoComplete="name" required placeholder="Name" data-testid="input-inquiry-name" />
                  </div>
                  <div className="field">
                    <label htmlFor="inquiry-email">Email</label>
                    <input id="inquiry-email" name="inquiry-email" type="email" autoComplete="email" required placeholder="you@example.com" data-testid="input-inquiry-email" />
                  </div>
                  <div className="field full">
                    <label htmlFor="inquiry-type">What can we help with?</label>
                    <select id="inquiry-type" name="inquiry-type" defaultValue="" required data-testid="input-inquiry-type">
                      <option value="" disabled>Choose a topic</option>
                      {inquiryTypes.map((type) => <option value={type} key={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="field full">
                    <label htmlFor="inquiry-message">Your message</label>
                    <textarea id="inquiry-message" name="inquiry-message" required placeholder="Tell us a little about what you have in mind." data-testid="input-inquiry-message" />
                  </div>
                </div>
                <p className="form-foot">Your email app will open with a message addressed to {email}. Jeremys will reply to confirm what is possible.</p>
                <button type="submit" className="button" data-testid="button-send-inquiry">Prepare message <span aria-hidden="true">↗</span></button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Jeremys Bread Kitchen · Åbyhøj, Aarhus</span>
        <span>Small batches. A little patience. Good bread.</span>
      </footer>
      <div className="mobile-order"><a href="#order" className="button" data-testid="button-mobile-order">Ask for a pre-order <span aria-hidden="true">↗</span></a></div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
