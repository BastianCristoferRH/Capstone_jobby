import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private correoElectronico: string | undefined;
  private tokenKey = 'auth_token';
  private apiUrl = 'http://localhost:3000/registro';
  constructor(private http: HttpClient) { }


  registrarUsuario(usuario: any) {
    return this.http.post(this.apiUrl, usuario);
  }
  login(correo_electronico: string, password: string) {
    const userData = {
      correo_electronico: correo_electronico,
      password: password
    };
    this.correoElectronico = correo_electronico;
    return this.http.post('http://localhost:3000/login', userData);
  }

  getCorreoElectronico(): string | undefined {
    return this.correoElectronico;
    console.log(this.correoElectronico);
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

  getUserProfile(correoElectronico: string) {  // Utilizamos el correo electrónico como identificador único
    return this.http.get(`http://localhost:3000/${correoElectronico}`);
  }





}

