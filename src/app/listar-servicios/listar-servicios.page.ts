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
  listaServicios: any[] = [];
  terminoBusqueda: string = '';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarListadoServicios();
  }

  perfil_trabajador(correoElectronico: string) {
    // Usar 'correoElectronico' para construir la URL y navegar
    this.router.navigate(['/trabajador', correoElectronico]);
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
  argarListadoServicios() {
    this.authService.cargarListadoServicios().subscribe((data: any) => {
      this.listaServicios = data;
      console.log(this.listaServicios);
    });
  }

  // Función para filtrar la lista de servicios
  filtrarServicios() {
    const terminoBusquedaLowerCase = this.terminoBusqueda.toLowerCase().split(' ');
  
    // Filtra la lista de servicios en función de términos de búsqueda flexibles
    this.listaServicios = this.listaServicios.filter((servicio) => {
      const textoServicio = (
        servicio.name_serv.toLowerCase() +
        servicio.des_serv.toLowerCase() +
        servicio.name_comuna.toLowerCase() +
        servicio.name_region.toLowerCase()
      );
  
      // Verifica si al menos un término está presente en el texto del servicio
      return terminoBusquedaLowerCase.every(termino => textoServicio.includes(termino));
    });
  }
  

  // Función para limpiar el filtro y restablecer la lista original
  limpiarFiltro() {
    this.terminoBusqueda = ''; // Vacía el término de búsqueda
    this.cargarListadoServicios(); // Recarga la lista de servicios original
  }

  buscarServicios() {
   
    if (this.terminoBusqueda.trim() !== '') {
    
      this.filtrarServicios();
    }else if(this.terminoBusqueda.trim() == ''){
      this.limpiarFiltro();
    }
    
  }
  // doRefresh(event) {
  //   console.log('Begin async operation');

  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     event.target.complete();
  //   }, 500);
  // }

}

