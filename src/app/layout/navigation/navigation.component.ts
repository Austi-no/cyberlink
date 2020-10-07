import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/security/auth/security.service';
import { SessionService } from 'src/app/security/auth/session.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  userLoggedIn = false
  constructor(public service: SecurityService, private router: Router) { }

  ngOnInit() {

  }
  logout() {
    this.service.logout();
    this.router.navigate(["/"])

  }

}
