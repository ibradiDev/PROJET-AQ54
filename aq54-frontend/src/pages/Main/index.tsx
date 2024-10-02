import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { HeaderComponent } from "../../components/HeaderComponent.jsx";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import { getCurrentValues } from "../../services/services.js";
import { stationDataType } from "../../configs/types.js";
import ChartFrameComponent from "../../components/ChartFrameComponent.js";

export default function Main() {
   const [currentStation1, setCurrentStation1] = useState<stationDataType | undefined>();
   const [currentStation2, setCurrentStation2] = useState<stationDataType | undefined>();
   const [loading, setLoading] = useState(true);
   const [errorMsg, setErrorMsg] = useState("");

   const navigate = useNavigate();


   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await getCurrentValues();

            if (response) {
               const { currentStation1, currentStation2 } = response;
               setCurrentStation1(currentStation1);
               setCurrentStation2(currentStation2);
               setLoading(false);
            } else {
               console.error("Aucune donnée renvoyée");
            }
         } catch (err) {
            console.error(
               "Erreur lors de la récupération des données :",
               err
            );
            const timeoutId = setTimeout(() => {
               setLoading(false);
               setErrorMsg(
                  "Impossible de récupérer les données. Veuillez vérifier votre connexion internet ou rechargez la page."
               );
            }, 10000);


            return () => clearTimeout(timeoutId);
         }
      };
      fetchData();

      // Lancer la requête chaque 3 min
      const intervalId = setInterval(fetchData, 180000);

      // Quand le composant se demonte
      return () => clearInterval(intervalId);
   }, []);

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         if (!user) navigate("/security/auth");
      });

      return () => unsubscribe();
   }, [navigate]);

   return (
      <div
         className="p-component"
         style={{
            minHeight: "100vh",
            backgroundColor: "#f1f5f9",
            padding: "1rem",
         }}
      >
         <HeaderComponent />

         <div
            className="p-card p-component"
            style={{
               maxWidth: "1024px",
               margin: "0 auto",
               backgroundColor: "white",
               borderRadius: "6px",
               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
               padding: "1.5rem",
            }}
         >
            {loading ? (
               <div
                  className="flex flex-col text-center space-y-3"
                  style={{ color: "#6b7280", fontSize: "1.125rem" }}
               >
                  <ProgressSpinner
                     style={{ width: "50px", height: "50px" }}
                     aria-label="Loading"
                     strokeWidth="1"
                     animationDuration=".7s"
                  />
                  <span>Chargement des données...</span>
               </div>
            ) : errorMsg ? (
               <div
                  className="flex flex-col text-center space-y-3"
                  style={{ color: "#6b7280", fontSize: "1.125rem" }}
               >
                  <label>{errorMsg}</label>
               </div>
            ) : (
               <div className="p-grid">
                  <div className="p-col">
                     <ChartFrameComponent
                        currentStation1={currentStation1}
                        currentStation2={currentStation2}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
