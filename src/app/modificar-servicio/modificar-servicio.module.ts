import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarServicioPageRoutingModule } from './modificar-servicio-routing.module';

import { ModificarServicioPage } from './modificar-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarServicioPageRoutingModule
  ],
  declarations: [ModificarServicioPage]
})
export class ModificarServicioPageModule {}
