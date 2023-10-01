import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
 
  },
  {
    path: 'perfil/:userId', 
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'trabajador/:correoElectronico',
    loadChildren: () => import('./perfiltrabajador/perfiltrabajador.module').then( m => m.PerfiltrabajadorPageModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'agregar-servicio/:correoElectronico',
    loadChildren: () => import('./agregar-servicio/agregar-servicio.module').then( m => m.AgregarServicioPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'solicitud/:correoElectronico', 
    loadChildren: () => import('./solicitud/solicitud.module').then( m => m.SolicitudPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'listar-servicios',
    loadChildren: () => import('./listar-servicios/listar-servicios.module').then( m => m.ListarServiciosPageModule)
  },

  {
    path: 'agregar-servicio',
    loadChildren: () => import('./agregar-servicio/agregar-servicio.module').then( m => m.AgregarServicioPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'solicitud/:correoElectronico', 
    loadChildren: () => import('./solicitud/solicitud.module').then( m => m.SolicitudPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'servicio-solicitado/:correoElectronico',
    loadChildren: () => import('./servicios-solicitados/servicios-solicitados.module').then( m => m.ServiciosSolicitadosPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'agregar-resena/:id_solicitud',
    loadChildren: () => import('./agregar-resena/agregar-resena.module').then( m => m.AgregarResenaPageModule)
  },
  {
    path: 'registrar-trabajado/:correo',
    loadChildren: () => import('./registrar-trabajador/registrar-trabajador.module').then( m => m.RegistrarTrabajadorPageModule),
    canActivate: [AuthGuard],
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


