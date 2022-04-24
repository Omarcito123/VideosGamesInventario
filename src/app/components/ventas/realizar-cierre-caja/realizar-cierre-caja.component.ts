import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { sucursales } from 'src/app/models/sucursales';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { productoCar } from 'src/app/models/productoCar';
import { venta } from '../../../models/venta';
import { compra } from '../../../models/compra';
import { cupones } from 'src/app/models/cupones';
import { DatePipe } from '@angular/common';
import { historialCajaInv } from '../../../models/historialCajaInv';
import { cajaInv } from '../../../models/cajaInv';

@Component({
  selector: 'app-realizar-cierre-caja',
  templateUrl: './realizar-cierre-caja.component.html',
  styleUrls: ['./realizar-cierre-caja.component.css']
})
export class RealizarCierreCajaComponent implements OnInit {

  selectedTipoPago: string;
  tipoPagoVenta: string;
  selectedPost: string;
  selectedSucursal: number;
  selectedComprobante: string;
  selectedVendedor: number;
  myControl = new FormControl();
  myControlSerie = new FormControl();
  caja = new cajaInv();
  historialCaja = new historialCajaInv();
  sucursalesList: sucursales[];
  cuponFind = new cupones();
  productAddCarList: Array<productoCar> = [];
  ventaList: Array<venta> = [];
  ventaCar: venta;
  filteredOptions: Observable<string[]>;
  filteredSeriesOptions: Observable<string[]>;
  userSesion: any;
  options: string[] = [];
  optionsSerie: string[] = [];
  itemsInCar = 0;
  addProductCarForm: FormGroup;
  payProductCarForm: FormGroup;
  numberFactura: string;
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
  totalReserva = 0;
  totalPagoOnLine = 0;
  ventaTotalSucursal = 0;
  totalComprasSucursal = 0;
  comprasBySucursalList: Array<compra> = [];
  cuponActive = false;
  codigoCupon = '';
  categorias = '';
  rol = '';
  selectedtipoVenta: string;
  totalCompra = 0;
  esOferta = false;
  esperando = 'No';
  dateVenta = new Date();
  showDateInput = false;

  constructor(private api: ApiService, private datePipe: DatePipe,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fecha = new Date();
    this.userSesion = this.authService.currentUserValue;
    this.selectedSucursal = this.userSesion.idsucursal;
    this.rol = this.userSesion.rolname;
    this.getVentasBySucursal('Inicio');
  }

  getVentasBySucursal(tipo): void {
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.userSesion.idsucursal;
    if (tipo === 'Inicio'){
      const myDate = new Date();
      this.ventasVen.dateadd = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    }else{
      this.ventasVen.dateadd = this.datePipe.transform(this.dateVenta, 'yyyy/MM/dd');
    }
    this.api.getVentasBySucursal(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.ventasBySucursalList = response.data;
              this.montoTotalVentas();
              if (tipo === 'Inicio'){
                this.getComprasBySucursal('Inicio');
                this.findCajaByDateAndSucursal('Inicio');
              }else{
                this.getComprasBySucursal('Otro');
                this.findCajaByDateAndSucursal('Otro');
              }
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

  getComprasBySucursal(tipo: string): void {
    this.SpinnerService.show();
    const compraId = new compra();
    if (tipo === 'Otro'){
      compraId.dateadd = this.datePipe.transform(this.dateVenta, 'yyyy/MM/dd');
    }
    compraId.idsucursal = this.userSesion.idsucursal;
    this.api.getListComprasBySucursal(compraId).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.comprasBySucursalList = response.data;
              this.montoTotalCompras();
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

  findCajaByDateAndSucursal(tipo: string): void{
    this.SpinnerService.show();
    if (tipo === 'Otro'){
      this.caja.dateadd = this.datePipe.transform(this.dateVenta, 'yyyy/MM/dd');
    }
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.api.findCajaByDateAndSucursal(this.caja).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.caja = response.data;
              // this.caja.monedas = this.caja.monedas;
              this.historialCaja.iniciocaja = this.caja.iniciocaja;
              this.historialCaja.monedas = this.caja.monedas;
              this.historialCaja.faltante = this.caja.faltante;
              this.historialCaja.sobrante = this.caja.sobrante;
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
    this.historialCaja.ventatotal = this.ventasBySucursalList.filter(item => item.preciototal != null)
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.totaltarjetas = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago === 'Tarjeta')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.agricola = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipopago === 'Tarjeta' && item.post === 'Agricola')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.cuscatlan = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipopago === 'Tarjeta' && item.post === 'Cuscatlan')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.davivienda = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipopago === 'Tarjeta' && item.post === 'Davivienda')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.credomatic = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipopago === 'Tarjeta' && item.post === 'Credomatic')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.efectivoentregar = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago === 'Efectivo')
                        .reduce((sum, current) => sum + current.preciototal, 0);
    this.totalEfectivoEntregar = this.historialCaja.efectivoentregar;

    this.historialCaja.efectivo = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipopago === 'Efectivo')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.qrtransferencias = this.ventasBySucursalList.filter(item => item.preciototal != null && item.tipopago === 'QR o Transferencias')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.pagoenlinea = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipopago === 'Pago en linea retira en sucursal')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.reservas = this.ventasBySucursalList.filter(item => item.preciototal != null
      && item.tipoventa === 'Reserva')
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalVentas = this.ventasBySucursalList
      .filter((item) => item.preciototal != null)
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalPagoOnLine = this.ventasBySucursalList
                        .filter(
                          (item) =>
                            item.preciototal != null &&
                            item.tipopago === 'Pago en linea retira en sucursal'
                        )
                        .reduce((sum, current) => sum + current.preciototal, 0);

    this.historialCaja.ventasucursal = this.totalVentas - this.totalPagoOnLine;
  }

  montoTotalCompras(): void{
    this.historialCaja.compras = this.comprasBySucursalList.filter(item => item.total != null)
                        .reduce((sum, current) => sum + current.total, 0);
    this.historialCaja.efectivoentregar = this.totalEfectivoEntregar - this.historialCaja.compras;
  }

  saveInicioCajaMonedas(): void{
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.SpinnerService.show();
    this.api.saveInicioCajaMonedas(this.caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            location.reload();
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
  }

  saveFantanteSobrante(): void{
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.SpinnerService.show();
    this.api.saveFantanteSobrante(this.caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
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
  }

  guardarCierreCajaOtroDia(): void{
    this.showDateInput = true;
  }

  guardarCierreCaja(): void{
    this.historialCaja.idsucursal = this.userSesion.idsucursal;
    this.SpinnerService.show();
    this.api.guardarCierreCaja(this.historialCaja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
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
  }
}
