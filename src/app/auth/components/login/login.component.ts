import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  errorAlert: any = null;

  login = new FormGroup({
    usertype: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  getUsertypeErrorMessage() {
    if (this.login.controls['usertype'].hasError('required')) {
      return 'Please select a role';
    }
    else {
      return null;
    }
  }

  getUsernameErrorMessage() {
    if (this.login.controls['username'].hasError('required')) {
      return 'Please enter your username';
    }
    else {
      return null;
    }
  }

  getPasswordErrorMessage() {
    if (this.login.controls['password'].hasError('required')) {
      return 'Please enter your password';
    }
    else {
      return null;
    }
  }

  // loginUserData: User = {
  //   usertype: '',
  //   username: '',
  //   password: ''
  // }

  loginUser = () => {
    this.auth.loginUser(this.login.value).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['doctor']);
      },
      err => {
        // console.log(err);
        this.errorAlert = err;
        setTimeout(() => {
          this.errorAlert = null;
        }, 5 * 1000);
        // this.notifierService.showNotification(err, 'OK');
      }
    );
  }

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

}