import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './components/patient/patient.component';
import { AuthPatientGuard } from '../guards/auth-patient.guard';

import { MatModule } from '../mat/mat.module';
import { PatientHistoryComponent } from './components/patient-history/patient-history.component';

@NgModule({
  declarations: [
    PatientComponent,
    PatientHistoryComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    MatModule
  ],
  providers: [
    AuthPatientGuard
  ],
  exports: [
    PatientComponent,
    PatientHistoryComponent
  ]
})
export class PatientModule { }
