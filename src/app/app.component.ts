import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private correo: string | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {
    this.correo = this.authService.getCorreoElectronico();
  }

  

  private closeMenu() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.closeMenu();
  }

  perfil_menu() {
    if (this.authService.isAuthenticated()) {
      const correoElectronico = this.authService.getCorreoElectronico();
      if (correoElectronico) {
        this.navigateToUserProfile(correoElectronico);
        this.closeMenu();
      }
    } else {
      this.router.navigateByUrl('/login');
      this.closeMenu();
    }
  }

  perfil_trabajador() {
    const perfilTrabajadorUrl = `/trabajador/${btoa(this.correo!)}`;
    this.router.navigate([perfilTrabajadorUrl]);
    this.closeMenu();
  }

 
  private navigateToUserProfile(correoElectronico: string) {
    const perfilUrl = `/perfil/${btoa(correoElectronico)}`;
    this.router.navigate([perfilUrl]);
    this.closeMenu();

  }


  navegarAServicioSolicitado() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.navigateTo('/servicio-solicitado/' + btoa(correoElectronico));
      this.closeMenu();
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }

  navegarAFavorito() {
    const correoElectronico = this.authService.getCorreoElectronico();
    if (correoElectronico) {
      this.navigateTo('/listar-favorito/' + btoa(correoElectronico));
      this.closeMenu();
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }

  inicio() {
    this.navigateTo('/listar-servicios');
    this.closeMenu();
  }

  NavegarAgenda(){
    this.navigateTo('agenda');
    this.closeMenu();
  }

  private navigateTo(url: string) {
    this.router.navigateByUrl(url);
    this.closeMenu();
  }
}
