import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-gestionar-resenas',
  templateUrl: './gestionar-resenas.page.html',
  styleUrls: ['./gestionar-resenas.page.scss'],
})
export class GestionarResenasPage implements OnInit {

  starData1!: { enteras: number; fraccion: number; };
  calificacion: number = 0;
  resenaData: any[]=[];
  correoElectronico: string = '';
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private alertController: AlertController) { }


  getStarData(calificacion: number): { enteras: number, fraccion: number } {
    const enteras = Math.floor(calificacion);
    const fraccion = calificacion - enteras;
    return { enteras, fraccion };
    
  }
  
  ngOnInit() {
    this.starData1 = this.getStarData(this.calificacion);
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico']
      this.authService.obtenerResenas(this.correoElectronico).subscribe((data:any)=>{
        console.log(data);
        this.resenaData = data;
        this.calificacion = data
      });
    });
  }


    async emitirReporte(resenaId: number) {
      const alert = await this.alertController.create({
        header: 'Estás seguro que deseas reportar esta reseña?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelado');
            }
          },
          {
            text: 'Sí',
            handler: () => {
              console.log('Reporte emitido con éxito');
              this.authService.actualizarEstadoResena(resenaId, 'reportado').subscribe(
                (data: any) => {
                  location.reload();
                },
                (error: any) => {
                  console.error('Error al emitir el reporte:', error);
                }
              );
            }
          }
        ]
      });
    
      await alert.present();
    }
    
  

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
  getStarIcon(index: number, calificacion: number): string {
    if (index <= Math.floor(calificacion)) {
      return 'star';
    } else if (index === Math.ceil(calificacion)) {
      return 'star-half'; 
    } else {
      return 'star-outline';
    }
  }

}
