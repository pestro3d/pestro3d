import Image from "next/image";
import Link from "next/link";

const process = [
  {
    number: "01",
    title: "Share your memory",
    copy: "Upload a clear photo and tell us the occasion, finish, and details that make it yours.",
  },
  {
    number: "02",
    title: "Approve the preview",
    copy: "We shape your miniature in 3D, send a detailed preview, and refine it before production begins.",
  },
  {
    number: "03",
    title: "Unbox a keepsake",
    copy: "Your hand-painted miniature arrives gift-ready, thoughtfully packed, and made to be treasured.",
  },
];

const promises = [
  { title: "Preview before production", copy: "You approve the design before anything is made." },
  { title: "Hand-painted finish", copy: "Every detail is finished by hand for a distinctive result." },
  { title: "Premium materials", copy: "Durable resin, thoughtfully crafted for lasting memories." },
];

const gallery = [
  {
    title: "The classic bike",
    category: "Signature miniature",
    image: "/images/bike-miniature-1.jpg",
    alt: "Hand-painted bike miniature",
  },
  {
    title: "The roadster",
    category: "Signature miniature",
    image: "/images/bike-miniature-3.jpg",
    alt: "Alternate hand-painted bike miniature",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span /> A memory, made tangible</p>
          <h1>Turn a cherished photo into a <em>tiny treasure.</em></h1>
          <p className="hero-intro">
            Personalised 3D miniatures, thoughtfully designed and hand-painted for the people and moments you never want to forget.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="button button-primary">Start your miniature <span>↗</span></Link>
            <Link href="#how-it-works" className="text-link">See how it works <span>↓</span></Link>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>AK</span><span>RS</span><span>MP</span>
            </div>
            <p><strong>Made with care</strong><br />for meaningful milestones</p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrap">
            <Image
              src="/images/bike-miniature-1.jpg"
              alt="Premium hand-painted bike miniature"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="hero-image"
            />
            <div className="image-shade" />
          </div>
          <div className="hero-caption">
            <span>01</span>
            <p><strong>Signature piece</strong><br />Hand-painted in our studio</p>
          </div>
          <div className="floating-note"><span>✦</span> Made for your story</div>
        </div>
      </section>

      <section className="marquee" aria-label="Product values">
        <div>
          <span>Personalised</span><i>✦</i><span>Hand-painted</span><i>✦</i><span>Preview included</span><i>✦</i><span>Gift-ready</span><i>✦</i>
          <span>Personalised</span><i>✦</i><span>Hand-painted</span><i>✦</i><span>Preview included</span><i>✦</i><span>Gift-ready</span><i>✦</i>
        </div>
      </section>

      <section className="section process-section" id="how-it-works">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> The experience</p>
            <h2>From a photo to a <em>keepsake.</em></h2>
          </div>
          <p>Every order follows a simple, transparent process—so you always know exactly what you are creating and why.</p>
        </div>
        <div className="process-grid">
          {process.map((step) => (
            <article className="process-card" key={step.number}>
              <span className="process-number">{step.number}</span>
              <div className="process-icon" aria-hidden="true">{step.number === "01" ? "◌" : step.number === "02" ? "◇" : "✦"}</div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-image">
          <Image src="/images/bike-miniature-3.jpg" alt="Second hand-painted bike miniature" fill sizes="(max-width: 1024px) 90vw, 55vw" className="showcase-photo" />
          <div className="showcase-stamp"><span>100%</span> yours</div>
        </div>
        <div className="showcase-copy">
          <p className="eyebrow light"><span /> Designed around you</p>
          <h2>Not just a miniature.<br /><em>A memory, made visible.</em></h2>
          <p>We translate the details that matter into a tactile, one-of-a-kind piece—capturing the expression, character, and story behind your favourite photo.</p>
          <ul>
            {promises.map((promise) => (
              <li key={promise.title}><span>✓</span><div><strong>{promise.title}</strong><small>{promise.copy}</small></div></li>
            ))}
          </ul>
          <Link href="/shop" className="button button-light">Explore the collection <span>↗</span></Link>
        </div>
      </section>

      <section className="section gallery-section" id="gallery">
        <div className="section-heading gallery-heading">
          <div>
            <p className="eyebrow"><span /> The collection</p>
            <h2>Small objects.<br /><em>Big stories.</em></h2>
          </div>
          <Link href="/shop" className="text-link">View all pieces <span>↗</span></Link>
        </div>
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <article className={`gallery-card ${index === 0 ? "gallery-card-large" : ""}`} key={item.title}>
              <div className="gallery-image-wrap">
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 1024px) 90vw, 45vw" className="gallery-image" />
                <span className="gallery-index">0{index + 1}</span>
              </div>
              <div className="gallery-meta"><div><p>{item.category}</p><h3>{item.title}</h3></div><Link href="/shop" aria-label={`View ${item.title}`}>↗</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonial-section">
        <div className="quote-mark">“</div>
        <blockquote>It feels like the person I lost is still sitting beside me—only now, I can hold the memory in my hands.</blockquote>
        <div className="quote-author"><span>MR</span><p><strong>Meera R.</strong><br />Personal keepsake order</p></div>
      </section>

      <section className="cta-section">
        <div>
          <p className="eyebrow light"><span /> Your story starts here</p>
          <h2>Let’s make something<br /><em>worth keeping.</em></h2>
        </div>
        <div className="cta-action">
          <p>Send us a clear photo. We’ll take care of the rest.</p>
          <Link href="/shop" className="button button-light">Send a photo <span>↗</span></Link>
        </div>
      </section>
    </main>
  );
}
