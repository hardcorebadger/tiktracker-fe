import * as React from "react";
import { SoundsTable } from "./SoundsTable";
import { Sound } from "@/services/soundService";

// Generate fake data
const generateFakeData = (count: number): Sound[] => {
  const sounds: Sound[] = [];
  const artists = ["Drake", "Taylor Swift", "Bad Bunny", "The Weeknd", "Doja Cat", "Post Malone", "Ariana Grande", "Ed Sheeran"];
  const songPrefixes = ["Remix of", "Cover of", "Sound from", "Beat from", "Sample of", "Mix of", "Mashup with"];
  const songWords = ["Love", "Dance", "Night", "Dream", "Star", "Heart", "Beat", "Vibe", "Wave", "Mood"];

  for (let i = 0; i < count; i++) {
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const randomPrefix = songPrefixes[Math.floor(Math.random() * songPrefixes.length)];
    const randomWord = songWords[Math.floor(Math.random() * songWords.length)];
    const videoCount = Math.floor(Math.random() * 10000000) + 100000;
    
    // Generate random history data
    const historyLength = 30;
    const viewHistory: number[] = [];
    let lastCount = videoCount - Math.floor(Math.random() * 1000000);
    
    for (let j = 0; j < historyLength; j++) {
      viewHistory.push(lastCount);
      // Random increase between 0% and 5%
      lastCount += Math.floor(lastCount * (Math.random() * 0.05));
    }

    // Calculate percentage changes
    const pctChange1d = ((videoCount - viewHistory[viewHistory.length - 2]) / viewHistory[viewHistory.length - 2]) * 100;
    const pctChange1w = ((videoCount - viewHistory[viewHistory.length - 8]) / viewHistory[viewHistory.length - 8]) * 100;
    const pctChange1m = ((videoCount - viewHistory[0]) / viewHistory[0]) * 100;

    sounds.push({
      id: `sound-${i}`,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      url: `https://tiktok.com/music/sound-${i}`,
      sound_name: `${randomPrefix} ${randomWord}`,
      creator_name: randomArtist,
      video_count: videoCount,
      icon_url: `https://picsum.photos/seed/${i}/100/100`,
      view_history: viewHistory,
      pct_change_1d: pctChange1d,
      pct_change_1w: pctChange1w,
      pct_change_1m: pctChange1m,
      last_scrape: new Date().toISOString()
    });
  }

  return sounds;
};

// Demo data for landing page
const demoSounds: Sound[] = [
  {
    id: "1",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    sound_name: "original sound - JVKE",
    creator_name: "JVKE",
    icon_url: "https://picsum.photos/seed/jvke/100/100",
    url: "https://www.tiktok.com/music/original-sound-7188625618919416579",
    video_count: 1234567,
    pct_change_1d: 2.5,
    pct_change_1w: 15.3,
    pct_change_1m: 45.8,
    last_scrape: new Date().toISOString(),
    view_history: [100000, 150000, 200000, 300000, 400000, 600000, 800000, 1000000, 1234567],
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    sound_name: "Flowers",
    creator_name: "Miley Cyrus",
    icon_url: "https://picsum.photos/seed/flowers/100/100",
    url: "https://www.tiktok.com/music/Flowers-7189419612177991426",
    video_count: 987654,
    pct_change_1d: -1.2,
    pct_change_1w: 8.7,
    pct_change_1m: 25.4,
    last_scrape: new Date().toISOString(),
    view_history: [500000, 600000, 700000, 750000, 800000, 850000, 900000, 950000, 987654],
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    sound_name: "Anti-Hero",
    creator_name: "Taylor Swift",
    icon_url: "https://picsum.photos/seed/antihero/100/100",
    url: "https://www.tiktok.com/music/Anti-Hero-7156932840231458561",
    video_count: 2345678,
    pct_change_1d: 5.8,
    pct_change_1w: 22.4,
    pct_change_1m: 68.9,
    last_scrape: new Date().toISOString(),
    view_history: [1000000, 1200000, 1400000, 1600000, 1800000, 2000000, 2200000, 2300000, 2345678],
  },
];

interface TestSoundsTableProps {
  count?: number;
  useDemo?: boolean;
  className?: string;
}

export function TestSoundsTable({ count = 50, useDemo = false, className = "" }: TestSoundsTableProps) {
  const data = useDemo ? demoSounds : generateFakeData(count);

  const handleRowClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Would delete:', id);
  };

  const handleAddSound = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Would add sound:', newSoundUrl);
  };

  const [newSoundUrl, setNewSoundUrl] = React.useState("");

  return (
      <SoundsTable
        data={data}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onAddSound={handleAddSound}
        isSubmitting={false}
        newSoundUrl={newSoundUrl}
        setNewSoundUrl={setNewSoundUrl}
      />
  );
} 