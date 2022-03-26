import { cupones } from './../../../models/cupones';
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { sucursales } from 'src/app/models/sucursales'
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { categoria } from '../../../models/categoria';
import { lista } from 'src/app/models/lista';

@Component({
  selector: 'app-add-edit-cupon',
  templateUrl: './add-edit-cupon.component.html',
  styleUrls: ['./add-edit-cupon.component.css']
})
export class AddEditCuponComponent implements OnInit {

  addCuponForm: FormGroup;
  cupon = new cupones();
  isNewUser = true;
  sucursalesList: sucursales[];
  categoriasList: categoria[];
  tipoCuponList: lista[];
  limitado = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditCuponComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addCuponForm = this.fb.group({
        descripcion: ['', [Validators.required, Validators.maxLength(50)]],
        categoria: ['',  [Validators.required, Validators.maxLength(20)]],
        descuento: ['', [Validators.required, Validators.maxLength(6)]],
        fechavalido: ['', [Validators.required, Validators.maxLength(10)]],
        tipoCupon: ['', [Validators.required, Validators.maxLength(50)]]
      });
    }

  ngOnInit(): void {
    this.getTipoPagoList();
    this.getCategoriasList();
    if(this.data != null){
      this.cupon.idcupon = this.data.idcupon;
      this.cupon.descripcion = this.data.descripcion;
      this.cupon.descuento = this.data.descuento;
      this.cupon.cupon = this.data.cupon;
      this.cupon.tipocupon = this.data.tipocupon;
      this.cupon.limiteuso = this.data.limiteuso;
      this.cupon.numerouso = this.data.numerouso;
      this.cupon.categoria = this.data.categoria;
      this.cupon.fechavalido = this.data.fechavalido;
      this.cupon.iduseradd = this.data.iduseradd;
      this.cupon.datemod = this.data.datemod;
      this.cupon.idusermod = this.data.idusermod;
      this.cupon.dateadd = this.data.dateadd;
      this.isNewUser = false;
    }
  }

  getTipoPagoList() {
    this.tipoCuponList = [
      { value: 1, description: 'Con limite de uso' },
      { value: 2, description: 'Sin limite de uso' },
    ];
  }

  getTipoCupon(event){
    console.log(event);
    if(event != null){
      if(event == 'Con limite de uso'){
        this.limitado = false;
      }else{
        this.limitado = true;
        this.cupon.limiteuso = 0;
      }     
    }    
  }

  getCategoriasList(){
    this.SpinnerService.show(); 
      this.api.getCategoriasList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.categoriasList = response.data;                       
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveCupon(){
    if(this.addCuponForm.valid){   
      if(this.cupon.tipocupon == null || this.cupon.tipocupon == undefined || this.cupon.tipocupon == ''){
        this.api.openSnackBar("Selecciona un tipo de cupon", 'X', 'error');
        return;
      }  
      if(this.isNewUser){
        this.SpinnerService.show();
        this.api.saveCuponInv(this.cupon).subscribe(
          (response) => {
            if (response != null) {            
              if (response.state == "Success") {
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
            if(error.includes("403")){
              this.authService.logout();
            }
          }
        );
      }else{
        this.SpinnerService.show();
        this.api.updateCuponInv(this.cupon).subscribe(
          (response) => {
            if (response != null) {            
              if (response.state == "Success") {
                this.dialogRef.close();
                this.api.openSnackBar("Cupon modificado exitosamente", 'X', 'success');
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
            if(error.includes("403")){
              this.authService.logout();
            }
          }
        );
      }
    }else{
      this.api.openSnackBar("Ingresa los campos requeridos", 'X', 'error');
    }
  }
}
