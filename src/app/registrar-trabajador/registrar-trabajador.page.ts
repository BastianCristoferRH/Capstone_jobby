import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registrar-trabajador',
  templateUrl: './registrar-trabajador.page.html',
  styleUrls: ['./registrar-trabajador.page.scss'],
})
export class RegistrarTrabajadorPage implements OnInit {
  correo: string = '';
  descripcion: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.correo = atob(params['correo']); // Obtiene el correo electrónico de la URL
    });
  }

  registrarTrabajador() {
    const trabajadorData = {
      disponibilidad: 'disponible',
      des_perfil: this.descripcion,
      correo_electronico: this.correo,
    };
    console.log(trabajadorData);

    this.authService.registrarTrabajador(trabajadorData).subscribe(
      (response) => {
        console.log('Trabajador registrado con éxito', response)
        this.router.navigate(['/agregar-servicio', this.authService.getCorreoElectronico()]);
      },
      (error) => {
        console.error('Error al registrar al trabajador:', error);
      }
    );
  }

  agregarFavorito(id_usuario: string, id_trabajador: number) {
    this.authService.agregarFavorito(id_usuario, id_trabajador).subscribe(
      (response) => {
        console.log('Trabajador agregado como favorito con éxito');
      },
      (error) => {
      
        console.error('Error al agregar el trabajador como favorito', error);
      }
    );
  }
  quitarFavorito(id_usuario: string, id_trabajador: number) {
    this.authService.quitarFavorito(id_usuario, id_trabajador).subscribe(
      (response) => {
        console.log('Trabajador eliminado de favoritos con éxito');
      },
      (error) => {
        console.error('Error al quitar el trabajador de favoritos', error);
      }
    );
  }


}
