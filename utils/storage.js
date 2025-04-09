import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@job_bookmarks';

export const getBookmarks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error reading bookmarks:', error);
    return [];
  }
};

export const saveBookmarks = async (bookmarks) => {
  try {
    const jsonValue = JSON.stringify(bookmarks);
    await AsyncStorage.setItem(BOOKMARKS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
};

export const addBookmark = async (job) => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = [...bookmarks, job];
    await saveBookmarks(updatedBookmarks);
    return updatedBookmarks;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }
};

export const removeBookmark = async (id) => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter(job => job.id !== id);
    await saveBookmarks(updatedBookmarks);
    return updatedBookmarks;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return null;
  }
};