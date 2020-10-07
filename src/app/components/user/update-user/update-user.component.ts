import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/security/auth/security.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateUserForm: FormGroup;
  username: any;
  email: any;
  firstName: any;
  lastName: any;
  user: any;
  description: any;
  phone: any;
  interest: any;
  education: any;
  address: any;
  city: any;
  country: any;
  image: any;
  imageFormGroup: FormGroup;
  public profilePic: any = File;
  uploadedFilePath: any;
  id: void;
  option;
  constructor(private formBuilder: FormBuilder, private service: SecurityService, private actRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.service.getProfile().subscribe(res => {
      console.log(res)
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
      this.user = res.user._id
    })
    this.updateUserForm = this.formBuilder.group({
      description: [''],
      phone: [''],
      education: [''],
      interest: [''],
      address: [''],
      city: [''],
      country: [''],
      _id: ['']

    })

    this.imageFormGroup = this.formBuilder.group({
      profilePic: [''],
      profilePicURL: [''],
      _id: ['']

    })
  }


  updateUser(id: any, updateUserForm: FormGroup) {

    id = this.user
    this.user = this.updateUserForm.get('_id').setValue(this.user)
    updateUserForm = this.updateUserForm.value

    this.service.updateUserProfile(id, updateUserForm).subscribe(res => {
      console.log(res)
    }, (err) => {
      console.log(err);
    })
  }

  onSelectedFile(e) {

    const file = e.target.files[0];
    console.log(file)
    this.profilePic = file;
  }

  uploadPhoto() {

    // this.id = this.imageFormGroup.get('_id').setValue(this.user)
    const formData = new FormData();
    formData.append('file', this.profilePic);

    this.http.post('http://localhost:8585/authentication/updateProfilePic', formData)
      .subscribe(res => {
        console.log(res);
        alert('SUCCESS !!');
      })


    // this.service.uploadProfilePicture(formData).subscribe(res => {
    //   console.log(res)
    //   this.uploadedFilePath = res.user.profileUrl;
    //   this.imageFormGroup.reset()
    // })

  }


}
