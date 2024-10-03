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
    const station1: stationDataType = response.data.currentStation1;
    const station2: stationDataType = response.data.currentStation2;
    return { station1, station2 };
  } catch (err) {
    console.error(err);
    return;
  }
};
