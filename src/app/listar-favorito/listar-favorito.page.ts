import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-listar-favorito',
  templateUrl: './listar-favorito.page.html',
  styleUrls: ['./listar-favorito.page.scss'],
})
export class ListarFavoritoPage implements OnInit {
  favoritos: any[] = [];
  correo = this.authService.getCorreoElectronico();

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit() {
    this.listar_favoritos();
  }

  listar_favoritos() {
    const id_usuario = this.correo;
    if (id_usuario !== null) {
      this.authService.listarFavoritos(id_usuario).subscribe(
        (data: any) => {
          if (Array.isArray(data.favoritos)) { // Verifica si data.favoritos es un arreglo
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
      this.router.navigate(['/trabajador', trabajador]);
    } else {
      console.error('Correo electrónico no disponible.');
    }
  }
}
