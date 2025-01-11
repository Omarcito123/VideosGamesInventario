import { producto } from './../../../models/producto';
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { reparacionDet } from '../../../models/reparacionDet';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, window } from 'rxjs/operators';
import { categoria } from '../../../models/categoria';
import { isThisISOWeek } from 'date-fns';

@Component({
  selector: 'app-add-edit-detalle-rep',
  templateUrl: './add-edit-detalle-rep.component.html',
  styleUrl: './add-edit-detalle-rep.component.css'
})

export class AddEditDetalleRepComponent implements OnInit {

  hide = true;
  productBySucursalList: producto[];
  addDetalleForm: FormGroup;
  detalle = new reparacionDet();
  isNew = true;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  categoriasList: categoria[];
  existencia: number;
  userSesion: any;

  constructor(
    public dialogRef: MatDialogRef<AddEditDetalleRepComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addDetalleForm = this.fb.group({
        cantidad: ['', [Validators.required, Validators.maxLength(6)]],
        categoriaproducto: ['', [Validators.required, Validators.maxLength(50)]],
        nota: ['', ''],
        precioregular: ['', [Validators.required, Validators.maxLength(6)]],
        preciototal: ['', [Validators.required, Validators.maxLength(6)]],
      });
    }

    ngOnInit(): void {
      this.detalle.idreparacionenc = this.data.idreparacionenc;
      if (this.data.idreparaciondet != null){
        this.detalle.idreparaciondet = this.data.nombrecliente;
        this.detalle.categoriaproducto = this.data.telefonocliente;
        this.detalle.idproducto = this.data.duicliente;
        this.detalle.nombreproducto = this.data.descripcion;
        this.detalle.precioregular = this.data.idsucursal;
        this.detalle.iduseradd = this.data.iduseradd;
        this.detalle.dateadd = this.data.dateadd;
        this.detalle.idusermod = this.data.idusermod;
        this.detalle.datemod = this.data.datemod;
        this.isNew = false;
      }
      this.getCategoriasList();
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    getCategoriasList(): void{
      this.SpinnerService.show();
      this.api.getCategoriasList().subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
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
            if (error.includes('403')){
              this.authService.logout();
            }
          }
        );
    }

    getProductsBySucursal(): void{
      const product = new producto();
      this.userSesion = this.authService.currentUserValue;
      product.idsucursal  = this.userSesion.idsucursal;
      product.categoria = this.detalle.categoriaproducto;
      this.SpinnerService.show();
      this.api.getRepuestoBodegaAndCategoria(product).subscribe(
            (response) => {
              if (response != null) {
                if (response.state === 'Success') {
                  this.productBySucursalList = response.data;
                  this.options = response.data.map(a => a.nombre);
                  this.filteredOptions = this.myControl.valueChanges
                  .pipe(
                    startWith(''),
                    map(value => this._filter(value))
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
              if (error.includes('403')){
                this.authService.logout();
              }
            }
          );
    }

    private _filter(value: string): string[] {
      const name = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().includes(name));
    }

    fillDataProduct(): void{
      const repuesto = this.productBySucursalList.filter(item => item.nombre === this.detalle.nombreproducto);
      if (repuesto.length > 0){
        this.existencia = repuesto[0].existencia;
        this.detalle.precioregular = repuesto[0].precioregular;
        this.detalle.idproducto = repuesto[0].idprodinv;
      }
    }

    saveDet(): void{
      if (this.addDetalleForm.valid){
        if (this.existencia < this.detalle.cantidad){
          this.api.openSnackBar('No hay suficientes repuestos para agregarlo al detalle', 'X', 'error');
          return;
        }
        const productoFind = this._filter(this.detalle.nombreproducto);
        if (productoFind.length === 0){
          this.api.openSnackBar('El repuesto no existe en el inventario, por favor selecciona un repuesto existente', 'X', 'error');
          return;
        }
        if (this.isNew){
          this.SpinnerService.show();
          console.log(this.detalle);
          this.api.saveDetalleRepInv(this.detalle).subscribe(
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
          this.api.updateDetalleRepInv(this.detalle).subscribe(
            (response) => {
              if (response != null) {
                if (response.state === 'Success') {
                  this.dialogRef.close();
                  this.api.openSnackBar('Detalle modificado exitosamente', 'X', 'success');
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

    precioTotalRep(): void{
      this.detalle.preciototal = this.detalle.cantidad * this.detalle.precioregular;
    }
}