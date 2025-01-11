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
import { controlHoras } from '../../../models/controlHoras';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-historial-control-horas',
  templateUrl: './historial-control-horas.component.html',
  styleUrl: './historial-control-horas.component.css'
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
  dateStart: Date;
  dateEnd: Date;

  displayedColumns: string[] = ['marco', 'fechahora'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.controlH = new controlHoras();
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

  getControlHorasByUser(): void{
    if (this.selectedVendedor == null){
      this.api.openSnackBar('Selecciona un usuario por favor', 'X', 'error');
      return;
    }
    this.controlH.dateadd = this.datePipe.transform(this.dateStart, 'yyyy/MM/dd');
    this.controlH.datemod = this.datePipe.transform(this.dateEnd, 'yyyy/MM/dd');
    this.controlH.iduser = this.selectedVendedor;
    this.SpinnerService.show();
    this.api.getControlByUserRangoFecha(this.controlH).subscribe(
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