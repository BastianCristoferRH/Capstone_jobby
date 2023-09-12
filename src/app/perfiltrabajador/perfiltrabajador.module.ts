import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfiltrabajadorPageRoutingModule } from './perfiltrabajador-routing.module';

import { PerfiltrabajadorPage } from './perfiltrabajador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfiltrabajadorPageRoutingModule
  ],
  declarations: [PerfiltrabajadorPage]
})
export class PerfiltrabajadorPageModule {}
