import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-listar-servicios',
  templateUrl: './listar-servicios.page.html',
  styleUrls: ['./listar-servicios.page.scss'],
})
export class ListarServiciosPage implements OnInit {
  listaServicios: any[] = [];
  terminoBusqueda: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController
  ) { }




  ngOnInit() {
    this.cargarListadoServicios();

  }

  perfil_trabajador(correoElectronico: string) {
    // Usar 'correoElectronico' para construir la URL y navegar
    this.router.navigate(['/trabajador',correoElectronico]);
  }

  cargarListadoServicios() {
    this.authService.cargarListadoServicios().subscribe((data: any) => {
      this.listaServicios = data;

      // Luego, itera a través de los servicios y convierte las imágenes base64 en URLs seguras
      this.listaServicios.forEach((element) => {
        if (element.img_portada_base64 !== null) {
          element.img_portada_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + element.img_portada_base64);
        }
      });

      console.log(this.listaServicios);
    });
  }
  
  navegarAPerfilTrabajador(correoElectronico: string) {
    const perfilTrabajadorUrl = `/trabajador/${btoa(correoElectronico)}`;
    this.router.navigate([perfilTrabajadorUrl]);
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


}

