import { producto } from 'src/app/models/producto';
import { DialogConfirmacionComponent } from '../../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { pedidoInv } from '../../../models/pedido';
import { sucursales } from '../../../models/sucursales';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ver-pedido-sucursal',
  templateUrl: './ver-pedido-sucursal.component.html',
  styleUrls: ['./ver-pedido-sucursal.component.css'],
})
export class VerPedidoSucursalComponent implements OnInit {
  pedidosList: Array<pedidoInv> = [];
  pedidosTrasladarList: Array<pedidoInv> = [];
  userSesion: any;
  pedido = new pedidoInv();
  selectedSucursal: number;
  sucursalesList: sucursales[];
  productTras = new producto();

  displayedColumns: string[] = [
    'seleccionar',
    'cantidad',
    'existencia',
    'existenciabodega',
    'nombreproducto',
    'dateadd',
  ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private datePipe: DatePipe,
    private api: ApiService,
    private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getSucursales();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSucursales() {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
      (response) => {
        if (response != null) {
          if (response.state == 'Success') {
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
        if (error.includes('403')) {
          this.authService.logout();
        }
      }
    );
  }

  getPedidosListBySucursal() {
    this.SpinnerService.show();
    this.pedido.idsucursal = this.selectedSucursal;
    this.api.getPedidosListBySucursal(this.pedido).subscribe(
      (response) => {
        if (response != null) {
          if (response.state == 'Success') {
            this.pedidosList = response.data;
            this.dataSource = new MatTableDataSource(this.pedidosList);
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
        if (error.includes('403')) {
          this.authService.logout();
        }
      }
    );
  }

  setEntregar(event, element) {
    if (event) {
      this.pedidosTrasladarList.push(element);
    } else {
      this.pedidosTrasladarList.forEach((value, index) => {
        if (value.idpedidoinv == element.idpedidoinv) {
          this.pedidosTrasladarList.splice(index, 1);
        }
      });
    }
  }

  entregarProductos(){
    this.pedidosTrasladarList.forEach((value, index) => {
      if(value.cantidad > value.existenciabodega){
        this.api.openSnackBar('La cantidad ingresa es mayor a la existencia del producto: ' + value.nombreproducto, 'X', 'error');
      }else{
        this.trasladarProducto(value);
      }
    });    
  }

  trasladarProducto(pedido: pedidoInv) {
    this.SpinnerService.show();
    this.productTras.idsucursal = this.selectedSucursal;
    this.productTras.existencia = pedido.cantidad;
    this.productTras.nombre = pedido.nombreproducto;
    this.productTras.idprodinv = pedido.idprodinv;
    this.productTras.iduseradd = this.userSesion.iduser;
    this.api.trasladarProducto(this.productTras).subscribe(
      (response) => {
        if (response != null) {
          if (response.state == 'Success') {
            this.api.openSnackBar("Producto " + pedido.nombreproducto + " entregado exitosamente", 'X', 'success');
            this.updatePedidoInv(pedido);
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
        if (error.includes('403')) {
          this.authService.logout();
        }
      }
    );
  }

  updatePedidoInv(pedido: pedidoInv){
    var myDate = new Date();
    pedido.fechaentrega = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    pedido.estado = 'entregado';
    this.SpinnerService.show();
        this.api.updatePedidoInv(pedido).subscribe(
          (response) => {
            if (response != null) {            
              if (response.state == "Success") {
                this.getPedidosListBySucursal();
                //this.api.openSnackBar("Producto modificado exitosamente", 'X', 'success');
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
            if(error.includes("403")){
              this.authService.logout();
            }
          }
        );
  }
}
