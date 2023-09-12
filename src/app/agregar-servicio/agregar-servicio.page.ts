import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar-servicio',
  templateUrl: './agregar-servicio.page.html',
  styleUrls: ['./agregar-servicio.page.scss'],
})
export class AgregarServicioPage implements OnInit {

  servicio: any = {}; 
  serviceData = {
    des_serv:'',
    presencial:'',
    id_trabajador:'',
    id_serv: '',
    id_comuna: '',
    id_region: ''
  };
  constructor( private http: HttpClient) { }

  addService() {
    // Enviar la solicitud POST a tu API Express
    this.http.post('http://localhost:3000/agregar_servicio', this.serviceData)
      .subscribe(response => {
        // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
        console.log('Servicio agregado con éxito', response);
      });
  }

  ngOnInit() {
  }

}
