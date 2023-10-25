import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubidaGaleriaPage } from './subida-galeria.page';

describe('SubidaGaleriaPage', () => {
  let component: SubidaGaleriaPage;
  let fixture: ComponentFixture<SubidaGaleriaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SubidaGaleriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
