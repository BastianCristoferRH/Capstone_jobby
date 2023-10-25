import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarResenasPageRoutingModule } from './gestionar-resenas-routing.module';

import { GestionarResenasPage } from './gestionar-resenas.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarResenasPageRoutingModule,
    SharedModule
  ],
  declarations: [GestionarResenasPage]
})
export class GestionarResenasPageModule {}
