import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { venta } from '../../../models/venta';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { userInv } from 'src/app/models/userInv';
import { DatePipe } from '@angular/common';
import { sucursales } from '../../../models/sucursales';

@Component({
  selector: 'app-historial-reserva',
  templateUrl: './historial-reserva.component.html',
  styleUrls: ['./historial-reserva.component.css']
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

  displayedColumns: string[] = ['tipopago', 'tipoventa', 'post', 'cantidad', 'descripcion', 'precio', 'factura', 'recibo', 'options'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.ventasVen.iduseradd = this.userSesion.iduser;
    this.rol = this.userSesion.rolname;
    this.username = this.userSesion.username;
    this.getSucursales();
    this.getUserList();
    this.getVentasBySucursal();
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSucursales() {
    this.SpinnerService.show();  
      this.api.getSucursales().subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  getUserList() {
    this.SpinnerService.show();  
      this.api.getUserList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              if(this.rol == 'SuperAdmin' || this.rol == 'Administrador'){
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  getVentasVendedor(){
    this.ventasVen.iduseradd = this.selectedVendedor;
    this.getVentasBySucursalAndUser();
  }

  getReservasBySucursal(){
    this.SpinnerService.show();     
    this.ventasVen.idsucursal = this.selectedSucursal;
      this.api.getListVentaReservaOnlyBySucursal(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  getVentasBySucursalAndUser() {
    this.SpinnerService.show();     
    this.ventasVen.idsucursal = this.selectedSucursal;
      this.api.getListVentaReservaBySucursalAndByVendedor(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  getVentasBySucursal() {
    this.SpinnerService.show();     
    this.ventasVen.idsucursal = this.userSesion.idsucursal;
    var myDate = new Date();
    this.ventasVen.dateadd = this.datePipe.transform(myDate, 'yyyy/MM/dd');
      this.api.getListVentaReservaBySucursal(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  montoTotalVentas(){
    this.totalVentas = this.ventasBySucursalList.filter(item => item.preciototal != null)
                        .reduce((sum, current) => sum + current.preciototal, 0);
  }

  deleteVenta(venta: any){
    this.SpinnerService.show();
    console.log(venta);  
      this.api.deleteVenta(venta).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  entregarReserva(venta: any){
    this.SpinnerService.show();  
      this.api.entregarReserva(venta).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }
}
