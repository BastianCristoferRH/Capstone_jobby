import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarFavoritoPage } from './listar-favorito.page';

describe('ListarFavoritoPage', () => {
  let component: ListarFavoritoPage;
  let fixture: ComponentFixture<ListarFavoritoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarFavoritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
