import { signOut } from 'firebase/auth';
import { Button } from 'primereact/button';
import { auth } from '../firebase-config';

export const HeaderComponent = () => {
   const handleLogout = async () => {
      await signOut(auth);
   };
   
   return (
      <div className="">
         <header
            className="p-card mb-8 p-4 rounded-lg text-white flex justify-between"
            style={{
               backgroundColor: "#0284c7",
               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",

            }}
         >
            <div className='h-full text-center py-0'>
               <h1 className='font-bold text-3xl' >
                  AirQ54
               </h1>
            </div>
            <div className="h-full py-0">
               <Button
                  label="Se deconnecter"
                  severity="danger"
                  color="#fff"
                  rounded
                  onClick={handleLogout}
               />
            </div>
         </header>
      </div>
   );
};
