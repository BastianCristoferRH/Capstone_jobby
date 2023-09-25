import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar-servicio',
  templateUrl: './agregar-servicio.page.html',
  styleUrls: ['./agregar-servicio.page.scss'],
})
export class AgregarServicioPage implements OnInit {

  servicio: any = {};
  regiones: any[] = [];
  comunas: any[]=[]; 
  servicios: any[] = [];
  serviceData = {
    id_des_serv:'',
    des_serv:'',
    presencial:'',
    id_trabajador:'',
    id_serv: '',
    id_comuna: '',
    id_region: ''
  };
  constructor( private http: HttpClient) { }

  addService() {
    this.http.post('http://localhost:3000/agregar_servicio', this.serviceData)
      .subscribe(response => {
        console.log('Servicio agregado con éxito', response);
      });
  }
  cargarRegiones() {
    this.http.get('http://localhost:3000/obtener-regiones').subscribe((data: any) => {
      this.regiones = data;
     });
  }
  cargarComunas() {
    this.http.get('http://localhost:3000/obtener-comunas').subscribe((data: any) => {
      this.comunas = data;
     });
  }
  cargarServicios() {
    this.http.get('http://localhost:3000/obtener-servicios').subscribe((data: any) => {
      this.servicios = data;
      console.log(this.servicios);
     });
  }

  ngOnInit() {
    this.cargarRegiones();
    this.cargarComunas();
    this.cargarServicios();
    console.log(this.servicios);
  }


}
