import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { clubList, getClubBySlug } from './clubs/index.js';
import CricketScorer from './CricketScorer.jsx';

function ClubHome() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '2rem 1rem',
    }}>
      <div style={{ maxWidth: '28rem', margin: '0 auto', paddingTop: '3rem' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: '#111827',
          marginBottom: '0.75rem',
        }}>
          Cricket Scoring App
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem', fontWeight: 500 }}>
          Choose your club to start scoring
        </p>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {clubList.map((club) => (
            <Link
              key={club.id}
              to={`/${club.slug}`}
              style={{
                display: 'block',
                padding: '1.25rem 1.5rem',
                background: club.colors.black,
                color: 'white',
                borderRadius: '1rem',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              {club.name}
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                opacity: 0.75,
                marginTop: '0.35rem',
              }}>
                /{club.slug}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubApp() {
  const { clubSlug } = useParams();
  const club = getClubBySlug(clubSlug);
  if (!club) {
    return <Navigate to="/" replace />;
  }
  return <CricketScorer key={club.id} club={club} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClubHome />} />
        <Route path="/:clubSlug/*" element={<ClubApp />} />
      </Routes>
    </BrowserRouter>
  );
}
