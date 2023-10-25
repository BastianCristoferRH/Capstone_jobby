import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarResenaPageRoutingModule } from './agregar-resena-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AgregarResenaPage } from './agregar-resena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarResenaPageRoutingModule,
    SharedModule
  ],
  declarations: [AgregarResenaPage]
})
export class AgregarResenaPageModule {}