import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarResenaPageRoutingModule } from './agregar-resena-routing.module';

import { AgregarResenaPage } from './agregar-resena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarResenaPageRoutingModule
  ],
  declarations: [AgregarResenaPage]
})
export class AgregarResenaPageModule {}