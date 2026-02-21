import React, { createContext, useContext, useState, useEffect } from "react";

// ─── API base (proxied via Vite → http://localhost:5000) ───
const API = "/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  class: string;
  board: string;
  subjects: string[];
  examGoal: string;
  examDate: string;
  dailyStudyHours: number;
  strengths: string[];
  weaknesses: string[];
  careerInterests: string[];
  onboardingComplete: boolean;
  joinedAt: string;
  xp: number;
  level: number;
  streak: number;
  totalStudyHours: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_PROFILE_TEMPLATE: Omit<UserProfile, "id" | "name" | "email" | "joinedAt"> = {
  class: "12th",
  board: "CBSE",
  subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
  examGoal: "JEE Advanced",
  examDate: "2026-05-15",
  dailyStudyHours: 6,
  strengths: ["Mathematics", "Physics"],
  weaknesses: ["Chemistry"],
  careerInterests: ["Engineering", "Technology"],
  onboardingComplete: false,
  xp: 0,
  level: 1,
  streak: 0,
  totalStudyHours: 0,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // ─── Restore session from localStorage on mount ───
  useEffect(() => {
    const storedToken = localStorage.getItem("learnsync_token");
    const storedUser = localStorage.getItem("learnsync_user");
    const storedProfile = localStorage.getItem("learnsync_profile");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setProfile(storedProfile ? JSON.parse(storedProfile) : null);
    }
    setIsLoading(false);
  }, []);

  // ─── LOGIN: calls POST /api/auth/login ───
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message || "Login failed");
        setIsLoading(false);
        return false;
      }

      // Backend returns { token, user: { id, name, email } }
      const jwt = data.token;
      const backendUser = data.user;

      const authUser: AuthUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        onboardingComplete: true, // existing user → assume onboarded
      };

      // Build profile (restore from localStorage if available, else use defaults)
      const storedProfile = localStorage.getItem("learnsync_profile");
      const userProfile: UserProfile = storedProfile
        ? { ...JSON.parse(storedProfile), id: authUser.id, name: authUser.name, email: authUser.email }
        : {
          ...DEFAULT_PROFILE_TEMPLATE,
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          onboardingComplete: true,
          joinedAt: new Date().toISOString(),
        };

      // Persist everything
      localStorage.setItem("learnsync_token", jwt);
      localStorage.setItem("learnsync_user", JSON.stringify(authUser));
      localStorage.setItem("learnsync_profile", JSON.stringify(userProfile));

      setToken(jwt);
      setUser(authUser);
      setProfile(userProfile);
      setIsLoading(false);

      console.log("[Auth] Login successful for", authUser.email);
      return true;
    } catch (err) {
      console.error("[Auth] Login network error:", err);
      setAuthError("Network error. Is the backend running?");
      setIsLoading(false);
      return false;
    }
  };

  // ─── SIGNUP: calls POST /api/auth/register, then auto-login ───
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Step 1: Register the user
      const regRes = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        setAuthError(regData.message || "Registration failed");
        setIsLoading(false);
        return false;
      }

      console.log("[Auth] Registration successful for", email);

      // Step 2: Auto-login to get JWT token
      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        // Registration succeeded but login failed — user can manually login
        setAuthError("Registered! Please log in manually.");
        setIsLoading(false);
        return false;
      }

      const jwt = loginData.token;
      const backendUser = loginData.user;

      const authUser: AuthUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        onboardingComplete: false, // new user → needs onboarding
      };

      const newProfile: UserProfile = {
        ...DEFAULT_PROFILE_TEMPLATE,
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        onboardingComplete: false,
        joinedAt: new Date().toISOString(),
      };

      // Persist everything
      localStorage.setItem("learnsync_token", jwt);
      localStorage.setItem("learnsync_user", JSON.stringify(authUser));
      localStorage.setItem("learnsync_profile", JSON.stringify(newProfile));

      setToken(jwt);
      setUser(authUser);
      setProfile(newProfile);
      setIsLoading(false);

      console.log("[Auth] Auto-login after signup successful");
      return true;
    } catch (err) {
      console.error("[Auth] Signup network error:", err);
      setAuthError("Network error. Is the backend running?");
      setIsLoading(false);
      return false;
    }
  };

  // ─── LOGOUT: clear everything ───
  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    setAuthError(null);
    localStorage.removeItem("learnsync_token");
    localStorage.removeItem("learnsync_user");
    localStorage.removeItem("learnsync_profile");
    console.log("[Auth] Logged out");
  };

  // ─── PROFILE UPDATES (local for now) ───
  const updateProfile = (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem("learnsync_profile", JSON.stringify(updated));
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    if (!profile || !user) return;
    const updated = { ...profile, ...data, onboardingComplete: true };
    const updatedUser = { ...user, onboardingComplete: true };
    setProfile(updated);
    setUser(updatedUser);
    localStorage.setItem("learnsync_profile", JSON.stringify(updated));
    localStorage.setItem("learnsync_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        login,
        signup,
        logout,
        updateProfile,
        completeOnboarding,
        isLoading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
