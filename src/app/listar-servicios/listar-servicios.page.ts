import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-listar-servicios',
  templateUrl: './listar-servicios.page.html',
  styleUrls: ['./listar-servicios.page.scss'],
})
export class ListarServiciosPage implements OnInit {
  listaServicios:any[] = [];
  constructor(private http: HttpClient,
              private router: Router ) { }

  ngOnInit() {
    this.cargarListadoServicios();
  }

  perfil_trabajador(correoElectronico: string) {
    // Usar 'correoElectronico' para construir la URL y navegar
    this.router.navigate(['/trabajador', correoElectronico]);
  }

  cargarListadoServicios() {
    this.http.get('http://localhost:4000/listar-servicios').subscribe((data: any) => {
      this.listaServicios = data;
      console.log(this.listaServicios);
     });
  }
}
