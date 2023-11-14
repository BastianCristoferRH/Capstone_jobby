import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  correoElectronico: string = '';
  usuarioId: string | null = null;
  datosUsuario: any = {};
  SolicitudesRealizadas: any[] = []; // Aquí almacenaremos los datos del usuario

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    
    this.route.params.subscribe((params) => {
      this.correoElectronico = atob(params['userId']); // Utiliza 'correoElectronico'
      this.loadUserProfile(this.correoElectronico);
      this.authService.SolicitudesRealizadas(this.correoElectronico).subscribe(
        (data: any) => {
          this.SolicitudesRealizadas = data;
          console.log(this.SolicitudesRealizadas);
        },
        (error: any) => {
          console.error('Error al obtener las solicitudes recibidas:', error);
        }
      ); // Pasa 'correoElectronico' en lugar de 'userId'
    });
  }
  goToResena(solicitudId: number){
    this.router.navigate(['/perfil',btoa(this.correoElectronico),'agregar-resena',solicitudId])
  }
  

  loadUserProfile(correoElectronico: string) {
    this.authService.getUserProfile(correoElectronico).subscribe(
      (profileData: any) => {
        this.datosUsuario = profileData;  
        
        if (this.datosUsuario.img_base64 !== null) {
          // Crear una URL segura a partir de los datos base64
          this.datosUsuario.img_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.datosUsuario.img_base64);
        }
        
        console.log(this.datosUsuario);
      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
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

  

  navegarModificarPerfil() {
    this.router.navigate(['/modperfil',btoa(this.correoElectronico)])
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

  CompletadoEncargo(solicitudId: number) {
    this.authService.actualizarEstadoSolicitud(solicitudId, 'Completado').subscribe(
      (data: any) => {
        console.log('Solicitud aceptada con éxito');
        location.reload();
      (error: any) => {
        console.error('Error al aceptar la solicitud:', error);
      }}
    );
  }

  

  


  IncompletoEncargo(solicitudId: number) {
    this.authService.actualizarEstadoSolicitud(solicitudId, 'Incompleto').subscribe(
      (data: any) => {
        console.log('Solicitud aceptada con éxito');
        location.reload();
      (error: any) => {
        console.error('Error al aceptar la solicitud:', error);
      }}
    );
  }

  


}