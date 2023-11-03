import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';


@Component({
  selector: 'app-agregar-servicio',
  templateUrl: './agregar-servicio.page.html',
  styleUrls: ['./agregar-servicio.page.scss'],
})
export class AgregarServicioPage implements OnInit {
  servicioo: any = {
    des_serv: '',
  };
  regiones: any[] = [];
  comunas: any[] = [];
  servicios: any[] = [];
  servicio: any = {
    des_serv: '',
    presencial: false,
    id_trabajador: '',
    id_serv: '',
    id_comuna: '',
    id_region: '',
    img_portada: '',
  };
  trabajadorInfo: any = {};
  trabajadorId: any = {};
  imagenPreview: any; 
  desServError: boolean = false;
  imagenError: boolean = false; 

  

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService
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

    

    // Llama a las funciones del servicio para cargar regiones, comunas y servicios
    this.authService.cargarRegiones().subscribe((data: any) => {
      this.regiones = data;
    });

    this.authService.cargarComunas().subscribe((data: any) => {
      this.comunas = data;
    });

    this.authService.cargarServicios().subscribe((data: any) => {
      this.servicios = data;
    });

    
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
        this.servicio.img_portada = hexString;
        
        // Registrar datos del formulario
        console.log("Datos del formulario al cargar la imagen:", this.servicio);
  
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
  
  
  
  

  perfil_trabajador() {
    this.router.navigate(['/trabajador', this.authService.getCorreoElectronico()]);
  }


  addService() {
    const correoElectronico = this.authService.getCorreoElectronico();
    this.servicio.des_serv = this.servicioo.des_serv;
    this.servicio.presencial = this.servicioo.presencial;

    if (this.trabajadorId.length > 0) {
      this.servicio.id_trabajador = this.trabajadorId[0].id_trabajador;
    } else {
      console.error('No se encontró información del trabajador.');
    }

    this.servicio.id_serv = this.servicioo.id_serv;
    this.servicio.id_comuna = this.servicioo.id_comuna;
    this.servicio.id_region = this.servicioo.id_region;

    if (this.servicioo.des_serv.length < 20) {
      this.desServError = true;
      console.log('Descripcion de servicio muy corta');
      this.presentAlert1('Debe completar los campos del formulario correctamente para agregar servicio.'); 
      // Establecer la variable de error en verdadero
      return; // Detener la función si la validación falla
    } else {
      this.desServError = false;
      
       // Restablecer la variable de error si se cumple la validación
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


    this.authService.agregarServicio(this.servicio).subscribe(
      (response) => {
        console.log('Servicio agregado con éxito', response);
        console.log("Datos del servicio agregado: ", this.servicio);
        this.perfil_trabajador();
      },
      (error) => {
        console.error('Error al agregar el servicio:', error);
        console.log("Datos del formulario rechazado: ",  this.servicio);
        this.presentAlert1('Debe completar los campos del formulario correctamente para agregar servicio.');
      }
    );
  }

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
