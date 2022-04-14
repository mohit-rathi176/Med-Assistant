import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatModule } from '../mat/mat.module';
import { DoctorRoutingModule } from './doctor-routing.module';
import { FormsModule } from '@angular/forms';

import { DoctorComponent } from './components/doctor/doctor.component';
// import { DoctorNavComponent } from './components/doctor-nav/doctor-nav.component';
import { PrescriptionComponent } from './components/prescription/prescription.component';

@NgModule({
  declarations: [
    DoctorComponent,
    PrescriptionComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    DoctorRoutingModule,
    FormsModule
  ],
  exports: [
    DoctorComponent,
    PrescriptionComponent
  ]
})
export class DoctorModule { }
