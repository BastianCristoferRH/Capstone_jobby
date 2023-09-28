import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarResenaPage } from './agregar-resena.page';

describe('AgregarResenaPage', () => {
  let component: AgregarResenaPage;
  let fixture: ComponentFixture<AgregarResenaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarResenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
