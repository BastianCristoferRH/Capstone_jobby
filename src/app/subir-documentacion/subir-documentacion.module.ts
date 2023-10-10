import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirDocumentacionPageRoutingModule } from './subir-documentacion-routing.module';

import { SubirDocumentacionPage } from './subir-documentacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirDocumentacionPageRoutingModule
  ],
  declarations: [SubirDocumentacionPage]
})
export class SubirDocumentacionPageModule {}
