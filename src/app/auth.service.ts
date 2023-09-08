import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    return this.http.post('http://localhost:3000/login', userData);
  }


}

