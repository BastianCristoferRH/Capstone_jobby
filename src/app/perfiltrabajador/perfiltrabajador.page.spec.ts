import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfiltrabajadorPage } from './perfiltrabajador.page';

describe('PerfiltrabajadorPage', () => {
  let component: PerfiltrabajadorPage;
  let fixture: ComponentFixture<PerfiltrabajadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PerfiltrabajadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
