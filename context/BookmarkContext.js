import React, { createContext, useContext, useEffect, useState } from 'react';
import { insertBookmark, getBookmarks, deleteBookmark } from '../utils/database';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = () => {
    setLoading(true);
    getBookmarks(data => {
      setBookmarks(data);
      setLoading(false);
    });
  };

  const addBookmark = (job) => {
    insertBookmark(job);
    setBookmarks(prev => [...prev, job]);
  };

  const removeBookmark = (id) => {
    deleteBookmark(id);
    setBookmarks(prev => prev.filter(job => job.id !== id));
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