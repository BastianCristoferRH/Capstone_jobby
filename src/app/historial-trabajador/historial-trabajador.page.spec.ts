import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialTrabajadorPage } from './historial-trabajador.page';

describe('HistorialTrabajadorPage', () => {
  let component: HistorialTrabajadorPage;
  let fixture: ComponentFixture<HistorialTrabajadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistorialTrabajadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
