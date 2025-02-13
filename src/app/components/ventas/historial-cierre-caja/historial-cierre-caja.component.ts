import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { sucursales } from '../../../models/sucursales';
import { DatePipe } from '@angular/common';
import { historialCajaInv } from '../../../models/historialCajaInv';

@Component({
  selector: 'app-historial-cierre-caja',
  templateUrl: './historial-cierre-caja.component.html',
  styleUrl: './historial-cierre-caja.component.css'
})

export class HistorialCierreCajaComponent implements OnInit {

  sucursalesList: sucursales[];
  rol = '';
  userSesion: any;
  selectedSucursal: number;
  dateVentainicio: Date;
  dateVentafin: Date;
  historial = new historialCajaInv();
  historialList: historialCajaInv[];

  constructor(private datePipe: DatePipe, private api: ApiService,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.getSucursales();
  }

  getSucursales(): void {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
        (response) => {
          console.log('cierre sucu');
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
          console.log('error cierre sucu');
          this.SpinnerService.hide();
        }
      );
  }

  getHistorialCierreCajaBySucursal(): void {
    this.SpinnerService.show();
    this.historial.idsucursal = this.selectedSucursal;
    this.historial.dateadd = this.datePipe.transform(this.dateVentainicio, 'yyyy/MM/dd');
    this.historial.datemod = this.datePipe.transform(this.dateVentafin, 'yyyy/MM/dd');
    this.api.getHistorialCierreCajaBySucursal(this.historial).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.historialList = response.data;
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
        }
      );
  }

  eliminarCierreCaja(item): void {
    this.SpinnerService.show();
    this.api.eliminarCierreCaja(item).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.getHistorialCierreCajaBySucursal();
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
        }
      );
  }
}