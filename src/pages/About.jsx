import { Container } from 'react-bootstrap';
import TopNavbar from '../components/TopNavbar';

function About() {
  return (
    <div className="home-v2">
      <TopNavbar />
      <Container className="py-5" style={{ maxWidth: 900 }}>
        <div className="text-center">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            About Voyago
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 540, margin: '0.75rem auto 0', lineHeight: 1.7, fontSize: '1.02rem' }}>
            Voyago takes the stress out of trip planning so you can focus on what matters — the adventure itself. Whether you're a solo explorer or coordinating with a group, we've got you covered.
          </p>
        </div>
      </Container>
    </div>
  );
}

export default About;
