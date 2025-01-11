import { producto } from './../../../../models/producto';
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, window } from 'rxjs/operators';
import { pedidoInv } from '../../../../models/pedido';

@Component({
  selector: 'app-add-edit-pedido',
  templateUrl: './add-edit-pedido.component.html',
  styleUrl: './add-edit-pedido.component.css'
})

export class AddEditPedidoComponent implements OnInit {

  addPedidoForm: FormGroup;
  pedido = new pedidoInv();
  isNew = true;
  userSesion: any;
  productBySucursalList: producto[];
  myControl = new FormControl();
  myControlSerie = new FormControl();
  options: string[] = [];
  optionsSerie: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredSeriesOptions: Observable<string[]>;
  existencia: number;
  idprodinv: number;

  constructor(
    public dialogRef: MatDialogRef<AddEditPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addPedidoForm = this.fb.group({
        cantidad: ['', [Validators.required, Validators.maxLength(6)]],
      });
   }

  ngOnInit(): void {
    if (this.data != null){
      this.pedido.serie = this.data.serie;
      this.pedido.idpedidoinv = this.data.idpedidoinv;
      this.pedido.idsucursal = this.data.idsucursal;
      this.pedido.idprodinv = this.data.idprodinv;
      this.pedido.cantidad = this.data.cantidad;
      this.pedido.nombreproducto = this.data.nombreproducto;
      this.pedido.fechaentrega = this.data.fechaentrega;
      this.pedido.estado = this.data.estado;
      this.pedido.iduseradd = this.data.iduseradd;
      this.pedido.dateadd = this.data.dateadd;
      this.pedido.idusermod = this.data.idusermod;
      this.pedido.datemod = this.data.datemod;
      this.isNew = false;
    }
    this.userSesion = this.authService.currentUserValue;
    this.pedido.idsucursal  = this.userSesion.idsucursal;
    this.getProductsBySucursal();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getProductsBySucursal(): void{
    const product = new producto();
    product.categoria = '';
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
                this.optionsSerie = response.data.map((s) => s.serie);
                this.filteredSeriesOptions = this.myControlSerie.valueChanges.pipe(
                startWith(''),
                map((values) => this._filterSerie(values))
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

  private _filterSerie(valuese: string): string[] {
    if (valuese != null) {
      const nameSerie = valuese.toLowerCase();
      return this.optionsSerie.filter((optionS) =>
        optionS.toLowerCase().includes(nameSerie)
      );
    }
  }

  fillDataProduct(): void{
    const productos = this.productBySucursalList.filter(item => item.nombre === this.pedido.nombreproducto);
    if (productos.length > 0){
      this.pedido.serie = productos[0].serie;
      this.existencia = productos[0].existencia;
      this.idprodinv = productos[0].idprodinv;
    }
  }

  deleteProductName(): void {
    if (this.pedido != null) {
      this.pedido.nombreproducto = '';
    }
  }

  fillDataProductSerie(): void{
    this.deleteProductName();
    const productos = this.productBySucursalList.filter(item => item.serie === this.pedido.serie);
    if (productos.length > 0){
      this.pedido.nombreproducto = productos[0].nombre;
      this.existencia = productos[0].existencia;
      this.idprodinv = productos[0].idprodinv;
    }
  }

  savePedido(): void{
    if (this.addPedidoForm.valid){
      if (this.existencia < 1){
        this.api.openSnackBar('No existe la cantidad suficiente de este producto para realizar el pedido', 'X', 'error');
        return;
      }
      const productoFind = this._filter(this.pedido.nombreproducto);
      if (productoFind.length === 0){
        this.api.openSnackBar('El repuesto no existe en el inventario, por favor selecciona un repuesto existente', 'X', 'error');
        return;
      }
      if (this.isNew){
        this.SpinnerService.show();
        this.pedido.idprodinv = this.idprodinv;
        this.pedido.existencia = 0;
        this.api.savePedidoInv(this.pedido).subscribe(
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
        this.api.updatePedidoInv(this.pedido).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.dialogRef.close();
                this.api.openSnackBar('Pedido modificado exitosamente', 'X', 'success');
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