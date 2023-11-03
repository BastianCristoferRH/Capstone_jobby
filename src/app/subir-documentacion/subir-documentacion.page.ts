import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-subir-documentacion',
  templateUrl: './subir-documentacion.page.html',
  styleUrls: ['./subir-documentacion.page.scss'],
})
export class SubirDocumentacionPage implements OnInit {
  documentData: any = {
    titulo: '',
    documento: '',
    id_trabajador:'',
  };

  trabajadorId:any={};

  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,) { }



  ngOnInit() {
    const correoElectronico = this.authService.getCorreoElectronico();

    if (correoElectronico) {
      this.authService.getTrabajadorIdPorCorreo(correoElectronico).subscribe(
        (data: any) => {
          
          
          this.trabajadorId = data;
          this.documentData.id_trabajador = this.trabajadorId[0].id_trabajador;
          console.log('id trabajador en documentdata=',this.documentData.id_trabajador);
          console.log('id trabajador =',this.trabajadorId[0].id_trabajador);
        },
        (error) => {
          console.error('Error al obtener id trabajador:', error);
        }
      );
    } else {
      console.error('El correo electrónico es nulo o no está disponible.');
    }
    
    

    }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (selectedFile.size > maxSizeInBytes) {
      // Muestra un mensaje de error al usuario o realiza una acción apropiada.
      console.log("La imagen es demasiado grande. Debe ser menor de 5 MB.");
      this.presentAlert4('La imagen cargada es demasiado grande, porfavor selecciona otra con un tamaño menor a 5mb.');
      return;
    }
    else {

      // Crear un nuevo objeto Blob con el archivo seleccionado
      const blob = new Blob([selectedFile], { type: selectedFile.type });
      
      // Llama a blobToHexString para obtener la cadena hexadecimal
      this.blobToHexString(blob).then((hexString) => {
        // Asigna la cadena hexadecimal a this.servicio.img_portada
        this.documentData.documento = hexString;
        
        // Registrar datos del formulario
        console.log("Datos del formulario al cargar la imagen:", this.documentData);
  

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
      console.log('Archivo convertido a hexstring');
      reader.readAsArrayBuffer(blob);
    });
  }


  async submitForm() {

    
    if (this.trabajadorId.length > 0) {
      this.documentData.id_trabajador = this.trabajadorId[0].id_trabajador;
    } else {
      console.error('No se encontró información del trabajador.');
    }
    

    if (!this.documentData.titulo ) {
      console.log('Por favor, complete todos los campos.');
      this.presentAlert4('Por favor, complete todos los campos.');
      console.log(this.documentData);
      return;
    }

    if (!this.documentData.documento ) {
      console.log('Por favor, complete todos los campos.');
      this.presentAlert4('Por favor, complete todos los campos.');
      console.log(this.documentData);
      return;
    }
    
    this.documentData.titulo = this.documentData.titulo;
    this.documentData.documento = this.documentData.documento;
    
    console.log('Datos a enviar:', this.documentData);


    
    this.authService.agregarDocumentacionTrabajador(this.documentData).subscribe(
      (response) => {
        console.log('Documento subido exitosamente:', response);
        this.perfil_trabajador();
      },
      (error) => {
        console.error('Error al subir el documento:', error);
      }
    );
  }

  perfil_trabajador() {
    this.router.navigate(['/trabajador', this.authService.getCorreoElectronico()]);
  }

  

//ALERTAS

async presentAlert4(mensaje: string) {
  const alert = await this.alertController.create({
    cssClass: 'personalizada',
    header: 'Error al subir el documento',
    message: mensaje,
    buttons: [{ text: 'OK'}]
  });

  await alert.present();
}

}