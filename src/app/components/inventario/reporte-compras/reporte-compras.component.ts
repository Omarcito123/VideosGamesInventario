import { reporteCompras } from './../../../models/reporteCompras';
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { sucursales } from 'src/app/models/sucursales'
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { venta } from '../../../models/venta';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from 'src/app/services/excel-services-service.service'; 
import { compra } from 'src/app/models/compra';

@Component({
  selector: 'app-reporte-compras',
  templateUrl: './reporte-compras.component.html',
  styleUrls: ['./reporte-compras.component.css']
})
export class ReporteComprasComponent implements OnInit {

  selectedSucursal: number;
  sucursalesList: sucursales[];
  dateVenta1: Date;
  dateVenta2: Date;
  comprasInv = new compra();
  reporteComprasList: reporteCompras[];

  constructor(private excelService:ExcelServicesService, private datePipe: DatePipe,
    public dialogRef: MatDialogRef<ReporteComprasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
    this.getSucursales();
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  descargarReporte(){
    this.SpinnerService.show();     
    this.comprasInv.idsucursal = this.selectedSucursal;
    this.comprasInv.dateadd = this.datePipe.transform(this.dateVenta1, 'yyyy/MM/dd');
    this.comprasInv.datemod = this.datePipe.transform(this.dateVenta2, 'yyyy/MM/dd');
      this.api.getComprasReporte(this.comprasInv).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.reporteComprasList = response.data;
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
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }

  descargarExcel(){
    if(this.sucursalesList != null && this.sucursalesList.length > 0){
      var nombreSucursal = this.sucursalesList.filter(item => item.idsucursal == this.selectedSucursal)[0];    
      this.excelService.exportAsExcelFile(this.reporteComprasList, 'ReporteCompras_' + nombreSucursal.nombre.replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_"));
    }else{
      this.api.openSnackBar("Por favor selecciona una sucursal", 'X', 'error');
    }
  }
}
