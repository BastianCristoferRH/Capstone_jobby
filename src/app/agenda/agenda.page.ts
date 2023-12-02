import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { error } from 'console';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  constructor(private authService: AuthService) { }
  visitasAgendas: any[]=[];
  VisitasAgendadas: any[]=[];
  public showVisitasAgendas = true;
  public showVisitasAgenda = false;
  selectedTab1: string = 'tab1';
  ngOnInit() {
    const correo = this.authService.getCorreoElectronico();
    if (correo) {
      this.authService.getVisitasAgendadas(correo).subscribe(
        response => {
          console.log('Respuesta de la API:', response);
          this.visitasAgendas=response;
        },
        error => {
          console.log("error");
          console.error('Error al obtener las visitas agendadas:', error);
        }
      );

      this.authService.visitasARecibir(correo).subscribe(
        response => {
          console.log('Respuesta de la API:', response);
          this.VisitasAgendadas=response;
        },
        error => {
          console.log("error");
          console.error('Error al obtener las visitas agendadas:', error);
        }
      );


    }
  }


  toggleList() {
    this.showVisitasAgendas = false;
    this.showVisitasAgenda = true;
  }

  toggleList2() {
    this.showVisitasAgenda = false;
    this.showVisitasAgendas = true;
  }




}