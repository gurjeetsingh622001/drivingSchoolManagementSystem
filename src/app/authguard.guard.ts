import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { ApiServiceService } from './shared/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class Authguard implements CanActivate {
  constructor(private router: Router, private apiService: ApiServiceService) {
  }

  canActivate(): boolean {
    const user = localStorage.getItem('user')
    if (user) {
      const userId = JSON.parse(user).localId
      return true
    }
    this.router.navigate(['login'])
    return false;
  }

  checkRole(userId: string) {
    this.apiService.checkUserRole(userId).then((user: any) => {
      this.router.navigateByUrl(user.role)
    }).catch(err => {
      this.router.navigate(['login'])
    })
  }

}
