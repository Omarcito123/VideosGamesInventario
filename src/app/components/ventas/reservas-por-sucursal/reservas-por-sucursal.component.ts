import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { venta } from '../../../models/venta';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { userInv } from '../../../models/userInv';
import { sucursales } from '../../../models/sucursales';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservas-por-sucursal',
  templateUrl: './reservas-por-sucursal.component.html',
  styleUrl: './reservas-por-sucursal.component.css'
})

export class ReservasPorSucursalComponent implements OnInit {

  ventasBySucursalList: Array<venta> = [];
  userSesion: any;
  selectedVendedor: number;
  totalVentas = 0;
  usersList: userInv[];
  ventasVen = new venta();
  selectedSucursal: number;
  sucursalesList: sucursales[];
  dateVenta1: Date;
  dateVenta2: Date;
  rol = '';

  displayedColumns: string[] = ['tipopago', 'post', 'cantidad', 'descripcion', 'precio', 'tipoventa', 'factura', 'fecha', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.getSucursales();
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
        }
      );
  }

  getVentasBySucursal(): void {
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.selectedSucursal;
    this.ventasVen.dateadd = this.datePipe.transform(this.dateVenta1, 'yyyy/MM/dd');
    this.ventasVen.datemod = this.datePipe.transform(this.dateVenta2, 'yyyy/MM/dd');
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
        }
      );
  }
}