import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResenaInfoPageRoutingModule } from './resena-info-routing.module';

import { ResenaInfoPage } from './resena-info.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResenaInfoPageRoutingModule,
    SharedModule
  ],
  declarations: [ResenaInfoPage]
})
export class ResenaInfoPageModule {}
