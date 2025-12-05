import { SessionManager } from "@/lib/session";
import type { AuthData } from "@/types";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface AuthContextType {
  user: AuthData | null;
  loading: boolean;
  checkCurrentUser: () => Promise<void>;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<AuthData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await SessionManager.getUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (data: AuthData) => {
      await SessionManager.loginCookie(data);
      setUser(data);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    await SessionManager.logoutCookie();
    setUser(null);
  }, []);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        checkCurrentUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
