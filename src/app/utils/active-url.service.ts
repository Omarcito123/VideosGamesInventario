import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ActiveUrlService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(){
    let state: boolean = false;
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }else{
      state = true;
    }
    return state;
  }
}