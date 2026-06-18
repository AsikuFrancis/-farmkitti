import * as SQLite from 'expo-sqlite';

export const getDb = () => {
  // Opening the SQLite database synchronously
  return SQLite.openDatabaseSync('farmkitti.db');
};

export const initDb = async () => {
  try {
    const db = getDb();
    
    // Create Farms table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS farms (
        id TEXT PRIMARY KEY,
        name TEXT,
        size REAL,
        latitude REAL,
        longitude REAL,
        synced INTEGER DEFAULT 1
      );
    `);

    // Create Sync Queue table for actions performed offline
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT,
        method TEXT,
        payload TEXT,
        created_at TEXT
      );
    `);
    
    console.log('Local DB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize local DB:', error);
  }
};

// Helper methods
export const saveFarmLocally = async (farm: any) => {
  const db = getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO farms (id, name, size, latitude, longitude, synced) VALUES (?, ?, ?, ?, ?, ?)',
    farm.id || Math.random().toString(36).substr(2, 9),
    farm.name,
    farm.size,
    farm.latitude || 0,
    farm.longitude || 0,
    farm.synced ? 1 : 0
  );
};

export const getLocalFarms = async () => {
  const db = getDb();
  return await db.getAllAsync('SELECT * FROM farms');
};

export const addToSyncQueue = async (endpoint: string, method: string, payload: any) => {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO sync_queue (endpoint, method, payload, created_at) VALUES (?, ?, ?, ?)',
    endpoint,
    method,
    JSON.stringify(payload),
    new Date().toISOString()
  );
};

export const getSyncQueue = async () => {
  const db = getDb();
  return await db.getAllAsync('SELECT * FROM sync_queue ORDER BY created_at ASC');
};

export const removeFromSyncQueue = async (id: number) => {
  const db = getDb();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', id);
};
