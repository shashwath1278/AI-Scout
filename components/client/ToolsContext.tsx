'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface ToolsState {
  tools: Tool[];
  loading: boolean;
  search: string;
  category: string;
}

type Action = 
  | { type: 'SET_TOOLS'; payload: Tool[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_TOOL'; payload: Tool };

function toolsReducer(state: ToolsState, action: Action): ToolsState {
  switch (action.type) {
    case 'SET_TOOLS':
      return { ...state, tools: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'ADD_TOOL':
      return { ...state, tools: [...state.tools, action.payload] };
    default:
      return state;
  }
}

const ToolsContext = createContext<{
  state: ToolsState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toolsReducer, {
    tools: [],
    loading: false,
    search: '',
    category: ''
  });

  useEffect(() => {
    const fetchTools = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const query = new URLSearchParams({
        search: state.search,
        category: state.category
      }).toString();
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools?${query}`);
        const data = await response.json();
        dispatch({ type: 'SET_TOOLS', payload: data });
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchTools();
  }, [state.search, state.category]);

  return (
    <ToolsContext.Provider value={{ state, dispatch }}>
      {children}
    </ToolsContext.Provider>
  );
}

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) throw new Error('useTools must be used within ToolsProvider');
  return context;
};
