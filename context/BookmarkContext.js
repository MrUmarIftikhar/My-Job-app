import React, { createContext, useContext, useEffect, useState } from 'react';
import { getBookmarks, addBookmark as addBookmarkToStorage, removeBookmark as removeBookmarkFromStorage } from '../utils/storage';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (job) => {
    try {
      const updatedBookmarks = await addBookmarkToStorage(job);
      if (updatedBookmarks) {
        setBookmarks(updatedBookmarks);
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (id) => {
    try {
      const updatedBookmarks = await removeBookmarkFromStorage(id);
      if (updatedBookmarks) {
        setBookmarks(updatedBookmarks);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const isBookmarked = (id) => {
    return bookmarks.some(job => job.id === id);
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      loading,
      addBookmark,
      removeBookmark,
      isBookmarked,
      refreshBookmarks: loadBookmarks
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);