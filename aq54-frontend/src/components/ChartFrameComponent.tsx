
import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { DataTableComponent } from './DataTableComponent';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import chartConfig from '../configs/chart-config';
import { stationDataType } from '../configs/types';

export default function ChartFrameComponent({ currentStation1, currentStation2 }: { currentStation1: stationDataType | undefined, currentStation2: stationDataType | undefined }) {
   const [chartData, setChartData] = useState({});
   const [chartOptions, setChartOptions] = useState({});
   const [chartType, setChartType] = useState("line");

   const chartTypes = [
      { label: "Line", value: "line" },
      { label: "Bar", value: "bar" },
   ];


   useEffect(() => {

      const chartConf = chartConfig(currentStation1, currentStation2)

      const data = chartConf?.data
      const options = chartConf?.options

      setChartData(data);
      setChartOptions(options);
   }, [chartType, currentStation1, currentStation2]);


   return (
      <div className="p-d-flex p-flex-column">
         <div className="p-mb-4">
            <Card title="Visualisation en temps réel" className="text-center"
               style={{
                  marginBottom: "40px",
                  backgroundColor: "#00264d",
                  color: "white",
               }}
            >
               <div className="p-card-header">
                  <h2 className="p-mt-0" style={{ textAlign: "center" }}>
                     Taux de concentration des particules dans l'air
                  </h2>
               </div>
               <div className="p-card-body">
                  <Chart type={chartType} options={chartOptions} data={chartData} />
               </div>
               <div className="p-grid p-justify-end mb-2">
                  <div className="p-field space-x-2 float-end">
                     <label htmlFor="chart_type" style={{ color: "#fff" }}>
                        Type d'affichage
                     </label>
                     <Dropdown
                        id="chart_type"
                        value={chartType}
                        options={chartTypes}
                        onChange={(e) => setChartType(e.value)}
                        className="p-inputtext-sm"
                     />
                  </div>
               </div>
            </Card>
         </div>

         <DataTableComponent />
      </div>
   )
}
