import { useState, useEffect } from "react";
import { auth } from "../firebase-config";

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      } else setToken(null);
    });

    return () => unsubscribe();
  }, []);

  return token;
};
