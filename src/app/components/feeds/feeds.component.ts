import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/security/auth/security.service';
import { FeedService } from "../service/feed.service";
import Swal from 'sweetalert2';
import { elementAt } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  isDropup = true
  isDropup2 = true
  isCollapsed = true;
  isCollapsed2 = true

  displayComment = false
  form: FormGroup;
  username: any;

  messageClass;
  message;
  feedList: any = [];
  currentUrl: any;
  singleFeed: any;
  inputValue: string;
  feedBody: any;
  editfeedValue;
  feed;
  singleFeedId: any;
  body: any;
  feedbody;

  feedExist = false
  processing = false
  email: any;
  firstName;
  lastName;

  newComment = []
  commentForm: FormGroup;
  listOfComments: any;
  enabledComments = [];
  description: any;
  phone: any;
  education: any;
  interest: any;
  address: any;
  city: any;
  country: any;

  loading: boolean = true
  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private securityService: SecurityService,
    private feedService: FeedService, private toastr: ToastrService) { }

  ngOnInit() {

    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })

    this.securityService.getProfile().subscribe(res => {
      this.username = res.user.username
      this.email = res.user.email
      this.firstName = res.user.firstName
      this.lastName = res.user.lastName
      this.description = res.user.description
      this.phone = res.user.phone
      this.education = res.user.education
      this.interest = res.user.interest
      this.address = res.user.address
      this.city = res.user.city
      this.country = res.user.country
    })
    this.getAllFeeds();
    this.securityService.getProfile().subscribe(res => {
      this.username = res.user.username
    },
      error => {
        console.error(error);

      }
    )
    this.form = this.formBuilder.group({
      // Body field
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250),
        Validators.minLength(5)
      ])]
    })
  }

  newFeedForm() {

  }


  createFeed() {
    this.loading = true
    const feed = {
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.feedService.createNewFeed(feed).subscribe(res => {

      console.log(res)
      // Check if blog was saved to database or not
      if (!res.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = res.message; // Return error message
        this.processing = false; // Enable submit button
        this.loading = false
      } else {

        this.getAllFeeds();
        // Clear form data after two seconds
        setTimeout(() => {
          this.messageClass = 'alert alert-success'; // Return success class
          this.message = res.message; // Return success message
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset();
          this.loading = false // Reset all form fields
        }, 2000);
      }
    })


  }

  getAllFeeds(): any {
    this.feedService.getAllBlogs().subscribe(res => {
      this.feedList = res.feeds
      var list = res.feeds[0].comments
      console.log(list)
      console.log(res)
      console.log(this.feedList)
      this.listOfComments = res.feeds[0].comments.length;;
      this.loading = false
    })
  }


  editFeed(): any {
    this.loading = true
    this.feed.body = this.feedbody
    console.log(this.feed)
    this.feedService.editFeed(this.feed).subscribe(res => {
      if (!res.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = "Invalid Feed Cant Save"; // Return error message
        this.loading = false
      } else {
        this.getAllFeeds()
        console.log(res)
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = res.message;
        this.loading = false
      }
    })

  }

  getFeedById(id) {
    this.feedService.getSingleFeed(id).subscribe(res => {
      if (!res.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = "Invalid Feed "; // Return error message
        this.processing = false; // Enable submit button
      } else {
        this.editfeedValue = res.feed.body
        this.singleFeed = res.feed.body;
        this.feed = res.feed;
        this.feedbody = res.feed.body
        console.log(this.feedbody)
        this.inputValue = document.getElementById("editFeed").innerHTML = this.feedbody;
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = false;
      }
    })

  }
  // delete blog
  deleteFeedById(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedService.deleteFeedById(id).subscribe(res => {
          console.log(res)

          this.getAllFeeds()
          swalWithBootstrapButtons.fire(
            'Deleted!',
            res.message,
            'success'
          )

        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Feed is safe :)',
          'error'
        )
      }
    })
  }

  // likeFeed
  likeFeed(id: any): any {
    this.feedService.likeFeed(id).subscribe(res => {
      if (res.message == 'You already liked this feed') {
        this.toastr.warning('', res.message)
      } else {
        console.log(res)
        this.getAllFeeds()
        this.toastr.success('', res.message)
      }


    })
  }

  // dislike feed
  dislikeFeed(id: any): any {
    this.feedService.dislikeFeed(id).subscribe(res => {
      if (res.message == 'You already disliked this feed') {
        this.toastr.warning('', res.message)
      } else if (res.success == true) {
        console.log(res)
        this.getAllFeeds()
        this.toastr.success('', res.message)
      }
      else {
        this.toastr.error('', res.message)
      }
    })
  }

  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }


  onHidden2(): void {
    console.log('Dropdown is hidden');
  }
  onShown2(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange2(): void {
    console.log('Dropdown state is changed');
  }



  draftComment(id) {
    this.commentForm.reset();
    this.newComment = []
    this.newComment.push(id);

  }
  expandComment(id) {

  }
  postComment(id: any): any {
    this.loading = true
    this.processing = true
    const comment = this.commentForm.get('comment').value;
    this.feedService.postComment(id, comment).subscribe(res => {
      this.getAllFeeds();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1)
      this.processing = false
      console.log(res)
      this.toastr.success('', res.
      message)
      this.loading = false
    })

  }

}
