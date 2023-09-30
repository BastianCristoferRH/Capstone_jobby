import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.correo = params['correo']; // Obtiene el correo electrónico de la URL
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
      },
      (error) => {
        console.error('Error al registrar al trabajador:', error);
      }
    );
  }
}
