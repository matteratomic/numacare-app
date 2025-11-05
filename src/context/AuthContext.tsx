import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userEmail?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  state: AuthState;
  login: (input: LoginInput) => void;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    hasCompletedOnboarding: false,
  });

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
    }));
  }, []);

  const login = useCallback((input: LoginInput) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      userEmail: input.email,
    }));
  }, []);

  const logout = useCallback(() => {
    setState({
      isAuthenticated: false,
      hasCompletedOnboarding: true,
      userEmail: undefined,
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      login,
      logout,
      completeOnboarding,
    }),
    [completeOnboarding, login, logout, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
