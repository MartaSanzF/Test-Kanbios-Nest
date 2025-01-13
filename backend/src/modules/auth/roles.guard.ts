import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

  // La méthode `canActivate` doit recevoir un `ExecutionContext` pour récupérer la requête
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest(); // Accéder à la requête
    const user = request.user; // Récupérer l'utilisateur attaché à la requête par le AuthGuard

    if (!user) {
      throw new HttpException('No user found in request', HttpStatus.UNAUTHORIZED);
    }

    const userRole = user.role; // Récupérer le rôle de l'utilisateur

    // Vérifier si l'utilisateur a un rôle 'admin' (ou un autre rôle de votre choix)
    if (userRole !== 'admin') {
      throw new HttpException('Not Authorized', HttpStatus.FORBIDDEN);
    }

    return true; // Si le rôle est correct, on autorise l'accès
  }
}
