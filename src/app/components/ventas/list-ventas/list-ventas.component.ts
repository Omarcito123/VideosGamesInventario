import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { venta } from '../../../models/venta';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { userInv } from 'src/app/models/userInv';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrls: ['./list-ventas.component.css']
})
export class ListVentasComponent implements OnInit {

  ventasBySucursalList: Array<venta> = [];
  userSesion: any;
  selectedVendedor: number;
  totalVentas = 0;
  usersList: userInv[];
  ventasVen = new venta();
  rol = '';

  displayedColumns: string[] = ['tipopago', 'tipoventa', 'post', 'cantidad', 'existencia', 'descripcion', 'precio', 'factura', 'recibo', 'options'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.ventasVen.iduseradd = this.userSesion.iduser;
    this.rol = this.userSesion.rolname;
    this.getUserList();
    this.getVentasBySucursal();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getUserList(): void {
    this.SpinnerService.show();
    this.api.getUserList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.usersList = response.data;
              if (this.rol !== 'SuperAdmin' && this.rol !== 'Administrador'){
                this.usersList = this.usersList.filter((option) => option.idsucursal === this.userSesion.idsucursal);
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
        }
      );
  }

  getVentasVendedor(): void{
    console.log(this.selectedVendedor);
    this.ventasVen.iduseradd = this.selectedVendedor;
    this.getVentasBySucursalAndUser();
  }

  getVentasBySucursalAndUser(): void {
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.userSesion.idsucursal;
    this.api.getVentasBySucursalAndUser(this.ventasVen).subscribe(
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

  deleteVenta(venta1: any): void{
    this.SpinnerService.show();
    this.api.deleteVenta(venta1).subscribe(
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
        }
      );
  }
}
