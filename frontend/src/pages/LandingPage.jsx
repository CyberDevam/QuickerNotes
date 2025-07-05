import React from 'react';
import '../assets/App.css';
import { Link } from 'react-router-dom';

function LandingPage({mode}) {
  return (
    <div className="App">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}


function HeroSection() {
  return (
    <section className="hero">
      <h1>The simplest way to keep notes</h1>
      <p>Light, clean, and free. NoteSimple is the easiest way to keep notes on all your devices.</p>
      <div className="cta-buttons">
        <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
        <Link to="/learnmore" className="btn btn-secondary">Learn More</Link>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="features" id="features">
      <h2>Why Choose NoteSimple?</h2>
      <div className="features-grid">
        <FeatureCard 
          icon="📱" 
          title="All Your Devices" 
          description="Sync your notes across all your devices, including iPhone, iPad, Android, Mac, Windows, and Linux."
        />
        <FeatureCard 
          icon="⚡" 
          title="Lightning Fast" 
          description="Open instantly and syncs immediately. No waiting, no distractions, just your notes."
        />
        <FeatureCard 
          icon="🔒" 
          title="Private & Secure" 
          description="Your notes are encrypted and private. We don't sell your data or show you ads."
        />
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#contact">Contact</a>
        <a href="#twitter">Twitter</a>
        <a href="#github">GitHub</a>
      </div>
      <p>© {new Date().getFullYear()} QuickerNotes. All rights reserved.</p>
    </footer>
  );
}

export default LandingPage;