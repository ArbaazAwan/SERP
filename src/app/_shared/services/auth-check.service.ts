import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckService {

  constructor(private router: Router) { }

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (!localStorage.getItem('UserId')) {
        // User is logged in, redirect to the dashboard
        this.router.navigate(['/Login']);
      }
      resolve();
    });
  }
}
