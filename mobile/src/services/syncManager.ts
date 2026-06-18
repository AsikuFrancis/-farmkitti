import * as Network from 'expo-network';
import { api } from './api';
import { getSyncQueue, removeFromSyncQueue } from './db';

export const SyncManager = {
  isOnline: async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.isInternetReachable;
  },

  sync: async () => {
    const online = await SyncManager.isOnline();
    if (!online) {
      console.log('Device is offline. Skipping sync.');
      return;
    }

    try {
      console.log('Starting sync process...');
      const queue: any[] = await getSyncQueue();
      
      if (queue.length === 0) {
        console.log('No items in sync queue.');
        return;
      }

      for (const item of queue) {
        try {
          const payload = JSON.parse(item.payload);
          
          if (item.method === 'POST') {
            await api.post(item.endpoint, payload);
          } else if (item.method === 'PUT') {
            await api.put(item.endpoint, payload);
          } else if (item.method === 'DELETE') {
            await api.delete(item.endpoint);
          }

          // If successful, remove from queue
          await removeFromSyncQueue(item.id);
          console.log(`Successfully synced item ${item.id}`);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          // Stop syncing on first error to maintain order
          break;
        }
      }
    } catch (error) {
      console.error('Error during sync process:', error);
    }
  }
};
