import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-agregar-resena',
  templateUrl: './agregar-resena.page.html',
  styleUrls: ['./agregar-resena.page.scss'],
})
export class AgregarResenaPage implements OnInit {
  trabajadorId: any = {};
  solicitudId:any= {};
  resenaa:any={}
  reseñaData: any={
    descripcion:'',
    calificacion:null,
    id_solicitud:''
  };

 
  constructor(private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute) {
      
     }

    agregarResena() {
      this.route.params.subscribe(params=>{
        const solicitudId = params['id_solicitud']
        this.reseñaData.descripcion = this.resenaa.descripcion;
        this.reseñaData.calificacion = this.resenaa.calificacion;
        this.reseñaData.id_solicitud = solicitudId
        console.log(this.reseñaData.descripcion);
        console.log(this.reseñaData.calificacion);
        console.log(this.reseñaData.id_solicitud);
        this.http.post(`http://localhost:4001/agregar-resena/${solicitudId}`, this.reseñaData)
          .subscribe(
            (result) => {
              console.log("Reseña agregada con éxito", result);
            
            },
            (error) => {
              console.log("Error al agregar reseña", error);
            }
          );
        });
      
    }




  ngOnInit() {
    this.route.params.subscribe(params => {
      const idSolicitud = params['id_solicitud'];
      const correoElectronico = this.authService.getCorreoElectronico();
      if (correoElectronico) {
        this.authService.getTrabajadorIdPorCorreo(correoElectronico).subscribe(
          (data: any) => {
            console.log(data);
            this.trabajadorId = data;
          },
          (error) => {
            console.error('Error al obtener información del trabajador:', error);
          }
        );
      } else {
        console.error('El correo electrónico es nulo o no está disponible.');
      }
      console.log(this.trabajadorId[0].id_trabajador);
  });
}

}
