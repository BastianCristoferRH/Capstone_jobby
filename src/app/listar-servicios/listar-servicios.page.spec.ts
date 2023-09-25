import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarServiciosPage } from './listar-servicios.page';

describe('ListarServiciosPage', () => {
  let component: ListarServiciosPage;
  let fixture: ComponentFixture<ListarServiciosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
