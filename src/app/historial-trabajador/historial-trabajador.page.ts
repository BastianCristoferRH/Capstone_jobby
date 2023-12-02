import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-historial-trabajador',
  templateUrl: './historial-trabajador.page.html',
  styleUrls: ['./historial-trabajador.page.scss'],
})
export class HistorialTrabajadorPage implements OnInit {

  correoElectronico: string = '';
  servicios: any[]=[];

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.correoElectronico = params['correoElectronico'];
      this.authService.SolicitudesRecibidas(this.correoElectronico).subscribe((data:any)=>{
        this.servicios = data;
        console.log(this.servicios);
      })
  });
     
    
  }

  perfil_trabajador() {
    const perfilTrabajadorUrl = `/trabajador/${btoa(this.correoElectronico!)}`;
    this.router.navigate([perfilTrabajadorUrl]);
  }


  goToResenaInfo(solicitudId:number) {  
    this.router.navigate(['trabajador',this.correoElectronico,'historial-trabajador','resena-info',this.correoElectronico,solicitudId]);
  }

}
