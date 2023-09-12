import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
<<<<<<< HEAD
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

=======
import { Router } from '@angular/router';
>>>>>>> 2295d4863f3639ccb2433934e18b5b58cd0db556

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  registroForm!: FormGroup; // Inicializar la propiedad con "!"

<<<<<<< HEAD
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(7)]],
      confirmarContrasena: ['', [Validators.required]],
      primerNombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      telefono: [0, [Validators.required]],
      imagen: ['']
    });
=======
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      
      this.router.navigateByUrl('/perfil');
    }
>>>>>>> 2295d4863f3639ccb2433934e18b5b58cd0db556
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
      console.log("Faltan valores en el formulario");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      console.log("Las contraseñas no coinciden");
      return;
    }

    

    const usuario = {
      correo_electronico: this.registroForm.get('correoElectronico')?.value,
      nombre: this.registroForm.get('primerNombre')?.value,
      apellidos: this.registroForm.get('apellidos')?.value,
      telefono: telefono,
      fecha_creacion: new Date(),
<<<<<<< HEAD
      fecha_nacimiento: fechaNacimiento,
      conexion: '0',
      password: contrasena,
      img: this.registroForm.get('imagen')?.value
=======
      fecha_nacimiento: this.fechaNacimiento,
      password: this.contrasena,
>>>>>>> 2295d4863f3639ccb2433934e18b5b58cd0db556
    };

    this.authService.registrarUsuario(usuario).subscribe(
      (resultado) => {
<<<<<<< HEAD
        this.presentAlert('¡Bien!, te has registrado correctamente');
=======
>>>>>>> 2295d4863f3639ccb2433934e18b5b58cd0db556
        console.log("Registro exitoso:", resultado);
      },
      (error) => {
        console.error("Error al registrar:", error);
      }
    );
  }
<<<<<<< HEAD

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Puedes realizar acciones con el archivo seleccionado aquí
      // Por ejemplo, puedes mostrar una vista previa o subirlo al servidor
      console.log('Archivo seleccionado:', file);
      // También puedes almacenar la URL de la imagen en el formulario si es necesario
      this.registroForm.get('imagen')?.setValue(file.name); // Ejemplo: almacenar el nombre del archivo
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
=======
>>>>>>> 2295d4863f3639ccb2433934e18b5b58cd0db556
}
