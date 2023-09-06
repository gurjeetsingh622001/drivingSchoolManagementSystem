import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiServiceService } from '../shared/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardGuard implements CanActivate {
  constructor(private router: Router, private apiService: ApiServiceService) {
  }

  canActivate(): boolean {
    const user = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    if (user) {
      const userId = JSON.parse(user).localId;
      console.log(role, userId)
      if (role === 'admin') {
        return true;
      }
      this.router.navigate(['login']);
      return false
    }
    this.router.navigate(['login']);
    return false;
  }


}
