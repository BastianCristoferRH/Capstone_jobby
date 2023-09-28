import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({  
  selector: 'app-listar-servicios',
  templateUrl: './listar-servicios.page.html',
  styleUrls: ['./listar-servicios.page.scss'],
})
export class ListarServiciosPage implements OnInit {
  listaServicios:any[] = [];
  constructor(
    private http: HttpClient ,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.cargarListadoServicios();
  }
  cargarListadoServicios() {
    this.authService.cargarListadoServicios().subscribe((data: any) => {
      this.listaServicios = data;
      console.log(this.listaServicios);
    });
  }
}
