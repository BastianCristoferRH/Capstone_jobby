import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  perfil_menu() {
    if (this.authService.isAuthenticated()) {
      const correoElectronico = this.authService.getCorreoElectronico();
      if (correoElectronico) {
        this.navigateToUserProfile(correoElectronico);
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  perfil_trabajador() {
    this.navigateTo('/trabajador/' + this.authService.getCorreoElectronico());
  }

  private navigateToUserProfile(correoElectronico: string) {
    this.navigateTo('/perfil/' + correoElectronico);
  }

  navegarAServicioSolicitado() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.navigateTo('/servicio-solicitado/' + correoElectronico);
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }

  navegarAFavorito() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.navigateTo('/listar-favorito/' + correoElectronico);
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }

  inicio() {
    this.navigateTo('/listar-servicios');
  }

  private navigateTo(url: string) {
   
    window.location.href = url;
  }
}
