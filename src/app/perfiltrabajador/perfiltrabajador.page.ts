import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfiltrabajador',
  templateUrl: './perfiltrabajador.page.html',
  styleUrls: ['./perfiltrabajador.page.scss'],
})

export class PerfiltrabajadorPage implements OnInit {
  mostrarBotonAgregarServicio: boolean = false;
  mostrarBotonSolicitar: boolean = true;
  correoElectronico: string = '';
  datosTrabajador: any[] = [];
  datosServicio: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico'];

      // Obtener datos del trabajador
      this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
        (data: any) => {
          this.datosTrabajador = data.datosTrabajador;
          this.datosServicio = data.datosServicio;
          console.log('Datos Trabajador obtenidos', this.datosTrabajador);
          console.log('Datos servicios obtenidos', this.datosServicio);

          const usuarioAutenticado = this.authService.getCorreoElectronico();
          if (usuarioAutenticado === this.correoElectronico) {
            this.mostrarBotonAgregarServicio = true;
            this.mostrarBotonSolicitar = false;
          }
        },
        (error: any) => {
          console.error('Error al recibir los datos del trabajador', error);
        }
      );
    });
  }

  async confirmarEliminarServicio(id_des_serv: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este servicio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            // Llama directamente a la función eliminarServicio
            this.eliminarServicio(id_des_serv);
          }
        }
      ]
    });

    await alert.present();
  }

  perfil_trabajador() {
    this.router.navigate(['/trabajador', this.correoElectronico]);
  }

  
  eliminarServicio(id_des_serv: number) {
    this.authService.eliminarServicio(id_des_serv).subscribe(
      (response: any) => {
        console.log('Servicio eliminado con éxito', response);
        this.perfil_trabajador();

        // Llama a la función loadTrabajadorData después de eliminar el servicio
        this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
          (data: any) => {
            this.datosServicio = data.datosServicio;
            // Resto del código para manejar los datos actualizados.
          },
          (error: any) => {
            console.error('Error al recibir los datos del trabajador', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al eliminar el servicio', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }

  navigateToSolicitud() {
    this.router.navigate(['/solicitud', this.correoElectronico]);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
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

  private navigateToUserProfile(correoElectronico: string) {
    this.router.navigate(['/perfil', correoElectronico]);
  }

  

  navegarAServicioSolicitado() {
    const correoElectronico = this.authService.getCorreoElectronico();

    if (correoElectronico) {
      this.router.navigate(['/servicio-solicitado', correoElectronico]);
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }

  agregarServicio() {
    this.router.navigate(['/agregar-servicio', this.authService.getCorreoElectronico()]);
    console.log("click");
  }

  navegarCrearPerfilTrabajador() {
    const correoElectronico = this.authService.getCorreoElectronico();
    this.router.navigate(['/registrar-trabajado', correoElectronico]);
  }
}
