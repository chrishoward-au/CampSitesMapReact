import { supabase } from '../utils/supabase';
import type { MapPoint } from '../types';

export const mapPointsService = {
  async getMapPoints(): Promise<MapPoint[]> {
    const { data, error } = await supabase
      .from('map_points')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching map points:', error);
      throw error;
    }
    
    return data as MapPoint[];
  },
  
  async getMapPointById(id: string): Promise<MapPoint | null> {
    const { data, error } = await supabase
      .from('map_points')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching map point with id ${id}:`, error);
      throw error;
    }
    
    return data as MapPoint;
  },
  
  async createMapPoint(mapPoint: Omit<MapPoint, 'id' | 'created_at'>): Promise<MapPoint> {
    const { data, error } = await supabase
      .from('map_points')
      .insert([mapPoint])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating map point:', error);
      throw error;
    }
    
    return data as MapPoint;
  },
  
  async updateMapPoint(id: string, updates: Partial<MapPoint>): Promise<MapPoint> {
    const { data, error } = await supabase
      .from('map_points')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating map point with id ${id}:`, error);
      throw error;
    }
    
    return data as MapPoint;
  },
  
  async deleteMapPoint(id: string): Promise<void> {
    const { error } = await supabase
      .from('map_points')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting map point with id ${id}:`, error);
      throw error;
    }
  }
};
