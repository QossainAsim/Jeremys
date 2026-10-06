import './_group.css';
import './Redesign.css';

export function Redesign() {
  return (
    <main className="jk-redesign">
      <section className="hero" aria-labelledby="redesign-hero-heading">
        <div className="hero-photo" role="img" aria-label="Fresh artisan bread in the warm light of the bakery" />
        <div className="hero-wash" />
        <div className="hero-copy-wrap">
          <p className="eyebrow">A neighborhood bakery · Åbyhøj, Aarhus</p>
          <h1 id="redesign-hero-heading">Good bread<br />takes <em>its time.</em></h1>
          <p className="hero-copy">Organic bread, sourdough, pastries and more. Made by hand in small batches, just around the corner.</p>
          <div className="actions">
            <a className="button" href="#redesign-reviews">Meet the bakes <span aria-hidden="true">↘</span></a>
            <a className="hero-text-link" href="#redesign-reviews">Come find us <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="hero-side-note"><span>Small batch</span><span className="hero-side-rule" /><span>Åbyhøj · Aarhus</span></div>
        <a className="hero-scroll" href="#redesign-reviews" aria-label="Scroll to the next section"><span>Down to the good stuff</span><b aria-hidden="true">↓</b></a>
        <div className="hero-counter">01 <span>/</span> MADE WITH TIME</div>
      </section>

      <section className="customer-love" id="redesign-reviews" aria-labelledby="redesign-reviews-heading">
        <div className="review-orbit" aria-hidden="true">
          <div className="review-orbit-ring" />
          <div className="review-orbit-core"><span>Local voices</span><b>Å</b><span>Find them yourself</span></div>
          <span className="orbit-word orbit-word-one">CURIOUS?</span>
          <span className="orbit-word orbit-word-two">NO MADE-UP REVIEWS</span>
          <span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" />
        </div>
        <div className="customer-love-copy">
          <p className="eyebrow">A neighborhood bakery is made together</p>
          <h2 id="redesign-reviews-heading">The best word<br />travels <em>locally.</em></h2>
          <p>We’d rather let real customers speak for themselves. Find Jeremys’ public reviews, or get in touch with us directly.</p>
          <a className="text-link" href="https://www.google.com/search?q=Jeremys+Bread+Kitchen+Aarhus+reviews" target="_blank" rel="noreferrer">Look for public reviews on Google <span aria-hidden="true">↗</span></a>
          <span className="review-footnote">No review excerpts or scores reproduced here.</span>
        </div>
      </section>
    </main>
  );
}
