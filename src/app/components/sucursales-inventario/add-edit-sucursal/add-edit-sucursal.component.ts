import { sucursales } from '../../../models/sucursales';
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-edit-sucursal',
  templateUrl: './add-edit-sucursal.component.html',
  styleUrl: './add-edit-sucursal.component.css'
})

export class AddEditSucursalComponent implements OnInit {

  headerText = '';
  sucursal = new sucursales();
  addEditSucursalForm: FormGroup;
  isNewSucursal = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditSucursalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addEditSucursalForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(60)]],
      });
    }

  ngOnInit(): void {
    this.headerText = 'Agregar sucursal';
    if (this.data != null){
      this.sucursal.idsucursal = this.data.idsucursal;
      this.sucursal.nombre = this.data.nombre;
      this.sucursal.dateadd = this.data.dateadd;
      this.sucursal.iduseradd = this.data.iduseradd;
      this.sucursal.datemod = this.data.datemod;
      this.sucursal.idusermod = this.data.idusermod;
      this.headerText = 'Modificar sucursal';
      this.isNewSucursal = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUpdateSucursal(): void{
    if (this.addEditSucursalForm.valid){
      if (this.isNewSucursal){
        this.SpinnerService.show();
        this.api.saveSucursalInv(this.sucursal).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
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
            if (error.includes('403')){
              this.authService.logout();
            }
          }
        );
      }else{
        this.SpinnerService.show();
        this.api.updateSucursalInv(this.sucursal).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.dialogRef.close();
                this.api.openSnackBar('Sucursal modificada exitosamente', 'X', 'success');
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
    }else{
      this.api.openSnackBar('Ingresa los campos requeridos', 'X', 'error');
    }
  }
}