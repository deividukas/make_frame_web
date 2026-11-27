import { createContext, useContext } from "react";
import type defaultContent from "../config/content.json";

export type Content = typeof defaultContent;

interface ContentContextType {
  content: Content;
  updateContent: (newContent: Content) => void;
  resetContent: () => void;
  isLoading: boolean;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
