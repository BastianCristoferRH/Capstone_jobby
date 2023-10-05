import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubirDocumentacionPage } from './subir-documentacion.page';

describe('SubirDocumentacionPage', () => {
  let component: SubirDocumentacionPage;
  let fixture: ComponentFixture<SubirDocumentacionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SubirDocumentacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
