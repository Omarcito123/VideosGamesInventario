import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { categoria } from '../../../models/categoria';

@Component({
  selector: 'app-add-edit-categoria',
  templateUrl: './add-edit-categoria.component.html',
  styleUrls: ['./add-edit-categoria.component.css']
})
export class AddEditCategoriaComponent implements OnInit {

  addCategoriaForm: FormGroup;
  categoria = new categoria();
  isNewUser = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addCategoriaForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(20)]],
        descripcion: ['',  ''],
      });
    }

  ngOnInit(): void {
    if (this.data != null){
      this.categoria.idcategoria = this.data.idcategoria;
      this.categoria.nombre = this.data.nombre;
      this.categoria.descripcion = this.data.descripcion;
      this.categoria.iduseradd = this.data.iduseradd;
      this.categoria.dateadd = this.data.dateadd;
      this.categoria.idusermod = this.data.idusermod;
      this.categoria.datemod = this.data.datemod;
      this.isNewUser = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveCategoria(): void{
    if (this.addCategoriaForm.valid){
      if (this.isNewUser){
        this.SpinnerService.show();
        this.api.saveCategoriaInv(this.categoria).subscribe(
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
        this.api.updateCategoriaInv(this.categoria).subscribe(
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
