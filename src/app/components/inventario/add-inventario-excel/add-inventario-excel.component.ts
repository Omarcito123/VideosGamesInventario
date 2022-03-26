import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { producto } from '../../../models/producto';
import { sucursales } from 'src/app/models/sucursales'
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-add-inventario-excel',
  templateUrl: './add-inventario-excel.component.html',
  styleUrls: ['./add-inventario-excel.component.css']
})
export class AddInventarioExcelComponent implements OnInit {

  data2: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  selectedSucursal: number;
  sucursalesList: sucursales[];
  newProducto = new producto();
  productosList: any = [];
  userSesion: any;
  file: any;
  arrayBuffer: any;

  constructor(
    public dialogRef: MatDialogRef<AddInventarioExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
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

  onFileChange(evt: any) {
    try{
      /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];      
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data2 = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      this.data2.forEach(obj => {
        if(obj != []){
          if(obj[0] != "sku"){
            if(obj["0"] != undefined){
              this.newProducto = new producto();
              this.userSesion = this.authService.currentUserValue;   
              this.newProducto.categoria = obj["2"];
              this.newProducto.dateadd = "";
              this.newProducto.datemod = "";
              this.newProducto.estado = obj["3"];
              this.newProducto.existencia = obj["7"];
              this.newProducto.idsucursal = this.selectedSucursal;
              this.newProducto.iduseradd = this.userSesion.iduser;
              this.newProducto.idusermod = 0;
              this.newProducto.nombre = obj["1"];
              this.newProducto.preciocosto = obj["4"];
              this.newProducto.preciooferta = obj["6"];
              this.newProducto.precioregular = obj["5"];
              this.newProducto.serie = obj["0"];
              this.newProducto.cantidad = 0;
              this.newProducto.precioTotal = 0;
              this.productosList.push(this.newProducto);
            }
          }
        }
    });
    this.api.saveProductListInv(this.productosList).subscribe(
      (response) => {
        if (response != null) {
          if (response.state == "Success") {
            this.sucursalesList = response.data;
            this.onNoClick();
            this.api.openSnackBar("Inventario cargado exitosamente", 'X', 'success');
          } else {
            this.api.openSnackBar("response.message", 'X', 'error');
          }
        } else {
          this.api.openSnackBar(response.message, 'X', 'error');
        }
        this.SpinnerService.hide(); 
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide(); 
        if(error.includes("403")){
          this.authService.logout();
        }
      }
    );
    };
    reader.readAsBinaryString(target.files[0]);
    }catch(e){
      this.SpinnerService.hide(); 
      this.api.openSnackBar('Error al cargar el inventario', 'X', 'error');
    }
  }
}
