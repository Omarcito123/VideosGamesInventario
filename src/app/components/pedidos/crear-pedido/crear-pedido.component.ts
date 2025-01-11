import { DialogConfirmacionComponent } from '../../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { pedidoInv } from '../../../models/pedido';
import { AddEditPedidoComponent } from './add-edit-pedido/add-edit-pedido.component';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrl: './crear-pedido.component.css'
})

export class CrearPedidoComponent implements OnInit {

  pedidosList: Array<pedidoInv> = [];
  pedido = new pedidoInv();
  userSesion: any;
  sumTotal: number = 0;

  displayedColumns: string[] = ['cantidad', 'existencia', 'existenciabodega', 'nombreproducto', 'dateadd', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.sumTotal = 0;
    this.userSesion = this.authService.currentUserValue;
    this.pedido.idsucursal = this.userSesion.idsucursal;
    this.getPedidosListBySucursal();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPedidosListBySucursal(): void{
    this.sumTotal = 0;
    this.SpinnerService.show();
    this.api.getPedidosListBySucursal(this.pedido).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.pedidosList = response.data;
              this.dataSource = new MatTableDataSource(this.pedidosList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.pedidosList.forEach(a => this.sumTotal += a.cantidad);
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

  addPedido(): void {
    const dialogRef = this.dialog.open(AddEditPedidoComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getPedidosListBySucursal();
    });
  }

  editPedido(pedidoEdit: any): void{
    const dialogRef = this.dialog.open(AddEditPedidoComponent, {
      data: pedidoEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getPedidosListBySucursal();
    });
  }

  deletePedido(pedidoDe: any): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: {mensaje: 'Esta seguro que desea eliminar el producto del pedido?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.deletePedido(pedidoDe).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.getPedidosListBySucursal();
                this.api.openSnackBar('El producto fue eliminado del pedido con exito!', 'X', 'success');
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