import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { venta } from '../../../models/venta';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { userInv } from '../../../models/userInv';
import { DatePipe } from '@angular/common';
import { sucursales } from '../../../models/sucursales';

@Component({
  selector: 'app-historial-reserva',
  templateUrl: './historial-reserva.component.html',
  styleUrl: './historial-reserva.component.css'
})

export class HistorialReservaComponent implements OnInit {

  ventasBySucursalList: Array<venta> = [];
  userSesion: any;
  selectedVendedor: number;
  totalVentas = 0;
  usersList: userInv[];
  ventasVen = new venta();
  rol = '';
  username = '';
  selectedSucursal: number;
  sucursalesList: sucursales[];

  displayedColumns: string[] = ['tipopago', 'tipoventa', 'post', 'cantidad', 'descripcion', 'precio', 'factura', 'recibo', 'dateadd', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.ventasVen.iduseradd = this.userSesion.iduser;
    this.rol = this.userSesion.rolname;
    this.username = this.userSesion.username;
    this.getSucursales();
    this.getUserList();
    this.getVentasBySucursal();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSucursales(): void {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.sucursalesList = response.data;
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
    this.api.getUserList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              if (this.rol === 'SuperAdmin' || this.rol === 'Administrador'){
                this.usersList = response.data;
              }else{
                this.usersList = response.data;
                this.usersList = this.usersList.filter((option) => option.username.includes(this.username));
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

  getVentasVendedor(): void{
    this.ventasVen.iduseradd = this.selectedVendedor;
    this.getVentasBySucursalAndUser();
  }

  getReservasBySucursal(): void{
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.selectedSucursal;
    this.api.getListVentaReservaOnlyBySucursal(this.ventasVen).subscribe(
        (response) => {
          console.log(response);
          if (response != null) {
            if (response.state === 'Success') {
              this.ventasBySucursalList = response.data;
              this.montoTotalVentas();
              this.dataSource = new MatTableDataSource(this.ventasBySucursalList);
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

  getVentasBySucursalAndUser(): void {
    this.SpinnerService.show();
    if (this.selectedSucursal === undefined){
      this.ventasVen.idsucursal = this.userSesion.idsucursal;
    } else {
      this.ventasVen.idsucursal = this.selectedSucursal;
    }
    this.api.getListVentaReservaBySucursalAndByVendedor(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.ventasBySucursalList = response.data;
              this.montoTotalVentas();
              this.dataSource = new MatTableDataSource(this.ventasBySucursalList);
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

  getVentasBySucursal(): void {
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.userSesion.idsucursal;
    const myDate = new Date();
    this.ventasVen.dateadd = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    this.api.getListVentaReservaBySucursal(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.ventasBySucursalList = response.data;
              this.montoTotalVentas();
              this.dataSource = new MatTableDataSource(this.ventasBySucursalList);
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

  montoTotalVentas(): void{
    this.totalVentas = this.ventasBySucursalList.filter(item => item.preciototal != null)
                        .reduce((sum, current) => sum + current.preciototal, 0);
  }

  deleteVenta(ventas: any): void{
    this.SpinnerService.show();
    this.api.deleteVenta(ventas).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.api.openSnackBar(response.message, 'X', 'success');
              this.getVentasBySucursal();
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

  entregarReserva(ventas: any): void{
    this.SpinnerService.show();
    this.api.entregarReserva(ventas).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.api.openSnackBar(response.message, 'X', 'success');
              this.getReservasBySucursal();
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