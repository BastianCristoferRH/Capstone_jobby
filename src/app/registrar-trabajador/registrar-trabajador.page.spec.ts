import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarTrabajadorPage } from './registrar-trabajador.page';

describe('RegistrarTrabajadorPage', () => {
  let component: RegistrarTrabajadorPage;
  let fixture: ComponentFixture<RegistrarTrabajadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrarTrabajadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
