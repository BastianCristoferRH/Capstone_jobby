import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResenaInfoPage } from './resena-info.page';

describe('ResenaInfoPage', () => {
  let component: ResenaInfoPage;
  let fixture: ComponentFixture<ResenaInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResenaInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
