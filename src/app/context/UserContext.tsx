"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthday?: string;
  profile_image?: string | null;
  interests?: string[];
  password?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Rafraîchissement automatique toutes les 2000 secondes
  useEffect(() => {
    if (!user?.id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://bernard-backend-a1go.onrender.com/users/${user.id}`);
        if (!res.ok) {
          console.warn("Impossible de rafraîchir les infos utilisateur");
          return;
        }
        const freshUser: User = await res.json();
        setUser(freshUser);
      } catch (error) {
        console.error("Erreur lors de la récupération utilisateur :", error);
      }
    };

    fetchUser();
    const interval = setInterval(fetchUser, 2000 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

