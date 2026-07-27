import { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authClient } from '../services/api';
import { STORAGE_KEYS } from '../constants/Config';

const initialState = {
  balance: '0.00',
  currency: 'GH₵',
  minimumPickupPrice: 20.00,
  isLoading: false,
  error: null,
  transactions: [],
};

const ActionTypes = {
  SET_BALANCE: 'SET_BALANCE',
  ADD_BALANCE: 'ADD_BALANCE',
  DEDUCT_BALANCE: 'DEDUCT_BALANCE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  RESET: 'RESET',
};

function walletReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_BALANCE:
      return { ...state, balance: action.payload, isLoading: false };
    case ActionTypes.ADD_BALANCE:
      return {
        ...state,
        balance: (parseFloat(state.balance) + action.payload).toFixed(2),
        isLoading: false,
      };
    case ActionTypes.DEDUCT_BALANCE:
      return {
        ...state,
        balance: (parseFloat(state.balance) - action.payload).toFixed(2),
        isLoading: false,
      };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case ActionTypes.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const hasSufficientBalance = parseFloat(state.balance) >= state.minimumPickupPrice;

  const setBalance = (balance) => {
    dispatch({ type: ActionTypes.SET_BALANCE, payload: balance });
  };

  const addBalance = (amount) => {
    dispatch({ type: ActionTypes.ADD_BALANCE, payload: amount });
  };

  const deductBalance = (amount) => {
    if (!hasSufficientBalance) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Insufficient balance' });
      return false;
    }
    dispatch({ type: ActionTypes.DEDUCT_BALANCE, payload: amount });
    return true;
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setTransactions = (transactions) => {
    dispatch({ type: ActionTypes.SET_TRANSACTIONS, payload: transactions });
  };

  const addTransaction = (transaction) => {
    dispatch({
      type: ActionTypes.ADD_TRANSACTION,
      payload: {
        ...transaction,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      },
    });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user');
        return;
      }

      const { data, error } = await supabase
        .from('wallet')
        .select('*')
        .eq('customer_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setBalance(data?.balance?.toString() || '0.00');
    } catch (error) {
      setError(error.message);
    }
  };

  const topUp = async (amount) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          customer_id: user.id,
          type: 'topup',
          amount,
          status: 'completed',
        })
        .select();

      if (error) throw error;

      addBalance(amount);
      addTransaction({
        type: 'topup',
        amount,
        status: 'completed',
        description: `Top up of GH₵ ${amount.toFixed(2)}`,
      });
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const value = {
    ...state,
    hasSufficientBalance,
    setBalance,
    addBalance,
    deductBalance,
    setLoading,
    setError,
    setTransactions,
    addTransaction,
    fetchBalance,
    topUp,
    reset,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletStore() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletStore must be used within a WalletProvider');
  }
  return context;
}

export { ActionTypes };