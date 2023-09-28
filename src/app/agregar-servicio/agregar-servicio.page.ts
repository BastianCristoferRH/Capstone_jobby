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
  trabajadorId: any = {};

  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router) { }


  ngOnInit() {
    const correoElectronico = this.authService.getCorreoElectronico();
    console.log(correoElectronico);
    if (correoElectronico) {
      // Llama al servicio para obtener la información del trabajador por correo electrónico
      this.authService.getTrabajadorIdPorCorreo(correoElectronico).subscribe(
        (data: any) => {
          console.log(data);
          this.trabajadorId = data; // Almacena la información del trabajador
          
          console.log(this.trabajadorId[0].id_trabajador);
        },
        (error) => {
          console.error('Error al obtener información del trabajador:', error);
        }
      );
    } else {
      console.error('El correo electrónico es nulo o no está disponible.');
    }
    
    this.cargarRegiones();
    this.cargarComunas();
    this.cargarServicios();
  }
  private navigateToServiceList(correoElectronico: string) {
    this.router.navigate(['/listar-servicios', correoElectronico]);
  }

  addService() {
    const correoElectronico = this.authService.getCorreoElectronico();
    this.servicio.des_serv = this.servicioo.des_serv;
    this.servicio.presencial = this.servicioo.presencial;
    if (this.trabajadorId.length > 0) {
      // Asigna el ID del trabajador al objeto this.servicio
      this.servicio.id_trabajador = this.trabajadorId[0].id_trabajador;
    } else {
      console.error('No se encontró información del trabajador.');
    }
    this.servicio.id_serv = this.servicioo.id_serv;
    this.servicio.id_comuna = this.servicioo.id_comuna;
    this.servicio.id_region = this.servicioo.id_region;

    console.log(this.servicio);


    this.authService.agregarServicio(this.servicio).subscribe(
      (response) => {
        console.log('Servicio agregado con éxito', response);
        console.log(this.servicio.des_serv);
        // Puedes realizar acciones adicionales después de agregar el servicio aquí
        if(correoElectronico){
          this.navigateToServiceList(correoElectronico);
        }
        
      },
      (error) => {
        console.error('Error al agregar el servicio:', error);
      }
    );
  }
  cargarRegiones() {
    this.http.get('http://localhost:4001/obtener-regiones').subscribe((data: any) => {
      this.regiones = data;
    });
  }
  cargarComunas() {
    this.http.get('http://localhost:4001/obtener-comunas').subscribe((data: any) => {
      this.comunas = data;
    });
  }
  cargarServicios() {
    this.http.get('http://localhost:4001/obtener-servicios').subscribe((data: any) => {
      this.servicios = data;
      //console.log(this.servicios);
    });
  }




}
