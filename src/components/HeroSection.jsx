import TripSearchCard from './TripSearchCard';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <h1 className="hero-heading">Where to next?</h1>
        <p className="hero-subtitle">
          The best trips aren't about the destination &mdash; they're about who's beside you
        </p>
        <TripSearchCard />
      </div>
    </section>
  );
}

export default HeroSection;