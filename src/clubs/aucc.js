export const aucc = {
  id: 'aucc',
  slug: 'aucc',
  name: 'Auckland University Cricket Club',
  shortName: 'AUCC',
  tagline: 'Junior scoring for AUCC',
  headerTitle: 'AUCC Score Centre',
  reportPrefix: 'AUCC',
  colors: {
    primary: '#2563EB',
    secondary: '#DC2626',
    accent: '#0F766E',
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
    'AUCC Blues',
    'AUCC Whites',
    'AUCC Golds',
    'AUCC Greens',
  ],
  draw: {
    rounds: [
      {
        date: 'Saturday, 1 November 2025',
        startTime: '9:00 AM',
        fixtures: [
          { pitch: 1, team1: 'AUCC Blues', team2: 'AUCC Whites' },
          { pitch: 2, team1: 'AUCC Golds', team2: 'AUCC Greens' },
        ],
      },
    ],
  },
};
