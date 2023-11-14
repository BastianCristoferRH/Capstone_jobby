import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modperfil',
  templateUrl: './modperfil.page.html',
  styleUrls: ['./modperfil.page.scss'],
})
export class ModperfilPage implements OnInit {
  correoElectronico: string = '';
  datosUsuario: any = {};
  datosmod: any = {};
  imagenPreview: any;
  flagmodsev: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.correoElectronico = atob(params['userId']);
      this.loadUserProfile(this.correoElectronico);
    });
  }
  
  loadUserProfile(correoElectronico: string) {
    this.authService.getUserProfile(correoElectronico).subscribe(
      (profileData: any) => {
        this.datosUsuario = profileData;
  
        if (this.datosUsuario.img_base64 !== null) {
          this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.datosUsuario.img_base64);
        }
  
        console.log('datos obtenidos de api', this.datosUsuario);
  
        // Asigna los valores a las propiedades del objeto servicio después de obtener los datos
        this.datosmod.correo_electronico = this.datosUsuario.correo_electronico;
        this.datosmod.nombre = this.datosUsuario.nombre;
        this.datosmod.apellidos = this.datosUsuario.apellidos; // Aquí corregí el error, antes decía "nombre"
        this.datosmod.telefono = this.datosUsuario.telefono;
  
        console.log('datos al cargar', this.datosmod);
      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }
  

  async modPerfil() {
    // Obtener los valores del formulario
    const nombre = this.datosmod.nombre;
    const apellidos = this.datosmod.apellidos;
    const telefono = this.datosmod.telefono;
  
    // Agregar el console.log para mostrar el formulario actual
    console.log('Formulario a enviar:', this.datosmod);
  
    // Verificar la lógica del flagmodsev según tus necesidades
    if (this.flagmodsev === 1) {
      console.log('Flag1');
      this.presentConfirmAlert();
      // Detener la ejecución si la validación falla
    } else {
      console.log('Flag2');
      this.presentConfirmAlert2();
    }
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

          this.datosmod.img = hexString;
          this.flagmodsev = 1;
          // Registrar datos del formulario
          console.log("Datos del formulario al cargar la imagen:", this.datosmod);

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

  async blobToHexString(blob: ArrayBuffer): Promise<string> {
    const array = new Uint8Array(blob);
    let hexString = '';
    for (let i = 0; i < array.length; i++) {
      const hex = array[i].toString(16).padStart(2, '0');
      hexString += hex;
    }
    return hexString;
  }

  perfil_perfil() {
    const correo = this.authService.getCorreoElectronico();
    if (correo != null) {
      this.navigateTo('/perfil/' + btoa(correo));
    }

  }

  private navigateTo(url: string) {

    window.location.href = url;
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
            this.authService.modificarPerfil(this.correoElectronico, this.datosmod).subscribe(
              (response) => {
                console.log('Servicio modificado con éxito', response);
                console.log('Así quedaron los datos modificados', this.datosmod);
                this.perfil_perfil();
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
            this.authService.modificarPerfil1(this.correoElectronico, this.datosmod).subscribe(
              (response) => {
                console.log('Servicio modificado con éxito', response);
                console.log('Así quedaron los datos modificados', this.datosmod);
                this.perfil_perfil();
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
