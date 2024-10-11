import axios, { AxiosResponse } from "axios";
import { stationDataType } from "../configs/types";
import { getAuth } from "firebase/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

// Types d'erreur personnalisés
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Fction utilitaire pour effectuer des requêtes authentifiées
async function authenticatedRequest<T>(url: string): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new AuthenticationError("Utilisateur non authentifié");
  }

  try {
    const response: AxiosResponse<T> = await API.get(url, {
      // withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(`Erreur lors de la requête API vers ${url}:`, err);
    throw new ApiError(`Échec de la requête API vers ${url}`);
  }
}

export const getHourlyAvg = async () => {
  try {
    const data = await authenticatedRequest<{
      hourlyDataStation1: any;
      hourlyDataStation2: any;
    }>("/hourly-avg");

    if (!data.hourlyDataStation1 || !data.hourlyDataStation2) {
      throw new ApiError("Données station manquantes dans la réponse");
    }

    return data;
  } catch (err) {
    console.error("Erreur lors de la récupération des données horaires:", err);
    throw err;
  }
};

export const getCurrentValues = async () => {
  try {
    const data = await authenticatedRequest<{
      currentStation1: stationDataType;
      currentStation2: stationDataType;
    }>("/current");

    if (!data.currentStation1 || !data.currentStation2) {
      throw new ApiError("Données station manquantes dans la réponse");
    }

    return {
      station1: data.currentStation1,
      station2: data.currentStation2,
    };
  } catch (err) {
    console.error("Erreur lors de la récupération des valeurs actuelles:", err);
    throw err;
  }
};

async function getToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const token = await user.getIdToken();
  return token;
}
