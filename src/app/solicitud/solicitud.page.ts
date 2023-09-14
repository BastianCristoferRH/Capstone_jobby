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
      this.correoElectronico_trabajador = params['correoElectronico']; // Utiliza 'correoElectronico'
      this.loadServicio_solicitud(this.correoElectronico_trabajador); // Pasa 'correoElectronico' en lugar de 'userId'

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
        this.datosServicio = trabajorData

      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }


  enviarSolicitud() {
    // Verifica si correo_electronico no es null antes de usarlo
    const correo_electronico = this.authService.getCorreoElectronico();
    if (!correo_electronico) {
      console.error('Correo electrónico no disponible.');
      // Puedes manejar la falta de correo electrónico aquí
      return;
    }
  
    // Asegúrate de que datosServicio sea un arreglo
    if (!Array.isArray(this.datosServicio)) {
      console.error('Los datos del servicio no son válidos.');
      return;
    }
  
    // Asegúrate de que servicioSeleccionado tenga un valor
    if (!this.servicioSeleccionado) {
      console.error('No se ha seleccionado un servicio válido.');
      return;
    }
  
    // Encuentra el índice en datosServicio
    const seleccionIndex = this.datosServicio.findIndex(servicio => servicio.name_serv === this.servicioSeleccionado);
  
    if (seleccionIndex === -1) {
      console.error('No se ha encontrado el servicio seleccionado en los datos del servicio.');
      return;
    }
  
    const correoElectronico_trabajadorx = this.correoElectronico_trabajador;
    const idTrabajadorSeleccionado = this.datosServicio[seleccionIndex].id_trabajador;
    const idDesServSeleccionado = this.datosServicio[seleccionIndex].id_des_serv;
    const tituloSolicitud = this.titulo; 
    const descripcionSolicitud = this.descripcion; // Obtén la descripción del formulario
    // Llama a la función de AuthService para enviar la solicitud
    this.authService.enviarSolicitud(
      correo_electronico,
      idTrabajadorSeleccionado,
      idDesServSeleccionado,
      tituloSolicitud,
      descripcionSolicitud,
      correoElectronico_trabajadorx
    ).subscribe(
      (response: any) => {
        // La solicitud se envió con éxito, puedes manejar aquí la respuesta del servidor
        console.log('Solicitud enviada con éxito', response);
       
        this.navigateToUserProfile(correoElectronico_trabajadorx);
      },
      (error: any) => {
        console.error('Error al enviar la solicitud:', error);
        // Maneja aquí los errores, por ejemplo, muestra un mensaje al usuario
      }
    );
  }
  
}

