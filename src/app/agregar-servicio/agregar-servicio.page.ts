import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-servicio',
  templateUrl: './agregar-servicio.page.html',
  styleUrls: ['./agregar-servicio.page.scss'],
})
export class AgregarServicioPage implements OnInit {


  servicioo: any = {};
  regiones: any[] = [];
  comunas: any[] = [];
  servicios: any[] = [];
  servicio: any = {
    des_serv: '',
    presencial: false,
    id_trabajador: '',
    id_serv: '',
    id_comuna: '',
    id_region: '',
  };
  trabajadorInfo: any = {};
  trabajadorId: any;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router) { }


  ngOnInit() {
    console.log(this.trabajadorInfo);

    this.cargarRegiones();
    this.cargarComunas();
    this.cargarServicios();
    console.log(this.servicio);
  }


  addService() {
    this.servicio.des_serv = this.servicioo.des_serv;
    this.servicio.presencial = this.servicioo.presencial;
    this.servicio.id_trabajador = this.trabajadorInfo;
    this.servicio.id_serv = this.servicioo.id_serv;
    this.servicio.id_comuna = this.servicioo.id_comuna;
    this.servicio.id_region = this.servicioo.id_region;

    console.log(this.servicio);

    this.authService.agregarServicio(this.servicio).subscribe(
      (response) => {
        console.log('Servicio agregado con éxito', response);
        console.log(this.servicio.des_serv);
        // Puedes realizar acciones adicionales después de agregar el servicio aquí

      },
      (error) => {
        console.error('Error al agregar el servicio:', error);
      }
    );
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
      //console.log(this.servicios);
    });
  }
  cargarTrabajadorId(correoElectronico: string) {
    this.http.get('http://localhost:3000//obtener-datos-trabajador/${correoElectronico').subscribe((data: any) => {
      console.log(data);
      this.trabajadorInfo = data;

    });
  }




}
