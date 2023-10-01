import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule   } from '@ionic/angular';

import { SolicitudPageRoutingModule } from './solicitud-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SolicitudPage } from './solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudPageRoutingModule,
    SharedModule
  ],
  declarations: [SolicitudPage]
})
export class SolicitudPageModule {}
