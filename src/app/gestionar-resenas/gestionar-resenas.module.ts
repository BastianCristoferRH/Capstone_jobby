import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarResenasPageRoutingModule } from './gestionar-resenas-routing.module';

import { GestionarResenasPage } from './gestionar-resenas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarResenasPageRoutingModule
  ],
  declarations: [GestionarResenasPage]
})
export class GestionarResenasPageModule {}
