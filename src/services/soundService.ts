
// Mock data service for TikTok sounds

export interface Sound {
  id: string;
  created_at: string;
  url: string;
  sound_name: string;
  creator_name: string;
  total_views: number;
  icon_url: string;
  view_history: number[];
  pct_change_1d: number;
  pct_change_1w: number;
  pct_change_1m: number;
}

const generateRandomViewHistory = (days: number, baseViews: number): number[] => {
  const history = [];
  let currentViews = baseViews;
  
  for (let i = 0; i < days; i++) {
    // Random daily change between -5% and +15%
    const change = currentViews * (Math.random() * 0.20 - 0.05);
    currentViews = Math.max(0, Math.round(currentViews + change));
    history.push(currentViews);
  }
  
  return history;
};

const calculatePercentChange = (history: number[], daysAgo: number): number => {
  if (history.length <= daysAgo) return 0;
  const currentValue = history[history.length - 1];
  const pastValue = history[history.length - 1 - daysAgo];
  if (pastValue === 0) return 0;
  return Math.round(((currentValue - pastValue) / pastValue) * 100);
};

// Mock TikTok sound data
const mockSounds: Sound[] = [
  {
    id: "1",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7118752383218358021",
    sound_name: "Running Up That Hill",
    creator_name: "Kate Bush",
    total_views: 24500000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/1975085133960d620b0e179dfd620434~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7151686229972447022",
    sound_name: "Bad Habit",
    creator_name: "Steve Lacy",
    total_views: 18700000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/e8bfef9cb30fa3f17e491181ca3711b5~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7104715347261159174",
    sound_name: "As It Was",
    creator_name: "Harry Styles",
    total_views: 32100000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/6c31e3683556fc1b345b41445976e78c~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  },
  {
    id: "4",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7167692615554917125",
    sound_name: "Anti-Hero",
    creator_name: "Taylor Swift",
    total_views: 15300000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/703f1c69084c83539327148821b86673~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  },
  {
    id: "5",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7065168958885212934",
    sound_name: "About Damn Time",
    creator_name: "Lizzo",
    total_views: 27800000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/2c458646333e8292443a4a98e7de88e1~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  },
  {
    id: "6",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7171890731563180806",
    sound_name: "Unholy",
    creator_name: "Sam Smith & Kim Petras",
    total_views: 9800000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/4e9895e7a7d25e42ec2e83d2c97dda24~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  },
  {
    id: "7",
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    url: "https://www.tiktok.com/music/original-sound-7047614641164071681",
    sound_name: "Heat Waves",
    creator_name: "Glass Animals",
    total_views: 21400000,
    icon_url: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/56585cd4029c01f1d4c2e90092e08ef9~c5_100x100.jpeg",
    view_history: [],
    pct_change_1d: 0,
    pct_change_1w: 0,
    pct_change_1m: 0
  }
];

// Generate view history and calculate percent changes for each sound
const processedSounds = mockSounds.map(sound => {
  const viewHistory = generateRandomViewHistory(30, sound.total_views * 0.7);
  viewHistory.push(sound.total_views);
  
  return {
    ...sound,
    view_history: viewHistory,
    pct_change_1d: calculatePercentChange(viewHistory, 1),
    pct_change_1w: calculatePercentChange(viewHistory, 7),
    pct_change_1m: calculatePercentChange(viewHistory, 30),
  };
});

export const getSounds = async (): Promise<Sound[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return processedSounds;
};
