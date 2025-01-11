import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { notas } from '../../../models/notas';

@Component({
  selector: 'app-add-edit-nota',
  templateUrl: './add-edit-nota.component.html',
  styleUrl: './add-edit-nota.component.css'
})


export class AddEditNotaComponent implements OnInit {

  addNotaForm: FormGroup;
  notaInv = new notas();
  isNewUser = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {

    }

  ngOnInit(): void {
    if (this.data != null){
      this.notaInv.idnota = this.data.idnota;
      this.notaInv.nota = this.data.nota;
      this.notaInv.iduseradd = this.data.iduseradd;
      this.notaInv.dateadd = this.data.dateadd;
      this.notaInv.idusermod = this.data.idusermod;
      this.notaInv.datemod = this.data.datemod;
      this.isNewUser = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNota(): void{
    if (this.notaInv.nota != null || this.notaInv.nota !== ''){
      if (this.isNewUser){
        this.SpinnerService.show();
        this.api.saveNotaInv(this.notaInv).subscribe(
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
        this.api.updateNotaInv(this.notaInv).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.dialogRef.close();
                this.api.openSnackBar('Categoria modificada exitosamente', 'X', 'success');
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