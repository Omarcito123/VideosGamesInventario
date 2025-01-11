import { Component, OnInit } from '@angular/core';
import { controlHoras } from '../../models/controlHoras';
import { cajaInv } from '../../models/cajaInv';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { MatDialog } from '@angular/material/dialog';
import { sucursales } from '../../models/sucursales';

interface Valores {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-control-horas',
  templateUrl: './control-horas.component.html',
  styleUrl: './control-horas.component.css'
})

export class ControlHorasComponent implements OnInit {

  deviceInfo = null;
  selectedValue: string;
  userSesion: any;
  controlList = [];
  controlH = new controlHoras();
  caja = new cajaInv();
  horaEntrada = '--:--';
  horaSalidaAlmuerzo = '--:--';
  horaEntradaAlmuerzo = '--:--';
  horaSalida = '--:--';
  rol = '';
  sucursalesList: sucursales[];

  foods: Valores[] = [
    {value: 'Entrada', viewValue: 'Entrada'},
    {value: 'SalidaAlmuerzo', viewValue: 'Salida almuerzo'},
    {value: 'EntradaAlmuerzo', viewValue: 'Entrada almuerzo'},
    {value: 'Salida', viewValue: 'Salida'}
  ];

  constructor(public dialog: MatDialog, private datePipe: DatePipe, private api: ApiService,
              private authService: AuthService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.selectedValue = 'Entrada';
    this.marcarHora();
    this.getControlByUserAndFecha();
    this.selectSucursal();
    this.getSucursalesList();
  }

  getSucursalesList(): void {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.sucursalesList = response.data;
              this.userSesion.sucursal = this.sucursalesList.find(x => x.idsucursal === this.userSesion.idsucursal).nombre;
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

  selectSucursal(): void{
    if (this.rol === 'Administrador' || this.rol === 'SuperAdmin'){
      const dialogRef = this.dialog.open(SucursalesComponent, {
        disableClose: true,
        data: null
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }

  getControlByUserAndFecha(): void {
    this.SpinnerService.show();
    this.controlH = new controlHoras();
    this.controlH.iduser = this.userSesion.iduser;
    const myDate = new Date();
    this.controlH.datecontrol = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    this.api.getControlByUserAndFecha(this.controlH).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.controlList = response.data;
              this.controlList.forEach(function(value): void {
                if (value.turno === 'Entrada'){
                  this.horaEntrada = value.datecontrol;
                }else if (value.turno === 'SalidaAlmuerzo'){
                  this.horaSalidaAlmuerzo = value.datecontrol;
                }else if (value.turno === 'EntradaAlmuerzo'){
                  this.horaEntradaAlmuerzo = value.datecontrol;
                }else if (value.turno === 'Salida'){
                  this.horaSalida = value.datecontrol;
                }
              }, this);
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

  marcarHora(): void{
    const platform = ['Win32', 'Android', 'iOS'];
    if (this.selectedValue != null){
      if (this.selectedValue === 'Entrada' || this.selectedValue === 'Salida' ||
      this.selectedValue === 'SalidaAlmuerzo' || this.selectedValue === 'EntradaAlmuerzo'){
        for (const row of platform) {
          if (navigator.platform.indexOf(row) > - 1) {
           this.controlH.turno = this.selectedValue;
           this.controlH.iduser = this.userSesion.iduser;
           const myDate = new Date();
           this.controlH.datecontrol = this.datePipe.transform(myDate, 'yyyy/MM/dd HH:mm');
           this.api.saveTurno(this.controlH).subscribe(
             (response) => {
              if (response != null) {
                if (response.state === 'Success') {
                  this.api.openSnackBar(response.message, 'X', 'success');
                  this.getControlByUserAndFecha();
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
      }
    }
  }
}