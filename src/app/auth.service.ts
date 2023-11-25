import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private emailKey = 'auth_email'; // Clave para almacenar el correo electrónico
  private apiUrl = 'http://192.168.1.4:4001';//'http://192.168.1.9:4001'
  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any) {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }



  login(correo_electronico: string, password: string) {
    const userData = {
      correo_electronico: correo_electronico,
      password: password
    };
    return this.http.post(`${this.apiUrl}/login`, userData).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.saveEmail(correo_electronico);
        }
      })
    );
  }


  private saveEmail(email: string) {
    localStorage.setItem(this.emailKey, email);
  }

  getCorreoElectronico(): string | null {
    return localStorage.getItem(this.emailKey);
  }


  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    this.clearToken();
  }

  getUserProfile(userId: string) {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`);
  }

  enviarSolicitud(
    correoElectronico: string,
    idTrabajador: number,
    idDesServ: number,
    tituloSolicitud: string,
    descripcionSolicitud: string,
    correo_trabajador: string,
  ): Observable<any> {
    const solicitudData = {
      correo_electronico: correoElectronico,
      id_trabajador: idTrabajador,
      id_des_serv: idDesServ,
      titulo_solicitud: tituloSolicitud,
      estado: 'pendiente', // Estado por defecto: pendiente
      fecha_solicitud: new Date(), // Fecha de solicitud actual
      des_solicitud: descripcionSolicitud,
    };
    console.log("HOLA: ", solicitudData.des_solicitud);

    // Realiza la solicitud POST al servidor
    const url = `${this.apiUrl}/enviar-solicitud/${correo_trabajador}`;
    return this.http.post(url, solicitudData);
  }

  loadServData(id_des_serv: string) {
    return this.http.get(`${this.apiUrl}/servicio-especifico/${id_des_serv}`);
  }

  loadTrabajadorData(correoElectronico: string) {
    return this.http.get(`${this.apiUrl}/obtener-datos-trabajador/${correoElectronico}`);
  }

  loadServicioData(correoElectronico: string) {
    return this.http.get(`${this.apiUrl}/obtener-servicios/${correoElectronico}`); 
  }

  SolicitudesRecibidas(correo_trabajador: String){
    return this.http.get(`${this.apiUrl}/servicios-solicitados/${correo_trabajador}`)
  }

  SolicitudesRealizadas(correo_trabajador: String){
    return this.http.get(`${this.apiUrl}/servicios-solicitados-cliente/${correo_trabajador}`)
  }

  actualizarEstadoSolicitud(solicitudId: number, nuevoEstado: string) {

    const data = { estado: nuevoEstado };
    return this.http.put(`${this.apiUrl}/actualizar-solicitud/${solicitudId}`, data);
  }

  cargarListadoServicios() { // listar servicios pagina de inicio
    return this.http.get(`${this.apiUrl}/listar-servicios`);
  }

  agregarServicio(serviceData: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/agregar_servicio`, serviceData);
  }

  agregarGaleria(galleryData: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/agregar_a_galeria`, galleryData);
  }
  
  // Eliminar servicios
  eliminarServicio(id_des_serv: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/eliminar_servicio/${id_des_serv}`);
  }

  // Eliminar Galeria
  eliminarGaleria(id_foto: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/eliminar_galeria/${id_foto}`);
  }

  // Eliminar Documento
  eliminarDocumento(id_documento: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/eliminar_documento/${id_documento}`);
  }




  getTrabajadorIdPorCorreo(correoElectronico: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener-trabajadorid/${correoElectronico}`);
  }

  cargarRegiones() {
    return this.http.get(`${this.apiUrl}/obtener-regiones`);
  }
  cargarComunas() {
    return this.http.get(`${this.apiUrl}/obtener-comunas`);
  }
  cargarServicios() {
    return this.http.get(`${this.apiUrl}/obtener-servicios`);
  }


  registrarTrabajador(trabajadorData: any) {
    const url = `${this.apiUrl}/registrar-trabajador`;
    return this.http.post(url, trabajadorData);
  }


  getSolicitudIdPorTrabajadorId(trabajadorid: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener-solicitudid/${trabajadorid}`)
  }

  agregarFavorito(id_usuario: string, id_trabajador: number): Observable<any> {
    const body = { id_usuario, id_trabajador };
    return this.http.post(`${this.apiUrl}/agregar-favorito`, body);
  }

  quitarFavorito(id_usuario: string, id_trabajador: number): Observable<any> {
    const body = { id_usuario, id_trabajador };
    return this.http.post(`${this.apiUrl}/quitar-favorito`, body);
  }

  verificarFavorito(
    id_usuario: string,
    id_trabajador: number
  ): Observable<any> {
    const url = `${this.apiUrl}/verificar-favorito`;
    const data = {
      id_usuario,
      id_trabajador,
    };

    return this.http.post(url, data);
  }

  listarFavoritos(id_usuario: string): Observable<any> {
    const url = `${this.apiUrl}/listar-favoritos`;
    const data = {
      id_usuario,
    };

    return this.http.post(url, data);
  }

  agregarResena(idSolicitud: string, reseñaData: any): Observable<any> {
    const url = `${this.apiUrl}/agregar-resena`;
    return this.http.post(url, reseñaData);
  }

  obtenerResenas(correoElectronico:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/obtener-resenas/${correoElectronico}`);
  }



  obtenerResena(correoElectronico: string, solicitudId:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar-resena/${correoElectronico}/${solicitudId}`);   
    ///listar-resena/:resenaId/:solicitudId
  }
  agregarDocumentacionTrabajador(documentData:any):Observable<any>{
    const url =  `${this.apiUrl}/agregar-documentacion`;
    return this.http.post(url,documentData);
  }



  getPromedioCalificacionesServicio(idServicio:number, trabajadorId:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/promedio-calificacion-servicio/${idServicio}/${trabajadorId}`);
  }


  getPromedioCalificacionesTrabajador(correoElectronico:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/promedio-calificaciones-trabajador/${correoElectronico}`);
  }
  actualizarDisponibilidad(correo_electronico: string, disponibilidad: string): Observable<any> {
    const url = `${this.apiUrl}/actualizar-disponibilidad`;
    const data = { correo_electronico, disponibilidad };
    console.log(correo_electronico,disponibilidad);
    return this.http.put(url, data);
  }

  actualizarEstadoResena(resenaId: number, nuevoEstado: string): Observable<any>{
    const data = { estado:nuevoEstado };
    return this.http.put(`${this.apiUrl}/emitir-reporte/${resenaId}`, data);
  }
  modificarServicio(id_des_serv: string, serviceData: any): Observable<any> {
    const url = `${this.apiUrl}/modificar_servicio/${id_des_serv}`;
    return this.http.put(url, serviceData);
  }

  modificarServicio2(id_des_serv: string, serviceData: any): Observable<any> {
    const url = `${this.apiUrl}/modificar_servicio2/${id_des_serv}`;
    return this.http.put(url, serviceData);
  }

  modificarPerfil(correo_electronico: string, datosmod: any): Observable<any> {
    const url = `${this.apiUrl}/modificar_perfil/${correo_electronico}`;
    return this.http.put(url, datosmod);
  }

  modificarPerfil1(correo_electronico: string, datosmod: any): Observable<any> {
    const url = `${this.apiUrl}/modificar_perfil1/${correo_electronico}`;
    return this.http.put(url, datosmod);
  }

  agregarVisitaConSolicitud(visitaData: any): Observable<any> {
    const url = `${this.apiUrl}/agregar-visita`;
    return this.http.post(url, visitaData);
  }

  getVisitasAgendadas(correoElectronico:string): Observable<any> {
   
    return this.http.post(`${this.apiUrl}/visitas-agendadas`, { correoTrabajador: correoElectronico });
  }

  visitasARecibir(correoElectronico:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/visitas-agendadas-cliente`,{ correoCliente: correoElectronico });
  }

  
}





