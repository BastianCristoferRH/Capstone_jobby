import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-servicios',
  templateUrl: './listar-servicios.page.html',
  styleUrls: ['./listar-servicios.page.scss'],
})
export class ListarServiciosPage implements OnInit {
  listaServicios:any[] = [];
  constructor(private http: HttpClient ) { }

  ngOnInit() {
    this.cargarListadoServicios();
  }
  cargarListadoServicios() {
    this.http.get('http://localhost:3000/listar-servicios').subscribe((data: any) => {
      this.listaServicios = data;
      console.log(this.listaServicios);
     });
  }
}
