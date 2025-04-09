import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import {
  signIn,
  fetchAuthSession,
  fetchUserAttributes,
  signOut,
} from "aws-amplify/auth";
import { Platform } from "react-native";

interface UserData {
  nickname?: string;
  email?: string;
  sub?: string;
  [key: string]: string | undefined;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: UserData | null;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

/**
 * Authentication context for managing user sessions
 * @type {React.Context<AuthContextType | null>}
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication provider component that manages user authentication state
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Auth provider component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const fetchUserData = async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) return null;

    try {
      isFetchingRef.current = true;
      const attributes = await fetchUserAttributes();

      setUserData({
        nickname: attributes.nickname,
        email: attributes.email,
        sub: attributes.sub,
        ...attributes,
      });

      return attributes;
    } catch (error) {
      console.log("Error fetching user attributes:", error);
      return null;
    } finally {
      isFetchingRef.current = false;
    }
  };

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      // Check if user is authenticated by trying to get the current session
      const session = await fetchAuthSession();
      const isAuth = session.tokens !== undefined;
      setIsAuthenticated(isAuth);

      if (isAuth) {
        await fetchUserData();
      }
    } catch (error) {
      console.log("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles user sign-in process
   * @param {string} username - User's username or email
   * @param {string} password - User's password
   * @returns {Promise<any>} Sign-in result from AWS Amplify
   * @throws Will throw an error if sign-in fails
   */
  const handleSignIn = async (username: string, password: string) => {
    try {
      console.log(`Attempting to sign in user on ${Platform.OS}: ${username}`);

      const signInResult = await signIn({
        username,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      console.log("Sign in result:", JSON.stringify(signInResult));

      if (signInResult.nextStep.signInStep === "DONE") {
        setIsAuthenticated(true);
        await fetchUserData();
      }

      return signInResult;
    } catch (error) {
      console.log("Sign in error:", error);
      console.log("Error details:", JSON.stringify(error));
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  const refreshUserData = async () => {
    if (isAuthenticated && !isFetchingRef.current) {
      await fetchUserData();
    }
  };

  const authContextValue = {
    isAuthenticated,
    isLoading,
    userData,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
