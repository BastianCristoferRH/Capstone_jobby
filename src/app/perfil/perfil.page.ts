import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  
})
export class PerfilPage implements OnInit {
  correoElectronico: string = '';
  usuarioId: string | null = null;
  datosUsuario: any = {}; // Aquí almacenaremos los datos del usuario

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.correoElectronico = params['userId']; // Utiliza 'correoElectronico'
      this.loadUserProfile(this.correoElectronico); // Pasa 'correoElectronico' en lugar de 'userId'
    });
   
  }


  loadUserProfile(correoElectronico: string) {
    this.authService.getUserProfile(correoElectronico).subscribe(
      (profileData: any) => {
        this.datosUsuario = profileData;
      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }



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
    this.router.navigate(['/trabajador', this.correoElectronico]); // Usar 'this.correoElectronico'
  }

  private navigateToUserProfile(correoElectronico: string) {
    this.router.navigate(['/perfil', correoElectronico]);
  }

  navigateToSolicitud() {
    this.router.navigate(['/solicitud', this.correoElectronico]); 
  }
  navegarAServicioSolicitado() {

    const correoElectronico = this.authService.getCorreoElectronico();

    if (correoElectronico) {
      
      this.router.navigate(['/servicio-solicitado', correoElectronico]);
    } else {
      console.error('Correo electrónico no disponible.');
     
    }
  }


}
