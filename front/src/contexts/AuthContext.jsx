import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar si hay token guardado al cargar la app
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: parsedUser, token },
        });
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_ERROR', payload: 'Token inválido' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: null });
    }
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authAPI.register(userData);
      
      // Después del registro, hacer login automáticamente
      const loginResult = await login({
        username: userData.username,
        password: userData.password,
      });

      return loginResult;
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrarse';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = async (userData) => {
    try {
      // Aquí implementarías la API call para actualizar usuario
      // const response = await authAPI.updateProfile(userData);
      
      // Por ahora solo actualizamos el estado local
      dispatch({ type: 'UPDATE_USER', payload: userData });
      
      // También actualizar en localStorage
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al actualizar perfil';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}