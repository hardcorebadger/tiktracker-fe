// Supabase service for TikTok sounds

import { supabase } from '@/integrations/supabase/client';

export interface Sound {
  id: string;
  created_at: string;
  url: string;
  sound_name: string;
  creator_name: string;
  video_count: number | null;
  icon_url: string;
  view_history: number[];
  pct_change_1d: number | null;
  pct_change_1w: number | null;
  pct_change_1m: number | null;
  last_scrape: Date | null;
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
    const processedSounds = sounds.map(sound => ({
      id: sound.id,
      created_at: sound.created_at,
      url: sound.url,
      sound_name: sound.sound_name || 'Untitled Sound',
      creator_name: sound.creator_name || 'Unknown Creator',
      video_count: sound.video_count,
      icon_url: sound.icon_url || 'https://placehold.co/100x100',
      view_history: sound.video_history || [],
      pct_change_1d: sound.pct_change_1d,
      pct_change_1w: sound.pct_change_1w,
      pct_change_1m: sound.pct_change_1m,
      last_scrape: sound.last_scrape ? new Date(sound.last_scrape) : null,
    }));

    return processedSounds;
  } catch (error) {
    console.error('Error in getSounds:', error);
    // Return empty array if there's an error
    return [];
  }
};

// Function to add a new sound to track
export const addSound = async (url: string): Promise<Sound | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    // Validate URL
    if (!url.includes('tiktok.com')) {
      throw new Error('Invalid TikTok URL');
    }

    // Extract the sound name from URL (this is a simplified example)
    const soundName = url.split('/').pop() || 'New Sound';
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('sounds')
      .insert([
        { 
          url,
          user_id: user.id,
          sound_name: soundName,
          creator_name: 'TikTok Creator',
          video_count: null,
          video_history: [],
          scrape_history: [],
          last_scrape: null,
          icon_url: 'https://placehold.co/100x100',
          pct_change_1d: null,
          pct_change_1w: null,
          pct_change_1m: null,
          created_at: now
        }
      ])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('This sound URL has already been added');
      }
      console.error('Error adding sound:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from insert');
    }
    
    return {
      id: data.id,
      created_at: data.created_at || now,
      url: data.url,
      sound_name: data.sound_name || 'Untitled Sound',
      creator_name: data.creator_name || 'Unknown Creator',
      video_count: data.video_count,
      icon_url: data.icon_url || 'https://placehold.co/100x100',
      view_history: data.video_history || [],
      pct_change_1d: data.pct_change_1d,
      pct_change_1w: data.pct_change_1w,
      pct_change_1m: data.pct_change_1m,
      last_scrape: data.last_scrape ? new Date(data.last_scrape) : null,
    };
  } catch (error) {
    console.error('Error in addSound:', error);
    // Return the error message for better user feedback
    throw error instanceof Error ? error : new Error('Failed to add sound');
  }
};

// Function to delete a sound
export const deleteSound = async (id: string): Promise<boolean> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    console.log('Attempting to delete sound:', { id, userId: user.id });

    // First verify the sound exists and belongs to the user
    const { data: sound, error: fetchError } = await supabase
      .from('sounds')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching sound:', fetchError);
      throw new Error('Could not verify sound ownership');
    }

    if (!sound) {
      throw new Error('Sound not found or not owned by user');
    }

    const { error } = await supabase
      .from('sounds')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting sound:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSound:', error);
    throw error instanceof Error ? error : new Error('Failed to delete sound');
  }
};
