import { compra } from './../../../models/compra';
import { DialogConfirmacionComponent } from '../../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { userInv } from '../../../models/userInv';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-compras',
  templateUrl: './list-compras.component.html',
  styleUrl: './list-compras.component.css'
})

export class ListComprasComponent implements OnInit {

  comprasBySucursalList: Array<compra> = [];
  userSesion: any;
  selectedUser: number;
  totalCompras = 0;
  usersList: userInv[];
  dateCompra: Date;
  dateCompra2: Date;

  displayedColumns: string[] = ['cantidad', 'nombre', 'precio', 'total', 'fecha', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService, public dialog: MatDialog,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getUserList();
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

  getComprasBySucursal(): void {
    this.SpinnerService.show();
    const compraId = new compra();
    compraId.idsucursal = this.userSesion.idsucursal;
    compraId.iduseradd = this.selectedUser;
    compraId.dateadd = this.datePipe.transform(this.dateCompra, 'yyyy/MM/dd');
    compraId.datemod = this.datePipe.transform(this.dateCompra2, 'yyyy/MM/dd');
    this.api.getListComprasBySucursalAndByVendedor(compraId).subscribe(
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
    this.totalCompras = this.comprasBySucursalList.filter(item => item.total != null)
                        .reduce((sum, current) => sum + current.total, 0);
  }

  deleteCompra(compraDelete: compra): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: {mensaje: 'Esta seguro que desea eliminar la compra?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.deleteCompra(compraDelete).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.getComprasBySucursal();
                this.api.openSnackBar('La compra fue eliminada con exito!', 'X', 'success');
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
            this.api.openSnackBar(error, 'X', 'error');
          }
        );
      }
    });
  }
}