import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/security/auth/security.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  username: any;
  email;
  image: any;
  form: FormGroup;
  firstName: any;
  lastName: any;
  description: any;
  phone: any;
  education: any;
  interest: any;
  address: any;
  city: any;
  country: any;
  loading: boolean = true
  constructor(private service: SecurityService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({ imageFile: [''] })
    this.service.getProfile().subscribe(res => {
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
      this.loading = false
    })
  }

  onFileSelected(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      this.image = file
      console.log(this.image)
      this.onSubmit()
    }
  }

  onSubmit() {
    const pic = this.form.get('imageFile').value
    const formData = new FormData();
    formData.append('file', pic);

    // this.service.uploadProfilePic(formData).subscribe(res => {
    //   console.log(res)
    // })
  }

  gotoEdit() {
    this.router.navigate(['/update-user'])
  }

}
