import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarServicioPage } from './modificar-servicio.page';

describe('ModificarServicioPage', () => {
  let component: ModificarServicioPage;
  let fixture: ComponentFixture<ModificarServicioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModificarServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
