import { supabase } from '../utils/supabase';
import type { UserSettings } from '../types';
// import type { Database } from '../types/supabase';

// Default settings if none are found
const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  default_theme: 'light',
  default_map_style: 'outdoors',
  default_latitude: -33.8688,
  default_longitude: 151.2093,
  default_zoom: 10.0,
  email_notifications: true,
  push_notifications: false,
  language: 'en',
  distance_unit: 'metric'
};

// Create a fallback settings object that doesn't require database access
const createFallbackSettings = (userId: string): UserSettings => ({
  id: 'local-fallback',
  user_id: userId,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...DEFAULT_SETTINGS
});

export const settingsService = {
  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      // Check if userId is valid before making any requests
      if (!userId || userId === 'null' || userId === 'undefined') {
        return createFallbackSettings('guest');
      }
      
      console.log('Fetching settings for user:', userId);

      // Only check authentication if we have a valid userId
      const { data: userData, error: authError } = await supabase.auth.getUser();
      const isAuthenticated = !!userData?.user;
      
      // If not authenticated, immediately return fallback settings without logging errors
      if (!isAuthenticated || authError) {
        return createFallbackSettings(userId);
      }
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        if (error.code === 'PGRST116') {
          // No settings found, try to create default settings
          console.log('No settings found, creating default settings');
          try {
            return await this.createUserSettings(userId);
          } catch (createError) {
            console.error('Failed to create settings, using fallback:', createError);
            return createFallbackSettings(userId);
          }
        }
        
        // For other errors, use fallback settings
        console.warn('Error fetching settings, using fallback:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return createFallbackSettings(userId);
      }

      console.log('Successfully fetched settings:', data);
      return data as UserSettings;
    } catch (err) {
      console.error('Network or unexpected error:', err);
      // Fall back to default settings
      return createFallbackSettings(userId);
    }
  },

  async createUserSettings(userId: string): Promise<UserSettings> {
    try {
      // Check if user is authenticated before attempting to create settings
      const { data: userData, error: authError } = await supabase.auth.getUser();
      const isAuthenticated = !!userData?.user;
      
      if (!isAuthenticated || authError) {
        console.warn('Cannot create settings: User not authenticated', { userData, authError });
        return createFallbackSettings(userId);
      }
      
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
        // If we hit RLS policy issues or other errors, return fallback
        if (error.code === '42501') {
          console.warn('RLS policy violation, using fallback settings');
          return createFallbackSettings(userId);
        }
        throw error;
      }

      console.log('Successfully created user settings:', data);
      return data as UserSettings;
    } catch (err) {
      console.error('Failed to create user settings:', err);
      throw err;
    }
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
  getDefaultSettings(): Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
    return { ...DEFAULT_SETTINGS };
  }
};
