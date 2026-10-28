export default function AxhillesFooter() {
  const year = new Date().getFullYear();

  return (
    <div style={{
      marginTop: '1.75rem',
      textAlign: 'center',
      fontSize: '0.8rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
    }}>
      <span style={{ color: '#6B7280' }}>Brought to you by </span>
      <a
        href="https://axhilles.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#0047AB',
          textDecoration: 'none',
          fontWeight: 800,
        }}
      >
        Axhilles
      </a>
      <span style={{ color: '#9CA3AF' }}> · © {year}</span>
    </div>
  );
}
