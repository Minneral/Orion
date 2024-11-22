import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { User } from '../types/User';

const AuthContext = createContext<User | null>(null);

type AuthProviderProps = PropsWithChildren & {
  isSignedIn?: boolean;
};

export default function AuthProvider({
  children,
  isSignedIn,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(isSignedIn ? JSON.parse(Cookies.get('user') || 'null') : null);

  useEffect(() => {
    setUser(isSignedIn ? JSON.parse(Cookies.get('user') || 'null') : null);
  }, [Cookies.get('user')]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
