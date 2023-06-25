import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    public authService: AuthService,
    public router: Router,

  ) { }

  ngOnInit(): void {
    //// console.log(this.authService.user);
    if (this.authService.user) {
      this.router.navigate(['/']);
    }
  }

  login() {
    if (!this.email) {
      console.log("ES NECESARIO INGRESAR EL EMAIL");

    }
    if (!this.password) {
      console.log("ES NECESARIO INGRESAR UNA CONTRASEÑA ");

    }

    this.authService.login(this.email, this.password).subscribe((resp: any) => {
      console.log(resp);
      if (!resp.error && resp) {
        //EL USUARIO INGRESO CON EXITO
        this.router.navigate(["/"]);
      } else {
        alert(resp.error.message);
      }

    })
  }
}
