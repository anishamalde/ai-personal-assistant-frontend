import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../../amplify-config";
import { signIn, fetchAuthSession } from "aws-amplify/auth";

Amplify.configure(amplifyConfig);

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      // Check if user is authenticated by trying to get the current session
      const session = await fetchAuthSession();
      setIsAuthenticated(session.tokens !== undefined);
    } catch (error) {
      console.log("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      console.log("trying to sign in ");
      const signInResult = await signIn({
        username,
        password,
      });
      console.log(signInResult);

      if (signInResult.nextStep.signInStep === "DONE") {
        setIsAuthenticated(true);
      }

      return signInResult;
    } catch (error) {
      console.log("Sign in error:", error);
      throw error;
    }
  };

  // Context value to provide
  const authContextValue = {
    isAuthenticated,
    isLoading,
    signIn: handleSignIn,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
