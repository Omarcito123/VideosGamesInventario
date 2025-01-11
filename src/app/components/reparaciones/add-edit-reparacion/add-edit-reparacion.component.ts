import { reparacionEnc } from './../../../models/reparacionEnc';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-edit-reparacion',
  templateUrl: './add-edit-reparacion.component.html',
  styleUrl: './add-edit-reparacion.component.css'
})

export class AddEditReparacionComponent implements OnInit {
  hide = true;
  addReparacionForm: FormGroup;
  reparacion = new reparacionEnc();
  isNew = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditReparacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private api: ApiService,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.addReparacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    if (this.data != null) {
      this.reparacion.idreparacionenc = this.data.idreparacionenc;
      this.reparacion.nombrecliente = this.data.nombrecliente;
      this.reparacion.telefonocliente = this.data.telefonocliente;
      this.reparacion.duicliente = this.data.duicliente;
      this.reparacion.descripcion = this.data.descripcion;
      this.reparacion.idsucursal = this.data.idsucursal;
      this.reparacion.estado = this.data.estado;
      this.reparacion.iduseradd = this.data.iduseradd;
      this.reparacion.dateadd = this.data.dateadd;
      this.reparacion.idusermod = this.data.idusermod;
      this.reparacion.datemod = this.data.datemod;
      this.isNew = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveRep(): void {
    if (this.addReparacionForm.valid) {
      if (this.isNew) {
        this.SpinnerService.show();
        this.api.saveReparacionInv(this.reparacion).subscribe(
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
            if (error.includes('403')) {
              this.authService.logout();
            }
          }
        );
      } else {
        this.SpinnerService.show();
        console.log(this.reparacion);
        this.api.updateReparaionInv(this.reparacion).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.dialogRef.close();
                this.api.openSnackBar(
                  'Reparacion modificada exitosamente',
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