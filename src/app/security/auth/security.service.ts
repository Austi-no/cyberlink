import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
// import 'rxjs/operators/map';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {


  // baseUrl: String = "http://localhost:8080"

  baseUrl: String = ""

  authToken;
  user;
  options;

  constructor(private http: HttpClient) {

  }

  createUserAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    let headers = new HttpHeaders({

      'Content-Type': 'application/json', // Format set to JSON
      'authorization': this.authToken // Attach token

    });

    this.options = {
      headers: headers
    }

  }



  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.baseUrl + "/authentication/register", user)


  }

  // Function to check if username is taken
  checkUsername(username: any): Observable<any> {
    return this.http.get(this.baseUrl + '/authentication/checkUsername/' + username)
  }

  // Function to check if e-mail is taken
  checkEmail(email: any): Observable<any> {
    return this.http.get(this.baseUrl + '/authentication/checkEmail/' + email)
  }

  storeLoginUserData(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token
    this.user = user

  }
  login(user: any): Observable<any> {
    return this.http.post(this.baseUrl + '/authentication/login', user)

  }

  // Function to get user's profile data
  getProfile(): Observable<any> {
    this.createUserAuthenticationHeaders(); // Create headers before sending to API
    return this.http.get(this.baseUrl + '/authentication/profile', this.options)
  }
  // Function to logout
  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    localStorage.clear(); // Clear local storage
  }
  getToken() {
    return localStorage.getItem("token");
  }

  getPublicProfile(username: any): Observable<any> {
    this.createUserAuthenticationHeaders(); // Create headers before sending to API
    return this.http.get(this.baseUrl + '/authentication/publicProfile/' + username, this.options)
  }



  updateUserProfile2(user: any): Observable<any> {
    const feedData = { user: user };
    this.createUserAuthenticationHeaders();
    return this.http.put(this.baseUrl + '/authentication/updateProfile', feedData, this.options)
  }

  getUsers(): Observable<any> {

    this.createUserAuthenticationHeaders(); // Create headers
    return this.http.get(this.baseUrl + '/authentication/allUsers', this.options)
  }


  updateUserProfile(id: any, user: any): Observable<any> {

    this.createUserAuthenticationHeaders();
    return this.http.put(this.baseUrl + '/authentication/updateProfile/' + id, JSON.stringify(user), this.options)
  }

  uploadProfilePicture(formData: FormData): Observable<any> {

    this.createUserAuthenticationHeaders();

    return this.http.put(this.baseUrl + '/authentication/updateProfilePic', formData, this.options);
  }

}
