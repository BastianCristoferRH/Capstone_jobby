import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  registroForm!: FormGroup; // Inicializar la propiedad con "!"
  imagenPreview: any; 
  imagenError: boolean = false; 

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService
  ) {}
  

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      
      this.router.navigateByUrl('/perfil');
    }

    this.registroForm = this.formBuilder.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(7)]],
      confirmarContrasena: ['', [Validators.required]], // Validación personalizada aquí
      primerNombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      telefono: ['', [Validators.required,Validators.minLength(7)]],
      imagen: ['']
    }, {
      validators: this.matchPassword // Aplicar validación personalizada al FormGroup
    });
   }

   matchPassword(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;

    // Compara los valores de los campos
    if (password !== confirmPassword) {
      group.get('confirmarContrasena')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      group.get('confirmarContrasena')?.setErrors(null);
    }

    return null;
  }

  

  

  async registrar() {
    if (this.registroForm.invalid) {
      console.log("Formulario no válido");
      return;
    }
  
    const contrasena = this.registroForm.get('contrasena')?.value;
    const confirmarContrasena = this.registroForm.get('confirmarContrasena')?.value;
    const telefono = this.registroForm.get('telefono')?.value;
    const fechaNacimiento = this.registroForm.get('fechaNacimiento')?.value;
  
    if (!contrasena || !confirmarContrasena || !telefono || !fechaNacimiento) {
      console.log("Error al registrar ");
      this.presentAlert1('Debes llenar los campos obligatorios del registro');
      return;
    }

    if (!this.imagenPreview) {
      this.imagenError = true;
      console.log('Falta Imagen');
      this.presentAlert1('Debe añadir una imagen de perfil');
      return; // Detener la función si no se ha seleccionado una imagen
    } else {
      this.imagenError = false;
       // Restablecer la variable de error si se selecciona una imagen
    }
  
    if (contrasena !== confirmarContrasena) {
      console.log("Las contraseñas no coinciden");
      this.presentAlert2('Revisa las contraseñas ingresadas');
      return;
    }
  
    const usuario = {
      correo_electronico: this.registroForm.get('correoElectronico')?.value,
      nombre: this.registroForm.get('primerNombre')?.value,
      apellidos: this.registroForm.get('apellidos')?.value,
      telefono: telefono,
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_nacimiento: fechaNacimiento,
      password: contrasena,
      img: await this.blobToHexString(this.registroForm.get('imagen')?.value) // Convierte el Blob a cadena hexadecimal
    };
    
    
  
    // Realizar acciones adicionales según tus necesidades
    console.log("Objeto usuario:", usuario);
  
    this.authService.registrarUsuario(usuario).subscribe(
      (resultado) => {
        this.presentAlert('¡Bien!, te has registrado correctamente');
        console.log("Registro exitoso:", resultado);
      },
      (error) => {
        this.presentAlert3('Ingresa un correo distinto, este ya ha sido registrado.');
        console.error("Error al registrar:", error);
      }
    );
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
  
  

  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;
  
    if (file) {
      if (file.size > maxSizeInBytes) {
        // Muestra una alerta al usuario
        this.presentAlert4('La imagen cargada es demasiado grande, por favor selecciona otra con un tamaño menor a 5 MB.');
        
        // Limpia el campo de imagen en el formulario
        this.registroForm.get('imagen')?.setValue(new Blob());
  
        // Cambia el texto del botón a "Seleccionar Imagen" ya que no se ha seleccionado ninguna imagen
        
      } else {
        // Mostrar vista previa de la imagen
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    
          // Actualizar el valor del campo imagen en el formulario
          this.registroForm.get('imagen')?.setValue(file);
        };
        reader.readAsDataURL(file);
    
        // Registrar datos del formulario
        console.log("Datos del formulario al cargar la imagen:", this.registroForm.value);
      }
    }

    if (!file) {
      this.imagenError = true;
      this.presentAlert4('Debe subir una imagen principal del servicio ofrecido.'); // Establecer la variable de error en verdadero si no se selecciona una imagen
      return; // Detener la función si no se selecciona una imagen
    } else {
      this.imagenError = false; // Restablecer la variable de error si se selecciona una imagen
    }
  }
  
  
  
  

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Registrado correctamente',
      message: mensaje,
      buttons: [{ text: 'OK', handler: () => { document.location.href = 'login'; } }]
    });

    await alert.present();
  }

  async presentAlert1(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Error al registrar',
      message: mensaje,
      buttons: [{ text: 'OK'}]
    });

    await alert.present();
  }

  async presentAlert2(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Las contraseñas no coinciden',
      message: mensaje,
      buttons: [{ text: 'OK'}]
    });

    await alert.present();
  }

  async presentAlert3(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'personalizada',
      header: 'Correo registrado',
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
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Limpia el campo de imagen en el formulario
            this.registroForm.get('imagen')?.setValue('');
          }
        }
      ]
    });

    await alert.present();
  }

}
