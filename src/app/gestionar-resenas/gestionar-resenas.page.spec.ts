import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarResenasPage } from './gestionar-resenas.page';

describe('GestionarResenasPage', () => {
  let component: GestionarResenasPage;
  let fixture: ComponentFixture<GestionarResenasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestionarResenasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
