import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import defaultContent from "../config/content.json";

type Content = typeof defaultContent;

interface ContentContextType {
  content: Content;
  updateContent: (newContent: Content) => void;
  resetContent: () => void;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

async function fetchContent(): Promise<Content> {
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
  const adminPassword = localStorage.getItem("admin-password");
  const response = await fetch("/api/content", {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "X-Admin-Password": adminPassword || ""
    },
    body: JSON.stringify(content),
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
  
  const { data: content, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: fetchContent,
    staleTime: 1000 * 60 * 5,
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

  const updateContent = (newContent: Content) => {
    saveMutation.mutate(newContent);
  };

  const resetContentFn = () => {
    resetMutation.mutate();
  };

  return (
    <ContentContext.Provider 
      value={{ 
        content: content || defaultContent, 
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
