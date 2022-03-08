import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  register = new FormGroup({
    usertype: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  getUsertypeErrorMessage() {
    if (this.register.controls['usertype'].hasError('required')) {
      return 'Please select a role';
    }
    else {
      return null;
    }
  }

  getUsernameErrorMessage() {
    if (this.register.controls['username'].hasError('required')) {
      return 'Please enter your username';
    }
    else {
      return null;
    }
  }

  getEmailErrorMessage() {
    if (this.register.controls['email'].hasError('required')) {
      return 'Please enter your email';
    }
    else if (this.register.controls['email'].hasError('email')) {
      return 'Please enter a valid email';
    }
    else {
      return null;
    }
  }

  getPasswordErrorMessage() {
    if (this.register.controls['password'].hasError('required')) {
      return 'Please enter your password';
    }
    else {
      return null;
    }
  }

  // registerUserData: User = {
  //   usertype: '',
  //   username: '',
  //   email: '',
  //   password: ''
  // }

  registerUser = () => {
    this.auth.registerUser(this.register.value).subscribe(
      res => {
        console.log(res)
        this.router.navigate(['auth/login'])
      },
      err => console.log(err)
    );
  }

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

}