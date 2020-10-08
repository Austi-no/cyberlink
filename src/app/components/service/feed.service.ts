import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/security/auth/security.service';

@Injectable({
  providedIn: 'root'
})
export class FeedService {


  // baseUrl: String = "http://localhost:8080"

  baseUrl: String = ""
  options: { headers: any; };
  authToken: string | string[];
  constructor(private http: HttpClient, private securityService: SecurityService) { }


  createUserAuthenticationHeaders() {
    this.securityService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    let headers = new HttpHeaders({

      'Content-Type': 'application/json', // Format set to JSON
      'authorization': this.securityService.authToken // Attach token

    });

    this.options = {
      headers: headers
    }

  }
  // Function to create a new blog post
  createNewFeed(feed: any): Observable<any> {
    this.createUserAuthenticationHeaders(); // Create headers
    return this.http.post(this.baseUrl + '/feeds/feed', feed, this.options)
  }

  // Function to get all blogs from the database
  getAllBlogs(): Observable<any> {
    this.createUserAuthenticationHeaders(); // Create headers
    return this.http.get(this.baseUrl + '/feeds/allFeeds', this.options)
  }

  getSingleFeed(id: any): Observable<any> {
    this.createUserAuthenticationHeaders();
    return this.http.get(this.baseUrl + '/feeds/getFeed/' + id, this.options)
  }

  editFeed(feed: any): Observable<any> {
    this.createUserAuthenticationHeaders();
    return this.http.put(this.baseUrl + "/feeds/edit-feed/", feed, this.options)
  }
  deleteFeedById(id: any): Observable<any> {
    this.createUserAuthenticationHeaders();
    return this.http.delete(this.baseUrl + "/feeds/deleteFeed/" + id, this.options)
  }

  // Function to like a blog post
  likeFeed(id: any): Observable<any> {
    const feedData = { id: id };
    return this.http.put(this.baseUrl + '/feeds/likeFeed/', feedData, this.options)
  }

  // Function to dislike a blog post
  dislikeFeed(id: any): Observable<any> {
    const feedData = { id: id };
    return this.http.put(this.baseUrl + '/feeds/dislikeFeed/', feedData, this.options)
  }
  sendEmail(data: any): Observable<any> {
    this.createUserAuthenticationHeaders()
    return this.http.post(this.baseUrl + "/feeds/sendmail", data, this.options);
  }


  postComment(id: any, comment: any): Observable<any> {
    this.createUserAuthenticationHeaders(); // Create headers
    // Create blogData to pass to backend
    const feedData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.baseUrl + '/feeds/comment', feedData, this.options)

  }

  upload(formData: FormData): Observable<any> {
    this.createUserAuthenticationHeaders()

    return this.http.post('http://localhost:8585/authentication/updateProfilePic', formData, this.options);
  }

}
