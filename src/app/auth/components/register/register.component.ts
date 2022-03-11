import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  sentotp: boolean = false;

  errorAlert: any = null;
  successAlert: any = null;

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

  move(e:any, p:any, c:any, n:any) {
    var length = c.value.length;
    var maxlength = c.getAttribute('maxlength');
    if (length == maxlength) {
      if (n != '') {
        n.focus();
      }
    }
    if (e.key == 'Backspace') {
      if (p != '') {
        p.focus();
      }
    }
  }

  verifyUserData: User = {
    usertype: '',
    username: '',
    email: '',
    password: ''
  }

  registerUserData: User = {
    usertype: '',
    username: '',
    email: '',
    password: '',
    otp: ''
  }

  verifyUserEmail = () => {
    this.auth.verifyUser(this.register.value).subscribe(
      res => {
        console.log(res)
        this.register.controls['usertype'].disable();
        this.register.controls['username'].disable();
        this.register.controls['email'].disable();
        this.register.controls['password'].disable();
        setTimeout(() => {
          this.register.addControl('otp1', new FormControl());
          this.register.addControl('otp2', new FormControl());
          this.register.addControl('otp3', new FormControl());
          this.register.addControl('otp4', new FormControl());
          this.sentotp = true;
          this.cdRef.detectChanges();
        }, 0)
        this.successAlert = 'OTP has been sent';
        setTimeout(() => {
          this.successAlert = null;
        }, 5 * 1000);
      },
      err => {
        console.log(err)
        this.errorAlert = err;
        setTimeout(() => {
          this.errorAlert = null;
        }, 5 * 1000);
      }
    );
  }

  registerNewUser = () => {
    let otp = '';
    otp += this.register.controls['otp1'].value;
    otp += this.register.controls['otp2'].value;
    otp += this.register.controls['otp3'].value;
    otp += this.register.controls['otp4'].value;
    console.log(otp);
    this.registerUserData.usertype = this.register.controls['usertype'].value;
    this.registerUserData.username = this.register.controls['username'].value;
    this.registerUserData.email = this.register.controls['email'].value;
    this.registerUserData.password = this.register.controls['password'].value;
    this.registerUserData.otp = otp;
    this.auth.registerUser(this.registerUserData).subscribe(
      res => {
        console.log(res)
        this.router.navigate(['auth/login'])
      },
      err => {
        console.log(err)
        this.errorAlert = err;
        setTimeout(() => {
          this.errorAlert = null;
        }, 5 * 1000);
      }
    );
  }

  reVerifyUserEmail = () => {
    this.verifyUserData.usertype = this.register.controls['usertype'].value;
    this.verifyUserData.username = this.register.controls['username'].value;
    this.verifyUserData.email = this.register.controls['email'].value;
    this.verifyUserData.password = this.register.controls['password'].value;
    this.auth.verifyUser(this.verifyUserData).subscribe(
      res => {
        console.log('OTP resent successfully')
        this.successAlert = 'OTP resent';
        setTimeout(() => {
          this.successAlert = null;
        }, 5 * 1000);
      },
      err => {
        console.log(err)
        this.errorAlert = err;
        setTimeout(() => {
          this.errorAlert = null;
        }, 5 * 1000);
      }
    );
  }

  constructor(private auth: AuthService, private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

}