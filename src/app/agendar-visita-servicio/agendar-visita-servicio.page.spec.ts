import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendarVisitaServicioPage } from './agendar-visita-servicio.page';

describe('AgendarVisitaServicioPage', () => {
  let component: AgendarVisitaServicioPage;
  let fixture: ComponentFixture<AgendarVisitaServicioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgendarVisitaServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
