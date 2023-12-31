import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
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
  mostrarBotonGestionarResenas: boolean = false;
  correoElectronico: string = '';
  //datosTrabajador: any = []; // Ahora inicializado como un arreglo
  id_trabajador: number = 0;

  selectedTab: string = 'tab1';

  //promedio_trabajador: any[]=[];
  datosTrabajador: any[] = [];
  datosServicio: any[] = [];
  datosGaleria: any[] = [];
  datosDocumentos: any[] = [];

  esFavorito: boolean = false;
  promedioTrabajador: number = 0;
  promedioServicio: number = 0;
  starData1!: { enteras: number; fraccion: number; };
  starData2!: { enteras: number; fraccion: number; };




  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController
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
    //this.obtenerPromedioPorIdDesServ("9","3");
    console.log(this.promedioServicio);
    this.starData1 = this.getStarDataAverageWorker(this.promedioTrabajador);
    this.starData2 = this.getStarDataAverageService(this.promedioServicio);
    console.log(this.promedioServicio);
    this.route.params.subscribe(params => {
      this.correoElectronico = atob(params['correoElectronico']);

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
            if (element.img_portada_base64 !== null) {
              // Crear una URL segura a partir de los datos base64
              console.log('Pasadas por buble conversor de imagenes');
              element.img_portada_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + element.img_portada_base64);
            }

          }

          for (let i = 0; i < data.datosGaleria.length; i++) {
            const element = data.datosGaleria[i];
            if (element.img_galeria_base64 !== null) {
              // Crear una URL segura a partir de los datos base64
              console.log('Pasadas por buble conversor de imagenes');
              element.img_galeria_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + element.img_galeria_base64);
            }

          }

          

          







          this.datosTrabajador = data.datosTrabajador;


          this.datosServicio = data.datosServicio;
          this.datosGaleria = data.datosGaleria;
          this.datosDocumentos = data.datosDocumentos;
          console.log('promedio',this.promedioTrabajador);
          console.log('Datos Trabajador obtenidos', this.datosTrabajador);
          console.log('Datos servicios obtenidos', this.datosServicio);
          console.log('Datos de galeria obtenidos', this.datosGaleria);
          console.log('Datos de Documentos obtenidos', this.datosDocumentos);
          console.log('Datos de Documentos obtenidos', data.datosDocumentos.documento_hex);
          console.log('Promedios servicio:',this.promedioServicio);


          // Verificar si el correo del trabajador coincide con el usuario autenticado
          const usuarioAutenticado = this.authService.getCorreoElectronico();
          if (usuarioAutenticado === this.correoElectronico) {
            this.mostrarBotonAgregarServicio = true;
            this.mostrarBotonAgregarDocumentacion = true;
            this.mostrarBotonSolicitar = false; // Ocultar el botón "Solicitar"
            this.mostrarBotonGestionarResenas = true;
            // Verificar si el correo del trabajador coincide con el usuario autenticado



          }
          this.verificarFavorito();
        },


        (error: any) => {
          console.error('Error al recibir los datos del trabajador', error);
        });


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

  gestionarResenas() {
    this.router.navigate(['/trabajador', btoa(this.correoElectronico), 'gestionar-resenas'])
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

  async confirmarEliminarGaleria(id_foto: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta foto?',
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
            this.eliminarGaleria(id_foto);
          }
        }
      ]
    });

    await alert.present();
  }



  async confirmarEliminarDocumento(id_documento: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este documento?',
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
            this.eliminarDocumento(id_documento);
          }
        }
      ]
    });

    await alert.present();
  }

  perfil_trabajador() {
    this.router.navigate(['/trabajador', btoa(this.correoElectronico)]);
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
            for (let i = 0; i < data.datosServicio.length; i++) {
              const element = data.datosServicio[i];
              if (element.img_portada_base64 !== null) {
                // Crear una URL segura a partir de los datos base64
                console.log('Pasadas por buble conversor de imagenes');
                element.img_portada_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + element.img_portada_base64);
              }

            }
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

  eliminarGaleria(id_foto: number) {
    this.authService.eliminarGaleria(id_foto).subscribe(
      (response: any) => {
        console.log('Foto eliminada con exito de galeria', response);
        this.perfil_trabajador();

        this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
          (data: any) => {

            this.datosGaleria = data.datosGaleria;
            for (let i = 0; i < data.datosGaleria.length; i++) {
              const element = data.datosGaleria[i];
              if (element.img_galeria_base64 !== null) {
                // Crear una URL segura a partir de los datos base64
                console.log('Pasadas por buble conversor de imagenes');
                element.img_galeria_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + element.img_galeria_base64);
              }

            }
            // Resto del código para manejar los datos actualizados.
          },
          (error: any) => {
            console.error('Error al recibir los datos del trabajador', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al eliminar la  foto de galeria', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }


  eliminarDocumento(id_documento: number) {
    this.authService.eliminarDocumento(id_documento).subscribe(
      (response: any) => {
        console.log('Documento eliminado con exito', response);
        this.perfil_trabajador();

        this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
          (data: any) => {

            this.datosDocumentos = data.datosDocumentos;
          },
          (error: any) => {
            console.error('Error al recibir los datos del trabajador', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al eliminar documento', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }

  navigateToSolicitud() {
    this.router.navigate(['/solicitud', btoa(this.correoElectronico)]);
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
    this.router.navigate(['/perfil', btoa(correoElectronico)]);
  }



  navegarAServicioSolicitado() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.router.navigate(['/servicio-solicitado', btoa(correoElectronico)]);
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }

  agregarServicio() {
    const correo = this.authService.getCorreoElectronico();
    if (correo != null) {
      this.router.navigate(['/agregar-servicio', btoa(correo)]);
    }
  }

  agregarGaleria() {
    const correo = this.authService.getCorreoElectronico();
    if (correo != null) {
      this.router.navigate(['/subida-galeria', btoa(correo)]);
    }


  }

  navegarCrearPerfilTrabajador() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico != null) {
      this.router.navigate(['/registrar-trabajado', btoa(correoElectronico)]);
    }

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

  descargarDocumento(documentoBase64: string, titulo: string) {
    // Decodifica el documento base64 a un Blob
    const byteCharacters = atob(documentoBase64);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Cambia 'application/pdf' al tipo correcto del documento
  
    // Crea un enlace para la descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = titulo; // Establece el nombre del archivo con el título
    document.body.appendChild(a);
  
    // Inicia la descarga
    a.click();
  
    // Limpia el enlace
    window.URL.revokeObjectURL(url);
  }
  
  
  
  

  
  



  
  

 
  
  
  


}
