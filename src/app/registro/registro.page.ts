import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  correoElectronico: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  primerNombre: string = '';
  apellidos: string = '';
  fechaNacimiento: string = '';
  telefono: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      
      this.router.navigateByUrl('/perfil');
    }
  }

  registrar() {
    if (this.contrasena !== this.confirmarContrasena) {
      console.log("Las contraseñas no coinciden");
      return;
    }

    const usuario = {
      correo_electronico: this.correoElectronico,
      nombre: this.primerNombre,
      apellidos: this.apellidos,
      telefono: this.telefono,
      fecha_creacion: new Date(),
      fecha_nacimiento: this.fechaNacimiento,
      password: this.contrasena,
    };

    this.authService.registrarUsuario(usuario).subscribe(
      (resultado) => {
        console.log("Registro exitoso:", resultado);
      },
      (error) => {
        console.error("Error al registrar:", error);
      }
    );
  }
}
