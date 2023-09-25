import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servicios-solicitados',
  templateUrl: './servicios-solicitados.page.html',
  styleUrls: ['./servicios-solicitados.page.scss'],
})
export class ServiciosSolicitadosPage implements OnInit {
  correoTrabajador: string = '';
  solicitudesRecibidas: any = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.correoTrabajador = params['correoElectronico'];
      this.authService.SolicitudesRecibidas(this.correoTrabajador).subscribe(
        (data: any) => {
          this.solicitudesRecibidas = data;
          console.log(this.solicitudesRecibidas);
        },
        (error: any) => {
          console.error('Error al obtener las solicitudes recibidas:', error);
        }
      );
    });
  }

  aceptarSolicitud(solicitudId: number) {
    this.authService.actualizarEstadoSolicitud(solicitudId, 'gestionando').subscribe(
      (data: any) => {
        console.log('Solicitud aceptada con éxito');
        this.authService.SolicitudesRecibidas(this.correoTrabajador).subscribe(
          (data: any) => {
            this.solicitudesRecibidas = data;
            console.log(this.solicitudesRecibidas);
          },
          (error: any) => {
            console.error('Error al obtener las solicitudes recibidas:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al aceptar la solicitud:', error);
      }
    );
  }

  aceptarEncargo(solicitudId: number) {
    this.authService.actualizarEstadoSolicitud(solicitudId, 'Desarrollo').subscribe(
      (data: any) => {
        console.log('Solicitud aceptada con éxito');
        this.authService.SolicitudesRecibidas(this.correoTrabajador).subscribe(
          (data: any) => {
            this.solicitudesRecibidas = data;
            console.log(this.solicitudesRecibidas);
          },
          (error: any) => {
            console.error('Error al obtener las solicitudes recibidas:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al aceptar la solicitud:', error);
      }
    );
  }

  rechazarEncargo(solicitudId: number) {
    this.authService.actualizarEstadoSolicitud(solicitudId, 'Rechazado').subscribe(
      (data: any) => {
        console.log('Solicitud aceptada con éxito');
        this.authService.SolicitudesRecibidas(this.correoTrabajador).subscribe(
          (data: any) => {
            this.solicitudesRecibidas = data;
            console.log(this.solicitudesRecibidas);
          },
          (error: any) => {
            console.error('Error al obtener las solicitudes recibidas:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al aceptar la solicitud:', error);
      }
    );
  }

  finalizarSolicitud(solicitudId: number) {
    this.authService.actualizarEstadoSolicitud(solicitudId, 'Finalizado').subscribe(
      (data: any) => {
        console.log('Solicitud aceptada con éxito');
        this.authService.SolicitudesRecibidas(this.correoTrabajador).subscribe(
          (data: any) => {
            this.solicitudesRecibidas = data;
            console.log(this.solicitudesRecibidas);
          },
          (error: any) => {
            console.error('Error al obtener las solicitudes recibidas:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al aceptar la solicitud:', error);
      }
    );
  }
}
