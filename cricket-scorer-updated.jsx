import React, { useState, useEffect } from 'react';
import { ChevronLeft, BarChart3, Menu, X, Plus, Minus } from 'lucide-react';

const TEAMS = [
  'Super Tigers', 'Raptors', 'Hammerheads', 'Wolfpack', 'Vipers',
  'Striking Cobras', 'Grizzlies', 'Manta Rays', 'Mighty Eagles', 'CZ'
];

const DRAW_DATA = {
  rounds: [
    {
      date: 'Friday, 7 November 2024',
      startTime: '6:00 PM',
      fixtures: [
        { pitch: 11, team1: 'Super Tigers', team2: 'Hammerheads' },
        { pitch: 13, team1: 'Mighty Eagles', team2: 'Raptors' },
        { pitch: 15, team1: 'Manta Rays', team2: 'Vipers' },
        { pitch: 17, team1: 'Grizzlies', team2: 'Wolfpack' },
        { pitch: null, team1: 'Striking Cobras', team2: 'bye' }
      ]
    }
  ]
};

const COLORS = {
  primary: '#10B981',
  secondary: '#EF4444',
  accent: '#8B5CF6',
  black: '#111827',
  gray: '#6B7280'
};

export default function CricketScorer() {
  const [screen, setScreen] = useState('welcome');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const [mode, setMode] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  
  const [battingOrder, setBattingOrder] = useState(['']);
  const [currentBatsmen, setCurrentBatsmen] = useState([null, null]);
  const [striker, setStriker] = useState(0);
  const [batStats, setBatStats] = useState({});
  const [batOuts, setBatOuts] = useState({});
  const [totalRuns, setTotalRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [extras, setExtras] = useState(0);
  const [showExtrasMenu, setShowExtrasMenu] = useState(false);
  const [showEndInningsConfirm, setShowEndInningsConfirm] = useState(false);
  const [showNewPartnershipConfirm, setShowNewPartnershipConfirm] = useState(false);
  const [battingOverHistory, setBattingOverHistory] = useState([]);
  const [showEndOverConfirm, setShowEndOverConfirm] = useState(false);
  
  const [currentBowler, setCurrentBowler] = useState('');
  const [currentOver, setCurrentOver] = useState([]);
  const [bowlerStats, setBowlerStats] = useState({});
  const [overNumber, setOverNumber] = useState(1);
  const [showWideMenu, setShowWideMenu] = useState(false);
  const [showBowlingEndOverConfirm, setShowBowlingEndOverConfirm] = useState(false);
  
  const [innings1Complete, setInnings1Complete] = useState(false);
  const [innings1Data, setInnings1Data] = useState(null);
  const [innings2Complete, setInnings2Complete] = useState(false);
  const [innings2Data, setInnings2Data] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const goBack = () => {
    if (screen === 'draw') setScreen('welcome');
    else if (screen === 'draw-fixtures') { setScreen('draw'); setSelectedRound(null); }
    else if (screen === 'setup') setScreen('welcome');
    else if (screen === 'team-select') setScreen('setup');
    else if (screen === 'mode-select') setScreen('team-select');
    else if (screen === 'batting-order') setScreen('mode-select');
    else if (screen === 'select-batsmen') setScreen('batting-order');
    else if (screen === 'batting-score') setScreen('select-batsmen');
    else if (screen === 'select-bowler') setScreen('mode-select');
    else if (screen === 'bowling-score') setScreen('select-bowler');
    else if (screen === 'batting-summary' || screen === 'bowling-summary') {
      if (mode === 'batting') setScreen('batting-score');
      else setScreen('bowling-score');
    }
    else if (screen === 'confirm-innings') {
      if (mode === 'batting') setScreen('batting-summary');
      else setScreen('bowling-summary');
    }
  };

  const selectBatsman = (position, name) => {
    const newBatsmen = [...currentBatsmen];
    newBatsmen[position] = name;
    setCurrentBatsmen(newBatsmen);
    if (!batStats[name]) {
      setBatStats({ ...batStats, [name]: { runs: 0, balls: 0 } });
      setBatOuts({ ...batOuts, [name]: 0 });
    }
  };

  const recordBattingBall = (runs) => {
    const batsmanName = currentBatsmen[striker];
    setBattingOverHistory([...battingOverHistory, runs]);
    
    if (runs === 'Out') {
      const newStats = { ...batStats };
      newStats[batsmanName].runs -= 3;
      newStats[batsmanName].balls += 1;
      setBatStats(newStats);
      
      const newOuts = { ...batOuts };
      newOuts[batsmanName] = (newOuts[batsmanName] || 0) + 1;
      setBatOuts(newOuts);
      
      setTotalRuns(totalRuns - 3);
      setWickets(wickets + 1);
    } else {
      const runsNum = parseInt(runs);
      const newStats = { ...batStats };
      newStats[batsmanName].runs += runsNum;
      newStats[batsmanName].balls += 1;
      setBatStats(newStats);
      setTotalRuns(totalRuns + runsNum);
      if (runsNum % 2 === 1) setStriker(striker === 0 ? 1 : 0);
    }
  };

  const undoBattingBall = () => {
    if (battingOverHistory.length === 0) return;
    const lastBall = battingOverHistory[battingOverHistory.length - 1];
    setBattingOverHistory(battingOverHistory.slice(0, -1));
    const batsmanName = currentBatsmen[striker];
    
    if (lastBall === 'Out') {
      const newStats = { ...batStats };
      newStats[batsmanName].runs += 3;
      newStats[batsmanName].balls -= 1;
      setBatStats(newStats);
      setBatOuts({ ...batOuts, [batsmanName]: Math.max(0, (batOuts[batsmanName] || 0) - 1) });
      setTotalRuns(totalRuns + 3);
      setWickets(wickets - 1);
    } else {
      const runsNum = parseInt(lastBall);
      const newStats = { ...batStats };
      newStats[batsmanName].runs -= runsNum;
      newStats[batsmanName].balls -= 1;
      setBatStats(newStats);
      setTotalRuns(totalRuns - runsNum);
      if (runsNum % 2 === 1) setStriker(striker === 0 ? 1 : 0);
    }
  };

  const endBattingOver = () => {
    setBattingOverHistory([...battingOverHistory, 'END_OVER']);
  };

  const recordBowlingBall = (result) => {
    if (currentOver.length >= 8) return;
    const newOver = [...currentOver, result];
    setCurrentOver(newOver);
    
    const newStats = { ...bowlerStats };
    if (!newStats[currentBowler]) {
      newStats[currentBowler] = { overs: 0, runs: 0, wickets: 0, wides: 0 };
    }
    
    let runsToAdd = 0;
    if (result === 'Wide') {
      runsToAdd = 2;
      newStats[currentBowler].wides += 1;
    } else if (result.startsWith('W+')) {
      const extraRuns = parseInt(result.substring(2));
      runsToAdd = 2 + extraRuns;
      newStats[currentBowler].wides += 1;
    } else if (result === 'Out') {
      newStats[currentBowler].wickets += 1;
      setWickets(wickets + 1);
      runsToAdd = -3;
    } else {
      runsToAdd = parseInt(result);
    }
    
    newStats[currentBowler].runs += runsToAdd;
    setTotalRuns(totalRuns + runsToAdd);
    setBowlerStats(newStats);
  };

  const completeOver = () => {
    const validBalls = currentOver.filter(b => !b.startsWith('W') && b !== 'Wide').length;
    const newStats = { ...bowlerStats };
    newStats[currentBowler].overs += validBalls / 6;
    setBowlerStats(newStats);
    setOverNumber(overNumber + 1);
    setScreen('select-bowler');
  };

  const removeBall = () => {
    if (currentOver.length === 0) return;
    const lastBall = currentOver[currentOver.length - 1];
    setCurrentOver(currentOver.slice(0, -1));
    
    const newStats = { ...bowlerStats };
    let runsToRemove = 0;
    
    if (lastBall === 'Wide') {
      newStats[currentBowler].wides -= 1;
      runsToRemove = 2;
    } else if (lastBall.startsWith('W+')) {
      newStats[currentBowler].wides -= 1;
      const extraRuns = parseInt(lastBall.substring(2));
      runsToRemove = 2 + extraRuns;
    } else if (lastBall === 'Out') {
      newStats[currentBowler].wickets -= 1;
      setWickets(wickets - 1);
      runsToRemove = -3;
    } else {
      runsToRemove = parseInt(lastBall);
    }
    
    newStats[currentBowler].runs -= runsToRemove;
    setTotalRuns(totalRuns - runsToRemove);
    setBowlerStats(newStats);
  };

  const confirmInnings = () => {
    const inningsData = {
      team: myTeam, mode, totalRuns, wickets, extras,
      batStats, batOuts, bowlerStats, overs: overNumber - 1
    };
    
    if (!innings1Complete) {
      setInnings1Data(inningsData);
      setInnings1Complete(true);
      setBatStats({}); setBatOuts({}); setTotalRuns(0); setWickets(0);
      setExtras(0); setBowlerStats({}); setOverNumber(1);
      setCurrentBatsmen([null, null]); setStriker(0);
      setBattingOrder(['']); setCurrentBowler(''); setCurrentOver([]);
      setBattingOverHistory([]); setMode(''); setScreen('mode-select');
    } else {
      setInnings2Data(inningsData);
      setInnings2Complete(true);
      setScreen('match-summary');
    }
  };

  const exportToCSV = () => {
    let csv = "Cornwall Cricket Club - Jr Cricket Match Report\n\n";
    csv += `Date,${matchDate}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCC-Match-${matchDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert('Match data downloaded! Email to rahul@cornwallcricket.co.nz');
  };

  const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
    if (!show) return null;
    return (
      <div style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '1.5rem',
          padding: '2rem', maxWidth: '24rem', width: '100%'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.75rem', 
            color: COLORS.black, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            {title}
          </h3>
          <p style={{ color: COLORS.gray, marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {message}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button onClick={onClose} style={{
              padding: '1rem', backgroundColor: '#E5E7EB', color: COLORS.black,
              border: 'none', borderRadius: '3rem', fontSize: '0.875rem',
              fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase'
            }}>Cancel</button>
            <button onClick={() => { onClose(); onConfirm(); }} style={{
              padding: '1rem', backgroundColor: COLORS.black, color: 'white',
              border: 'none', borderRadius: '3rem', fontSize: '0.875rem',
              fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase'
            }}>Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, sans-serif',
      minHeight: '100vh', backgroundColor: '#F9FAFB'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: COLORS.black, padding: '1.5rem 1rem',
        position: 'sticky', top: 0, zIndex: 40
      }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto', display: 'flex', 
          alignItems: 'center', justifyContent: 'space-between' }}>
          {screen !== 'welcome' && screen !== 'innings1-review' && screen !== 'innings2-review' && (
            <button onClick={goBack} style={{ background: 'none', border: 'none', 
              color: 'white', cursor: 'pointer', padding: '0.5rem' }}>
              <ChevronLeft size={28} />
            </button>
          )}
          {(screen === 'welcome' || screen === 'innings1-review' || screen === 'innings2-review') && 
            <div style={{ width: '2rem' }}></div>}
          
          <h1 style={{ 
            color: 'white', fontSize: '1rem', fontWeight: '800',
            letterSpacing: '0.5px', textTransform: 'uppercase',
            flex: 1, textAlign: 'center'
          }}>CCC Score Centre</h1>
          
          {(screen === 'batting-score' || screen === 'bowling-score') && (
            <button 
              onClick={() => setScreen(mode === 'batting' ? 'batting-summary' : 'bowling-summary')}
              style={{ background: 'none', border: 'none', color: 'white', 
                cursor: 'pointer', padding: '0.5rem' }}
            >
              <BarChart3 size={24} />
            </button>
          )}
          {(innings1Complete || innings2Complete) && screen !== 'welcome' && 
            screen !== 'batting-score' && screen !== 'bowling-score' && (
            <button onClick={() => setShowMenu(!showMenu)}
              style={{ background: 'none', border: 'none', color: 'white', 
                cursor: 'pointer', padding: '0.5rem' }}
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          {screen !== 'batting-score' && screen !== 'bowling-score' && 
            !innings1Complete && !innings2Complete && screen !== 'welcome' && 
            <div style={{ width: '2rem' }}></div>}
        </div>
      </div>

      {/* Menu Dropdown */}
      {showMenu && (innings1Complete || innings2Complete) && (
        <div style={{
          position: 'absolute', top: '5rem', right: '1rem',
          backgroundColor: 'white', borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          zIndex: 50, width: '16rem', overflow: 'hidden'
        }}>
          {innings1Complete && innings2Complete && (
            <button onClick={() => { setScreen('match-summary'); setShowMenu(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: '1.25rem',
                background: 'none', border: 'none',
                borderBottom: '1px solid #E5E7EB', cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: '700', color: COLORS.black }}>MATCH SUMMARY</div>
              <div style={{ fontSize: '0.75rem', color: COLORS.gray, marginTop: '0.25rem' }}>
                Complete overview
              </div>
            </button>
          )}
          {innings1Complete && (
            <button onClick={() => { setScreen('innings1-review'); setShowMenu(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: '1.25rem',
                background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: '700', color: COLORS.black }}>1ST INNINGS</div>
              <div style={{ fontSize: '0.85rem', color: COLORS.gray, marginTop: '0.25rem' }}>
                {innings1Data.team}: {innings1Data.totalRuns}/{innings1Data.wickets}
              </div>
            </button>
          )}
          {innings2Complete && (
            <button onClick={() => { setScreen('innings2-review'); setShowMenu(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: '1.25rem',
                background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: '700', color: COLORS.black }}>2ND INNINGS</div>
              <div style={{ fontSize: '0.85rem', color: COLORS.gray, marginTop: '0.25rem' }}>
                {innings2Data.team}: {innings2Data.totalRuns}/{innings2Data.wickets}
              </div>
            </button>
          )}
        </div>
      )}

      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '1.5rem 1rem', paddingBottom: '3rem' }}>
        {/* Welcome Screen */}
        {screen === 'welcome' && (
          <div style={{ paddingTop: '3rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h1 style={{
                fontSize: '2.5rem', fontWeight: '900', lineHeight: '1.1',
                color: COLORS.black, marginBottom: '1rem', letterSpacing: '-0.03em'
              }}>
                Cornwall Cricket Club<br/>Score Centre
              </h1>
              <p style={{ fontSize: '1rem', color: COLORS.gray, fontWeight: '500' }}>
                Keeping the scoreboard ticking over since '25
              </p>
            </div>
            
            <button onClick={() => setScreen('setup')} style={{
              width: '100%', backgroundColor: COLORS.black, color: 'white',
              padding: '1.25rem', borderRadius: '3rem', border: 'none',
              fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px',
              cursor: 'pointer', marginBottom: '1rem', textTransform: 'uppercase'
            }}>Start Match</button>

            <button onClick={() => setScreen('draw')} style={{
              width: '100%', backgroundColor: 'white', color: COLORS.black,
              padding: '1.25rem', borderRadius: '3rem',
              border: `2px solid ${COLORS.black}`, fontSize: '1rem',
              fontWeight: '800', letterSpacing: '0.5px',
              cursor: 'pointer', textTransform: 'uppercase'
            }}>View Draw</button>
          </div>
        )}

        {/* Setup Screen */}
        {screen === 'setup' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>MATCH SETUP</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', 
                fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', 
                color: COLORS.gray }}>Date</label>
              <input type="date" value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                style={{
                  width: '100%', padding: '1rem', border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700',
                fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                color: COLORS.gray }}>Team 1</label>
              <select value={team1} onChange={(e) => setTeam1(e.target.value)}
                style={{
                  width: '100%', padding: '1rem', border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                }}
              >
                <option value="">Select Team</option>
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700',
                fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                color: COLORS.gray }}>Team 2</label>
              <select value={team2} onChange={(e) => setTeam2(e.target.value)}
                style={{
                  width: '100%', padding: '1rem', border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                }}
              >
                <option value="">Select Team</option>
                {TEAMS.filter(t => t !== team1).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <button
              onClick={() => { if (team1 && team2 && team1 !== team2) setScreen('team-select'); }}
              disabled={!team1 || !team2}
              style={{
                width: '100%',
                backgroundColor: team1 && team2 ? COLORS.black : '#E5E7EB',
                color: team1 && team2 ? 'white' : COLORS.gray,
                padding: '1.25rem', borderRadius: '3rem', border: 'none',
                fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px',
                cursor: team1 && team2 ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase'
              }}
            >Continue</button>
          </div>
        )}

        {/* Team Selection */}
        {screen === 'team-select' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '1rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>SELECT YOUR<br/>TEAM</h2>
            <p style={{ color: COLORS.gray, marginBottom: '2rem', fontSize: '1rem' }}>
              Choose which team you're scoring for
            </p>
            
            <button onClick={() => { setMyTeam(team1); setScreen('mode-select'); }}
              style={{
                width: '100%', backgroundColor: COLORS.primary, color: 'white',
                padding: '1.5rem', borderRadius: '1rem', border: 'none',
                fontSize: '1.25rem', fontWeight: '800', cursor: 'pointer',
                marginBottom: '1rem', letterSpacing: '-0.01em'
              }}
            >{team1}</button>
            
            <button onClick={() => { setMyTeam(team2); setScreen('mode-select'); }}
              style={{
                width: '100%', backgroundColor: COLORS.secondary, color: 'white',
                padding: '1.5rem', borderRadius: '1rem', border: 'none',
                fontSize: '1.25rem', fontWeight: '800', cursor: 'pointer',
                letterSpacing: '-0.01em'
              }}
            >{team2}</button>
          </div>
        )}

        {/* Mode Selection */}
        {screen === 'mode-select' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '0.5rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>{myTeam}</h2>
            <p style={{ color: COLORS.gray, marginBottom: '2rem', fontSize: '1rem', fontWeight: '600' }}>
              Are you batting or bowling?
            </p>
            
            <button onClick={() => { setMode('batting'); setScreen('batting-order'); }}
              style={{
                width: '100%', backgroundColor: COLORS.primary, color: 'white',
                padding: '1.5rem', borderRadius: '1rem', border: 'none',
                fontSize: '1.25rem', fontWeight: '800', cursor: 'pointer',
                marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}
            >Batting</button>
            
            <button onClick={() => { setMode('bowling'); setScreen('select-bowler'); }}
              style={{
                width: '100%', backgroundColor: COLORS.secondary, color: 'white',
                padding: '1.5rem', borderRadius: '1rem', border: 'none',
                fontSize: '1.25rem', fontWeight: '800', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}
            >Bowling</button>
          </div>
        )}

        {/* Batting Order */}
        {screen === 'batting-order' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>BATTING ORDER</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              {battingOrder.map((batter, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '2.5rem', height: '2.5rem', backgroundColor: COLORS.black,
                    color: 'white', borderRadius: '50%', fontWeight: '800', fontSize: '1rem'
                  }}>{idx + 1}</span>
                  <input type="text" value={batter}
                    onChange={(e) => {
                      const newOrder = [...battingOrder];
                      newOrder[idx] = e.target.value;
                      setBattingOrder(newOrder);
                    }}
                    placeholder="Player name"
                    style={{
                      flex: 1, padding: '1rem', border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                    }}
                  />
                  {battingOrder.length > 1 && (
                    <button
                      onClick={() => {
                        if (battingOrder.length > 1) {
                          setBattingOrder(battingOrder.filter((_, i) => i !== idx));
                        }
                      }}
                      style={{
                        padding: '0.75rem', backgroundColor: COLORS.secondary,
                        color: 'white', border: 'none', borderRadius: '0.75rem',
                        cursor: 'pointer'
                      }}
                    ><Minus size={20} /></button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => setBattingOrder([...battingOrder, ''])}
              style={{
                width: '100%', padding: '1rem', border: '2px dashed #E5E7EB',
                borderRadius: '0.75rem', backgroundColor: 'transparent',
                color: COLORS.gray, fontSize: '0.95rem', fontWeight: '700',
                cursor: 'pointer', marginBottom: '2rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}
            >
              <Plus size={20} /> Add Player
            </button>

            <button
              onClick={() => {
                const validBatters = battingOrder.filter(b => b.trim());
                if (validBatters.length >= 2) {
                  setBattingOrder(validBatters);
                  setScreen('select-batsmen');
                }
              }}
              disabled={battingOrder.filter(b => b.trim()).length < 2}
              style={{
                width: '100%',
                backgroundColor: battingOrder.filter(b => b.trim()).length >= 2 ? COLORS.black : '#E5E7EB',
                color: battingOrder.filter(b => b.trim()).length >= 2 ? 'white' : COLORS.gray,
                padding: '1.25rem', borderRadius: '3rem', border: 'none',
                fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px',
                cursor: battingOrder.filter(b => b.trim()).length >= 2 ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase'
              }}
            >Continue</button>
          </div>
        )}

        {/* Select Batsmen */}
        {screen === 'select-batsmen' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>SELECT<br/>PARTNERSHIP</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700',
                fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                color: COLORS.gray }}>Batsman 1</label>
              <select value={currentBatsmen[0] || ''}
                onChange={(e) => selectBatsman(0, e.target.value)}
                style={{
                  width: '100%', padding: '1rem', border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                }}
              >
                <option value="">Select batsman</option>
                {battingOrder.map(b => (
                  <option key={b} value={b} disabled={b === currentBatsmen[1]}>{b}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700',
                fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                color: COLORS.gray }}>Batsman 2</label>
              <select value={currentBatsmen[1] || ''}
                onChange={(e) => selectBatsman(1, e.target.value)}
                style={{
                  width: '100%', padding: '1rem', border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                }}
              >
                <option value="">Select batsman</option>
                {battingOrder.map(b => (
                  <option key={b} value={b} disabled={b === currentBatsmen[0]}>{b}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (currentBatsmen[0] && currentBatsmen[1]) setScreen('batting-score');
              }}
              disabled={!currentBatsmen[0] || !currentBatsmen[1]}
              style={{
                width: '100%',
                backgroundColor: currentBatsmen[0] && currentBatsmen[1] ? COLORS.black : '#E5E7EB',
                color: currentBatsmen[0] && currentBatsmen[1] ? 'white' : COLORS.gray,
                padding: '1.25rem', borderRadius: '3rem', border: 'none',
                fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px',
                cursor: currentBatsmen[0] && currentBatsmen[1] ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase'
              }}
            >Start Batting</button>
          </div>
        )}

        {/* Batting Score Screen */}
        {screen === 'batting-score' && (
          <div style={{ paddingTop: '1rem' }}>
            {/* Score Display */}
            <div style={{
              backgroundColor: COLORS.black, borderRadius: '1.5rem',
              padding: '2rem', marginBottom: '1.5rem', textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4.5rem', fontWeight: '900', color: 'white',
                lineHeight: '1', marginBottom: '0.5rem', letterSpacing: '-0.03em'
              }}>
                {totalRuns}<span style={{ color: COLORS.gray, fontSize: '3rem' }}>/{wickets}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: COLORS.gray, 
                textTransform: 'uppercase', letterSpacing: '1px' }}>
                {myTeam}
              </div>
              {extras > 0 && (
                <div style={{ fontSize: '0.875rem', color: COLORS.gray, marginTop: '0.5rem' }}>
                  Extras: {extras}
                </div>
              )}
            </div>

            {/* Current Partnership */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem',
                textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray }}>
                Current Partnership
              </h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {currentBatsmen.map((name, idx) => (
                  <div key={idx} style={{
                    flex: 1, padding: '1.25rem',
                    backgroundColor: striker === idx ? COLORS.black : 'white',
                    color: striker === idx ? 'white' : COLORS.black,
                    borderRadius: '1rem',
                    border: striker === idx ? 'none' : '2px solid #E5E7EB'
                  }}>
                    <div style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>
                      {batStats[name]?.runs || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                      {batStats[name]?.balls || 0} balls
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStriker(striker === 0 ? 1 : 0)}
                style={{
                  width: '100%', marginTop: '0.75rem', padding: '0.875rem',
                  backgroundColor: COLORS.accent, color: 'white', border: 'none',
                  borderRadius: '3rem', fontSize: '0.875rem', fontWeight: '800',
                  cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
              >Switch Striker</button>
            </div>

            {/* Partnership History */}
            {battingOverHistory.length > 0 && (
              <div style={{
                backgroundColor: 'white', padding: '1.25rem',
                borderRadius: '1rem', marginBottom: '1.5rem', border: '2px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray }}>
                  Partnership
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {battingOverHistory.map((ball, idx) => (
                    <div key={idx} style={{
                      width: ball === 'END_OVER' ? '2.5rem' : '2.5rem',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      backgroundColor: ball === 'END_OVER' ? COLORS.black :
                                     ball === 'Out' ? COLORS.secondary : 
                                     ball === '4' || ball === '6' ? COLORS.primary : '#F3F4F6',
                      color: ball === 'END_OVER' || ball === 'Out' || ball === '4' || ball === '6' ? 'white' : COLORS.black
                    }}>
                      {ball === 'END_OVER' ? '' : ball}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scoring Buttons */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem',
                textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray }}>
                Record Ball
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '0.75rem', marginBottom: '0.75rem' }}>
                {['0', '1', '2', '3', '4', '5', '6'].map(score => (
                  <button key={score} onClick={() => recordBattingBall(score)}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: score === '4' || score === '6' ? COLORS.primary : 'white',
                      color: score === '4' || score === '6' ? 'white' : COLORS.black,
                      border: score === '4' || score === '6' ? 'none' : '2px solid #E5E7EB',
                      borderRadius: '1rem', fontSize: '1.5rem', fontWeight: '900',
                      cursor: 'pointer'
                    }}
                  >{score}</button>
                ))}
                <button onClick={() => recordBattingBall('Out')}
                  style={{
                    aspectRatio: '1', backgroundColor: COLORS.secondary,
                    color: 'white', border: 'none', borderRadius: '1rem',
                    fontSize: '1rem', fontWeight: '900', cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}
                >OUT</button>
              </div>

              {/* Extras, Undo & End Over */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <button onClick={() => setShowExtrasMenu(!showExtrasMenu)}
                  style={{
                    padding: '1rem', backgroundColor: '#FCD34D', color: COLORS.black,
                    border: 'none', borderRadius: '3rem', fontSize: '0.875rem',
                    fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >{showExtrasMenu ? 'Close' : 'Extras'}</button>
                {battingOverHistory.length > 0 && (
                  <button onClick={undoBattingBall}
                    style={{
                      padding: '1rem', backgroundColor: '#6B7280', color: 'white',
                      border: 'none', borderRadius: '3rem', fontSize: '0.875rem',
                      fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >Undo</button>
                )}
                <button onClick={() => setShowEndOverConfirm(true)}
                  style={{
                    padding: '1rem', backgroundColor: COLORS.accent, color: 'white',
                    border: 'none', borderRadius: '3rem', fontSize: '0.875rem',
                    fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >End Over</button>
              </div>

              {showExtrasMenu && (
                <div style={{
                  marginTop: '0.75rem', padding: '1.25rem', backgroundColor: '#FEF3C7',
                  borderRadius: '1rem', border: '2px solid #FCD34D'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Wide Value
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                    {['2', '3', '4', '5', '6'].map(wide => (
                      <button key={wide}
                        onClick={() => {
                          setExtras(extras + parseInt(wide));
                          setTotalRuns(totalRuns + parseInt(wide));
                          setShowExtrasMenu(false);
                        }}
                        style={{
                          padding: '0.875rem', backgroundColor: '#FCD34D',
                          color: COLORS.black, border: 'none', borderRadius: '0.75rem',
                          fontSize: '1.25rem', fontWeight: '900', cursor: 'pointer'
                        }}
                      >{wide}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button onClick={() => setShowNewPartnershipConfirm(true)}
                style={{
                  padding: '1.25rem', backgroundColor: 'white', color: COLORS.black,
                  border: '2px solid #E5E7EB', borderRadius: '3rem',
                  fontSize: '0.875rem', fontWeight: '800', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
              >New Partnership</button>
              <button onClick={() => setShowEndInningsConfirm(true)}
                style={{
                  padding: '1.25rem', backgroundColor: COLORS.black, color: 'white',
                  border: 'none', borderRadius: '3rem', fontSize: '0.875rem',
                  fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >End Innings</button>
            </div>

            <ConfirmModal
              show={showNewPartnershipConfirm}
              onClose={() => setShowNewPartnershipConfirm(false)}
              onConfirm={() => {
                setCurrentBatsmen([null, null]);
                setStriker(0);
                setBattingOverHistory([]);
                setScreen('select-batsmen');
              }}
              title="NEW PARTNERSHIP?"
              message="Start a new partnership? You'll select the next pair of batsmen."
            />

            <ConfirmModal
              show={showEndInningsConfirm}
              onClose={() => setShowEndInningsConfirm(false)}
              onConfirm={() => setScreen('confirm-innings')}
              title="END INNINGS?"
              message="End this innings? This will take you to the innings summary."
            />

            <ConfirmModal
              show={showEndOverConfirm}
              onClose={() => setShowEndOverConfirm(false)}
              onConfirm={() => {
                endBattingOver();
                setShowEndOverConfirm(false);
              }}
              title="END OVER?"
              message="Mark the end of this over in the partnership summary?"
            />
          </div>
        )}

        {/* Select Bowler Screen */}
        {screen === 'select-bowler' && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{
              backgroundColor: COLORS.black, borderRadius: '1.5rem',
              padding: '2rem', marginBottom: '1.5rem', textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4.5rem', fontWeight: '900', color: 'white',
                lineHeight: '1', marginBottom: '0.5rem', letterSpacing: '-0.03em'
              }}>
                {totalRuns}<span style={{ color: COLORS.gray, fontSize: '3rem' }}>/{wickets}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: COLORS.gray,
                textTransform: 'uppercase', letterSpacing: '1px' }}>
                {myTeam === team1 ? team2 : team1}
              </div>
              <div style={{ fontSize: '0.75rem', color: COLORS.gray, marginTop: '0.5rem' }}>
                Over {overNumber}
              </div>
            </div>

            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>SELECT BOWLER</h2>

            <input type="text" value={currentBowler}
              onChange={(e) => setCurrentBowler(e.target.value)}
              placeholder="Enter bowler name"
              style={{
                width: '100%', padding: '1rem', border: '2px solid #E5E7EB',
                borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600',
                marginBottom: '2rem'
              }}
            />

            <button
              onClick={() => {
                if (currentBowler.trim()) {
                  setCurrentOver([]);
                  setScreen('bowling-score');
                }
              }}
              disabled={!currentBowler.trim()}
              style={{
                width: '100%',
                backgroundColor: currentBowler.trim() ? COLORS.black : '#E5E7EB',
                color: currentBowler.trim() ? 'white' : COLORS.gray,
                padding: '1.25rem', borderRadius: '3rem', border: 'none',
                fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px',
                cursor: currentBowler.trim() ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase', marginBottom: '2rem'
              }}
            >Start Over</button>

            {/* Bowler Stats */}
            {Object.keys(bowlerStats).length > 0 && (
              <div style={{
                backgroundColor: 'white', padding: '1.25rem',
                borderRadius: '1rem', border: '2px solid #E5E7EB'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem',
                  textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray }}>
                  Bowling Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(bowlerStats).map(([name, stats]) => (
                    <div key={name} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontWeight: '700' }}>{name}</div>
                      <div style={{ fontSize: '0.875rem', color: COLORS.gray }}>
                        {stats.overs.toFixed(1)}ov {stats.runs}r {stats.wickets}w {stats.wides}wd
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bowling Score Screen */}
        {screen === 'bowling-score' && (
          <div style={{ paddingTop: '1rem' }}>
            {/* Score Display */}
            <div style={{
              backgroundColor: COLORS.black, borderRadius: '1.5rem',
              padding: '2rem', marginBottom: '1.5rem', textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4.5rem', fontWeight: '900', color: 'white',
                lineHeight: '1', marginBottom: '0.5rem', letterSpacing: '-0.03em'
              }}>
                {totalRuns}<span style={{ color: COLORS.gray, fontSize: '3rem' }}>/{wickets}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: COLORS.gray,
                textTransform: 'uppercase', letterSpacing: '1px' }}>
                {myTeam === team1 ? team2 : team1}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginTop: '1rem' }}>
                {currentBowler}
              </div>
              <div style={{ fontSize: '0.75rem', color: COLORS.gray, marginTop: '0.5rem' }}>
                Over {overNumber}
              </div>
            </div>

            {/* Current Over */}
            <div style={{
              backgroundColor: 'white', padding: '1.25rem',
              borderRadius: '1rem', marginBottom: '1.5rem', border: '2px solid #E5E7EB'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1rem'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '800',
                  textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray }}>
                  This Over
                </h3>
                <span style={{ fontSize: '0.875rem', color: COLORS.gray }}>
                  {currentOver.length}/8 balls
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '3rem' }}>
                {currentOver.map((ball, idx) => (
                  <div key={idx} style={{
                    padding: '0 0.75rem', height: '2.5rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    borderRadius: '9999px', fontWeight: '800', fontSize: '0.95rem',
                    backgroundColor: ball === 'Out' ? COLORS.secondary :
                                   ball.startsWith('W') || ball === 'Wide' ? '#FCD34D' :
                                   ball === '4' || ball === '6' ? COLORS.primary : '#F3F4F6',
                    color: ball === 'Out' || ball === '4' || ball === '6' ? 'white' : COLORS.black
                  }}>
                    {ball === 'Wide' ? 'Wd' : ball}
                  </div>
                ))}
              </div>
              {currentOver.length > 0 && (
                <button onClick={removeBall}
                  style={{
                    width: '100%', marginTop: '1rem', padding: '0.875rem',
                    backgroundColor: '#6B7280', color: 'white', border: 'none',
                    borderRadius: '3rem', fontSize: '0.875rem', fontWeight: '800',
                    cursor: 'pointer', textTransform: 'uppercase'
                  }}
                >Undo Last Ball</button>
              )}
            </div>

            {/* Scoring Buttons */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem',
                textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray }}>
                Record Ball
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem', marginBottom: '0.75rem' }}>
                {['0', '1', '2', '3', '4', '5', '6'].map(score => (
                  <button key={score}
                    onClick={() => recordBowlingBall(score)}
                    disabled={currentOver.length >= 8}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: score === '4' || score === '6' ? COLORS.primary : 'white',
                      color: score === '4' || score === '6' ? 'white' : COLORS.black,
                      border: score === '4' || score === '6' ? 'none' : '2px solid #E5E7EB',
                      borderRadius: '1rem', fontSize: '1.5rem', fontWeight: '900',
                      cursor: currentOver.length < 8 ? 'pointer' : 'not-allowed',
                      opacity: currentOver.length >= 8 ? 0.5 : 1
                    }}
                  >{score}</button>
                ))}
                <button onClick={() => recordBowlingBall('Out')}
                  disabled={currentOver.length >= 8}
                  style={{
                    aspectRatio: '1', backgroundColor: COLORS.secondary,
                    color: 'white', border: 'none', borderRadius: '1rem',
                    fontSize: '1rem', fontWeight: '900',
                    cursor: currentOver.length < 8 ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    opacity: currentOver.length >= 8 ? 0.5 : 1
                  }}
                >OUT</button>
              </div>

              {/* Wides Button */}
              <button onClick={() => setShowWideMenu(!showWideMenu)}
                disabled={currentOver.length >= 8}
                style={{
                  width: '100%', padding: '1rem', backgroundColor: '#FCD34D',
                  color: COLORS.black, border: 'none', borderRadius: '3rem',
                  fontSize: '0.875rem', fontWeight: '800',
                  cursor: currentOver.length < 8 ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  opacity: currentOver.length >= 8 ? 0.5 : 1
                }}
              >{showWideMenu ? 'Close Wides' : 'Wides'}</button>

              {showWideMenu && (
                <div style={{
                  marginTop: '0.75rem', padding: '1.25rem', backgroundColor: '#FEF3C7',
                  borderRadius: '1rem', border: '2px solid #FCD34D'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Wide Type
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                    <button
                      onClick={() => { recordBowlingBall('Wide'); setShowWideMenu(false); }}
                      disabled={currentOver.length >= 8}
                      style={{
                        padding: '0.875rem 0', backgroundColor: '#FCD34D',
                        color: COLORS.black, border: 'none', borderRadius: '0.75rem',
                        fontSize: '0.875rem', fontWeight: '900', cursor: 'pointer'
                      }}
                    >W<br/><span style={{ fontSize: '0.625rem' }}>(2)</span></button>
                    {['1', '2', '3', '4'].map(extra => (
                      <button key={extra}
                        onClick={() => { recordBowlingBall(`W+${extra}`); setShowWideMenu(false); }}
                        disabled={currentOver.length >= 8}
                        style={{
                          padding: '0.875rem 0', backgroundColor: '#FCD34D',
                          color: COLORS.black, border: 'none', borderRadius: '0.75rem',
                          fontSize: '0.875rem', fontWeight: '900', cursor: 'pointer'
                        }}
                      >W+{extra}<br/><span style={{ fontSize: '0.625rem' }}>({parseInt(extra) + 2})</span></button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => setShowBowlingEndOverConfirm(true)}
                disabled={currentOver.length === 0}
                style={{
                  width: '100%', padding: '1.25rem',
                  backgroundColor: currentOver.length > 0 ? COLORS.accent : '#E5E7EB',
                  color: 'white', border: 'none', borderRadius: '3rem',
                  fontSize: '0.875rem', fontWeight: '800',
                  cursor: currentOver.length > 0 ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
              >Complete Over</button>

              <button onClick={() => setShowEndInningsConfirm(true)}
                style={{
                  width: '100%', padding: '1.25rem', backgroundColor: COLORS.black,
                  color: 'white', border: 'none', borderRadius: '3rem',
                  fontSize: '0.875rem', fontWeight: '800', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
              >End Innings</button>
            </div>

            <ConfirmModal
              show={showBowlingEndOverConfirm}
              onClose={() => setShowBowlingEndOverConfirm(false)}
              onConfirm={completeOver}
              title="COMPLETE OVER?"
              message="Complete this over? You'll select a new bowler next."
            />

            <ConfirmModal
              show={showEndInningsConfirm}
              onClose={() => setShowEndInningsConfirm(false)}
              onConfirm={() => setScreen('confirm-innings')}
              title="END INNINGS?"
              message="End this innings? This will take you to the innings summary."
            />
          </div>
        )}

        {/* Draw Screen */}
        {screen === 'draw' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>COMPETITION<br/>DRAW</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DRAW_DATA.rounds.map((round, idx) => (
                <button key={idx}
                  onClick={() => { setSelectedRound(round); setScreen('draw-fixtures'); }}
                  style={{
                    width: '100%', padding: '1.5rem', backgroundColor: 'white',
                    border: '2px solid #E5E7EB', borderRadius: '1rem',
                    textAlign: 'left', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    fontSize: '1.25rem', fontWeight: '900', color: COLORS.black,
                    marginBottom: '0.5rem', letterSpacing: '-0.01em'
                  }}>
                    {round.date}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: COLORS.gray, marginBottom: '0.5rem' }}>
                    Start Time: {round.startTime}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: COLORS.gray }}>
                    {round.fixtures.length} fixtures
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setScreen('welcome')}
              style={{
                width: '100%', marginTop: '2rem', padding: '1.25rem',
                backgroundColor: 'white', color: COLORS.black,
                border: `2px solid ${COLORS.black}`, borderRadius: '3rem',
                fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px',
                cursor: 'pointer', textTransform: 'uppercase'
              }}
            >Back to Home</button>
          </div>
        )}

        {/* Draw Fixtures Screen */}
        {screen === 'draw-fixtures' && selectedRound && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{
              backgroundColor: COLORS.black, borderRadius: '1.5rem',
              padding: '2rem', marginBottom: '1.5rem', textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.5rem', fontWeight: '900', color: 'white',
                marginBottom: '0.5rem', letterSpacing: '-0.02em'
              }}>
                {selectedRound.date}
              </h2>
              <p style={{ fontSize: '0.875rem', color: COLORS.gray }}>
                Start Time: {selectedRound.startTime}
              </p>
            </div>

            <h3 style={{
              fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem',
              textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.gray
            }}>Match Fixtures</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {selectedRound.fixtures.map((fixture, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem', backgroundColor: 'white',
                  border: '2px solid #E5E7EB', borderRadius: '1rem'
                }}>
                  {fixture.team2 === 'bye' ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: '800', color: COLORS.black }}>
                        {fixture.team1}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: COLORS.gray, marginTop: '0.25rem' }}>
                        (Bye)
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        display: 'flex', justifyContent: 'center',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          padding: '0.5rem 1.5rem', backgroundColor: COLORS.black,
                          color: 'white', borderRadius: '9999px', fontSize: '0.875rem',
                          fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                          Pitch {fixture.pitch}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: COLORS.black }}>
                          {fixture.team1}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: COLORS.gray }}>
                          vs
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: COLORS.black }}>
                          {fixture.team2}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => { setScreen('draw'); setSelectedRound(null); }}
              style={{
                width: '100%', padding: '1.25rem', backgroundColor: 'white',
                color: COLORS.black, border: `2px solid ${COLORS.black}`,
                borderRadius: '3rem', fontSize: '1rem', fontWeight: '800',
                letterSpacing: '0.5px', cursor: 'pointer', textTransform: 'uppercase'
              }}
            >Back to Draw</button>
          </div>
        )}

        {/* Confirm Innings placeholder - would show summary before confirming */}
        {screen === 'confirm-innings' && (
          <div style={{ paddingTop: '2rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>CONFIRM INNINGS</h2>
            <button onClick={confirmInnings}
              style={{
                width: '100%', padding: '1.25rem', backgroundColor: COLORS.black,
                color: 'white', border: 'none', borderRadius: '3rem',
                fontSize: '1rem', fontWeight: '800', cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >Confirm & Continue</button>
          </div>
        )}

        {/* Match Summary placeholder */}
        {screen === 'match-summary' && innings1Data && innings2Data && (
          <div style={{ paddingTop: '2rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: '900', color: COLORS.black,
              marginBottom: '2rem', letterSpacing: '-0.03em', textTransform: 'uppercase'
            }}>MATCH COMPLETE</h2>
            <div style={{
              backgroundColor: COLORS.black, borderRadius: '1.5rem',
              padding: '2rem', marginBottom: '1.5rem'
            }}>
              <div style={{ color: 'white', fontSize: '3rem', fontWeight: '900' }}>
                {innings1Data.totalRuns} - {innings2Data.totalRuns}
              </div>
            </div>
            <button onClick={exportToCSV}
              style={{
                width: '100%', padding: '1.25rem', backgroundColor: COLORS.primary,
                color: 'white', border: 'none', borderRadius: '3rem',
                fontSize: '1rem', fontWeight: '800', cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >Download Match Report</button>
          </div>
        )}
      </div>
    </div>
  );
}
