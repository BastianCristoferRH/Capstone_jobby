import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubidaGaleriaPageRoutingModule } from './subida-galeria-routing.module';

import { SubidaGaleriaPage } from './subida-galeria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubidaGaleriaPageRoutingModule
  ],
  declarations: [SubidaGaleriaPage]
})
export class SubidaGaleriaPageModule {}
