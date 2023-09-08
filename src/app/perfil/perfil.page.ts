import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  correoElectronico: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    
    this.correoElectronico = this.authService.getCorreoElectronico() || '';
    console.log(this.correoElectronico);
  }


}
