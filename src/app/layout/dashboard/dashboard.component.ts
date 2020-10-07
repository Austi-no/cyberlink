import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedService } from 'src/app/components/service/feed.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loginForm: FormGroup;
  profilePic: any;

  constructor(private formBuilder: FormBuilder, private service: FeedService, private http: HttpClient) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: [''],
      email: ['']
    })
  }

  register() {

    let user = {
      name: this.loginForm.get('name').value,
      email: this.loginForm.get('email').value
    }
    console.log(user)
    this.service.sendEmail(user).subscribe(res => {
      let data: any = res;
      console.log(res)
      console.log(
        `👏 > 👏 > 👏 > 👏 ${user.name} is successfully register and mail has been sent and the message id is ${res.messageId}`
      );
    })
  }

  onSelectedFile(e) {
    const file = e.target.files[0];
    console.log(file)
    this.profilePic = file;
  }

  uploadPhoto(): any {
    const formData = new FormData();
    formData.append('file', this.profilePic);

    // this.http.post('http://localhost:8585/authentication/updateProfilePic', formData)
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('SUCCESS !!');
    //   })
    this.service.upload(formData).subscribe(res => {
      console.log(res)
      // this.uploadedFilePath = res.user.profileUrl;
      // this.imageFormGroup.reset()
    })

  }

}
