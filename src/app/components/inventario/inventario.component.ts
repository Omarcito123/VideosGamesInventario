import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { sucursales } from '../../models/sucursales';
import { producto } from '../../models/producto';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { AuthService } from '../../services/auth.service';
import { AddInventarioExcelComponent } from './add-inventario-excel/add-inventario-excel.component';
import { TrasladarProductoComponent } from './trasladar-producto/trasladar-producto.component';
import { ExcelServicesServiceService } from '../../services/excel-services-service.service';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ReporteComprasComponent } from './reporte-compras/reporte-compras.component';
import { EliminarInventatioComponent } from './eliminar-inventatio/eliminar-inventatio.component';
import { categoria } from '../../models/categoria';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})

export class InventarioComponent implements OnInit {

  selectedSucursal: number;
  sucursalesList: sucursales[];
  categoriaSelect: string;
  productList: producto[];
  product = new producto();
  producAdd = new producto();
  userSesion: any;
  exceltoJson = {};
  filelist = [];
  lista: producto[] = [];
  rol = '';
  categoriasList: categoria[];

  displayedColumns: string[] = ['codigo', 'categoria', 'nombre', 'estado', 'precioregular', 'preciooferta', 'existencia', 'modificado', 'options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private excelService: ExcelServicesServiceService, private api: ApiService,
              private SpinnerService: NgxSpinnerService, public dialog: MatDialog,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getSucursales();
    this.userSesion = this.authService.currentUserValue;
    this.selectedSucursal = this.userSesion.idsucursal;
    this.rol = this.userSesion.rolname;
    this.getProductsBySucursal();
    this.getCategoriasList();
  }

  getCategoriasList(): void{
    this.SpinnerService.show();
    this.api.getCategoriasList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.categoriasList = response.data;
              const cate = new categoria();
              cate.idcategoria = 0;
              cate.nombre = 'Selecciona una categoria';
              this.categoriasList.push(cate);
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

  getProductsBySucursal(): void {
    this.SpinnerService.show();
    this.product.idsucursal = this.selectedSucursal;
    this.api.getProductsBySucursal(this.product).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.productList = response.data;
              this.dataSource = new MatTableDataSource(this.productList);
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
          this.api.openSnackBar(error, 'X', 'error');
        }
      );
  }

  descargarExcel(): void{
    if (this.sucursalesList != null && this.sucursalesList.length > 0){
      const nombreSucursal = this.sucursalesList.filter(item => item.idsucursal === this.selectedSucursal)[0];
      this.excelService.exportAsExcelFile(this.productList, 'Inventario_' +
      nombreSucursal.nombre.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_'));
    }else{
      this.api.openSnackBar('Por favor selecciona una sucursal', 'X', 'error');
    }
  }

  descargarReporteVentas(): void{
    const dialogRef = this.dialog.open(ReporteVentasComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  descargarReporteCompras(): void{
    const dialogRef = this.dialog.open(ReporteComprasComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addInventarioExcel(): void{
    const dialogRef = this.dialog.open(AddInventarioExcelComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProductsBySucursal();
    });
  }

  eliminarInventario(): void{
    const dialogRef = this.dialog.open(EliminarInventatioComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProductsBySucursal();
    });
  }

  trasladarProduct(productTras: any): void{
    const dialogRef = this.dialog.open(TrasladarProductoComponent, {
      data: productTras
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProductsBySucursal();
    });
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(AddEditProductComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProductsBySucursal();
    });
  }

  editProduct(productEdit: any): void{
    const dialogRef = this.dialog.open(AddEditProductComponent, {
      data: productEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProductsBySucursal();
    });
  }

  saveProduct(product: any): void {
    this.SpinnerService.show();
    this.api.saveProduct(product).subscribe(
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
          this.api.openSnackBar(error, 'X', 'error');
        }
      );
  }

  deleteProduct(product: any): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: {mensaje: 'Esta seguro que desea eliminar el producto?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        product.iduseradd = this.userSesion.iduser;
        this.api.deleteProduct(product).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.getProductsBySucursal();
              this.api.openSnackBar('El producto fue eliminado con exito!', 'X', 'success');
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

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterCode(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterExistencias(event: Event): void{
    this.lista = [];
    const filterValue = (event.target as HTMLInputElement).value;
    this.productList.forEach(element => {
      this.lista.push(element);
    });
    if (filterValue === ''){
      this.lista =  this.lista.filter(x => x.nombre !== '');
    }else{
      this.lista =  this.lista.filter(x => x.existencia === Number(filterValue));
    }
    this.dataSource = new MatTableDataSource(this.lista);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterByCategoria(event: string): void{
    if (this.selectedSucursal != null){
      this.lista = [];
      const filterValue = event;
      this.productList.forEach(element => {
        this.lista.push(element);
      });
      if (filterValue === ''){
        this.lista =  this.lista.filter(x => x.nombre !== '');
      }else{
        this.lista =  this.lista.filter(x => x.categoria === filterValue);
      }
      this.dataSource = new MatTableDataSource(this.lista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }else{
      this.api.openSnackBar('Por favor selecciona una sucursal', 'X', 'error');
    }
  }
}