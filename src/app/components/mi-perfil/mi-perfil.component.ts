import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { perfil } from '../../models/perfil';
import { userInv } from '../../models/userInv';
import { ChangePassComponent } from './change-pass/change-pass.component';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})

export class MiPerfilComponent implements OnInit {

  hide = true;
  perfilForm: FormGroup;
  myPerfil = new perfil();
  userSesion: any;
  user = new userInv();
  rol = '';

  constructor(private fb: FormBuilder, private api: ApiService, public dialog: MatDialog,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.perfilForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.maxLength(30)]],
        secondname: ['',  [Validators.required, Validators.maxLength(30)]],
        surname: ['', [Validators.required, Validators.maxLength(30)]],
        secondsurname: ['', [Validators.required, Validators.maxLength(30)]],
        username: ['', [Validators.required, Validators.maxLength(30)]],
        pass: ['', [Validators.required, Validators.maxLength(30)]],
        email: ['', [Validators.required, Validators.maxLength(50)]],
        phone: ['', [Validators.required, Validators.maxLength(10)]],
        dateborn: ['', [Validators.required, Validators.maxLength(50)]],
        sucursal: ['', [Validators.required, Validators.maxLength(30)]],
        rol: ['', [Validators.required, Validators.maxLength(20)]]
      });
    }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.geInfoPerfil();
  }

  showHidenPass(): void {
    this.hide = !this.hide;
  }

  geInfoPerfil(): void{
    this.SpinnerService.show();
    this.api.geInfoPerfil(this.user).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.myPerfil = response.data;
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
            this.SpinnerService.hide();
          },
          (error) => {
            this.SpinnerService.hide();
            if (error.includes('403')){
              this.authService.logout();
            }
          }
        );
  }

  changePass(): void {
    const dialogRef = this.dialog.open(ChangePassComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.geInfoPerfil();
    });
  }

  updatePerfil(): void{
    this.user.iduser = this.myPerfil.iduser;
    this.user.firstname = this.myPerfil.firstname;
    this.user.secondname = this.myPerfil.secondname;
    this.user.surname = this.myPerfil.surname;
    this.user.secondsurname = this.myPerfil.secondsurname;
    this.user.email = this.myPerfil.email;
    this.user.phone = this.myPerfil.phone;
    this.user.dateborn = this.myPerfil.dateborn;
    this.SpinnerService.show();
    this.api.updatePerfil(this.user).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.api.openSnackBar(response.message, 'X', 'success');
          } else {
            this.api.openSnackBar(response.message, 'X', 'error');
          }
        } else {
          this.api.openSnackBar(response.message, 'X', 'error');
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        if (error.includes('403')){
          this.authService.logout();
        }
      }
    );
  }
}