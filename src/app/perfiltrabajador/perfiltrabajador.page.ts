import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfiltrabajador',
  templateUrl: './perfiltrabajador.page.html',
  styleUrls: ['./perfiltrabajador.page.scss'],
})

export class PerfiltrabajadorPage implements OnInit {
  mostrarBotonAgregarServicio: boolean = false;
  mostrarBotonSolicitar: boolean = true;
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

    // Cargar los datos del trabajador
    this.authService.loadTrabajadorData(this.correoElectronico).subscribe(
      (data: any) => {
        this.datosTrabajador = data;
        console.log(this.datosTrabajador);

        // Verificar si el correo del trabajador coincide con el usuario autenticado
        const usuarioAutenticado = this.authService.getCorreoElectronico();
        if (usuarioAutenticado === this.correoElectronico) {
          this.mostrarBotonAgregarServicio = true;
          this.mostrarBotonSolicitar = false; // Ocultar el botón "Solicitar"
        }
      },
      (error: any) => {
        console.error('Error al recibir los datos del trabajador', error);
      }
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

  agregarServicio(){
    this.router.navigate(['/agregar-servicio',this.authService.getCorreoElectronico()]);
    console.log("click")
  }




}
