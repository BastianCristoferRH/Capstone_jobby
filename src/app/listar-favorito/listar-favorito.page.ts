import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-listar-favorito',
  templateUrl: './listar-favorito.page.html',
  styleUrls: ['./listar-favorito.page.scss'],
})
export class ListarFavoritoPage implements OnInit {
  favoritos: any[] = [];
  correo = this.authService.getCorreoElectronico();

  constructor(private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.listar_favoritos();
  }

  listar_favoritos() {
    const id_usuario = this.correo;
    if (id_usuario !== null) {
      this.authService.listarFavoritos(id_usuario).subscribe(
        (data: any) => {
          if (Array.isArray(data.favoritos)) {
            data.favoritos.forEach((favorito: any) => {
              if (favorito.img_base64 !== null) {
                // Crear una URL segura a partir de los datos base64
                favorito.img_base64 = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + favorito.img_base64);
              }
            });
            this.favoritos = data.favoritos;
          } else {
            console.error('Los datos recibidos no son un arreglo.');
          }
        },
        (error: any) => {
          console.error('Error al listar los favoritos', error);
        }
      );
    }
  }
  

  navegarAFavorito(trabajador :string) {
   
    if (trabajador) {
      this.router.navigate(['/trabajador', btoa(trabajador)]);
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }
}
