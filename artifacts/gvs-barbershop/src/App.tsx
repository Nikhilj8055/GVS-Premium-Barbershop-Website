import { useEffect, useRef, useState, type FormEvent, type ReactNode, type TouchEvent } from 'react';
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check,
  ChevronDown, CircleDot, Clock3, Coffee, Instagram, MapPin, Menu, MoveUpRight,
  Scissors, Sparkles, X,
} from 'lucide-react';
import { business, faqs, packages, services } from './data/business';

const navItems = [
  ['Home', 'home'], ['Services', 'services'], ['Experience', 'experience'],
  ['Gallery', 'gallery'], ['About', 'about'], ['Contact', 'contact'],
];

const galleryItems = [
  { title: 'The GVS frontage', category: 'Interior', type: 'image' as const, src: business.storefront, alt: 'GVS Premium Barbershop storefront and sign' },
  { title: 'Step inside GVS', category: 'Experience', type: 'video' as const, src: business.video, alt: 'A moving view of the GVS barbershop interior' },
  { title: 'A place to reset', category: 'Spa', type: 'image' as const, src: business.storefront, alt: 'GVS Premium Barbershop, exterior detail' },
  { title: 'The neighbourhood address', category: 'Interior', type: 'image' as const, src: business.storefront, alt: 'The actual GVS shop entrance' },
  { title: 'Grooming, at your pace', category: 'Grooming', type: 'video' as const, src: business.video, alt: 'GVS interior and entrance experience' },
  { title: 'A little breathing room', category: 'Coffee', type: 'image' as const, src: business.storefront, alt: 'GVS Premium Barbershop exterior' },
];
const galleryFilters = ['All', 'Interior', 'Grooming', 'Spa', 'Coffee', 'Experience'];
const stages = [
  ['01', 'Arrive', 'Step into a premium environment designed for comfort.'],
  ['02', 'Groom', 'Professional hair, beard and grooming services, with care in every detail.'],
  ['03', 'Relax', 'Take a moment to unwind with spa and relaxation experiences.'],
  ['04', 'Refresh', 'Enjoy the atmosphere, coffee and a moment that is entirely your own.'],
];
const membership = ['Essential', 'Premium', 'Elite'];

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`eyebrow ${light ? 'gold' : ''}`}>{children}</span>;
}

