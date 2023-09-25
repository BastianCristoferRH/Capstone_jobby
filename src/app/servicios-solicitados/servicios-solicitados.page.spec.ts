import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosSolicitadosPage } from './servicios-solicitados.page';

describe('ServiciosSolicitadosPage', () => {
  let component: ServiciosSolicitadosPage;
  let fixture: ComponentFixture<ServiciosSolicitadosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServiciosSolicitadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
