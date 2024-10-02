import { Button } from 'primereact/button';
import NotFoundImage from '/src/assets/images/404.webp';

const NotFound = () => {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
         <h1 className="text-8xl font-bold text-blue-700 mb-4">404</h1>

         <p className="text-2xl text-gray-600 mb-6">
            Oups, cette page n'existe pas !
         </p>

         <img
            src={NotFoundImage}
            alt="Page introuvable"
            className="mb-6 w-1/3 rounded-lg max-w-xs"
         />

         <Button
            label="Retour à l'accueil"
            className="p-button-primary px-5 py-3"
            onClick={() => window.location.href = '/'}
         />
      </div>
   );
};

export default NotFound;