function SectionHeading({ eyebrow, title, copy, light = false, id }: {
  eyebrow: string; title: ReactNode; copy?: string; light?: boolean; id?: string;
}) {
  return <div id={id} className="section-heading">
    <Eyebrow light={light}>{eyebrow}</Eyebrow>
    <h2 className="display-font">{title}</h2>
    {copy && <p>{copy}</p>}
  </div>;
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [slider, setSlider] = useState(52);
  const [selectedService, setSelectedService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mobileWhatsappNote, setMobileWhatsappNote] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    document.title = 'GVS Premium Barbershop | Premium Grooming & Relaxation';
    const description = 'Experience premium grooming, barbering, spa, relaxation and lifestyle services at GVS Premium Barbershop.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]') ?? document.head.appendChild(document.createElement('meta'));
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'GVS Premium Barbershop | Premium Grooming & Relaxation');
    const ogDescription = document.querySelector('meta[property="og:description"]') ?? document.head.appendChild(document.createElement('meta'));
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', description);
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BarberShop', name: business.businessName });
    document.head.appendChild(schema);
    return () => { schema.remove(); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
      const positions = navItems.map(([, id]) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? 9999 }));
      const current = positions.filter(item => item.top < 180).sort((a, b) => b.top - a.top)[0];
      if (current) setActiveNav(current.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowRight') setLightboxIndex(index => index === null ? 0 : (index + 1) % filteredGallery.length);
      if (event.key === 'ArrowLeft') setLightboxIndex(index => index === null ? 0 : (index - 1 + filteredGallery.length) % filteredGallery.length);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  });

  const filteredGallery = galleryItems.filter(item => filter === 'All' || item.category === filter);
  const jumpToBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setSubmitted(false);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };
  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  const onGalleryTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - event.changedTouches[0].clientX;
    if (Math.abs(delta) > 45) setLightboxIndex(index => index === null ? 0 : (index + (delta > 0 ? 1 : -1) + filteredGallery.length) % filteredGallery.length);
    touchStart.current = null;
  };
  const currentImage = lightboxIndex === null ? null : filteredGallery[lightboxIndex];

  return <main className="noise">
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <a className="brand-lockup focus-ring" href="#home" aria-label="GVS Premium Barbershop home">
        <span className="brand-monogram">GVS</span><span className="brand-divider" /><span className="brand-name">PREMIUM<br />BARBERSHOP</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([name, id]) => <a key={id} className={`nav-link ${activeNav === id ? 'nav-active' : ''}`} href={`#${id}`}>{name}</a>)}
      </nav>
      <button className="nav-book btn-arrow" onClick={() => jumpToBooking()} data-testid="button-book-nav">Book now <ArrowUpRight size={15} /></button>
      <button className="mobile-toggle focus-ring" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
    {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">
      {navItems.map(([name, id], index) => <a key={id} style={{ animationDelay: `${index * 45}ms` }} href={`#${id}`} onClick={() => setMenuOpen(false)}>{name}<ArrowUpRight size={16} /></a>)}
      <button onClick={() => jumpToBooking()} className="mobile-menu-book">Book your experience <ArrowRight size={16} /></button>
      <small>GROOM. RELAX. REDEFINE.</small>
    </nav>}

    <section className="hero" id="home" aria-label="GVS Premium Barbershop">
      <video className="hero-video" autoPlay muted loop playsInline poster={business.videoPoster} preload="metadata" aria-label="GVS interior and entrance">
        <source src={business.video} type="video/mp4" />
      </video>
      <div className="hero-shade" />
      <div className="hero-grain" />
      <div className="hero-content">
        <div className="hero-kicker reveal"><span className="hero-dot" /> GVS PREMIUM BARBERSHOP <span className="hero-kicker-line" /> EST. WITH CARE</div>
        <h1 className="display-font hero-title"><span>Groom.</span><span>Relax.</span><span className="hero-last">Redefine<span className="hero-period">.</span></span></h1>
        <p className="hero-copy">Premium grooming, relaxation and lifestyle —<br className="desktop-break" /> all under one roof.</p>
        <div className="hero-actions">
          <button className="button button-gold btn-arrow" onClick={() => jumpToBooking()} data-testid="button-book-hero">Book your experience <ArrowRight size={16} /></button>
          <a className="button button-quiet btn-arrow" href="#services">Explore services <ArrowDownRight size={16} /></a>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#intro" className="scroll-cue"><span className="scroll-float"><ArrowDown size={14} /></span> SCROLL TO EXPLORE</a>
        <div className="hero-location"><MapPin size={14} /><span>YOUR NEIGHBOURHOOD, REFINED</span></div>
        <span className="hero-index">01 <i /> 08</span>
      </div>
      <div className="hero-edge-word">THE GVS EXPERIENCE</div>
    </section>

    <section className="intro section-pad" id="intro">
      <div className="intro-meta"><Eyebrow>NOT JUST A CHAIR</Eyebrow><span className="gold-line" /></div>
      <div className="intro-copy">
        <h2 className="display-font">More than a<br /><em>haircut.</em><br /><span>It’s an experience.</span></h2>
        <div className="intro-aside"><span className="intro-aside-number">GVS / 01</span><p>GVS Premium Barbershop brings professional grooming, relaxation and modern lifestyle together in one destination.</p><a className="text-link line-link" href="#experience">Discover the experience <ArrowDownRight size={15} /></a></div>
      </div>
      <div className="intro-foot"><span>GOOD STYLE IS A FEELING.</span><span>GVS PREMIUM BARBERSHOP · 01—06</span></div>
    </section>

    <section className="experience section-dark section-pad" id="experience">
      <div className="experience-head">
        <div><Eyebrow light>THE RITUAL</Eyebrow><h2 className="display-font">The GVS<br /><em>experience.</em></h2></div>
        <p>From the first hello to the final look in the mirror, make room for a little more.</p>
      </div>
      <div className="experience-steps">
        {stages.map(([num, title, text], i) => <article className="step-row" key={num}>
          <span className="step-number">{num}</span><h3 className="serif-font">{title}</h3><p>{text}</p><span className="step-mark">{i === 0 ? <MapPin /> : i === 1 ? <Scissors /> : i === 2 ? <Sparkles /> : <Coffee />}</span>
        </article>)}
      </div>
      <span className="experience-side">A MOMENT, WELL SPENT</span>
    </section>

    <section className="video-feature section-pad">
      <div className="video-feature-top"><Eyebrow>STEP INSIDE GVS</Eyebrow><span>01 / THE HOUSE</span></div>
      <h2 className="serif-font">Designed around grooming,<br /><em>comfort and relaxation.</em></h2>
      <div className="cinema-frame media-card">
        <video autoPlay muted loop playsInline poster={business.videoPoster} preload="none" aria-label="Take a look inside GVS Premium Barbershop">
          <source src={business.video} type="video/mp4" />
        </video>
        <div className="cinema-wash" /><span className="cinema-label"><span className="hero-dot" /> GVS / THE EXPERIENCE</span>
        <span className="cinema-caption">A closer look<br /><small>AT YOUR NEXT FAVOURITE PLACE</small></span>
      </div>
    </section>

    <section className="services section-pad" id="services">
      <div className="services-title">
        <div><Eyebrow>CONSIDERED CRAFT</Eyebrow><h2 className="display-font">The art of<br /><em>grooming.</em></h2></div>
        <p>Good grooming is personal. Find the service that feels like you.</p>
      </div>
      <div className="service-list">
        {services.map((service, index) => <button key={service.title} className="service-row" onClick={() => jumpToBooking(service.title)} data-testid={`button-service-${index}`}>
          <span className="service-num">0{index + 1}</span><span className="service-category">{service.group}</span><span className="service-main"><b>{service.title}</b><small>{service.description}</small></span><span className="service-action">Discover <ArrowUpRight size={16} /></span>
        </button>)}
      </div>
      <p className="service-note">Service availability and details are confirmed directly with GVS. Prices to be added by the business.</p>
    </section>

    <section className="packages section-dark section-pad">
      <div className="package-heading"><div><Eyebrow light>MADE FOR THE MOMENT</Eyebrow><h2 className="display-font">The GVS signature<br /><em>experiences.</em></h2></div><p>A little more time. A little more you.</p></div>
      <div className="package-grid">
        {packages.map(pack => <article className={`package-card ${pack.featured ? 'package-featured' : ''}`} key={pack.number}>
          <div className="package-card-top"><span>PACKAGE {pack.number}</span>{pack.featured && <span className="package-stamp">THE FAVOURITE</span>}</div>
          <h3 className="serif-font">{pack.name}</h3><span className="package-rule" />
          <ul>{pack.items.map(item => <li key={item}><Check size={13} />{item}</li>)}</ul>
          <button className="package-link" onClick={() => jumpToBooking('Premium Package')}>Explore experience <ArrowRight size={15} /></button>
        </article>)}
      </div>
      <p className="package-disclaimer">Package details and availability are placeholders for the business to confirm. No prices shown.</p>
    </section>

    <section className="coffee section-pad">
      <div className="coffee-art" aria-hidden="true">
        <div className="coffee-orbit orbit-one" /><div className="coffee-orbit orbit-two" />
        <div className="coffee-cup"><div className="cup-coffee" /><span>GVS</span></div>
        <span className="coffee-art-note">A PAUSE<br />IN THE DAY</span>
        <span className="coffee-art-coordinate">01° / TAKE YOUR TIME</span>
      </div>
      <div className="coffee-copy">
        <Eyebrow>THE IN-BETWEEN</Eyebrow><h2 className="display-font">Pause.<br /><em>Sip.</em><br />Relax.</h2>
        <p>Your grooming experience doesn’t have to end at the barber chair.</p>
        <div className="coffee-includes"><span><Coffee /> Coffee</span><span><CircleDot /> Refreshments</span><span><Sparkles /> Comfortable atmosphere</span></div>
        <a className="text-link line-link" href="#contact">Discover the coffee experience <ArrowRight size={15} /></a>
        <small className="placeholder-note">A welcoming coffee bar. Menu and details to be confirmed.</small>
      </div>
    </section>

    <section className="wellness section-dark section-pad">
      <div className="wellness-intro"><Eyebrow light>A DIFFERENT KIND OF RESET</Eyebrow><h2 className="display-font">Reset your<br /><em>routine.</em></h2><p>Take a moment away from the noise and enjoy a grooming experience designed around relaxation.</p></div>
      <div className="wellness-grid">
        {['Head massage', 'Facial care', 'Relaxation', 'Premium grooming'].map((item, i) => <div className={`wellness-tile wellness-tile-${i + 1}`} key={item}><span>0{i + 1} / GVS</span><h3 className="serif-font">{item}</h3><div className="wellness-icon">{i === 0 ? <Sparkles /> : i === 1 ? <CircleDot /> : i === 2 ? <Clock3 /> : <Scissors />}</div></div>)}
      </div>
      <small className="wellness-note">Experience names are editable and subject to confirmation by GVS.</small>
    </section>

    <section className="lounge section-pad">
      <div className="lounge-image media-card"><img src={business.storefront} loading="lazy" alt="The real GVS Premium Barbershop storefront" /><div className="lounge-image-overlay" /><span className="lounge-number">GVS / 02</span><span className="lounge-vertical">YOUR SPACE TO SLOW DOWN</span></div>
      <div className="lounge-copy"><Eyebrow>MAKE YOURSELF AT HOME</Eyebrow><h2 className="serif-font">Take a moment<br />for <em>yourself.</em></h2><p>A space to slow down, relax and enjoy the GVS experience.</p><a className="text-link line-link" href="#gallery">See the GVS space <ArrowRight size={15} /></a></div>
    </section>

    <section className="welcome section-dark" id="about">
      <div className="welcome-image media-card"><img src={business.storefront} loading="lazy" alt="Actual GVS Premium Barbershop exterior, showing original storefront sign and branding" /><span className="image-corner-label">THE REAL GVS · THE NEIGHBOURHOOD</span></div>
      <div className="welcome-copy"><Eyebrow light>WELCOME TO GVS</Eyebrow><h2 className="display-font">A good place<br />to <em>feel good.</em></h2><p className="welcome-name">GVS PREMIUM BARBERSHOP</p><p>Where grooming meets comfort, style and experience.</p><button className="button button-gold btn-arrow" onClick={() => jumpToBooking()}>Book your experience <ArrowRight size={16} /></button><span className="welcome-signoff">GROOM. RELAX. REDEFINE.</span></div>
    </section>

    <section className="reasons section-pad">
      <div className="reasons-heading"><Eyebrow>THE GVS DIFFERENCE</Eyebrow><h2 className="display-font">A little more<br /><em>considered.</em></h2></div>
      <div className="reasons-grid">
        {['Premium grooming', 'Experienced barbers', 'Spa & wellness', 'Relaxation experience', 'Coffee bar', 'Personalized service'].map((item, i) => <article className="reason" key={item}><span>0{i + 1}</span><div className="reason-icon">{[<Scissors key="sc" />, <CircleDot key="ci" />, <Sparkles key="sp" />, <Clock3 key="cl" />, <Coffee key="co" />, <MoveUpRight key="mv" />][i]}</div><h3>{item}</h3></article>)}
      </div>
      <p className="placeholder-note">Business-specific details and service claims should be confirmed by GVS before publishing.</p>
    </section>

    <section className="gallery section-dark section-pad" id="gallery">
      <div className="gallery-head"><div><Eyebrow light>LOOK AROUND</Eyebrow><h2 className="display-font">The GVS <em>space.</em></h2></div><p>A glimpse of the place, its pace and the experience.<br /><small>All imagery here is actual GVS storefront or supplied interior video.</small></p></div>
      <div className="gallery-filters" role="group" aria-label="Filter gallery">
        {galleryFilters.map(category => <button key={category} onClick={() => { setFilter(category); setLightboxIndex(null); }} className={filter === category ? 'filter-active' : ''} aria-pressed={filter === category} data-testid={`filter-${category.toLowerCase()}`}>{category}</button>)}
      </div>
      <div className="gallery-grid">
        {filteredGallery.map((item, index) => <button key={`${item.title}-${index}`} className={`gallery-item gallery-item-${index + 1} media-card`} onClick={() => setLightboxIndex(index)} aria-label={`View image: ${item.title}`} data-testid={`gallery-item-${index}`}>
          {item.type === 'video' ? <><video autoPlay muted loop playsInline poster={business.storefront} preload="none" aria-hidden="true"><source src={business.video} type="video/quicktime" /><source src={business.video} type="video/mp4" /></video><span className="gallery-play">GVS / VIDEO</span></> : <img src={item.src} loading="lazy" alt={item.alt} />}
          <span className="gallery-overlay"><span><small>{item.category}</small><b>{item.title}</b></span><ArrowUpRight size={19} /></span>
        </button>)}
      </div>
      <div className="gallery-bottom"><span>01 — 06 / GVS ARCHIVE</span><span>Press an image to take a closer look</span></div>
    </section>

    <section className="transformation section-pad">
      <div className="transform-copy"><Eyebrow>DETAIL CHANGES EVERYTHING</Eyebrow><h2 className="display-font">The<br /><em>transformation.</em></h2><p>A space for real before-and-after work. This demo uses abstract placeholders only — no client results are shown.</p><span className="transform-credit">DEMO VISUAL · REPLACE WITH APPROVED CLIENT PHOTOS</span></div>
      <div className="compare-wrap">
        <div className="compare-image compare-after" style={{ clipPath: `inset(0 0 0 ${slider}%)` }}><div className="abstract-portrait portrait-after"><span className="abstract-hair" /><span className="abstract-face" /><span className="abstract-neck" /><span className="abstract-label">AFTER · DEMO</span></div></div>
        <div className="compare-image compare-before" style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}><div className="abstract-portrait portrait-before"><span className="abstract-hair" /><span className="abstract-face" /><span className="abstract-neck" /><span className="abstract-label">BEFORE · DEMO</span></div></div>
        <span className="compare-divider" style={{ left: `${slider}%` }}><span><ArrowLeft size={13} /><ArrowRight size={13} /></span></span>
        <input className="compare-range custom-range" type="range" min="0" max="100" value={slider} onChange={event => setSlider(Number(event.target.value))} aria-label="Compare before and after demo placeholders" data-testid="slider-transformation" />
      </div>
    </section>

    <section className="team section-dark section-pad">
      <div className="team-heading"><div><Eyebrow light>GOOD HANDS</Eyebrow><h2 className="display-font">Meet the grooming<br /><em>experts.</em></h2></div><p>Skilled people make the experience. Team details are ready for GVS to make their own.</p></div>
      <div className="team-grid">
        {[
          ['01', 'Senior Barber', 'Master Grooming Specialist'],
          ['02', 'Grooming Expert', 'Hair & Beard'],
          ['03', 'Wellness Specialist', 'Spa & Relaxation'],
        ].map(([number, role, specialty], i) => <article key={number} className="team-card">
          <div className={`team-portrait team-portrait-${i + 1}`}><span className="team-initial">{String.fromCharCode(65 + i)}</span><span className="team-demo">EDITABLE PLACEHOLDER</span></div>
          <div className="team-caption"><div><Eyebrow light>{number} / TEAM</Eyebrow><h3 className="serif-font">{role}</h3><p>{specialty}</p></div><ArrowUpRight size={18} /></div>
        </article>)}
      </div>
      <p className="demo-caveat">Placeholder roles only · Names and profiles to be provided by the business.</p>
    </section>

    <section className="testimonials section-pad">
      <div className="testimonials-title"><Eyebrow>THE WORD ON GVS</Eyebrow><h2 className="display-font">What our clients<br /><em>say.</em></h2><p>Sample copy for layout preview only. These are not genuine customer reviews.</p></div>
      <div className="quote-list">
        {[
          ['“A thoughtful demo quote about the care, comfort and attention to detail at GVS.”', 'DEMO REVIEW · REPLACE WITH APPROVED REVIEW'],
          ['“Placeholder words that show how a real customer story could sit in this space.”', 'DEMO REVIEW · REPLACE WITH APPROVED REVIEW'],
          ['“A sample sentiment about leaving feeling refreshed, ready for a real testimonial.”', 'DEMO REVIEW · REPLACE WITH APPROVED REVIEW'],
        ].map(([quote, attribution], index) => <article className="quote-card" key={`${attribution}-${index}`}><div className="quote-top"><span aria-label="Five star display placeholder">★★★★★</span><span>0{index + 1}</span></div><blockquote className="serif-font">{quote}</blockquote><p>{attribution}</p></article>)}
      </div>
    </section>

    <section className="membership section-dark section-pad">
      <div className="membership-heading"><Eyebrow light>MORE GVS, MORE OFTEN</Eyebrow><h2 className="display-font">Make GVS part<br />of your <em>routine.</em></h2><p>A membership idea, waiting for the right details.</p></div>
      <div className="membership-grid">{membership.map((name, i) => <article className={`membership-card ${i === 1 ? 'membership-featured' : ''}`} key={name}><span>MEMBERSHIP / 0{i + 1}</span><h3 className="serif-font">{name}</h3><p>Membership details and benefits<br />to be confirmed by GVS.</p><span className="membership-rule" /><button onClick={() => jumpToBooking('Membership enquiry')}>Ask about membership <ArrowRight size={14} /></button></article>)}</div>
      <p className="demo-caveat">Teaser only — no benefits, terms or prices are represented as confirmed.</p>
    </section>

    <section className="gift section-pad">
      <div className="gift-orbit"><div className="gift-disc"><span>GVS</span><i>GIVE A<br />MOMENT</i></div><span className="gift-ring-copy">A GOOD GIFT · A BETTER DAY · GVS</span></div>
      <div className="gift-copy"><Eyebrow>A THOUGHTFUL GESTURE</Eyebrow><h2 className="display-font">Give the GVS<br /><em>experience.</em></h2><p>Because a great grooming experience makes a great gift.</p><button className="button button-dark btn-arrow" onClick={() => jumpToBooking('Gift experience enquiry')}>Gift the experience <ArrowUpRight size={16} /></button><small>Gift enquiry only · no payment or voucher purchase in this demo.</small></div>
    </section>

    <section className="booking section-dark section-pad" id="booking">
      <div className="booking-intro"><Eyebrow light>MAKE SOME TIME</Eyebrow><h2 className="display-font">Your next experience<br /><em>starts here.</em></h2><p>Tell us what you have in mind. This demo enquiry is a first hello — the GVS team will need to confirm any appointment directly.</p>
        <div className="booking-aside"><span className="booking-index">01 / 02</span><span className="gold-line" /><small>NO PAYMENT · NO AUTOMATIC BOOKING</small></div>
      </div>
      {submitted ? <div className="success-panel" role="status" aria-live="polite"><span className="success-icon"><Check /></span><Eyebrow light>ENQUIRY READY</Eyebrow><h3 className="serif-font">Thanks for reaching out.</h3><p>Your demo enquiry has been received on this page. This is not a confirmed appointment; GVS will need to follow up directly.</p><button className="text-link" onClick={() => setSubmitted(false)}>Send another enquiry <ArrowRight size={15} /></button></div> :
      <form className="booking-form" onSubmit={submitInquiry}>
        <div className="form-row"><label>Your name<input name="name" placeholder="Name" required autoComplete="name" data-testid="input-name" /></label><label>Phone<input name="phone" placeholder="Phone number" required autoComplete="tel" data-testid="input-phone" /></label></div>
        <label>Email address<input name="email" type="email" placeholder="Email address" required autoComplete="email" data-testid="input-email" /></label>
        <label>What are you interested in?<span className="select-wrap"><select name="service" required value={selectedService} onChange={event => setSelectedService(event.target.value)} data-testid="select-service"><option value="" disabled>Select a service</option>{['Haircut', 'Beard', 'Hair + Beard', 'Spa', 'Facial', 'Massage', 'Premium Package', 'Membership enquiry', 'Gift experience enquiry', ...services.map(item => item.title)].map((service, index) => <option key={`${service}-${index}`} value={service}>{service}</option>)}</select><ChevronDown size={16} /></span></label>
        <div className="form-row"><label>Preferred date<input name="date" type="date" data-testid="input-date" /></label><label>Preferred time<span className="select-wrap"><select name="time" defaultValue=""><option value="">Choose a time</option>{['Morning', 'Midday', 'Afternoon', 'Evening', 'Flexible'].map(time => <option key={time}>{time}</option>)}</select><ChevronDown size={16} /></span></label></div>
        <label>Preferred barber <input name="barber" placeholder="Any barber / name (optional)" data-testid="input-barber" /></label>
        <label>A note for the team<textarea name="message" rows={3} placeholder="Anything you'd like us to know?" data-testid="input-message" /></label>
        <button className="button button-gold form-submit btn-arrow" type="submit" data-testid="button-submit-inquiry">Send an enquiry <ArrowRight size={16} /></button>
        <p className="form-legal">By submitting, you’re sharing a demo enquiry only. Your appointment is not booked or confirmed.</p>
      </form>}
    </section>

    <section className="contact section-pad" id="contact">
      <div className="contact-head"><div><Eyebrow>COME FIND US</Eyebrow><h2 className="display-font">Find <em>GVS.</em></h2></div><p>Good grooming is closer than you think.<br />Location details coming from the GVS team.</p></div>
      <div className="contact-grid">
        <div className="contact-details"><h3 className="serif-font">GVS Premium Barbershop</h3><div><MapPin /><span><b>Address</b><small>{business.address}</small></span></div><div><Clock3 /><span><b>Opening hours</b><small>{business.openingHours}</small></span></div><div><CircleDot /><span><b>Phone & WhatsApp</b><small>{business.phone} · {business.whatsapp}</small></span></div><button className="contact-cta" onClick={() => jumpToBooking()}>Make an enquiry <ArrowUpRight size={15} /></button></div>
        <div className="map-placeholder"><div className="map-lines"><span /><span /><span /><span /><span /></div><span className="map-pin"><MapPin size={22} /></span><div className="map-caption"><span className="hero-dot" /><b>GVS, RIGHT HERE</b><small>MAP PREVIEW · ADDRESS TO BE PROVIDED</small></div><span className="map-annotation">A PLACE<br />TO COME BACK TO</span></div>
      </div>
    </section>

    <section className="faq section-dark section-pad">
      <div className="faq-title"><Eyebrow light>GOOD TO KNOW</Eyebrow><h2 className="display-font">A few things<br /><em>you may wonder.</em></h2><p>Answers are editable placeholders. Please confirm details with GVS before publishing.</p></div>
      <div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${faqOpen === index ? 'faq-open' : ''}`} key={question}>
        <button className="faq-question" onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index} aria-controls={`faq-answer-${index}`} data-testid={`faq-question-${index}`}><span className="faq-number">0{index + 1}</span><span>{question}</span><span className="faq-plus">{faqOpen === index ? <X size={16} /> : <ArrowDown size={16} />}</span></button>
        {faqOpen === index && <p className="faq-answer" id={`faq-answer-${index}`}>{answer}</p>}
      </div>)}</div>
    </section>

    <section className="social section-pad" id="social">
      <div className="social-heading"><Eyebrow>FOLLOW ALONG</Eyebrow><h2 className="display-font">Follow the GVS<br /><em>experience.</em></h2></div>
      <div className="social-grid">
        {[
          ['The original sign', business.storefront, 'storefront'],
          ['Inside the experience', business.storefront, 'video'],
          ['A GVS welcome', business.storefront, 'welcome'],
          ['The neighbourhood', business.storefront, 'neighbourhood'],
        ].map(([title, src, kind], i) => <a href="#gallery" className={`social-tile social-tile-${i + 1}`} key={title} aria-label={`${title} — view GVS gallery`}><img src={src} alt={title} loading="lazy" /><span>{kind === 'video' ? 'GVS / INTERIOR' : `GVS / 0${i + 1}`}</span><Instagram size={17} /></a>)}
      </div>
      <div className="social-foot"><span>THE REAL PLACE. THE REAL FEELING.</span><a href="#contact" className="text-link line-link">Follow us <ArrowUpRight size={15} /></a></div>
      <small className="placeholder-note">Social channels and live links to be supplied by GVS. Images are supplied GVS media.</small>
    </section>

    <section className="final-cta section-dark">
      <div className="final-cta-top"><Eyebrow light>GVS PREMIUM BARBERSHOP</Eyebrow><span>THE NEXT CHAPTER IS YOURS</span></div>
      <div className="final-cta-main"><h2 className="display-font">Ready for<br />the GVS <em>experience?</em></h2><button className="button button-gold btn-arrow" onClick={() => jumpToBooking()}>Book your experience <ArrowRight size={16} /></button></div>
      <p>Groom. <em>Relax.</em> Redefine.</p>
      <span className="final-sun" aria-hidden="true">GVS</span>
    </section>

    <footer className="footer section-dark">
      <div className="footer-top">
        <div className="footer-brand"><a href="#home" className="brand-lockup"><span className="brand-monogram">GVS</span><span className="brand-divider" /><span className="brand-name">PREMIUM<br />BARBERSHOP</span></a><p>Groom.<br /><em>Relax.</em><br />Redefine.</p></div>
        <div className="footer-links"><div><Eyebrow light>EXPLORE</Eyebrow>{navItems.map(([name, id]) => <a href={`#${id}`} key={id}>{name}</a>)}</div><div><Eyebrow light>EXPERIENCE</Eyebrow>{['Hair', 'Beard', 'Spa', 'Facial', 'Packages'].map((name, i) => <a href="#services" key={name} onClick={() => setSelectedService(['Haircut', 'Beard', 'Spa', 'Facial', 'Premium Package'][i])}>{name}</a>)}</div><div><Eyebrow light>GET IN TOUCH</Eyebrow><span>{business.phone}</span><span>{business.whatsapp}</span><span>{business.email}</span><a href="#contact">Location</a></div><div><Eyebrow light>FOLLOW</Eyebrow><span>Instagram · {business.instagram}</span><span>Facebook · {business.facebook}</span><span>TikTok · {business.tiktok}</span></div></div>
      </div>
      <div className="footer-bottom"><span>© 2026 GVS Premium Barbershop. All rights reserved.</span><span>Website concept · Details to be confirmed by GVS.</span><a href="#home">Back to top ↑</a></div>
    </footer>

    <button className="whatsapp-float" onClick={() => { setMobileWhatsappNote(true); jumpToBooking(); }} aria-label="Send a WhatsApp booking enquiry" data-testid="button-whatsapp"><span className="whatsapp-icon">W</span><span>WHATSAPP</span></button>
    {mobileWhatsappNote && <div className="whatsapp-notice" role="status">WhatsApp: “Hi, I'd like to book an appointment at GVS Premium Barbershop.” Number to be provided by GVS.<button onClick={() => setMobileWhatsappNote(false)} aria-label="Dismiss"><X size={14} /></button></div>}

    {currentImage && <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onClick={() => setLightboxIndex(null)} onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={onGalleryTouchEnd} data-testid="gallery-lightbox">
      <button className="lightbox-close" aria-label="Close image viewer" onClick={() => setLightboxIndex(null)}><X /></button>
      <button className="lightbox-arrow lightbox-left" aria-label="Previous image" onClick={event => { event.stopPropagation(); setLightboxIndex(index => index === null ? 0 : (index - 1 + filteredGallery.length) % filteredGallery.length); }}><ArrowLeft /></button>
      <div className="lightbox-content" onClick={event => event.stopPropagation()}>
        {currentImage.type === 'video' ? <video autoPlay muted loop playsInline poster={business.videoPoster} controls><source src={currentImage.src} type="video/mp4" /></video> : <img src={currentImage.src} alt={currentImage.alt} />}
        <div><span>{currentImage.category} / {String((lightboxIndex ?? 0) + 1).padStart(2, '0')}</span><b>{currentImage.title}</b></div>
      </div>
      <button className="lightbox-arrow lightbox-right" aria-label="Next image" onClick={event => { event.stopPropagation(); setLightboxIndex(index => index === null ? 0 : (index + 1) % filteredGallery.length); }}><ArrowRight /></button>
    </div>}
  </main>;
}

export default App;
