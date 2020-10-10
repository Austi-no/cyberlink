import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/security/auth/security.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl: any;
  user: any;
  username: any;
  email: any;
  foundProfile: boolean;
  messageClass: string;
  message: any;
  description: any;
  phone: any;

  loading: boolean = true
  constructor(private service: SecurityService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentUrl = this.route.snapshot.params;
    this.service.getPublicProfile(this.currentUrl.username).subscribe(res => {
      // Check if user was found in resbase
      if (!res.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = res.message; // Return error message
        this.loading=false
      } else {
        this.username = res.user.username; // Save the username for use in HTML
        this.email = res.user.email; // Save the email for use in HTML
        this.phone = res.user.phone; // Save the email for use in HTML
        this.description = res.user.description; // Save the email for use in HTML
        this.foundProfile = true; // Enable profile table
        this.loading = false;
      }
    })
  }

}
