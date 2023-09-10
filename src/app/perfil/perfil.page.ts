import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  correoElectronico: string = '';
  usuarioId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.usuarioId = params.get('usuarioId');
    });

    if (this.authService.isAuthenticated()) {
      this.correoElectronico = this.authService.getCorreoElectronico() || '';

      if (this.usuarioId) {
        this.loadUserProfile(this.usuarioId);
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  loadUserProfile(usuarioId: string) {
    this.authService.getUserProfile(usuarioId).subscribe(
      (profileData: any) => {
        console.log('Perfil del usuario:', profileData);
      },
      (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
