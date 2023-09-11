import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarServicioPage } from './agregar-servicio.page';

describe('AgregarServicioPage', () => {
  let component: AgregarServicioPage;
  let fixture: ComponentFixture<AgregarServicioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
