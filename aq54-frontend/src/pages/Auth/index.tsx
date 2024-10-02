import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { auth } from "../../firebase";
import { Card } from "primereact/card";
import { AuthComponent } from "../../components/Auth";

export default function Auth() {
   const navigate = useNavigate();

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) navigate("/app");
      });
      return () => unsubscribe();
   }, [navigate]);
   return (
      <Card className="flex justify-center bg-blue-50">
         <AuthComponent />
      </Card>
   );
}
