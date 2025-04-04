import * as React from "react";
import { SoundsTable } from "./SoundsTable";
import { Sound } from "@/services/soundService";

// Generate fake data
const generateFakeData = (count: number, customSounds?: Array<{ sound_name?: string; creator_name?: string; video_count?: number }>): Sound[] => {
  const sounds: Sound[] = [];
  const artists = ["Drake", "Taylor Swift", "Bad Bunny", "The Weeknd", "Doja Cat", "Post Malone", "Ariana Grande", "Ed Sheeran"];
  const songPrefixes = ["Remix of", "Cover of", "Sound from", "Beat from", "Sample of", "Mix of", "Mashup with"];
  const songWords = ["Love", "Dance", "Night", "Dream", "Star", "Heart", "Beat", "Vibe", "Wave", "Mood"];

  const total = customSounds ? Math.max(count, customSounds.length) : count;

  for (let i = 0; i < total; i++) {
    const customSound = customSounds?.[i];
    const randomArtist = customSound?.creator_name || artists[Math.floor(Math.random() * artists.length)];
    const randomPrefix = songPrefixes[Math.floor(Math.random() * songPrefixes.length)];
    const randomWord = songWords[Math.floor(Math.random() * songWords.length)];
    const videoCount = customSound?.video_count || (Math.floor(Math.random() * 10000000) + 100000);
    const soundName = customSound?.sound_name || `${randomPrefix} ${randomWord}`;
    
    // Generate random history data
    const historyLength = 30;
    const viewHistory: number[] = [];
    let lastCount = videoCount - Math.floor(Math.random() * (videoCount * 0.2)); // Start 0-10% lower
    
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
      sound_name: soundName,
      creator_name: randomArtist,
      video_count: videoCount,
      icon_url: `https://picsum.photos/seed/${soundName.toLowerCase().replace(/\s+/g, '-')}/100/100`,
      view_history: viewHistory,
      pct_change_1d: pctChange1d,
      pct_change_1w: pctChange1w,
      pct_change_1m: pctChange1m,
      last_scrape: new Date().toISOString()
    });
  }

  return sounds;
};

// Demo data configuration
const demoSoundConfigs = [
  {
    sound_name: "original sound - JVKE",
    creator_name: "JVKE",
    video_count: 1234567
  },
  {
    sound_name: "Flowers",
    creator_name: "Miley Cyrus",
    video_count: 987654
  },
  {
    sound_name: "Anti-Hero",
    creator_name: "Taylor Swift",
    video_count: 2345678
  }
];

interface TestSoundsTableProps {
  count?: number;
  useDemo?: boolean;
  className?: string;
}

export function TestSoundsTable({ count = 50, useDemo = false, className = "" }: TestSoundsTableProps) {
  const data = useDemo ? generateFakeData(3, demoSoundConfigs) : generateFakeData(count);

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