import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-resena-info',
  templateUrl: './resena-info.page.html',
  styleUrls: ['./resena-info.page.scss'],
})
export class ResenaInfoPage implements OnInit {

  starData1!: { enteras: number; fraccion: number; };
  correoElectronico: string = '';
  solicitudId: string = '';
  resenaData: any[]=[];
  calificacion: number = 0;
  constructor(private route: ActivatedRoute,
    private authService: AuthService) { }

  getStarData(calificacion: number): { enteras: number, fraccion: number } {
    const enteras = Math.floor(calificacion); // Parte entera
    const fraccion = calificacion - enteras; // Parte fraccionaria
    return { enteras, fraccion };
  
  }
  ngOnInit() {
    this.starData1 = this.getStarData(this.calificacion);
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronicoo'];
      this.solicitudId = params ['solicitudId']
      this.authService.obtenerResena(this.correoElectronico,this.solicitudId).subscribe((data:any)=>{
        console.log(data);
        this.resenaData = data;
        this.calificacion = data[0].calificacion;
        console.log(this.calificacion);
      })
    });
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
  getStarIcon(index: number, calificacion: number): string {
    // Determina el nombre del ícono de estrella (star, star-half o star-outline) en función de 'index' y 'promedio'
    if (index <= Math.floor(calificacion)) {
      return 'star'; // Estrella completa
    } else if (index === Math.ceil(calificacion)) {
      return 'star-half'; // Media estrella si el índice es igual al valor entero más cercano del promedio
    } else {
      return 'star-outline'; // Estrella vacía
    }
  }
}
