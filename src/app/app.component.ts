import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CompanyCodeService } from './_shared/services/company-code.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  menuBar: MenuItem[];
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private companyCodeService: CompanyCodeService,
  ) {
    this.menuBar = [
      {
        label: 'User Settings',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Change Password',
            icon: 'pi pi-fw pi-pencil',
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            routerLink: '/',
            command: () => this.loggedOut(),
          },
        ],
      },
    ];

    // Check if the user is logged in based on the presence of 'UserId' in local storage
    this.isLoggedIn = localStorage.getItem('UserId') !== null;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update the isLoggedIn property whenever the route changes
        this.isLoggedIn = localStorage.getItem('UserId') !== null;
      }
     
    });
  }

  ngOnInit() {
    this.companyCodeService.getCookie('apiUrl');
    this.companyCodeService.getCookie('reportingApiUrl');
  }

  loggedOut() {
    // Remove 'UserId' from local storage and set isLoggedIn to false
    localStorage.removeItem('UserId');
    this.isLoggedIn = false;
  }

  isLoginPage(): boolean {
    return this.router.url === '/';
  }
}
