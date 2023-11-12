import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-subida-galeria',
  templateUrl: './subida-galeria.page.html',
  styleUrls: ['./subida-galeria.page.scss'],
})
export class SubidaGaleriaPage implements OnInit {
  validacion: any = {};
  galleryData: any = {
    descripcion: '',
    foto: '',
  };
  trabajadorId: any = {};
  imagenPreview: any; 
  imagenError: boolean = false; 

  

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
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
  }

  

  perfil_trabajador() {
    const correo =  this.authService.getCorreoElectronico();
    if(correo != null){
      this.navigateTo('/trabajador/' + btoa(correo));
    }
   
  }

  private navigateTo(url: string) {
   
    window.location.href = url;
  }


  
   // Selector de imagenes
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      // Muestra un mensaje de error al usuario o realiza una acción apropiada.
      console.log("La imagen es demasiado grande. Debe ser menor de 5 MB.");
      this.presentAlert4('La imagen cargada es demasiado grande, porfavor selecciona otra con un tamaño menor a 5mb.');
      return;
    }

    if (!file) {
      this.imagenError = true;
      this.presentAlert4('Debe subir una imagen principal del servicio ofrecido.'); // Establecer la variable de error en verdadero si no se selecciona una imagen
      return; // Detener la función si no se selecciona una imagen
    } else {
      this.imagenError = false; // Restablecer la variable de error si se selecciona una imagen
    }

    if (file) {
      // Crear un nuevo objeto Blob con el archivo seleccionado
      const blob = new Blob([file], { type: file.type });
      
      // Llama a blobToHexString para obtener la cadena hexadecimal
      this.blobToHexString(blob).then((hexString) => {
        // Asigna la cadena hexadecimal a this.servicio.img_portada
        this.galleryData.foto = hexString;
        
        // Registrar datos del formulario
        console.log("Datos del formulario al cargar la imagen:", this.galleryData);
  
        // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(blob);
      });

    }
  }



  async blobToHexString(blob: Blob): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const array = new Uint8Array(arrayBuffer);
        let hexString = '';
        for (let i = 0; i < array.length; i++) {
          const hex = array[i].toString(16).padStart(2, '0');
          hexString += hex;
        }
        resolve(hexString);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(blob);
    });
  }
  // FIN de Selector de imagenes
 

  addGallery() {
    const correoElectronico = this.authService.getCorreoElectronico();
    this.galleryData.descripcion = this.validacion.descripcion;

    if (this.trabajadorId.length > 0) {
      this.galleryData.id_trabajador = this.trabajadorId[0].id_trabajador;
    } else {
      console.error('No se encontró información del trabajador.');
    }


    if (!this.imagenPreview) {
      this.imagenError = true;
      console.log('Falta Imagen');
      this.presentAlert1('Debe completar los campos del formulario correctamente para agregar servicio.');  // Establecer la variable de error en verdadero
      return; // Detener la función si no se ha seleccionado una imagen
    } else {
      this.imagenError = false;
       // Restablecer la variable de error si se selecciona una imagen
    }


    this.authService.agregarGaleria(this.galleryData).subscribe(
      (response) => {
        console.log('Servicio agregado con éxito', response);
        console.log("Datos del servicio agregado: ", this.galleryData);
        this.perfil_trabajador();
      },
      (error) => {
        console.error('Error al agregar el servicio:', error);
        console.log("Datos del formulario rechazado: ",  this.galleryData);
        this.presentAlert1('Debe completar los campos del formulario correctamente para agregar servicio.');
      }
    );
  }

  //ALERTAS
  async presentAlert1(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Error al agregar servicio',
      message: mensaje,
      buttons: [{ text: 'OK'}]
    });

    await alert.present();
  }

  async presentAlert4(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Error al cargar la imagen',
      message: mensaje,
      buttons: [{ text: 'OK'}]
    });

    await alert.present();
  }
}
