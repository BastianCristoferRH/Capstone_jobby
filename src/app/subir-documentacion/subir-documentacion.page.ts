import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-subir-documentacion',
  templateUrl: './subir-documentacion.page.html',
  styleUrls: ['./subir-documentacion.page.scss'],
})
export class SubirDocumentacionPage implements OnInit {
  documentData: any = {
    titulo: '',
    documento: null,
    id_trabajador:''
  };

  documentDataa: any = {};
  trabajadorId:any={};

  selectedFile: File | null = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Archivo seleccionado:', this.selectedFile);
  }

  submitForm() {

    const correoElectronico = this.authService.getCorreoElectronico();

    if (correoElectronico) {
      this.authService.getTrabajadorIdPorCorreo(correoElectronico).subscribe(
        (data: any) => {
          console.log(data);
          this.trabajadorId = data;
          console.log(this.trabajadorId[0].id_trabajador);
        },
        (error) => {
          console.error('Error al obtener id trabajador:', error);
        }
      );
    } else {
      console.error('El correo electrónico es nulo o no está disponible.');
    }
    console.log('Datos a enviar:', this.documentData);
    console.log(this.selectedFile + '-'+this.documentData.titulo);
    if (!this.selectedFile || !this.documentDataa.titulo ) {
      console.log('Por favor, complete todos los campos.');
      return;
    }
    
    this.documentData.titulo = this.documentDataa.titulo;
    this.documentData.documento = this.selectedFile.webkitRelativePath;
    this.documentData.id_trabajador = this.trabajadorId[0].id_trabajador;
    console.log('Datos a enviar:', this.documentData);

    console.log(this.trabajadorId[0].id_trabajador);

    
    this.authService.agregarDocumentacionTrabajador(this.documentData).subscribe(
      (response) => {
        console.log('Documento subido exitosamente:', response);
      },
      (error) => {
        console.error('Error al subir el documento:', error);
      }
    );
  }

  ngOnInit() {
    
    

}
}