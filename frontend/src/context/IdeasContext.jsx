import { createContext, useContext, useEffect, useState } from 'react';

const IDEAS_STORAGE_KEY = 'trevo-ideas-state';

const IdeasContext = createContext(null);

const defaultIdeasState = {
  savedIdeas: [],
  confirmedIdeas: [],
};

function getInitialIdeasState() {
  if (typeof window === 'undefined') {
    return defaultIdeasState;
  }

  try {
    const storedIdeas = window.localStorage.getItem(IDEAS_STORAGE_KEY);

    if (!storedIdeas) {
      return defaultIdeasState;
    }

    const parsedIdeas = JSON.parse(storedIdeas);

    return {
      savedIdeas: Array.isArray(parsedIdeas.savedIdeas) ? parsedIdeas.savedIdeas : [],
      confirmedIdeas: Array.isArray(parsedIdeas.confirmedIdeas) ? parsedIdeas.confirmedIdeas : [],
    };
  } catch {
    return defaultIdeasState;
  }
}

function IdeasProvider({ children }) {
  const [ideasState, setIdeasState] = useState(getInitialIdeasState);

  useEffect(() => {
    window.localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideasState));
  }, [ideasState]);

  const saveIdea = (idea) => {
    setIdeasState((prev) => {
      const alreadyExists = [...prev.savedIdeas, ...prev.confirmedIdeas].some(
        (existingIdea) => existingIdea.id === idea.id,
      );

      if (alreadyExists) {
        return prev;
      }

      return {
        ...prev,
        savedIdeas: [{ ...idea }, ...prev.savedIdeas],
      };
    });
  };

  const confirmIdea = (ideaId) => {
    setIdeasState((prev) => {
      const selectedIdea = prev.savedIdeas.find((idea) => idea.id === ideaId);

      if (!selectedIdea) {
        return prev;
      }

      return {
        savedIdeas: prev.savedIdeas.filter((idea) => idea.id !== ideaId),
        confirmedIdeas: [{ ...selectedIdea }, ...prev.confirmedIdeas],
      };
    });
  };

  const removeSavedIdea = (ideaId) => {
    setIdeasState((prev) => ({
      ...prev,
      savedIdeas: prev.savedIdeas.filter((idea) => idea.id !== ideaId),
    }));
  };

  const removeConfirmedIdea = (ideaId) => {
    setIdeasState((prev) => ({
      ...prev,
      confirmedIdeas: prev.confirmedIdeas.filter((idea) => idea.id !== ideaId),
    }));
  };

  const value = {
    savedIdeas: ideasState.savedIdeas,
    confirmedIdeas: ideasState.confirmedIdeas,
    saveIdea,
    confirmIdea,
    removeSavedIdea,
    removeConfirmedIdea,
  };

  return <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>;
}

function useIdeas() {
  const context = useContext(IdeasContext);

  if (!context) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { IdeasProvider, useIdeas };
