import { lista } from './../../../models/lista';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { userInv } from 'src/app/models/userInv';
import { controlHoras } from '../../../models/controlHoras';

@Component({
  selector: 'app-historial-control-horas',
  templateUrl: './historial-control-horas.component.html',
  styleUrls: ['./historial-control-horas.component.css']
})
export class HistorialControlHorasComponent implements OnInit {

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
  controlList = [];
  controlH = new controlHoras();

  displayedColumns: string[] = ['marco', 'fechahora'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
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
    const nameMonthAct = this.monthNames[d.getMonth()];
    this.monthAct.value = actual;
    this.monthAct.description = nameMonthAct;

    const m1 = d.getMonth();
    const nameMonth1 = this.monthNames[d.getMonth() - 1];
    this.month1.value = m1;
    this.month1.description = nameMonth1;

    const m2 = d.getMonth() - 1;
    const nameMonth2 = this.monthNames[d.getMonth() - 2];
    this.month2.value = m2;
    this.month2.description = nameMonth2;

    const m3 = d.getMonth() - 2;
    const nameMonth3 = this.monthNames[d.getMonth() - 3];
    this.month3.value = m3;
    this.month3.description = nameMonth3;

    this.monthsList.push(this.monthAct);
    this.monthsList.push(this.month1);
    this.monthsList.push(this.month2);
    this.monthsList.push(this.month3);
    this.selectedMonth = actual;
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

  getControlHorasByUser(): void{
    if (this.selectedMonth == null){
      this.api.openSnackBar('Selecciona un mes por favor', 'X', 'error');
      return;
    }
    if (this.selectedVendedor == null){
      this.api.openSnackBar('Selecciona un usuario por favor', 'X', 'error');
      return;
    }
    this.controlH.iduser = this.selectedVendedor;
    this.controlH.dateadd = this.selectedMonth + '';
    this.SpinnerService.show();
    this.api.getControlByUserMonth(this.controlH).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.controlList = response.data;
              this.dataSource = new MatTableDataSource(this.controlList);
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
}
