import React from 'react';
import { Link } from 'react-router-dom';

const LearnMore = ({mode}) => {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: '300',
        marginBottom: '30px',
        color: '#3366cc'
      }}>Learn More About QuickerNotes</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        marginBottom: '50px'
      }}>
        <div style={{
          backgroundColor: '#f8f8f8',
          padding: '30px',
          borderRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '15px',
            color: '#3366cc'
          }}>Our Story</h2>
          <p style={{ color: '#666' }}>
            QuickerNotes was founded in 2023 with a simple mission: to create the most intuitive,
            lightweight note-taking app available. Frustrated with bloated alternatives,
            we built an app that focuses on what matters - your notes.
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f8f8',
          padding: '30px',
          borderRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '15px',
            color: '#3366cc'
          }}>How It Works</h2>
          <p style={{ color: '#666' }}>
            Just type and your notes are saved automatically. We sync across all your devices
            instantly. No complicated formatting options, no distractions - just pure note-taking.
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f0f5ff',
        padding: '40px',
        borderRadius: '8px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '300',
          marginBottom: '20px'
        }}>Key Features</h2>
        <ul style={{
          listStyleType: 'none',
          padding: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <li style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>📱 Sync across all devices</li>
          <li style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>⚡ Instant search</li>
          <li style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>🔒 End-to-end encryption</li>
          <li style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>🌎 Available in 10+ languages</li>
          <li style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>💯 100% free forever</li>
          <li style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>📅 Version history</li>
        </ul>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '30px 0'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '300',
          marginBottom: '20px'
        }}>Ready to Get Started?</h2>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '30px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Join millions of users who trust QuickerNotes for their note-taking needs.
        </p>
        <Link to="/register">
          <button style={{
            padding: '12px 30px',
            backgroundColor: '#3366cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Sign Up Free
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LearnMore;