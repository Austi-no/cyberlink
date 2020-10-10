import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../auth/security.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage = false;
  usernameValid;
  usernameMessage = false;
  usernamefound: boolean;
  public loading = false;
  // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }

  // Function to validate username is proper format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }

  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  constructor(private formBuilder: FormBuilder, private service: SecurityService, private router: Router) { }

  ngOnInit() {

    this.signupForm = this.formBuilder.group({

      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],

      // Email Input
      email: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(50), // Maximum length is 30 characters
        this.validateEmail // Custom validation
      ])],
      // Username Input
      username: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15), // Maximum length is 15 characters
        this.validateUsername // Custom validation
      ])],
      // Password Input
      password: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        this.validatePassword // Custom validation
      ])],
      // Confirm Password Input
      confirm: ['', Validators.required] // Field is required
    }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
  }




  // Function to disable the registration form
  disableForm() {
    this.signupForm.controls['email'].disable();
    this.signupForm.controls['username'].disable();
    this.signupForm.controls['password'].disable();
    this.signupForm.controls['confirm'].disable();
    this.signupForm.controls['lastName'].disable();
    this.signupForm.controls['firstName'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.signupForm.controls['email'].enable();
    this.signupForm.controls['username'].enable();
    this.signupForm.controls['password'].enable();
    this.signupForm.controls['confirm'].enable();
    this.signupForm.controls['lastName'].enable();
    this.signupForm.controls['firstName'].enable();
  }

  signup(): any {
    this.processing = true
    this.loading = true;
    this.disableForm()
    console.log(this.signupForm.value)
    this.service.createUser(this.signupForm.value).subscribe(res => {
      console.log(res)
      if (!res.success) {
        this.loading = false;
        this.messageClass = 'alert alert-danger text-center';
        this.message = res.message
        this.processing = false
        this.enableForm()
      } else {
        this.loading = true;
        this.messageClass = 'alert alert-success';
        this.message = res.message;
        setTimeout(() => {
          this.loading = true;
          this.router.navigate(['login'])
        }, 2000)
      }
    })

  }

  // Function to check if e-mail is taken
  checkEmail(): any {
    // Function from authentication file to check if e-mail is taken
    this.service.checkEmail(this.signupForm.get('email').value).subscribe(res => {
      console.log(res)

      // Check if success true or false was returned from API
      if (!res.success) {
        this.emailValid = false;
        this.usernamefound = false// Return email as invalid
        this.emailMessage = res.message; // Return error message
      } else {
        this.emailValid = true;
        this.emailMessage = true // Return email as valid
        this.emailMessage = res.message; // Return success message
      }
    })
  }

  // Function to check if username is available
  checkUsername() {
    // Function from authentication file to check if username is taken
    this.service.checkUsername(this.signupForm.get('username').value).subscribe(res => {
      // Check if success true or success false was returned from API
      if (!res.success) {
        this.usernameValid = false; // Return username as invalid
        this.usernameMessage = res.message; // Return error message
      } else {
        this.usernameValid = true; // Return username as valid
        this.usernameMessage = res.message; // Return success message
      }
    });
  }


}


