import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-agendar-visita-servicio',
  templateUrl: './agendar-visita-servicio.page.html',
  styleUrls: ['./agendar-visita-servicio.page.scss'],
})
export class AgendarVisitaServicioPage implements OnInit {

  agendaForm!: FormGroup;
  idSolicitud!: number;
  
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.agendaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id_solicitud');
    if (idParam) {
      this.idSolicitud = parseInt(idParam, 10);
    }
  }

  onSubmit(): void {
    if (this.agendaForm.valid) {
      const visitaData = {
        ...this.agendaForm.value,
        id_solicitud: this.idSolicitud
      
      };
    
      this.authService.agregarVisitaConSolicitud(visitaData).subscribe((response: any) => {
       
      }, (error: any) => {
        // Maneja el error aquí
      });
      console.log("hola");
    }
  }
}