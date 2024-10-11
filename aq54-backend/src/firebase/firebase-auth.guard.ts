import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { admin } from './firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Aucun token d'autorisation fourni");
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      // console.log('Token décodé:', decodedToken);
      request.user = decodedToken;
      return true;
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
