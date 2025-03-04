import { supabase } from '../utils/supabase';
import type { UserSettings } from '../types';

// Default settings if none are found
const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at'> = {
  default_latitude: -36.114858138524454,
  default_longitude: 146.8884086608887,
  default_zoom: 8,
  map_style: 'mapbox://styles/mapbox/streets-v12'
};

export const settingsService = {
  async getUserSettings(userId: string): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, create default settings
        return this.createUserSettings(userId);
      }
      console.error(`Error fetching settings for user ${userId}:`, error);
      throw error;
    }
    
    return data as UserSettings;
  },
  
  async createUserSettings(userId: string): Promise<UserSettings> {
    const newSettings = {
      user_id: userId,
      ...DEFAULT_SETTINGS
    };
    
    const { data, error } = await supabase
      .from('user_settings')
      .insert([newSettings])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user settings:', error);
      throw error;
    }
    
    return data as UserSettings;
  },
  
  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating settings for user ${userId}:`, error);
      throw error;
    }
    
    return data as UserSettings;
  },
  
  // Get default settings without requiring a user ID
  getDefaultSettings(): Omit<UserSettings, 'id' | 'user_id' | 'created_at'> {
    return { ...DEFAULT_SETTINGS };
  }
};
