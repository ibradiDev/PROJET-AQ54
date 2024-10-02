import { chartDataType, stationDataType } from "./types";
export default function chartConfig(
  currentStation1: stationDataType | undefined,
  currentStation2: stationDataType | undefined
) {
  if (!currentStation1 && !currentStation2) {
    return;
  }

  const chartData1: chartDataType = {
    ...currentStation1,
  };
  const chartData2: chartDataType = {
    ...currentStation2,
  };

  const documentStyle = getComputedStyle(document.documentElement);
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );

  const data: any = {
    labels: [
      "extT (˚C)",
      "rh (%)",
      "o3 (µg/m³)",
      "no2 (µg/m³)",
      "co (µg/m³)",
      "pm25 (µg/m³)",
      "pm10 (µg/m³)",
    ],
    datasets: [
      {
        label: currentStation1?.station_name,
        data: [
          chartData1.extT,
          chartData1.rh,
          chartData1.o3,
          chartData1.no2,
          chartData1.co,
          chartData1.pm25,
          chartData1.pm10,
        ],
        fill: false,
        borderColor: documentStyle.getPropertyValue("--blue-500"),
        backgroundColor: documentStyle.getPropertyValue("--blue-500"),
        tension: 0.4,
      },
      {
        label: currentStation2?.station_name,
        data: [
          chartData2.extT,
          chartData2.rh,
          chartData2.o3,
          chartData2.no2,
          chartData2.co,
          chartData2.pm25,
          chartData2.pm10,
        ],
        fill: false,
        borderColor: documentStyle.getPropertyValue("--pink-500"),
        backgroundColor: documentStyle.getPropertyValue("--pink-500"),
        tension: 0.4,
      },
    ],
  };

  const options: any = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColorSecondary,
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return { data, options };
}
