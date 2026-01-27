import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import defaultContent from "../config/content.json";

type Content = typeof defaultContent;

interface ContentContextType {
  content: Content;
  updateContent: (newContent: Content) => void;
  resetContent: () => void;
  isLoading: boolean;
}

declare global {
  interface Window {
    __INITIAL_DATA__?: Content | null;
  }
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Get initial data from server-injected script or null
function getInitialData(): Content | null {
  if (typeof window !== "undefined" && window.__INITIAL_DATA__) {
    return window.__INITIAL_DATA__;
  }
  return null;
}

async function fetchContent(): Promise<Content> {
  // First check if we have server-injected data
  const initialData = getInitialData();
  if (initialData) {
    // Clear it after first use to allow fresh fetches on navigation
    window.__INITIAL_DATA__ = null;
    return initialData;
  }
  
  const response = await fetch("/api/content");
  if (response.status === 404) {
    return defaultContent;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch content");
  }
  return response.json();
}

async function saveContent(content: Content): Promise<Content> {
  const adminPassword = localStorage.getItem("admin-password") || "";
  // Encode password to Base64 to avoid non-ISO-8859-1 character issues in headers
  const encodedPassword = btoa(unescape(encodeURIComponent(adminPassword)));

  // Ensure resourcesPage has default values if missing or incomplete
  const contentWithDefaults = {
    ...content,
    resourcesPage: {
      headline: content.resourcesPage?.headline || "News & Tips",
      subhead: content.resourcesPage?.subhead || "Learn more about event photography, social media marketing, and Make-frame capabilities."
    }
  };

  const response = await fetch("/api/content", {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "X-Admin-Password-Encoded": encodedPassword
    },
    body: JSON.stringify(contentWithDefaults),
  });
  if (response.status === 401) {
    throw new Error("Unauthorized: Please set admin password");
  }
  if (!response.ok) {
    throw new Error("Failed to save content");
  }
  return response.json();
}

async function resetToDefaults(): Promise<Content> {
  const response = await fetch("/api/content/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to reset content");
  }
  return response.json();
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  
  // Use server-injected data as initial data for instant render
  const initialData = getInitialData();
  
  const { data: content, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: fetchContent,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    // If we have initial data, use it immediately without showing loading state
    initialData: initialData || undefined,
    // Prevent refetch on mount if we have initial data
    refetchOnMount: !initialData,
  });

  const saveMutation = useMutation({
    mutationFn: saveContent,
    onSuccess: (data) => {
      queryClient.setQueryData(["site-content"], data);
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetToDefaults,
    onSuccess: (data) => {
      queryClient.setQueryData(["site-content"], data);
    },
  });

  const updateContent = async (newContent: Content) => {
    return saveMutation.mutateAsync(newContent);
  };

  const resetContentFn = () => {
    resetMutation.mutate();
  };

  // Only show loading if we don't have any content at all
  if (isLoading && !content && !initialData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <ContentContext.Provider 
      value={{ 
        content: content || initialData || defaultContent, 
        updateContent, 
        resetContent: resetContentFn,
        isLoading 
      }}
    >
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
