import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SecurityService } from '../auth/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  messageClass;
  message;
  processing = false;
  previousUrl;
  public loading = false;
  constructor(private formBuilder: FormBuilder, private authGuard: AuthGuard, private service: SecurityService, private router: Router) { }

  ngOnInit() {
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = "You must be logged in to view that page"
      this.previousUrl = this.authGuard.redirectUrl; // Set the previous URL user was redirected from
      this.authGuard.redirectUrl = undefined; // Erase previous URL
    }



    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }


  // Function to disable form
  disableForm() {
    this.loginForm.controls['username'].disable(); // Disable username field
    this.loginForm.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.loginForm.controls['username'].enable(); // Enable username field
    this.loginForm.controls['password'].enable(); // Enable password field
  }

  login() {
    this.loading = true;
    this.processing = true
    this.disableForm();
    this.service.login(this.loginForm.value).subscribe(res => {
      console.log(res)


      // Check if response was a success or error
      if (!res.success) {
        this.loading = false;
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = res.message; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      } else {
        this.loading = true;
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = res.message; // Set success message
        // Function to store user's token in client local storage
        this.service.storeLoginUserData(res.token, res.user);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          this.loading = true;
          // Check if user was redirected or logging in for first time
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
          } else {
            this.router.navigate(['profile']); // Navigate to dashboard view
          }
        }, 2000);
        // this.service.logedIn()
      }
    })


  }
}
