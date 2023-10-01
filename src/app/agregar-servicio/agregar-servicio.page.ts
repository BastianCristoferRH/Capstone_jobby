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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const correoElectronico = this.authService.getCorreoElectronico();

    if (correoElectronico) {
      this.authService.getTrabajadorIdPorCorreo(correoElectronico).subscribe(
        (data: any) => {
          this.trabajadorId = data;
        },
        (error) => {
          console.error('Error al obtener información del trabajador:', error);
        }
      );
    } else {
      console.error('El correo electrónico es nulo o no está disponible.');
    }

    // Llama a las funciones del servicio para cargar regiones, comunas y servicios
    this.authService.cargarRegiones().subscribe((data: any) => {
      this.regiones = data;
    });

    this.authService.cargarComunas().subscribe((data: any) => {
      this.comunas = data;
    });

    this.authService.cargarServicios().subscribe((data: any) => {
      this.servicios = data;
    });
  }

  private navigateToServiceList() {
    this.router.navigate(['/listar-servicios']);
  }

  addService() {
    const correoElectronico = this.authService.getCorreoElectronico();
    this.servicio.des_serv = this.servicioo.des_serv;
    this.servicio.presencial = this.servicioo.presencial;

    if (this.trabajadorId.length > 0) {
      this.servicio.id_trabajador = this.trabajadorId[0].id_trabajador;
    } else {
      console.error('No se encontró información del trabajador.');
    }

    this.servicio.id_serv = this.servicioo.id_serv;
    this.servicio.id_comuna = this.servicioo.id_comuna;
    this.servicio.id_region = this.servicioo.id_region;

    this.authService.agregarServicio(this.servicio).subscribe(
      (response) => {
        console.log('Servicio agregado con éxito', response);
        this.navigateToServiceList();
      },
      (error) => {
        console.error('Error al agregar el servicio:', error);
      }
    );
  }
}
