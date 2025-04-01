
// Supabase service for TikTok sounds

import { supabase } from '@/integrations/supabase/client';

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

export const getSounds = async (): Promise<Sound[]> => {
  try {
    // Fetch the currently logged in user's sounds
    const { data: sounds, error } = await supabase
      .from('sounds')
      .select('*');
    
    if (error) {
      console.error('Error fetching sounds:', error);
      throw error;
    }

    // Process the sounds to ensure view_history is properly formatted
    const processedSounds = sounds.map(sound => {
      // If view_history is NULL or empty, create a dummy history based on total_views
      let viewHistory = sound.video_history || [];
      
      if (!viewHistory || viewHistory.length === 0) {
        // Generate dummy view history if none exists
        viewHistory = generateDummyViewHistory(sound.total_views || 0);
      }
      
      return {
        id: sound.id,
        created_at: sound.created_at,
        url: sound.url,
        sound_name: sound.sound_name || 'Untitled Sound',
        creator_name: sound.creator_name || 'Unknown Creator',
        total_views: sound.total_views || 0,
        icon_url: sound.icon_url || 'https://placehold.co/100x100',
        view_history: viewHistory,
        pct_change_1d: sound.pct_change_1d || 0,
        pct_change_1w: sound.pct_change_1w || 0,
        pct_change_1m: sound.pct_change_1m || 0,
      };
    });

    return processedSounds;
  } catch (error) {
    console.error('Error in getSounds:', error);
    // Return empty array if there's an error
    return [];
  }
};

// Helper function to generate dummy view history for visualization
const generateDummyViewHistory = (totalViews: number): number[] => {
  const history = [];
  let currentViews = Math.max(100, totalViews * 0.7);
  
  // Generate 30 days of view history
  for (let i = 0; i < 30; i++) {
    // Random daily change between -5% and +15%
    const change = currentViews * (Math.random() * 0.20 - 0.05);
    currentViews = Math.max(0, Math.round(currentViews + change));
    history.push(currentViews);
  }
  
  // Set the last day to the actual total views
  history.push(totalViews);
  
  return history;
};

// Function to add a new sound to track
export const addSound = async (url: string): Promise<Sound | null> => {
  try {
    // Extract the sound name and creator from URL (this is a simplified example)
    const soundName = url.split('/').pop() || 'New Sound';
    
    const { data, error } = await supabase
      .from('sounds')
      .insert([
        { 
          url,
          sound_name: soundName,
          creator_name: 'TikTok Creator',
          total_views: 0,
          icon_url: 'https://placehold.co/100x100',
          video_count: 0
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding sound:', error);
      throw error;
    }
    
    return {
      id: data.id,
      created_at: data.created_at,
      url: data.url,
      sound_name: data.sound_name || 'Untitled Sound',
      creator_name: data.creator_name || 'Unknown Creator',
      total_views: data.total_views || 0,
      icon_url: data.icon_url || 'https://placehold.co/100x100',
      view_history: [],
      pct_change_1d: 0,
      pct_change_1w: 0,
      pct_change_1m: 0,
    };
  } catch (error) {
    console.error('Error in addSound:', error);
    return null;
  }
};

// Function to delete a sound
export const deleteSound = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sounds')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting sound:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteSound:', error);
    return false;
  }
};
