import { userInv } from './../../../models/userInv';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lista } from '../../../models/lista';
import { sucursales } from 'src/app/models/sucursales';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
})
export class AddEditUserComponent implements OnInit {
  hide = true;
  addUserForm: FormGroup;
  selectedEstado: number;
  selectedSucursal: number;
  selectedRol: number;
  listaEstados: lista[];
  listaRoles: lista[];
  usuario = new userInv();
  isNewUser = true;
  sucursalesList: sucursales[];

  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private api: ApiService,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.addUserForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(20)]],
      secondname: ['', [Validators.required, Validators.maxLength(20)]],
      surname: ['', [Validators.required, Validators.maxLength(30)]],
      secondsurname: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.maxLength(18)]],
      password: ['', [Validators.required, Validators.maxLength(15)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      telefono: ['', [Validators.required, Validators.maxLength(8)]],
      dateborn: ['', [Validators.required, Validators.maxLength(10)]],
      selectedEstado: ['', [Validators.required, Validators.maxLength(6)]],
      selectedSucursal: ['', [Validators.required, Validators.maxLength(6)]],
      selectedRol: ['', [Validators.required, Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
    this.getEstadosList();
    this.getSucursalesList();
    this.getRolesList();
    if (this.data != null) {
      this.selectedEstado = this.data.active;
      this.selectedRol = this.data.idrol;
      this.selectedSucursal = this.data.idsucursal;
      this.usuario.iduser = this.data.iduser;
      this.usuario.firstname = this.data.firstname;
      this.usuario.secondname = this.data.secondname;
      this.usuario.surname = this.data.surname;
      this.usuario.secondsurname = this.data.secondsurname;
      this.usuario.username = this.data.username;
      this.usuario.dateadd = this.data.dateadd;
      this.usuario.pass = this.data.pass;
      this.usuario.idrol = this.data.idrol;
      this.usuario.email = this.data.email;
      this.usuario.phone = this.data.phone;
      this.usuario.dateborn = this.data.dateborn;
      this.isNewUser = false;
    }
  }

  showHidenPass() {
    this.hide = !this.hide;
  }

  getEstadosList() {
    this.listaEstados = [
      { value: 1, description: 'Habilitar' },
      { value: 0, description: 'Deshabilitar' },
    ];
  }

  getRolesList() {
    this.listaRoles = [
      { value: 1, description: 'Administrador' },
      { value: 2, description: 'Vendedor' },
      { value: 3, description: 'Usuario' },
      { value: 4, description: 'SuperAdmin' },
    ];
  }

  getSucursalesList() {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
      (response) => {
        if (response != null) {
          if (response.state == 'Success') {
            this.sucursalesList = response.data;
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
        if (error.includes('403')) {
          this.authService.logout();
        }
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.addUserForm.valid) {
      this.usuario.active = this.selectedEstado;
      this.usuario.idrol = this.selectedRol;
      this.usuario.idsucursal = this.selectedSucursal;
      if (this.isNewUser) {
        this.SpinnerService.show();
        this.api.saveUserInv(this.usuario).subscribe(
          (response) => {
            if (response != null) {
              if (response.state == 'Success') {
                this.dialogRef.close();
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
            if (error.includes('403')) {
              this.authService.logout();
            }
          }
        );
      } else {
        this.SpinnerService.show();
        this.usuario.active = this.selectedEstado;
        this.usuario.idrol = this.selectedRol;
        this.usuario.idsucursal = this.selectedSucursal;
        this.api.updateUserInv(this.usuario).subscribe(
          (response) => {
            if (response != null) {
              if (response.state == 'Success') {
                this.dialogRef.close();
                this.api.openSnackBar(
                  'Usuario modificado exitosamente',
                  'X',
                  'success'
                );
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
            if (error.includes('403')) {
              this.authService.logout();
            }
          }
        );
      }
    } else {
      this.api.openSnackBar('Ingresa los campos requeridos', 'X', 'error');
    }
  }
}
