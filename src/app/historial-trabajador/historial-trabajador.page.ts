import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-historial-trabajador',
  templateUrl: './historial-trabajador.page.html',
  styleUrls: ['./historial-trabajador.page.scss'],
})
export class HistorialTrabajadorPage implements OnInit {

  correoElectronico: string = '';
  serviciosFinalizados: any[]=[];
  serviciosNoFinalizados: any[]=[];
  constructor(private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico'];
      this.authService.SolicitudesRecibidas(this.correoElectronico).subscribe((data:any)=>{

        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (element.estado == 'Rechazado') {
            this.serviciosNoFinalizados.push(element);
            
          }else{
            this.serviciosFinalizados.push(element);
          }
          
          
        }
        console.log('servicios no finalizados:',this.serviciosNoFinalizados);
        console.log('servicios finalizados: ',this.serviciosFinalizados);
      })
  });
    
  }

}
