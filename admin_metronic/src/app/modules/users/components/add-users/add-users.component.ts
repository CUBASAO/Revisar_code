import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../_services/users.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  @Output() UserC: EventEmitter<any> = new EventEmitter();
  name: any = null;
  surname: any = null;
  email: any = null;
  password: any = null;
  repet_password: any = null;


  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
  }

  save() {

    if (!this.name || !this.surname || !this.email || !this.password || !this.repet_password) { 
      //TODOS LOS CAMPOS SON OBLIGATORIOS
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesitas ingresar todos los campos.'` });
      return;
    }
    if (this.password != this.repet_password) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesitas ingresar las contraseñas iguales.'` });
      return;
    }
    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      repet_password: this.repet_password,
    }
    this.userService.createUser(data).subscribe((resp: any) => {
      console.log(resp);
      this.UserC.emit(resp.user)
      this.toaster.open(NoticyAlertComponent, { text: `success-'El Usuario se registro correctamente'` });
      this.modal.close();
    }, (error) => {
      if (error.error) {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'${error.error.message}'` });
      }
    })
  }
}
