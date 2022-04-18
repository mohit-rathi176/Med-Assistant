import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  links = [
    {
      label: 'History',
      link: '/patient/history'
    },
    {
      label: 'Appointment',
      link: '/patient/appointment'
    },
    {
      label: 'Profile',
      link: '/patient/profile'
    }
  ];
  activeLink = this.links[0].label;

  logout()
  {
    this.auth.logoutUser().subscribe(
      res => {
        console.log(res);
        localStorage.removeItem('isAuth');
        localStorage.removeItem('usertype');
        this.router.navigate(['auth']);
      },
      err => {
        // this.errorAlert = err;
        // setTimeout(() => {
        //   this.errorAlert = null;
        // }, 5 * 1000);
      }
    );;
  }

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

}
