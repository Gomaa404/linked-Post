import { createContext, useEffect, useState, useCallback } from "react";
import { getLoggedUser } from "@/Api";

export const tokenContext = createContext();

export default function TokenContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setUserData(null);
      return null;
    }
    setIsLoadingUser(true);
    try {
      const res = await getLoggedUser();
      setUserData(res?.data?.user || null);
      return res?.data?.user || null;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(null);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setUserData(null);
    }
  }, [token, refreshUser]);

  return (
    <tokenContext.Provider
      value={{ token, setToken, userData, setUserData, refreshUser, isLoadingUser }}
    >
      {children}
    </tokenContext.Provider>
  );
}
