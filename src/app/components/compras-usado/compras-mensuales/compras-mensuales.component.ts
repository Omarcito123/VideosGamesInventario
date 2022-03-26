import { compra } from './../../../models/compra';
import { lista } from './../../../models/lista';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { sucursales } from 'src/app/models/sucursales';

@Component({
  selector: 'app-compras-mensuales',
  templateUrl: './compras-mensuales.component.html',
  styleUrls: ['./compras-mensuales.component.css']
})
export class ComprasMensualesComponent implements OnInit {
  
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  monthAct = new lista();
  month1 = new lista;
  month2 = new lista;
  month3 = new lista;
  selectedMonth: number;
  userSesion: any;
  monthsList = [];
  selectedSucursal: number;
  sucursalesList: sucursales[];
  compraVen = new compra();
  comprasBySucursalList: Array<compra> = [];
  totalComprasMes = 0;

  displayedColumns: string[] = ['fecha', 'total'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService, public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getMonthList();
    this.getSucursales();
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMonthList(){
    var d = new Date();
    var actual = d.getMonth() + 1;    
    var nameMonthAct = this.monthNames[d.getMonth()] + " " + d.getFullYear();
    this.monthAct.value = d.getMonth() + 1;
    this.monthAct.description = nameMonthAct;

    d.setMonth(d.getMonth() - 1)
    d.toLocaleDateString();

    var nameMonth1 = this.monthNames[d.getMonth()] + " " + d.getFullYear();
    this.month1.value = d.getMonth() + 1;
    this.month1.description = nameMonth1;
    
    d.setMonth(d.getMonth() - 1)
    d.toLocaleDateString();

    var nameMonth2 = this.monthNames[d.getMonth()] + " " + d.getFullYear();
    this.month2.value = d.getMonth() + 1;
    this.month2.description = nameMonth2;

    d.setMonth(d.getMonth() - 1)
    d.toLocaleDateString();

    var nameMonth3 = this.monthNames[d.getMonth()] + " " + d.getFullYear();
    this.month3.value = d.getMonth() + 1;
    this.month3.description = nameMonth3;

    this.monthsList.push(this.monthAct);
    this.monthsList.push(this.month1);
    this.monthsList.push(this.month2);
    this.monthsList.push(this.month3);
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

  getComprasMensualBySucursal(){
    this.SpinnerService.show();
    this.compraVen.idsucursal = this.selectedSucursal;    
    this.compraVen.dateadd = this.selectedMonth + "";
    this.compraVen.datemod = this.monthsList.find(x => x.value === this.selectedMonth).description;
      this.api.getComprasMensualBySucursal(this.compraVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.comprasBySucursalList = response.data;
              this.montoTotalVentas();
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  montoTotalVentas(){
    this.totalComprasMes = this.comprasBySucursalList.filter(item => item.total != null)
                        .reduce((sum, current) => sum + current.total, 0);
  }
}
