import { createContext, useContext, useReducer } from 'react';
import { Linking } from 'react-native';

// Support channel types
export const SupportChannel = {
  CALL: 'call',
  CHAT: 'chat',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
};

// Support options configuration
export const SupportOptions = [
  {
    id: SupportChannel.CALL,
    title: 'Call Us',
    subtitle: 'Mon-Fri, 8am-6pm',
    icon: 'call',
    action: () => Linking.openURL('tel:+233500000000'),
    available: true,
  },
  {
    id: SupportChannel.CHAT,
    title: 'Live Chat',
    subtitle: 'Available 24/7',
    icon: 'chatbubble-ellipses',
    action: '/chat', // Navigation route
    available: true,
  },
  {
    id: SupportChannel.WHATSAPP,
    title: 'WhatsApp',
    subtitle: 'Quick responses',
    icon: 'logo-whatsapp',
    action: () => Linking.openURL('whatsapp://send?text=Hello&phone=+233500000000'),
    available: true,
  },
  {
    id: SupportChannel.EMAIL,
    title: 'Email Support',
    subtitle: 'support@bingo.com.gh',
    icon: 'mail',
    action: () => Linking.openURL('mailto:support@bingo.com.gh'),
    available: true,
  },
];

// Emergency contact
export const EmergencyContact = {
  phone: '+233 55 000 0000',
  message: 'For urgent waste collection emergencies, call our emergency line',
};

// Initial state
const initialState = {
  // Support sheet visibility
  isSupportSheetVisible: false,
  
  // Current support context (e.g., which activity/user is being discussed)
  context: null,
  
  // Support title and subtitle
  title: 'Contact Support',
  subtitle: 'How can we help you today?',
  
  // Selected support option
  selectedOption: null,
  
  // UI state
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SHOW_SUPPORT_SHEET: 'SHOW_SUPPORT_SHEET',
  HIDE_SUPPORT_SHEET: 'HIDE_SUPPORT_SHEET',
  SET_CONTEXT: 'SET_CONTEXT',
  SET_TITLE: 'SET_TITLE',
  SET_SUBTITLE: 'SET_SUBTITLE',
  SET_SELECTED_OPTION: 'SET_SELECTED_OPTION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
};

// Reducer
function supportReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SHOW_SUPPORT_SHEET:
      return { 
        ...state, 
        isSupportSheetVisible: true,
        context: action.payload?.context || null,
        title: action.payload?.title || 'Contact Support',
        subtitle: action.payload?.subtitle || 'How can we help you today?',
      };
    case ActionTypes.HIDE_SUPPORT_SHEET:
      return { 
        ...state, 
        isSupportSheetVisible: false,
        selectedOption: null,
      };
    case ActionTypes.SET_CONTEXT:
      return { ...state, context: action.payload };
    case ActionTypes.SET_TITLE:
      return { ...state, title: action.payload };
    case ActionTypes.SET_SUBTITLE:
      return { ...state, subtitle: action.payload };
    case ActionTypes.SET_SELECTED_OPTION:
      return { ...state, selectedOption: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create context
const SupportContext = createContext(null);

// Provider component
export function SupportProvider({ children }) {
  const [state, dispatch] = useReducer(supportReducer, initialState);

  // Actions
  const showSupportSheet = (options = {}) => {
    dispatch({ 
      type: ActionTypes.SHOW_SUPPORT_SHEET, 
      payload: options,
    });
  };

  const hideSupportSheet = () => {
    dispatch({ type: ActionTypes.HIDE_SUPPORT_SHEET });
  };

  const setContext = (context) => {
    dispatch({ type: ActionTypes.SET_CONTEXT, payload: context });
  };

  const setTitle = (title) => {
    dispatch({ type: ActionTypes.SET_TITLE, payload: title });
  };

  const setSubtitle = (subtitle) => {
    dispatch({ type: ActionTypes.SET_SUBTITLE, payload: subtitle });
  };

  const setSelectedOption = (option) => {
    dispatch({ type: ActionTypes.SET_SELECTED_OPTION, payload: option });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  // Handle support action
  const handleSupportAction = async (option) => {
    setSelectedOption(option);
    
    try {
      if (option.action && typeof option.action === 'function') {
        await option.action();
      } else if (option.action && typeof option.action === 'string') {
        // It's a navigation route - the component should handle navigation
        return option.action;
      }
      hideSupportSheet();
      return null;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const value = {
    ...state,
    showSupportSheet,
    hideSupportSheet,
    setContext,
    setTitle,
    setSubtitle,
    setSelectedOption,
    setLoading,
    setError,
    handleSupportAction,
    reset,
  };

  return (
    <SupportContext.Provider value={value}>
      {children}
    </SupportContext.Provider>
  );
}

// Hook to use the store
export function useSupportStore() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupportStore must be used within a SupportProvider');
  }
  return context;
}

export { ActionTypes };
