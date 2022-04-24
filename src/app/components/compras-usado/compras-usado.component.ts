import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { userInv } from '../../models/userInv';
import { compra } from '../../models/compra';
import { venta } from '../../models/venta';
import { cajaInv } from '../../models/cajaInv';
import { DatePipe } from '@angular/common';
import { lista } from '../../models/lista';

@Component({
  selector: 'app-compras-usado',
  templateUrl: './compras-usado.component.html',
  styleUrls: ['./compras-usado.component.css']
})
export class ComprasUsadoComponent implements OnInit {

  addProductCarForm: FormGroup;
  compraCar = new compra();
  itemsInCar = 0;
  selectedUser: number;
  usersList: userInv[];
  compraAddCarList: Array<compra> = [];
  compraList: Array<compra> = [];
  userSesion: any;
  caja = new cajaInv();
  fecha: Date;
  ventasVen = new venta();
  ventasBySucursalList: Array<venta> = [];
  totalVentas = 0;
  totalVentasTarjetas = 0;
  totalAgricola = 0;
  totalCuscatlan = 0;
  totalDavi = 0;
  totalCredo = 0;
  totalEfectivo = 0;
  totalEfectivoEntregar = 0;
  totalQR = 0;
  totalPagoOnLine = 0;
  totalReserva = 0;
  ventaTotalSucursal = 0;
  totalComprasSucursal = 0;
  comprasBySucursalList: Array<compra> = [];
  rol = '';
  selectedComprobante: string;
  comprobantesList: lista[];
  numberFactura: string;
  numberRecibo: string;

