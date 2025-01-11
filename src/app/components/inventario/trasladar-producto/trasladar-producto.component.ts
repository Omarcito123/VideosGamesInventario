import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { sucursales } from '../../../models/sucursales';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { producto } from '../../../models/producto';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trasladar-producto',
  templateUrl: './trasladar-producto.component.html',
  styleUrl: './trasladar-producto.component.css'
})

export class TrasladarProductoComponent implements OnInit {

  sucursalesList: sucursales[];
  selectedSucursal = [];
  productTras = new producto();
  userSesion: any;
  nombreSucursal = '';
  cantidad = 0;
  trasladados = 0;
  bandera = 0;
  menosTodas = 0;
  allSelected = false;
  sucurslesId = [];

  constructor(
    public dialogRef: MatDialogRef<TrasladarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
    this.getSucursales();
    this.userSesion = this.authService.currentUserValue;
    if (this.data != null){
      this.productTras.idprodinv = this.data.idprodinv;
      this.productTras.categoria = this.data.categoria;
      this.productTras.dateadd = this.data.dateadd;
      this.productTras.datemod = this.data.datemod;
      this.productTras.estado = this.data.estado;
      this.productTras.existencia = this.data.existencia;
      this.productTras.idsucursal = this.data.idsucursal;
      this.productTras.iduseradd = this.data.iduseradd;
      this.productTras.idusermod = this.data.idusermod;
      this.productTras.nombre = this.data.nombre;
      this.productTras.preciocosto = this.data.preciocosto;
      this.productTras.preciooferta = this.data.preciooferta;
      this.productTras.precioregular = this.data.precioregular;
      this.productTras.serie = this.data.serie;
    }
  }

  toggleSelectOne(): void{
    if (this.allSelected){
      this.selectedSucursal = this.selectedSucursal.filter(x => x !== 0);
    }
    this.allSelected = !this.allSelected;
  }

  async trasladarProduct(): Promise<void>{
    if (this.allSelected){
      this.selectedSucursal = this.selectedSucursal.filter(x => x !== 0);
    }
    this.bandera = 0;
    if (this.cantidad === 0){
      this.api.openSnackBar('Ingresa la cantida de productos a trasladar', 'X', 'error');
    }else if (this.selectedSucursal == null){
      this.api.openSnackBar('Selecciona la sucursal de destino', 'X', 'error');
    }else if (this.selectedSucursal === undefined){
      this.api.openSnackBar('Selecciona la sucursal de destino', 'X', 'error');
    }else if (this.selectedSucursal.length === 0){
      this.api.openSnackBar('Selecciona la sucursal de destino', 'X', 'error');
    }else if ((this.cantidad * this.selectedSucursal.length)  > this.productTras.existencia){
      this.api.openSnackBar('No hay la cantidad de productos suficientes en la sucursal de origen para el traslado', 'X', 'error');
    }else{
      this.trasladados = 0;
      this.SpinnerService.show();
      this.selectedSucursal.forEach(async idSucur => {
        if(idSucur === 0){
          this.menosTodas = 1;
        }
        if (idSucur !== 0){
          this.productTras.idsucursal = idSucur;
          this.productTras.existencia = this.cantidad;
          this.productTras.iduseradd = this.userSesion.iduser;
          await this.api.traslaProductoSucursales(this.productTras).subscribe(
            (response) => {
              this.bandera = this.bandera + 1;
              if (response != null) {
                if (response.state === 'Success') {
                  this.sucursalesList = response.data;
                  this.trasladados = this.trasladados + 1;
                  if ((this.selectedSucursal.length - this.menosTodas) === this.bandera){
                    this.updateExistenciaBodega();
                  }
                  this.api.openSnackBar(response.message, 'X', 'success');
                  this.onNoClick();
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
      });
    }
  }

  updateExistenciaBodega(): void{
    if (this.trasladados > 0){
      this.productTras.existencia = this.cantidad * this.trasladados;
      this.api.updateExistenciasBodega(this.productTras).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.sucursalesList = response.data;
              this.trasladados++;
              this.api.openSnackBar(response.message, 'X', 'success');
              this.onNoClick();
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSucursales(): void {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.sucursalesList = response.data;
              this.nombreSucursal = this.sucursalesList.filter(item => item.idsucursal === this.productTras.idsucursal)
                        .find(i => i).nombre;
              this.sucursalesList = this.sucursalesList.filter(item => item.idsucursal !== this.productTras.idsucursal);
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

  toggleSelectAll(): void{
    this.allSelected = !this.allSelected;
    this.sucurslesId = [];
    this.selectedSucursal = [];
    if (this.allSelected){
      this.selectedSucursal.push(0);
      this.sucursalesList .forEach(element => {
        this.sucurslesId.push(element.idsucursal);
        this.selectedSucursal.push(element.idsucursal);
      });
    }
  }
}