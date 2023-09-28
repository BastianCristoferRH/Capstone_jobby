import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component'; // Ajusta la ruta según la ubicación real del componente
import { IonicModule } from '@ionic/angular'; 
@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule,IonicModule],
  exports: [MenuComponent],
})
export class SharedModule {}