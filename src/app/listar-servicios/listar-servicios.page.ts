import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; 

@Component({  
  selector: 'app-listar-servicios',
  templateUrl: './listar-servicios.page.html',
  styleUrls: ['./listar-servicios.page.scss'],
})
export class ListarServiciosPage implements OnInit {
  listaServicios:any[] = [];
  constructor(
    private http: HttpClient ,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.cargarListadoServicios();
  }
  cargarListadoServicios() {
    this.authService.cargarListadoServicios().subscribe((data: any) => {
      this.listaServicios = data;
      console.log(this.listaServicios);
    });
  }
  navegarAPerfilTrabajador(correoElectronico: string) {
    const perfilTrabajadorUrl = `/trabajador/${correoElectronico}`;
    this.router.navigate([perfilTrabajadorUrl]);
  }
}
