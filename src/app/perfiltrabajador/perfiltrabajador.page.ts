import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfiltrabajador',
  templateUrl: './perfiltrabajador.page.html',
  styleUrls: ['./perfiltrabajador.page.scss'],
})

export class PerfiltrabajadorPage implements OnInit {
  mostrarBotonAgregarServicio: boolean = false;
  mostrarBotonSolicitar: boolean = true;
  correoElectronico: string = '';
  datosTrabajador: any = [];
  esFavorito: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico'];

      // Cargar los datos del trabajador
      this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
        (data: any) => {
          this.datosTrabajador = data;

          // Verificar si el correo del trabajador coincide con el usuario autenticado
          const usuarioAutenticado = this.authService.getCorreoElectronico();
          if (usuarioAutenticado === this.correoElectronico) {
            this.mostrarBotonAgregarServicio = true;
            this.mostrarBotonSolicitar = false; // Ocultar el botón "Solicitar"
          }

          // Verificar si el trabajador es favorito
          this.verificarFavorito();
        },
        (error: any) => {
          console.error('Error al recibir los datos del trabajador', error);
        }
      );
    });
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

  perfil_trabajador() {
    this.router.navigate(['/trabajador', this.correoElectronico]);
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
  }

  navegarCrearPerfilTrabajador() {
    const correoElectronico = this.authService.getCorreoElectronico();
    this.router.navigate(['/registrar-trabajado', correoElectronico]);
  }

  agregarFavorito(id_usuario: string, id_trabajador: number) {
    this.authService.agregarFavorito(id_usuario, id_trabajador).subscribe(
      (response) => {
        console.log('Trabajador agregado como favorito con éxito');
      },
      (error) => {
        console.error('Error al agregar el trabajador como favorito', error);
      }
    );
  }

  quitarFavorito(id_usuario: string, id_trabajador: number) {
    this.authService.quitarFavorito(id_usuario, id_trabajador).subscribe(
      (response) => {
        console.log('Trabajador eliminado de favoritos con éxito');
      },
      (error) => {
        console.error('Error al quitar el trabajador de favoritos', error);
      }
    );
  }

  toggleFavorito() {
    this.esFavorito = !this.esFavorito;
    const correoElectronico = this.authService.getCorreoElectronico();

    if (this.datosTrabajador.length > 0) {
      const idTrabajador = this.datosTrabajador[0].id_trabajador;
      if (correoElectronico) {
        if (this.esFavorito) {
          this.agregarFavorito(correoElectronico, idTrabajador);
        } else {
          this.quitarFavorito(correoElectronico, idTrabajador);
        }
      } else {
        console.error('Correo electrónico no disponible.');
      }
    } else {
      console.error('No hay datos de trabajador disponibles.');
    }
  }

  verificarFavorito() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.authService
        .verificarFavorito(correoElectronico, this.datosTrabajador[0].id_trabajador)
        .subscribe(
          (response: any) => {
            this.esFavorito = response.esFavorito;
          },
          (error: any) => {
            console.error('Error al verificar si el trabajador es un favorito', error);
          }
        );
    }
  }
}
