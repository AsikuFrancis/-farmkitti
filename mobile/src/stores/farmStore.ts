import { create } from 'zustand';
import { api } from '../services/api';
import { SyncManager } from '../services/syncManager';
import { getLocalFarms, saveFarmLocally, addToSyncQueue } from '../services/db';

interface Farm {
  id: string;
  name: string;
  size: number;
  latitude?: number;
  longitude?: number;
  synced?: boolean;
}

interface FarmStore {
  farms: Farm[];
  loading: boolean;
  fetchFarms: () => Promise<void>;
  addFarm: (farm: Omit<Farm, 'id'>) => Promise<void>;
}

export const useFarmStore = create<FarmStore>((set, get) => ({
  farms: [],
  loading: false,
  
  fetchFarms: async () => {
    set({ loading: true });
    
    // 1. Try to load local farms first for immediate display (Offline First)
    try {
      const localFarms = await getLocalFarms();
      if (localFarms && localFarms.length > 0) {
        set({ farms: localFarms });
      }
    } catch (e) {
      console.log('Error loading local farms', e);
    }

    // 2. Try to fetch from API and update local DB
    const isOnline = await SyncManager.isOnline();
    if (isOnline) {
      try {
        const response = await api.get('/farms');
        const serverFarms = response.data;
        
        // Save to SQLite
        for (const farm of serverFarms) {
          await saveFarmLocally({ ...farm, synced: true });
        }
        
        set({ farms: serverFarms });
      } catch (error) {
        console.error('API fetch failed, relying on local data', error);
        
        // Mock data fallback if DB is not ready
        setTimeout(() => {
          set({ 
            farms: [
              { id: '1', name: 'North Field', size: 5 },
              { id: '2', name: 'River Side', size: 2.5 }
            ] as Farm[], 
            loading: false 
          });
        }, 1000);
      }
    }
    
    set({ loading: false });
  },

  addFarm: async (farmData) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const newFarm = { ...farmData, id: tempId, synced: false };
    
    // Optimistic UI update
    set({ farms: [...get().farms, newFarm] });
    
    // Save locally
    await saveFarmLocally(newFarm);

    const isOnline = await SyncManager.isOnline();
    if (isOnline) {
      try {
        await api.post('/farms', farmData);
        // If successful, refresh the list to get true IDs
        await get().fetchFarms();
      } catch (error) {
        console.error('Failed to sync new farm to server', error);
        await addToSyncQueue('/farms', 'POST', farmData);
      }
    } else {
      // Offline: Add to sync queue
      await addToSyncQueue('/farms', 'POST', farmData);
    }
  }
}));
