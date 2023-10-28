import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo_electronico: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    
    if (this.authService.isAuthenticated()) {
      
      const correoElectronico = this.authService.getCorreoElectronico();

      if (correoElectronico) {
        this.router.navigateByUrl(`/perfil/${btoa(correoElectronico)}`);
      }
    }
  }

  login() {
    this.authService.login(this.correo_electronico, this.password).subscribe(
      (response: any) => {
        if (response && response.mensaje) {
          console.log('Inicio de sesión exitoso:', response.mensaje);
          this.authService.saveToken(response.token); // Almacena el token        
          this.router.navigateByUrl(`/perfil/${btoa(this.correo_electronico)}`);
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




