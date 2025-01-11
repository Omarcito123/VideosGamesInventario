import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { sucursales } from '../../../models/sucursales';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { venta } from '../../../models/venta';
import { DatePipe } from '@angular/common';
import { reporteVentas } from '../../../models/reporteVentas';
import { ExcelServicesServiceService } from '../../../services/excel-services-service.service';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrl: './reporte-ventas.component.css'
})

export class ReporteVentasComponent implements OnInit {

  selectedSucursal: number;
  sucursalesList: sucursales[];
  dateVenta1: Date;
  dateVenta2: Date;
  ventasVen = new venta();
  reporteVentasList: reporteVentas[];

  constructor(private excelService: ExcelServicesServiceService, private datePipe: DatePipe,
              public dialogRef: MatDialogRef<ReporteVentasComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
              private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
    this.getSucursales();
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  descargarReporte(): void{
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.selectedSucursal;
    this.ventasVen.dateadd = this.datePipe.transform(this.dateVenta1, 'yyyy/MM/dd');
    this.ventasVen.datemod = this.datePipe.transform(this.dateVenta2, 'yyyy/MM/dd');
    this.api.getVentasReporte(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.reporteVentasList = response.data;
              this.descargarExcel();
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

  descargarExcel(): void{
    if (this.sucursalesList != null && this.sucursalesList.length > 0){
      const nombreSucursal = this.sucursalesList.filter(item => item.idsucursal === this.selectedSucursal)[0];
      this.excelService.exportAsExcelFile(this.reporteVentasList, 'ReporteVentas_' + nombreSucursal.nombre.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_'));
    }else{
      this.api.openSnackBar('Por favor selecciona una sucursal', 'X', 'error');
    }
  }
}