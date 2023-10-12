import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-perfiltrabajador',
  templateUrl: './perfiltrabajador.page.html',
  styleUrls: ['./perfiltrabajador.page.scss'],
})

export class PerfiltrabajadorPage implements OnInit {
  mostrarBotonAgregarServicio: boolean = false;
  mostrarBotonAgregarDocumentacion: boolean = false;
  mostrarBotonSolicitar: boolean = true;
  correoElectronico: string = '';
  //datosTrabajador: any = []; // Ahora inicializado como un arreglo
  id_trabajador: number = 0;
  datosTrabajador: any[] = [];
  aa: any[] = [];
  //promedio_trabajador: any[]=[];
  datosServicio: any[] = [];
  esFavorito: boolean = false;
  promedioTrabajador: number = 0;
  promedioServicio: number = 1;
  starData1!: { enteras: number; fraccion: number; };
  starData2!: { enteras: number; fraccion: number; };




  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) { }

  getStarDataAverageWorker(promedioTrabajador: number): { enteras: number, fraccion: number } {
    const enteras = Math.floor(promedioTrabajador); // Parte entera
    const fraccion = promedioTrabajador - enteras; // Parte fraccionaria
    return { enteras, fraccion };

  }

  getStarDataAverageService(promedioServicio: number): { enteras: number, fraccion: number } {
    const enteras = Math.floor(promedioServicio); // Parte entera
    const fraccion = promedioServicio - enteras; // Parte fraccionaria
    return { enteras, fraccion };

  }


  ngOnInit() {

    this.starData1 = this.getStarDataAverageWorker(this.promedioTrabajador);
    this.starData2 = this.getStarDataAverageService(this.promedioServicio);
    console.log(this.promedioServicio);
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico'];

      // Obtener datos del trabajador
      this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
        (data: any) => {

          if (data.datosTrabajador.length > 0) {
            const trabajador = data.datosTrabajador[0];
            if (trabajador.img_base64 !== null) {
              // Crear una URL segura a partir de los datos base64
              trabajador.img_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + trabajador.img_base64);
            }
          }





          for (let i = 0; i < data.datosServicio.length; i++) {
            const element = data.datosServicio[i];
            this.aa.push(element)


          }
          this.authService.getPromedioCalificacionesServicio(this.aa[0].id_des_serv, this.aa[0].id_trabajador).subscribe((dataAvgServicio: any) => {
            console.log(dataAvgServicio);
            this.promedioServicio = dataAvgServicio;
          })
          console.log(this.aa);

          console.log('promedio servicioreklxD', this.promedioServicio);
          this.datosTrabajador = data.datosTrabajador;


          this.datosServicio = data.datosServicio;
          console.log('promedio', this.promedioTrabajador);
          console.log('Datos Trabajador obtenidos', this.datosTrabajador);
          console.log('Datos servicios obtenidos', this.datosServicio);
          console.log('Promedios servicio:', this.promedioServicio);

          // Verificar si el correo del trabajador coincide con el usuario autenticado
          const usuarioAutenticado = this.authService.getCorreoElectronico();
          if (usuarioAutenticado === this.correoElectronico) {
            this.mostrarBotonAgregarServicio = true;
            this.mostrarBotonAgregarDocumentacion = true;
            this.mostrarBotonSolicitar = false; // Ocultar el botón "Solicitar"

          }
          this.verificarFavorito();
        },
        (error: any) => {
          console.error('Error al recibir los datos del trabajador', error);
        }
      );


      this.authService.getPromedioCalificacionesTrabajador(this.correoElectronico).subscribe((data: any) => {
        //console.log(data);
        this.promedioTrabajador = data[0].promedio_calificacion;
        console.log(this.promedioTrabajador);

      })
    });



  }
  navigateToHistorialServicios() {
    this.router.navigate(['/trabajador', this.correoElectronico, 'historial-trabajador'])
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
  getStarIconAvgWorker(index: number, promedioTrabajador: number): string {
    // Determina el nombre del ícono de estrella (star, star-half o star-outline) en función de 'index' y 'promedio'
    if (index <= Math.floor(promedioTrabajador)) {
      return 'star'; // Estrella completa
    } else if (index === Math.ceil(promedioTrabajador)) {
      return 'star-half'; // Media estrella si el índice es igual al valor entero más cercano del promedio
    } else {
      return 'star-outline'; // Estrella vacía
    }
  }

  getStarIconAvgService(index: number, promedioServicio: number): string {
    // Determina el nombre del ícono de estrella (star, star-half o star-outline) en función de 'index' y 'promedio'
    if (index <= Math.floor(promedioServicio)) {
      return 'star'; // Estrella completa
    } else if (index === Math.ceil(promedioServicio)) {
      return 'star-half'; // Media estrella si el índice es igual al valor entero más cercano del promedio
    } else {
      return 'star-outline'; // Estrella vacía
    }
  }



  goToFormularioDocumentacion() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.authService.getTrabajadorIdPorCorreo(correoElectronico).subscribe((data: any) => {
        console.log(data[0].id_trabajador);
        this.id_trabajador = data[0].id_trabajador;
        console.log(this.id_trabajador);

      });
      this.id_trabajador = 0
      this.router.navigate(['/subir-documentacion', this.id_trabajador])

    } else {
      this.router.navigate(['/login'])
    }

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
  actualizarDisponibilidadUsuarioAutenticado() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      console.log(correoElectronico); // Agrega esto para depuración
      console.log('Cambiando disponibilidad a "disponible"'); // Agrega esto para depuración
      this.authService.actualizarDisponibilidad(correoElectronico, 'disponible')
        .subscribe(
          (response: any) => {
            console.log('Disponibilidad actualizada con éxito', response);
            window.location.reload(); // Recargar la página
          },
          (error: any) => {
            console.error('Error al actualizar la disponibilidad', error);
          }
        );
    } else {
      console.error('No se pudo obtener el correo electrónico del usuario autenticado.');
    }
  }

  actualizarDisponibilidadUsuarioAutenticadoocupado() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      console.log(correoElectronico); 
      console.log('Cambiando disponibilidad a "ocupado"'); 
      this.authService.actualizarDisponibilidad(correoElectronico, 'ocupado')
        .subscribe(
          (response: any) => {
            console.log('Disponibilidad actualizada con éxito', response);
            window.location.reload(); 
          },
          (error: any) => {
            console.error('Error al actualizar la disponibilidad', error);
          }
        );
    } else {
      console.error('No se pudo obtener el correo electrónico del usuario autenticado.');
    }
  }


}
