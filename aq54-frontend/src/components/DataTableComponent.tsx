import { FilterMatchMode } from "primereact/api";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { useState, useEffect } from 'react';
import { getHourlyAvg } from "../services/services";


export const DataTableComponent = () => {
   const [hourlyAvgStation1, setHourlyAvgStation1] = useState(null);
   const [hourlyAvgStation2, setHourlyAvgStation2] = useState(null);
   const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      timestamp: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      extT: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      rh: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      no2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      co: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      pm10: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      pm25: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
   });
   const [_loading, setLoading] = useState(true);
   const [isStation1Up, setIsStation1Up] = useState(true);
   const [globalFilterValue, setGlobalFilterValue] = useState("");


   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const response = await getHourlyAvg();
         if (response) {
            const { hourlyDataStation1, hourlyDataStation2 } = response;
            setHourlyAvgStation1(hourlyDataStation1);
            setHourlyAvgStation2(hourlyDataStation2);
         }
         setLoading(false);
      };
      fetchData();

      // Mettre à jour les données toutes les 3 minutes
      const intervalId = setInterval(fetchData, 18000);

      return () => clearInterval(intervalId);
   }, []);


   const onGlobalFilterChange = (e: any) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
   };

   const renderHeader = () => {
      return (
         <div className="flex justify-content-end">
            <IconField iconPosition="left">
               <InputIcon className="pi pi-search" />
               <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Mot clé"
               />
            </IconField>
         </div>
      );
   };

   const header = renderHeader();

   return (
      <Card
         className="text-center"
         title={"Données aggrégées par heure depuis les deux stations"}
      >
         <SelectButton
            value={isStation1Up}
            options={[
               { label: "SMART188", value: true },
               { label: "SMART189", value: false },
            ]}
            onChange={(e) => setIsStation1Up(e.value)}
         />
         <DataTable
            value={isStation1Up ? hourlyAvgStation1 || [] : hourlyAvgStation2 || []}
            paginator
            rows={10}
            dataKey="id"
            filters={filters}
            filterDisplay="row"
            // loading={loading}
            globalFilterFields={[
               "timestamp",
               "extT",
               "rh",
               "no2",
               "co",
               "pm10",
               "pm25",
            ]}
            header={header}
            emptyMessage="Aucune donnée"
         >
            <Column
               header="DateTime"
               field="timestamp"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
            <Column
               header="extT (°C)"
               field="extT"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
            <Column
               header="rh (%)"
               field="rh"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
            <Column
               header="no2 (µg/m³)"
               field="no2"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
            <Column
               header="co (µg/m³)"
               field="co"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
            <Column
               header="pm25 (µg/m³)"
               field="pm25"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
            <Column
               header="pm10 (µg/m³)"
               field="pm10"
               filter
               filterPlaceholder="Search"
               style={{ minWidth: "12rem" }}
            />
         </DataTable>
      </Card>
   );
}
