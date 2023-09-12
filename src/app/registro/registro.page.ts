import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  registroForm!: FormGroup; // Inicializar la propiedad con "!"

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
      fecha_nacimiento: fechaNacimiento,
      conexion: '0',
      password: contrasena,
      img: this.registroForm.get('imagen')?.value
    };

    this.authService.registrarUsuario(usuario).subscribe(
      (resultado) => {
        this.presentAlert('¡Bien!, te has registrado correctamente');
        console.log("Registro exitoso:", resultado);
      },
      (error) => {
        console.error("Error al registrar:", error);
      }
    );
  }

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
}
