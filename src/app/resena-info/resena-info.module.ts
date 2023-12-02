import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResenaInfoPageRoutingModule } from './resena-info-routing.module';

import { ResenaInfoPage } from './resena-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResenaInfoPageRoutingModule
  ],
  declarations: [ResenaInfoPage]
})
export class ResenaInfoPageModule {}
