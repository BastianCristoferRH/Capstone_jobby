import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregar-resena',
  templateUrl: './agregar-resena.page.html',
  styleUrls: ['./agregar-resena.page.scss'],
})
export class AgregarResenaPage implements OnInit {

  solicitudId:number;
  reseñaData: any={
    descripcion:'',
    calificacion:null,
  };
 
  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute) {
      this.solicitudId = this.activatedRoute.snapshot.params['id_solicitud'];
     }

    agregarReseña() {
      // Realiza una solicitud POST a tu API para agregar la reseña
      this.http.post(`http://localhost:4001/agregar-resena/${this.solicitudId}`, this.reseñaData)
        .subscribe(
          (result) => {
            console.log("Reseña agregada con éxito", result);
            // Puedes redirigir a otra página o realizar otras acciones aquí
          },
          (error) => {
            console.log("Error al agregar reseña", error);
            // Maneja el error de acuerdo a tus necesidades
          }
        );
    }




  ngOnInit() {
  }

}
