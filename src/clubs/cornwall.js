export const cornwall = {
  id: 'cornwall',
  slug: 'cornwall',
  name: 'Cornwall Cricket Club',
  shortName: 'CCC',
  tagline: "Keeping the scoreboard ticking over since '25",
  headerTitle: 'CCC Score Centre',
  reportPrefix: 'CCC',
  colors: {
    primary: '#10B981',
    secondary: '#EF4444',
    accent: '#8B5CF6',
    black: '#111827',
    gray: '#6B7280',
  },
  yearLevels: {
    year3: {
      id: 'year3',
      label: 'Year 3',
      shortLabel: 'Y3',
      description: 'Junior grade scoring for Year 3',
    },
    year4: {
      id: 'year4',
      label: 'Year 4',
      shortLabel: 'Y4',
      description: 'Junior grade scoring for Year 4',
    },
  },
  teams: [
    'Super Tigers', 'Raptors', 'Hammerheads', 'Wolfpack', 'Vipers',
    'Striking Cobras', 'Grizzlies', 'Manta Rays', 'Mighty Eagles', 'CZ',
  ],
  draw: {
    rounds: [
      {
        date: 'Friday, 7 November 2024',
        startTime: '6:00 PM',
        fixtures: [
          { pitch: 11, team1: 'Super Tigers', team2: 'Hammerheads' },
          { pitch: 13, team1: 'Mighty Eagles', team2: 'Raptors' },
          { pitch: 15, team1: 'Manta Rays', team2: 'Vipers' },
          { pitch: 17, team1: 'Grizzlies', team2: 'Wolfpack' },
          { pitch: null, team1: 'Striking Cobras', team2: 'bye' },
        ],
      },
    ],
  },
};
