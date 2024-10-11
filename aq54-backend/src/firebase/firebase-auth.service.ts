import { Injectable } from '@nestjs/common';
import { admin } from './firebase-admin';

@Injectable()
export class FirebaseAuthService {
  async verifyToken(token: string) {
    return await admin.auth().verifyIdToken(token);
  }
}
