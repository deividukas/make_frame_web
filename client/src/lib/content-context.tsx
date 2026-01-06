import React, { createContext, useContext, useState, useEffect } from "react";
import defaultContent from "../config/content.json";

type Content = typeof defaultContent;

interface ContentContextType {
  content: Content;
  updateContent: (newContent: Content) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(defaultContent);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("site-content");
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved content", e);
      }
    }
  }, []);

  const updateContent = (newContent: Content) => {
    setContent(newContent);
    localStorage.setItem("site-content", JSON.stringify(newContent));
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem("site-content");
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
