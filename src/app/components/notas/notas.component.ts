import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { userInv } from '../../models/userInv';
import { DatePipe } from '@angular/common';
import { notas } from '../../models/notas';
import { AddEditNotaComponent } from './add-edit-nota/add-edit-nota.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmacionComponent } from '../dialog-confirmacion/dialog-confirmacion.component';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css'
})


export class NotasComponent implements OnInit {

  userSesion: any;
  selectedUser: number;
  usersList: userInv[];
  notasLis: notas[];
  dateCompra: Date;
  dateCompra2: Date;
  rol = '';
  username = '';

  displayedColumns: string[] = ['nota', 'usuario', 'dateadd', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService, public dialog: MatDialog,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.username = this.userSesion.username;
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

  getNotasBySucursal(): void{
    this.SpinnerService.show();
    const notaInv = new notas();
    notaInv.iduseradd = this.selectedUser;
    notaInv.dateadd = this.datePipe.transform(this.dateCompra, 'yyyy/MM/dd');
    notaInv.datemod = this.datePipe.transform(this.dateCompra2, 'yyyy/MM/dd');
    this.api.getListNotasByUserAndDates(notaInv).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.notasLis = response.data;
              this.dataSource = new MatTableDataSource(this.notasLis);
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

  addNota(): void {
    const dialogRef = this.dialog.open(AddEditNotaComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getNotasBySucursal();
    });
  }

  editNota(notaEdit: any): void{
    const dialogRef = this.dialog.open(AddEditNotaComponent, {
      data: notaEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getNotasBySucursal();
    });
  }

  deleteNota(notaDe: any): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: {mensaje: 'Esta seguro que desea eliminar la nota?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.deleteNota(notaDe).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.getNotasBySucursal();
                this.api.openSnackBar('La nota fue eliminada con exito!', 'X', 'success');
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