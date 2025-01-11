import { AddEditCategoriaComponent } from './add-edit-categoria/add-edit-categoria.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { categoria } from '../../models/categoria';
import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})

export class CategoriasComponent implements OnInit {

  categoriasList: Array<categoria> = [];

  displayedColumns: string[] = ['nombre', 'descripcion', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.getCategoriasList();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCategoriasList(): void{
    this.SpinnerService.show();
    this.api.getCategoriasList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.categoriasList = response.data;
              this.dataSource = new MatTableDataSource(this.categoriasList);
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

  addCategoria(): void{
    const dialogRef = this.dialog.open(AddEditCategoriaComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getCategoriasList();
    });
  }

  editCategoria(item: any): void{
    const dialogRef = this.dialog.open(AddEditCategoriaComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getCategoriasList();
    });
  }

  deleteCategoria(item: any): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: {mensaje: 'Esta seguro que desea eliminar al usuario?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.deleteCategoria(item).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.getCategoriasList();
                this.api.openSnackBar('El usuario fue eliminado con exito!', 'X', 'success');
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