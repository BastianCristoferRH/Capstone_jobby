import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {
  titulo: string = '';
  descripcion: string = '';
  datosServicio: any = {};
  servicioSeleccionado: string = '';
  correoElectronico_trabajador = '';
  seleccionIndex: number = -1;
  constructor(

    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {

    this.route.params.subscribe(params => {
      this.correoElectronico_trabajador = atob(params['correoElectronico']);
      this.loadServicio_solicitud(this.correoElectronico_trabajador);

    });

  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  private navigateToUserProfile(correoElectronico: string) {
    this.router.navigate(['/perfil', correoElectronico]);
  }
  perfil_menu() {
    if (this.authService.isAuthenticated()) {
      const correoElectronico = this.authService.getCorreoElectronico();
      if (correoElectronico) {
        this.navigateToUserProfile(correoElectronico);
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  loadServicio_solicitud(correoElectronico: string) {
    this.authService.loadTrabajadorData(correoElectronico).subscribe(
      (trabajorData: any) => {
        this.datosServicio = trabajorData.datosServicio as Array<any>;
        console.log(this.datosServicio);
      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }


  enviarSolicitud() {
    const correo_electronico = this.authService.getCorreoElectronico();
    if (!correo_electronico) {
      console.error('Correo electrónico no disponible.');
      return;
    }

    if (!Array.isArray(this.datosServicio)) {
      console.error('Los datos del servicio no son válidos.');
      return;
    }

    if (!this.servicioSeleccionado) {
      console.error('No se ha seleccionado un servicio válido.');
      return;
    }

    const seleccionIndex = this.datosServicio.findIndex(servicio => servicio.name_serv === this.servicioSeleccionado);

    if (seleccionIndex === -1) {
      console.error('No se ha encontrado el servicio seleccionado en los datos del servicio.');
      return;
    }

    const correoElectronico_trabajadorx = this.correoElectronico_trabajador;
    const idTrabajadorSeleccionado = this.datosServicio[seleccionIndex].id_trabajador;
    const idDesServSeleccionado = this.datosServicio[seleccionIndex].id_des_serv;
    const tituloSolicitud = this.titulo;
    const descripcionSolicitud = this.descripcion; 
    this.authService.enviarSolicitud(
      correo_electronico,
      idTrabajadorSeleccionado,
      idDesServSeleccionado,
      tituloSolicitud,
      descripcionSolicitud,
      correoElectronico_trabajadorx
    ).subscribe(
      (response: any) => {
        console.log('Solicitud enviada con éxito', response);
        this.navigateToUserProfile(btoa(correoElectronico_trabajadorx));
      },
      (error: any) => {
        console.error('Error al enviar la solicitud:', error);
      }
    );
  }



}

