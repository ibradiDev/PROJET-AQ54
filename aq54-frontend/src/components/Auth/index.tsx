import { AuthErrorCodes, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { useState } from 'react';
import { auth } from '../../firebase';

export const AuthComponent = () => {
   const [loading, setLoading] = useState(false);
   const [isRegister, setIsRegister] = useState(false);
   const [error, setError] = useState("");

   const [credentials, setCredentials] = useState({
      email: "",
      password: "",
      confirmPassword: "",
   });

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const isFormSwitch = () => {
      setError("");
      setCredentials({ email: "", password: "", confirmPassword: "" });
      setIsRegister(!isRegister);
   };

   const handleFormChange = (e: { target: { name: any; value: any } }) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const isFormValid = () => {
      setError("");
      const { email, password, confirmPassword } = credentials;
      if (isRegister) {
         if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return false;
         } else if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return false;
         } else if (!emailRegex.test(email)) {
            setError("Adresse email invalide.");
            return false;
         }
         return true;
      } else {
         if (!emailRegex.test(email) || email === "" || password === "") {
            setError("Email ou mot de passe invalide.");
            return false;
         }
         return true;
      }
   };

   const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      load();

      const { email, password } = credentials;
      if (isRegister) {
         if (isFormValid()) {
            await createUserWithEmailAndPassword(auth, email, password).catch(() => {
               if (AuthErrorCodes.EMAIL_EXISTS) setError("Ce compte existe déjà");
               else setError("Désolé, nous rencontrons un problème");
            });
         }
      } else {
         if (isFormValid()) {
            await signInWithEmailAndPassword(auth, email, password).catch(() => {
               if (AuthErrorCodes.INVALID_EMAIL || AuthErrorCodes.INVALID_PASSWORD) {
                  setError("Email ou mot de passe incorrect.");
               } else {
                  setError("Désolé, nous rencontrons un problème!");
               }
            });
         }
      }
   };

   const load = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
   };

   return (
      <div className="flex justify-center items-center min-h-screen">
         <div className="card w-full p-6 bg-white justify-center text-center shadow-lg rounded-xl space-y-8">
            <h1 className="text-4xl text-blue-600 font-bold text-center mb-2">AirQ54</h1>
            <p className="text-center text-gray-500 mb-6">Votre plateforme d'information sur la Qualité de l'Air</p>

            {error && (
               <Message className="text-wrap text-center mb-4" text={error} severity="error" />
            )}

            <div className="card flex justify-center">
               <FloatLabel className="w-full">
                  <InputText
                     id="email"
                     type="email"
                     name="email"
                     className="w-full"
                     value={credentials.email}
                     onChange={handleFormChange}
                  />
                  <label htmlFor="email">Email</label>
               </FloatLabel>
            </div>

            <div className="card flex justify-center mt-4">
               <FloatLabel className="w-full">
                  <InputText
                     className="w-full"
                     id="password"
                     type='password'
                     value={credentials.password}
                     name="password"
                     onChange={handleFormChange}
                  />
                  <label htmlFor="password">Mot de passe</label>
               </FloatLabel>
            </div>

            {isRegister && (
               <div className="card flex justify-center mt-4">
                  <FloatLabel className="w-full">
                     <InputText
                        type='password'
                        className="w-full"
                        value={credentials.confirmPassword}
                        name="confirmPassword"
                        onChange={handleFormChange}
                     />
                     <label htmlFor="confirmPassword">Répétez mot de passe</label>
                  </FloatLabel>
               </div>
            )}

            <div className="card flex flex-col justify-center gap-3 mt-6">
               <Button
                  label="Soumettre"
                  rounded
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  icon={loading ? "pi pi-check" : ""}
                  iconPos="right"
                  loading={loading}
                  onClick={handleSubmit}
               />
               <Button
                  onClick={isFormSwitch}
                  label={isRegister ? "J'ai déjà un compte" : "Je n'ai pas de compte"}
                  severity="info"
                  text
                  className="mt-4 text-blue-600 hover:text-blue-700"
               />
            </div>

         </div>
      </div>
   );
};
