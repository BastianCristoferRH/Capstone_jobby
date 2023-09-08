import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo_electronico: string = '';
  password: string = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.correo_electronico, this.password).subscribe(
      (response: any) => {
        if (response && response.mensaje) {
          console.log('Inicio de sesión exitoso:', response.mensaje);
          // Redirige a la página principal o realiza otras acciones necesarias.
        } else {
          console.error('Respuesta inesperada del servidor:', response);
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }

}
