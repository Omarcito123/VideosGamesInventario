import { lista } from './../../../models/lista';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { userInv } from '../../../models/userInv';
import { comisionVendedor } from '../../../models/comisionVendedor';

@Component({
  selector: 'app-list-comisiones-vendedor',
  templateUrl: './list-comisiones-vendedor.component.html',
  styleUrl: './list-comisiones-vendedor.component.css'
})

export class ListComisionesVendedorComponent implements OnInit {

  comisionVList: Array<comisionVendedor> = [];
  comisionV = new comisionVendedor();
  userSesion: any;
  selectedVendedor: number;
  usersList: userInv[];
  monthsList = [];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
  'Octubre', 'Noviembre', 'Diciembre'];
  monthAct = new lista();
  month1 = new lista();
  month2 = new lista();
  month3 = new lista();
  selectedMonth: number;
  totalComi = 0;
  totalVentas = 0;

  displayedColumns: string[] = ['vendedor', 'sucursal', 'fecha', 'producto', 'valortotal', 'comision'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.comisionV.idusuario = this.userSesion.iduser;
    this.getUserList();
    this.getMonthList();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMonthList(): void{
    const d = new Date();
    const actual = d.getMonth() + 1;
    const nameMonthAct = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.monthAct.value = d.getMonth() + 1;
    this.monthAct.description = nameMonthAct;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth1 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month1.value = d.getMonth() + 1;
    this.month1.description = nameMonth1;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth2 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month2.value = d.getMonth() + 1;
    this.month2.description = nameMonth2;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth3 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month3.value = d.getMonth() + 1;
    this.month3.description = nameMonth3;

    this.monthsList.push(this.monthAct);
    this.monthsList.push(this.month1);
    this.monthsList.push(this.month2);
    this.monthsList.push(this.month3);
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

  getComisionVendedorByVendedor(): void{
    this.comisionV.mes = this.selectedMonth;
    this.comisionV.dateadd = this.monthsList.find(x => x.value === this.selectedMonth).description;
    this.comisionV.idusuario = this.selectedVendedor;
    this.getComisionVendedorList();
  }

  getComisionVendedorList(): void{
    this.SpinnerService.show();
    this.api.getComisionVendedorList(this.comisionV).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.comisionVList = response.data;
              this.calTotalVentas();
              this.totalComisiones();
              this.dataSource = new MatTableDataSource(this.comisionVList);
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

  calTotalVentas(): void{
    this.totalVentas = this.comisionVList.filter(item => item.ventatotal != null)
                        .reduce((sum, current) => sum + current.ventatotal, 0);
  }

  totalComisiones(): void{
    this.totalComi = this.comisionVList.filter(item => item.comision != null)
                        .reduce((sum, current) => sum + current.comision, 0);
  }
}