  displayedColumns: string[] = ['cantidad', 'nombre', 'precio', 'total', 'options'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private fb: FormBuilder, private api: ApiService, private datePipe: DatePipe,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    this.addProductCarForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      cantidad: ['', [Validators.required, Validators.maxLength(6)]],
      precio: ['', [Validators.required, Validators.maxLength(5)]],
      total: ['', [Validators.required, Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.fecha = new Date();
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.getUserList();
    this.getVentasBySucursal();
    this.getComprobanteList();
  }

  getComprobanteList(): void{
    this.comprobantesList = [
      { value: 1, description: 'Factura' },
      { value: 2, description: 'Sin Recibo' },
      { value: 3, description: 'Recibo' }
    ];
  }

  findCajaByDateAndSucursal(): void{
    this.SpinnerService.show();
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.api.findCajaByDateAndSucursal(this.caja).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.caja = response.data;
              this.caja.monedas = this.caja.monedas;
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

  getUserList(): void {
    this.SpinnerService.show();
    this.api.getUsersListBySucursal(this.userSesion.idsucursal).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.usersList = response.data;
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

  getVentasBySucursal(): void {
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.userSesion.idsucursal;
    const myDate = new Date();
    this.ventasVen.dateadd = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    this.api.getVentasBySucursal(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.ventasBySucursalList = response.data;
              this.montoTotalVentas();
              this.getComprasBySucursal();
              this.findCajaByDateAndSucursal();
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

  montoTotalVentas(): void{
    this.totalVentas = this.ventasBySucursalList.filter(item => item.preciototal != null)
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalVentasTarjetas = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Tarjeta')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalAgricola = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Tarjeta' && item.post == 'Agricola')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalCuscatlan = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Tarjeta' && item.post == 'Cuscatlan')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalDavi = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Tarjeta' && item.post == 'Davivienda')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalCredo = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Tarjeta' && item.post == 'Credomatic')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalEfectivoEntregar = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Efectivo')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalEfectivo = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Efectivo')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalQR = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'QR o Transferencias')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalPagoOnLine = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago == 'Pago en linea retira en sucursal')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalReserva = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipoventa == 'Reserva')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.ventaTotalSucursal = this.totalVentas - this.totalPagoOnLine;
  }

  getComprasBySucursal(): void {
    this.SpinnerService.show();
    const compraId = new compra();
    compraId.idsucursal = this.userSesion.idsucursal;
    this.api.getListComprasBySucursal(compraId).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.comprasBySucursalList = response.data;
              this.montoTotalCompras();
              this.dataSource = new MatTableDataSource(this.comprasBySucursalList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
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

  montoTotalCompras(): void{
    this.totalComprasSucursal = this.comprasBySucursalList.filter(item => item.total != null)
                        .reduce((sum, current) => sum + current.total, 0);

    this.totalEfectivoEntregar = this.totalEfectivoEntregar - this.totalComprasSucursal;
  }

  calcularCompraProd(): void{
    this.compraCar.total = this.compraCar.cantidad * this.compraCar.precio;
  }

  clearCompra(): void{
    this.compraCar.idcompra = null;
    this.compraCar.dateadd = '';
    this.compraCar.datemod = '';
    this.compraCar.idsucursal = null;
    this.compraCar.iduseradd = null;
    this.compraCar.idusermod = null;
    this.compraCar.nombre = '';
    this.compraCar.precio = null;
    this.compraCar.cantidad = null;
    this.compraCar.total = null;
  }

  agregarProductoCompra(): void{
    if (this.addProductCarForm.valid){
      if (this.compraCar.nombre == null){
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      }else if (this.compraCar.cantidad == null){
        this.api.openSnackBar('Cantidad del producto incorrecto', 'X', 'error');
      }else if (this.compraCar.precio == null){
        this.api.openSnackBar('Precio del producto incorrecto', 'X', 'error');
      }else if (this.compraCar.total == null){
        this.api.openSnackBar('Total del producto incorrecto', 'X', 'error');
      }else{
        const compraAddCar = new compra();
        compraAddCar.correlativo = this.compraAddCarList.length + 1;
        compraAddCar.nombre = this.compraCar.nombre;
        compraAddCar.cantidad = this.compraCar.cantidad;
        compraAddCar.precio = this.compraCar.precio;
        compraAddCar.total = this.compraCar.total;
        this.compraAddCarList.push(compraAddCar);
        const indexTotal = this.findTotalAllProduct('totalAllProduct');
        this.addItemTotalProducts(indexTotal);
        this.dataSource = new MatTableDataSource(this.compraAddCarList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.api.openSnackBar('Producto agregado al carrito', 'X', 'success');
        this.clearCompra();
        this.addProductCarForm.reset();
        this.itemsInCar = this.compraAddCarList.length - 1;
        Object.keys(this.addProductCarForm.controls).forEach(key => {
          this.addProductCarForm.get(key).setErrors(null) ;
        });
      }
    }else{
      this.api.openSnackBar('Todos los campos son requeridos', 'X', 'error');
    }
  }

  findTotalAllProduct(name: any): number{
    return this.compraAddCarList.findIndex(i => i.nombre === name);
  }

  addItemTotalProducts(index: any): void{
    if (index !== -1){
      this.compraAddCarList.splice(index, 1);
    }
    const sum = this.compraAddCarList.filter(item => item.nombre !== 'totalAllProduct')
                        .reduce((suma, current) => suma + current.total, 0);
    const itemTotal = new compra();
    itemTotal.nombre = 'totalAllProduct';
    itemTotal.total = sum;
    this.compraAddCarList.push(itemTotal);
  }

  deleteProductCar(item: any): void{
    const index = this.compraAddCarList.findIndex(i => i.correlativo === item.correlativo);
    this.compraAddCarList.splice(index, 1);
    const indexTotal = this.findTotalAllProduct('totalAllProduct');
    this.addItemTotalProducts(indexTotal);
    this.dataSource = new MatTableDataSource(this.compraAddCarList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.api.openSnackBar('Producto eliminado del carrito', 'X', 'success');
    this.itemsInCar = this.compraAddCarList.length - 1;
  }

  realizarCompra(): void{
    if (this.selectedUser == null || this.selectedUser === undefined){
      this.api.openSnackBar('Seleccione el comprador', 'X', 'error');
      return;
    }

    if (this.selectedComprobante === 'Factura'){
      if (this.numberFactura == null ||  this.numberFactura === undefined || this.numberFactura == ''){
        this.api.openSnackBar('Ingresa el numero de factura', 'X', 'error');
        return;
      }
    }
    if (this.selectedComprobante === 'Recibo'){
      if (this.numberRecibo == null ||  this.numberRecibo == undefined || this.numberRecibo == ''){
        this.api.openSnackBar('Ingresa el numero de recibo', 'X', 'error');
        return;
      }
    }

    this.SpinnerService.show();
    const iduseradd = this.selectedUser;
    const idsucursal = this.userSesion.idsucursal;
    this.compraAddCarList.forEach(compraObj => {
      if (compraObj.nombre !== 'totalAllProduct'){
        this.compraCar = new compra();
        this.compraCar.nombre = compraObj.nombre;
        this.compraCar.cantidad = compraObj.cantidad;
        this.compraCar.precio = compraObj.precio;
        this.compraCar.total = compraObj.total;
        this.compraCar.idsucursal = idsucursal;
        this.compraCar.iduseradd = iduseradd;
        this.compraCar.idusermod = 0;
        this.compraCar.factura = this.numberFactura;
        this.compraCar.recibo = this.numberRecibo;
        this.compraList.push(this.compraCar);
      }
    });
    this.api.createCompra(this.compraList).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            window.location.reload();
            this.api.openSnackBar('Compra realizada exitosamente', 'X', 'success');
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
