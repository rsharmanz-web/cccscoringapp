export default function AxhillesFooter() {
  return (
    <div style={{
      marginTop: '3rem',
      paddingTop: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.65rem',
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#6B7280',
      }}>
        Built by Axhilles
      </div>
      <img
        src="/axhilles-logo.png"
        alt="Axhilles"
        style={{
          width: '72px',
          height: '72px',
          objectFit: 'contain',
          borderRadius: '0.85rem',
          display: 'block',
        }}
      />
    </div>
  );
}
