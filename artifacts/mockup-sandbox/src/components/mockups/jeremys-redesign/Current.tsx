import './_group.css';

export function Current() {
  return (
    <main className="jk-current">
      <section className="hero" aria-labelledby="current-hero-heading">
        <div className="hero-copy-wrap">
          <p className="eyebrow">A little bakery in Åbyhøj, Aarhus</p>
          <h1 id="current-hero-heading">Organic bread,<br />baked with care<br />in Åbyhøj.</h1>
          <p className="hero-copy">Sourdough bread, pastries, cakes and more — handmade in small batches with carefully selected ingredients.</p>
          <div className="actions">
            <a className="button" href="#current-reviews">ORDER / PRE-ORDER <span aria-hidden="true">↘</span></a>
            <a className="button button-outline" href="#current-reviews">SEE THIS WEEK’S BAKES</a>
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

      <section className="section customer-love" id="current-reviews" aria-labelledby="current-reviews-heading">
        <div className="section-inner customer-love-inner">
          <div>
            <p className="eyebrow">A neighborhood bakery is made together</p>
            <h2 id="current-reviews-heading">Let the neighbors<br />tell you.</h2>
          </div>
          <div className="customer-love-copy">
            <p>We’d rather let real customers speak for themselves. Find Jeremys’ public reviews, or get in touch with us directly.</p>
            <a className="text-link" href="https://www.google.com/search?q=Jeremys+Bread+Kitchen+Aarhus+reviews" target="_blank" rel="noreferrer">Look for public reviews on Google ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}
