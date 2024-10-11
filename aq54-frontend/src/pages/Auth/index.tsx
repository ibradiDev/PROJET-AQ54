import { useNavigate } from "react-router-dom";
import { useEffect, } from 'react';
import { auth } from "../../firebase-config";
import { Card } from "primereact/card";
import { AuthComponent } from "../../components/Auth";
import { onAuthStateChanged, } from "firebase/auth";

export default function Auth() {
   const navigate = useNavigate();

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) navigate("/app");
      });

      return () => unsubscribe();
   }, []);


   return (
      <Card className="flex justify-center bg-blue-50">
         <AuthComponent />
      </Card>
   );
}
