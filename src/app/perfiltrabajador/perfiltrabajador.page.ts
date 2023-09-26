import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfiltrabajador',
  templateUrl: './perfiltrabajador.page.html',
  styleUrls: ['./perfiltrabajador.page.scss'],
})

export class PerfiltrabajadorPage implements OnInit {
  correoElectronico: string = '';
  datosTrabajador: any = []; // Ahora inicializado como un arreglo

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico'];
      this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
        (data: any) => {
          this.datosTrabajador = data;
          console.log(this.datosTrabajador);


        },
        (error: any) => {
          console.error('error al recibir los datos trabajador', error);
        },
      );
    });
  }

  navigateToSolicitud() {
    this.router.navigate(['/solicitud', this.correoElectronico]); 
  }

  //menu


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

  private navigateToUserProfile(correoElectronico: string) {
    this.router.navigate(['/perfil', correoElectronico]);
  }
  perfil_trabajador() {
    this.router.navigate(['/trabajador', this.correoElectronico]); // Usar 'this.correoElectronico'
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
