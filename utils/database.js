import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const db = Platform.OS === 'web'
  ? {
      transaction: () => {
        return {
          executeSql: () => {}
        };
      }
    }
  : SQLite.openDatabase('bookmarks.db');

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        location TEXT,
        salary TEXT,
        phone TEXT,
        data TEXT
      );`
    );
  });
};

export const insertBookmark = (job) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT OR REPLACE INTO bookmarks (id, title, location, salary, phone, data) VALUES (?, ?, ?, ?, ?, ?)',
      [
        job.id,
        job.title,
        job.location,
        job.salary,
        job.phone,
        JSON.stringify(job),
      ]
    );
  });
};

export const getBookmarks = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM bookmarks', [], (_, { rows }) => {
      const data = rows._array.map(row => ({
        ...JSON.parse(row.data),
      }));
      callback(data);
    });
  });
};

export const deleteBookmark = (id) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM bookmarks WHERE id = ?', [id]);
  });
};