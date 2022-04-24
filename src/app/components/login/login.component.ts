import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { controlHoras } from '../../models/controlHoras';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  userLogin: any = new user();
  controlH = new controlHoras();
  changePass = false;

  constructor(private datePipe: DatePipe, private api: ApiService, private router: Router,
              private authService: AuthService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  showHidenPass(): void {
    if (this.userLogin.username === 'melvin411' || this.userLogin.username === 'Marvin10'){
      this.hide = !this.hide;
    }
  }

  validateUsername(event): void{
    if (this.userLogin.username !== 'melvin411' && this.userLogin.username !== 'Marvin10'){
      this.changePass = true;
      console.log(this.changePass);
    }
  }

  login(usu: user): void {
    // if(this.changePass == false){
      if (usu.username === undefined || usu.username === ''){
        this.api.openSnackBar('Favor ingresa tu usuario', 'X', 'error');
      } else if (usu.pass === undefined || usu.pass === '') {
        this.api.openSnackBar('Favor ingresa tu contraseña', 'X', 'error');
      } else {
        this.SpinnerService.show();
        this.api.login(usu).subscribe(
          (response) => {
            if (response != null) {
              if (response.message === 'Usuario autentificado exitosamente') {
                this.authService.setJwt(response.data);
                const platform = ['Win32', 'Android', 'iOS'];
                for (const row of platform) {
                     if (navigator.platform.indexOf(row) > - 1) {
                      this.controlH.turno = 'Entrada';
                      this.controlH.iduser = response.data.iduser;
                      const myDate = new Date();
                      this.controlH.datecontrol = this.datePipe.transform(myDate, 'yyyy/MM/dd hh:mm:ss');
                      this.api.saveTurno(this.controlH).subscribe(
                        (responses) => {
                        },
                        (error) => {
                        }
                      );
                     }
                 }
                this.router.navigate(['/dashboard/controlhoras']);
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
            this.SpinnerService.hide();
          },
          (error) => {
            this.api.openSnackBar(error, 'X', 'error');
            this.SpinnerService.hide();
          }
        );
      }
    /*} else {
      if(this.userLogin.username != 'melvin411' && this.userLogin.username != 'Marvin10'){
        this.api.openSnackBar('Cuidado estas intentando violar la seguridad del sistema!', 'X', 'error');
      }
    }*/
  }
}
