import { useEffect, useState, useCallback } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { HeaderComponent } from "../../components/HeaderComponent";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { getCurrentValues } from "../../services/services";
import { stationDataType } from "../../configs/types";
import ChartFrameComponent from "../../components/ChartFrameComponent";
import { onAuthStateChanged } from "firebase/auth";
import { DataTableComponent } from "../../components/DataTableComponent";

export default function Main() {


   const [currentStations, setCurrentStations] = useState<{
      station1?: stationDataType;
      station2?: stationDataType;
   }>({});
   const [loading, setLoading] = useState(true);
   const [errorMsg, setErrorMsg] = useState("");
   const navigate = useNavigate();


   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (!user) {
            Promise.resolve(navigate("/security/auth")).catch(() => {
               setErrorMsg("Erreur lors de la redirection vers la page de connexion");
            });
         }
      });

      return () => unsubscribe();
   }, [navigate]);


   const fetchData = useCallback(async () => {
      try {
         const response = await getCurrentValues();
         if (response) {
            setCurrentStations(response);
            setLoading(false);
         }
      } catch (error) {
         console.error("Erreur lors de la récupération des données:", error);
         setErrorMsg("Erreur lors de la récupération des données");
         setLoading(false);
      }
   }, []);


   useEffect(() => {
      const fetchDataAndSetInterval = async () => {
         await fetchData();
         const intervalId = setInterval(fetchData, 180000);
         return () => clearInterval(intervalId);
      };

      fetchDataAndSetInterval();
   }, [fetchData]);

   const renderContent = () => {
      if (loading) {
         return (
            <div className="flex flex-col text-center space-y-3" style={{ color: "#6b7280", fontSize: "1.125rem" }}>
               <ProgressSpinner style={{ width: "50px", height: "50px" }} aria-label="Loading" strokeWidth="1" animationDuration=".7s" />
               <span>Chargement des données...</span>
            </div>
         );
      }

      if (errorMsg) {
         return (
            <div className="flex flex-col text-center space-y-3" style={{ color: "#6b7280", fontSize: "1.125rem" }}>
               <label>{errorMsg}</label>
            </div>
         );
      }

      return (
         <div className="p-grid">
            <div className="p-col">
               <ChartFrameComponent
                  currentStation1={currentStations.station1}
                  currentStation2={currentStations.station2}
               />
               <DataTableComponent />
            </div>
         </div>
      );
   };

   return (
      <div className="p-component" style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: "1rem" }}>
         <HeaderComponent />
         <div className="p-card p-component" style={{
            maxWidth: "1024px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            padding: "1.5rem",
         }}>
            {renderContent()}
         </div>
      </div>
   );
}
