import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { producto } from '../../../models/producto';
import { sucursales } from 'src/app/models/sucursales';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eliminar-inventatio',
  templateUrl: './eliminar-inventatio.component.html',
  styleUrls: ['./eliminar-inventatio.component.css']
})
export class EliminarInventatioComponent implements OnInit {

  selectedSucursal: number;
  sucursalesList: sucursales[];
  newProducto = new producto();
  productosList: any = [];
  userSesion: any;

  constructor(
    public dialogRef: MatDialogRef<EliminarInventatioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
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

  eliminarInventario(): void{
    this.SpinnerService.show();
    this.newProducto.idsucursal = this.selectedSucursal;
    this.api.eliminarInventario(this.newProducto).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.api.openSnackBar(response.message, 'X', 'success');
              this.sucursalesList = response.data;
              this.onNoClick();
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
