// packages/frontend/src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Article } from '../types/article';

// Define state shape
interface AppState {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

// Define actions
type AppAction =
  | { type: 'FETCH_ARTICLES_START' }
  | { type: 'FETCH_ARTICLES_SUCCESS'; payload: Article[] }
  | { type: 'FETCH_ARTICLES_ERROR'; payload: string }
  | { type: 'ADD_ARTICLE_SUCCESS'; payload: Article }
  | { type: 'UPDATE_ARTICLE_SUCCESS'; payload: Article }
  | { type: 'DELETE_ARTICLE_SUCCESS'; payload: string };

// Initial state
const initialState: AppState = {
  articles: [],
  loading: false,
  error: null,
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'FETCH_ARTICLES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ARTICLES_SUCCESS':
      return { ...state, articles: action.payload, loading: false };
    case 'FETCH_ARTICLES_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_ARTICLE_SUCCESS':
      return {
        ...state,
        articles: [...state.articles, action.payload],
      };
    case 'UPDATE_ARTICLE_SUCCESS':
      return {
        ...state,
        articles: state.articles.map((article) =>
          article.id === action.payload.id ? action.payload : article
        ),
      };
    case 'DELETE_ARTICLE_SUCCESS':
      return {
        ...state,
        articles: state.articles.filter((article) => article.id !== action.payload),
      };
    default:
      return state;
  }
};

// Context provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);