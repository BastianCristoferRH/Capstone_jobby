import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfiltrabajadorPageRoutingModule } from './perfiltrabajador-routing.module';

import { PerfiltrabajadorPage } from './perfiltrabajador.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfiltrabajadorPageRoutingModule,
    SharedModule
  ],
  declarations: [PerfiltrabajadorPage]
})
export class PerfiltrabajadorPageModule {}
