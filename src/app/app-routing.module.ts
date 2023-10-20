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
    path: 'modificar-servicio/:id_des_serv',
    loadChildren: () => import('./modificar-servicio/modificar-servicio.module').then( m => m.ModificarServicioPageModule),
    canActivate: [AuthGuard],
  },
  {

    path: 'perfil/:correoElectronico/agregar-resena/:id_solicitud',
    loadChildren: () => import('./agregar-resena/agregar-resena.module').then( m => m.AgregarResenaPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'registrar-trabajado/:correo',
    loadChildren: () => import('./registrar-trabajador/registrar-trabajador.module').then( m => m.RegistrarTrabajadorPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'subir-documentacion/:id_trabajador',
    loadChildren: () => import('./subir-documentacion/subir-documentacion.module').then( m => m.SubirDocumentacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'listar-favorito/:correo',
    loadChildren: () => import('./listar-favorito/listar-favorito.module').then( m => m.ListarFavoritoPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'trabajador/:correoElectronico/historial-trabajador',
    loadChildren: () => import('./historial-trabajador/historial-trabajador.module').then( m => m.HistorialTrabajadorPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'trabajador/:correoElectronico/historial-trabajador/resena-info/:correoElectronicoo/:solicitudId',
    loadChildren: () => import('./resena-info/resena-info.module').then( m => m.ResenaInfoPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'trabajador/:correoElectronico/gestionar-resenas',
    loadChildren: () => import('./gestionar-resenas/gestionar-resenas.module').then( m => m.GestionarResenasPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'agendar-visita-servicio/:id_solicitud',
    loadChildren: () => import('./agendar-visita-servicio/agendar-visita-servicio.module').then( m => m.AgendarVisitaServicioPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'agenda',
    loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaPageModule),
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


