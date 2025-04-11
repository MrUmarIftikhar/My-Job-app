import React, { createContext, useState } from 'react';

const BookmarkContext = createContext();

export default function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);

  const addBookmark = (job) => {
    setBookmarks(prev => [...prev, job]);
  };

  const removeBookmark = (jobId) => {
    setBookmarks(prev => prev.filter(job => job.id !== jobId));
  };

  const isBookmarked = (jobId) => {
    return bookmarks.some(job => job.id === jobId);
  };

  return (
    <BookmarkContext.Provider 
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
