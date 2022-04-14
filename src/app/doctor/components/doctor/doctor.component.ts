import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  // links = ['Prescription', 'Second', 'Third'];
  links = [
    {
      label: 'Prescription',
      link: '/doctor/prescription'
    },
    {
      label: 'First',
      link: ''
    },
    {
      label: 'Second',
      link: ''
    }
  ];
  activeLink = this.links[0].label;

  constructor() { }

  ngOnInit(): void {
  }

}
