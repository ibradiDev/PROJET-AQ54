import axios from "axios";
import { stationDataType } from "../configs/types";
export const DATA_API = "http://localhost:8000/air-quality";

export const getHourlyAvg = async () => {
  try {
    const response = await axios.get(`${DATA_API}/hourly-avg`);
    const { hourlyDataStation1, hourlyDataStation2 } = response.data;
    return { hourlyDataStation1, hourlyDataStation2 };
  } catch (err) {
    console.error();
  }
};

export const getCurrentValues = async () => {
  try {
    const response = await axios.get(`${DATA_API}/current`);
    const currentStation1: stationDataType = response.data.currentStation1;
    const currentStation2: stationDataType = response.data.currentStation2;
    return { currentStation1, currentStation2 };
  } catch (err) {
    console.error();
    return;
  }
};
