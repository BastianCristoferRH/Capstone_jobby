import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


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

  flagmodsev: number = 0;

  imagenPreview: any;
  imagenError: boolean = false;

  datosServicio: any = {};

  // Modifica serviceData para tener los campos correctos
  serviceData:any = {};

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
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


            if (this.datosServicio.img_portada_real_2 !== null) {
              

              // Convertir img_portada_real_2 a cadena hexadecimal y asignarlo a img_portada
              this.blobToHexString(this.datosServicio.img_portada_real_2).then((hexString) => {
                this.serviceData.img_portada = hexString;
              });
            }

            if (this.datosServicio.img_portada !== null) {
              this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.datosServicio.img_portada);
            }

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
            this.serviceData.img_portada = this.datosServicio.img_portada_real_2;

            if (this.datosServicio.img_portada_real_2 !== null) {
              // Asigna img_portada_real_2 a img_portada
              this.serviceData.img_portada = this.datosServicio.img_portada_real_2;
            
              
              this.blobToHexString(this.serviceData.img_portada).then((hexString) => {
                // Asigna la cadena hexadecimal a img_portada
                this.serviceData.img_portada = hexString;
                
                // Mostrar vista previa de la imagen si es necesario
                if (this.datosServicio.img_portada !== null) {
                  this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.datosServicio.img_portada);
                }
            
                console.log('Datos Prueba datos a enviar', this.serviceData);
              });
            } else {
              console.error('No se encontraron datos para la imagen con ID', this.id_des_serv);
            }


            // Otros pasos necesarios...

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


  

  async modService() {
    // Validar que la comuna seleccionada coincida con la región
    if (!this.validarComunaYRegion()) {
      return; // Detener la ejecución si la validación falla
    }

    // Obtener los IDs correspondientes a los nombres seleccionados
    this.serviceData.id_serv = this.obtenerIdServicio(this.serviceData.name_serv);
    this.serviceData.id_comuna = this.obtenerIdComuna(this.serviceData.name_comuna);
    this.serviceData.id_region = this.obtenerIdRegion(this.serviceData.name_region);
    console.log(this.flagmodsev);



    // Agregar el console.log para mostrar el formulario actual
    console.log('Formulario a enviar:', this.serviceData);
    if (this.flagmodsev === 1) {
      console.log('Flag1');
      this.presentConfirmAlert();
       // Detener la ejecución si la validación falla
    } else {
      console.log('Flag2');
      this.presentConfirmAlert2();
    }
    
    // Agregar una alerta de confirmación
    
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
      this.presentAlert4('La comuna seleccionada no coincide con la región.');
      return false;
    }

    return true;
  }

  perfil_trabajador() {
    const correo = this.authService.getCorreoElectronico();
    if (correo != null) {
      this.navigateTo('/trabajador/' + btoa(correo));
    }

  }

  private navigateTo(url: string) {

    window.location.href = url;
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

  async presentAlert4(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Error en comuna o region',
      message: mensaje,
      buttons: [{ text: 'OK' }]
    });

    await alert.present();
  }



  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file && file.size > maxSizeInBytes) {
      // Muestra un mensaje de error al usuario o realiza una acción apropiada.
      console.log("La imagen es demasiado grande. Debe ser menor de 5 MB.");
      this.presentAlert5('La imagen cargada es demasiado grande, por favor selecciona otra con un tamaño menor a 5MB.');
      return;
    }


    if (file) {
      // Crear un nuevo objeto Blob con el archivo seleccionado
      const blob = new Blob([file], { type: file.type });

      // Convertir el Blob a ArrayBuffer
      const arrayBufferPromise = new Response(blob).arrayBuffer();




      arrayBufferPromise.then((arrayBuffer) => {
        // Llama a blobToHexString para obtener la cadena hexadecimal
        this.blobToHexString(arrayBuffer).then((hexString) => {
          // Asigna la cadena hexadecimal a this.serviceData.img_portada
          this.serviceData.img_portada = hexString;
          this.flagmodsev = 1;
          // Registrar datos del formulario
          console.log("Datos del formulario al cargar la imagen:", this.serviceData);

          // Mostrar vista previa de la imagen
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
            
          };
          reader.readAsDataURL(blob);
        });
      });
    } else {
      

      // También debes eliminar la vista previa si es necesario.
      this.imagenPreview = null;
    }
  }


  async presentAlert5(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Error al cargar la imagen',
      message: mensaje,
      buttons: [{ text: 'OK' }]
    });

    await alert.present();
  }



  async blobToHexString(blob: ArrayBuffer): Promise<string> {
    const array = new Uint8Array(blob);
    console.log('Paso x el conversor b');
    let hexString = '';
    for (let i = 0; i < array.length; i++) {
      const hex = array[i].toString(16).padStart(2, '0');
      hexString += hex;
    }
    return hexString;
  }


  // FIN de Selector de imagenes

  async presentConfirmAlert() {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas modificar este servicio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Operación cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Realizar la solicitud HTTP para modificar el servicio
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
        }
      ]
    });

    await alert.present();
  }

  async presentConfirmAlert2() {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas modificar este servicio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Operación cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Realizar la solicitud HTTP para modificar el servicio
            this.authService.modificarServicio2(this.id_des_serv, this.serviceData).subscribe(
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
        }
      ]
    });

    await alert.present();
  }

}
