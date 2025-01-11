import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { lista } from '../../../models/lista';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { comisiones } from '../../../models/comisiones';

@Component({
  selector: 'app-add-edit-comision',
  templateUrl: './add-edit-comision.component.html',
  styleUrl: './add-edit-comision.component.css'
})

export class AddEditComisionComponent implements OnInit {

  addComisionForm: FormGroup;
  listaTipoComisiones: lista[];
  listaUnidades: lista[];
  comision = new comisiones();
  isNewUser = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditComisionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addComisionForm = this.fb.group({
        tipocomision: ['', [Validators.required, Validators.maxLength(30)]],
        unidad: ['',  [Validators.required, Validators.maxLength(20)]],
        valor: ['', [Validators.required, Validators.maxLength(6)]]
      });
    }

  ngOnInit(): void {
    this.getTipoComisiones();
    this.getTipoUnidades();
    if (this.data != null){
      this.comision.idcomision = this.data.idcomision;
      this.comision.iduseradd = this.data.iduseradd;
      this.comision.idusermod = this.data.idusermod;
      this.comision.dateadd = this.data.dateadd;
      this.comision.datemod = this.data.datemod;
      this.comision.tipocomision = this.data.tipocomision;
      this.comision.unidad = this.data.unidad;
      this.comision.valor = this.data.valor;
      this.isNewUser = false;
    }
  }

  getTipoComisiones(): void{
    this.listaTipoComisiones = [
      { value: 1, description: 'Efectivo' },
      { value: 2, description: 'Tarjeta' },
      { value: 3, description: 'Codigo' }
    ];
  }

  getTipoUnidades(): void{
    this.listaUnidades = [
      { value: 1, description: 'Valor por dolar' },
      { value: 2, description: 'Porcentaje por dolar' }
    ];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveComision(): void{
    if (this.addComisionForm.valid){
      if (this.isNewUser){
        this.SpinnerService.show();
        this.api.saveComisionInv(this.comision).subscribe(
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
        this.api.updateComisionInv(this.comision).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.dialogRef.close();
                this.api.openSnackBar('Comision modificada exitosamente', 'X', 'success');
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