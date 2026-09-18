"use client";

import { createContext, useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";

const SavedContext = createContext(null);

export const STATUSES = ["New", "Contacted", "Closed", "Skip"];

export function SavedLeadsProvider({ children }) {
  const [saved, setSaved] = useLocalStorage("saved_leads", {});

  function toggleSave(lead) {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[lead.place_id]) {
        delete next[lead.place_id];
      } else {
        next[lead.place_id] = { ...lead, savedStatus: "New", savedAt: Date.now() };
      }
      return next;
    });
  }

  function setStatus(placeId, status) {
    setSaved((prev) => ({
      ...prev,
      [placeId]: { ...prev[placeId], savedStatus: status },
    }));
  }

  function isSaved(placeId) {
    return Boolean(saved[placeId]);
  }

  const savedList = Object.values(saved).sort((a, b) => b.savedAt - a.savedAt);

  return (
    <SavedContext.Provider value={{ saved, savedList, toggleSave, setStatus, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}
