import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { UserService } from '../_shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private user:UserService,private router:Router,){}
  canActivate():boolean{
    if(localStorage.getItem("UserId")){
      return true

    }
    else{
      this.router.navigate(['/Login'])
      return false

    }
  }

  }



