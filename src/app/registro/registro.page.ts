import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  imagenFileName: string | null = null;
  registroForm!: FormGroup; // Inicializar la propiedad con "!"

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
      // Almacena el nombre del archivo en la propiedad
      this.imagenFileName = file.name;
      // Puedes realizar acciones adicionales aquí, como subir la imagen al servidor si es necesario
    }
  }

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

  

  

  registrar() {
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
      fecha_creacion: new Date(),
      fecha_nacimiento: fechaNacimiento,
      password: contrasena,
      img: this.registroForm.get('imagen')?.value
    };

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

  getImagenUrl(): SafeUrl | null {
    if (this.imagenFileName) {
      // Construye la URL de la imagen, asumiendo que las imágenes se almacenan en una carpeta llamada "imagenes"
      const imageUrl = `/imagenes/${this.imagenFileName}`;
      // Asegura la URL para evitar problemas de seguridad
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return null;
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     // Puedes realizar acciones con el archivo seleccionado aquí
  //     // Por ejemplo, puedes mostrar una vista previa o subirlo al servidor
  //     console.log('Archivo seleccionado:', file);
  //     // También puedes almacenar la URL de la imagen en el formulario si es necesario
  //     this.registroForm.get('imagen')?.setValue(file.name); // Ejemplo: almacenar el nombre del archivo
  //   }
  // }

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

}
