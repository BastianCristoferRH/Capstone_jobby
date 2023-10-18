import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendarVisitaServicioPageRoutingModule } from './agendar-visita-servicio-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AgendarVisitaServicioPage } from './agendar-visita-servicio.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendarVisitaServicioPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [AgendarVisitaServicioPage]
})
export class AgendarVisitaServicioPageModule {}
