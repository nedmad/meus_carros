import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../services/firebase";

interface ProviderAuth {
  signed: boolean;
  userAuth: AuthContextUser | null;
  loading: boolean;
}
interface AuthContextUser {
  uid: string;
  name?: string | null;
  email?: string | null;
}
export const ContextAuth = createContext({} as ProviderAuth);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userAuth, setUserAuth] = useState<AuthContextUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const login = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        });
        setLoading(false);
      } else {
        setLoading(false);
        setUserAuth(null);
      }
    });
    return () => {
      login();
    };
  }, []);

  return (
    <>
      <ContextAuth.Provider value={{ signed: !!userAuth, userAuth, loading }}>
        {children}
      </ContextAuth.Provider>
    </>
  );
}
