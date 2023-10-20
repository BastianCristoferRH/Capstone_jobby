import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-servicio',
  templateUrl: './modificar-servicio.page.html',
  styleUrls: ['./modificar-servicio.page.scss'],
})
export class ModificarServicioPage implements OnInit {
  servicio: any = {};
  regiones: any[] = [];
  comunas: any[] = [];
  servicios: any[] = [];
  id_des_serv: string = '';
  datosServicio: any = {};

  // Modifica serviceData para tener los campos correctos
  serviceData = {
    id_des_serv: '',
    des_serv: '',
    presencial: '', // Agrega los campos faltantes
    id_trabajador: '', // Agrega los campos faltantes
    id_serv: '',
    name_serv: '',
    id_comuna: '',
    name_comuna: '',
    id_region: '',
    name_region: '',
  };

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.cargarRegiones();
    this.cargarComunas();
    this.cargarServicios();

    this.route.params.subscribe((params) => {
      this.id_des_serv = params['id_des_serv'];
      this.authService.loadServData(this.id_des_serv).subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.datosServicio = data[0];

            // Asigna los valores a las propiedades del objeto servicio
            this.serviceData.des_serv = this.datosServicio.des_serv;
            this.serviceData.id_des_serv = this.datosServicio.id_des_serv;
            this.serviceData.id_trabajador = this.datosServicio.id_trabajador;
            this.serviceData.presencial = this.datosServicio.presencial;
            this.serviceData.id_serv = this.datosServicio.id_serv;
            this.serviceData.name_serv = this.datosServicio.name_serv;
            this.serviceData.id_comuna = this.datosServicio.id_comuna;
            this.serviceData.name_comuna = this.datosServicio.name_comuna;
            this.serviceData.id_region = this.datosServicio.id_region;
            this.serviceData.name_region = this.datosServicio.name_region;

            console.log('Datos recibidos de la API:', this.datosServicio);
            console.log('Datos Prueba datos a enviar', this.serviceData);
          } else {
            console.error('No se encontraron datos para el servicio con ID', this.id_des_serv);
          }
        },
        (error: any) => {
          console.error('Error al recibir los datos del servicio', error);
        }
      );
    });
  }

  modService() {
    // Validar que la comuna seleccionada coincida con la región
    if (!this.validarComunaYRegion()) {
      return; // Detener la ejecución si la validación falla
    }

    // Obtener los IDs correspondientes a los nombres seleccionados
    this.serviceData.id_serv = this.obtenerIdServicio(this.serviceData.name_serv);
    this.serviceData.id_comuna = this.obtenerIdComuna(this.serviceData.name_comuna);
    this.serviceData.id_region = this.obtenerIdRegion(this.serviceData.name_region);

    console.log('Datos de serviceData antes de enviar la solicitud HTTP:', this.serviceData);
    this.authService.modificarServicio(this.id_des_serv, this.serviceData).subscribe(
      (response) => {
        console.log('Servicio modificado con éxito', response);
        console.log('Así quedaron los datos modificados', this.serviceData);
        this.perfil_trabajador();

      },
      (error) => {
        console.error('Error al modificar el servicio', error);
      }
    );
  }

  cargarRegiones() {
    this.authService.cargarRegiones().subscribe((data: any) => {
      this.regiones = data;
      console.log('Regiones cargadas con éxito', data);
    });
  }

  cargarComunas() {
    this.authService.cargarComunas().subscribe((data: any) => {
      this.comunas = data;
      console.log('Comunas cargadas con éxito', data);
    });

  }

  cargarServicios() {
    this.authService.cargarServicios().subscribe((data: any) => {
      this.servicios = data;
      console.log('Servicios cargados con éxito', data);
    });
  }

  validarComunaYRegion(): boolean {
    const comunaSeleccionada = this.comunas.find((comuna) => comuna.name_comuna === this.serviceData.name_comuna);
    const regionSeleccionada = this.regiones.find((region) => region.name_region === this.serviceData.name_region);

    if (!comunaSeleccionada || !regionSeleccionada || comunaSeleccionada.id_region !== regionSeleccionada.id_region) {
      // Mostrar una alerta o mensaje de error aquí
      alert('La comuna seleccionada no coincide con la región.');
      return false;
    }

    return true;
  }
  perfil_trabajador() {
    this.router.navigate(['/trabajador', this.datosServicio.correo_electronico]); // Usar 'this.correoElectronico'
  }

  obtenerIdServicio(nombreServicio: string): string {
    const servicioSeleccionado = this.servicios.find((servicio) => servicio.name_serv === nombreServicio);
    return servicioSeleccionado ? servicioSeleccionado.id_serv : '';
  }

  obtenerIdComuna(nombreComuna: string): string {
    const comunaSeleccionada = this.comunas.find((comuna) => comuna.name_comuna === nombreComuna);
    return comunaSeleccionada ? comunaSeleccionada.id_comuna : '';
  }

  obtenerIdRegion(nombreRegion: string): string {
    const regionSeleccionada = this.regiones.find((region) => region.name_region === nombreRegion);
    return regionSeleccionada ? regionSeleccionada.id_region : '';
  }
}
