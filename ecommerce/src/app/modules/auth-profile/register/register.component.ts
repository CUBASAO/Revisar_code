import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string = "";
  name: string = "";
  surname: string = "";
  password: string = "";
  repet_password: string = "";
  constructor(
    public authServices: AuthService,
    public router: Router,
  ) {

  }
  ngOnInit(): void {
    if (this.authServices.user) {
      this.router.navigate(['/']);
    }
  }

  registro() {
    if (
      !this.email ||
      !this.name ||
      !this.surname ||
      !this.password ||
      !this.repet_password) {
      alert("TODOS LOS CAMPOS SON REQUERIDOS");
    }

    /**   if (this.password != this.repet_password) {
        alert("LAS CONTRASEÑAS DEBEN SER IGUALES");
        console.log("fallo contraseñas");
      }  */

    if (this.password != this.repet_password) {
      alert("LAS CONTRASEÑAS DEBEN SER IGUALES");
      console.log("fallo contraseñas");
    }

    // else {


    let data = {
      email: this.email,
      name: this.name,
      surname: this.surname,
      password: this.password,
      rol: 'cliente',
    };

    this.authServices.registro(data).subscribe((resp: any) => {
      console.log(resp);
    })
    // }

  }
}
