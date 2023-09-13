import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {
  titulo: string = '';
  descripcion: string = '';
  datosServicio: any = {};
  correoElectronico_trabajador = '';
  constructor(

    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.correoElectronico_trabajador = params['correoElectronico']; // Utiliza 'correoElectronico'
      this.loadServicio_solicitud(this.correoElectronico_trabajador); // Pasa 'correoElectronico' en lugar de 'userId'
      
    });
    
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  private navigateToUserProfile(correoElectronico: string) {
    this.router.navigate(['/perfil', correoElectronico]);
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

  loadServicio_solicitud(correoElectronico: string) {
    this.authService.loadTrabajadorData(correoElectronico).subscribe(
      (trabajorData: any) => {
        this.datosServicio = trabajorData;
        
        
      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }

}
