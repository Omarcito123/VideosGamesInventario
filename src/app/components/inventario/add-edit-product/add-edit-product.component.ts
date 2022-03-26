import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { lista } from '../../../models/lista';
import { sucursales } from 'src/app/models/sucursales'
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { producto } from '../../../models/producto';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  selectedSucursal: number;
  selectedValue: number;
  listaValores: lista[];
  sucursalesList: sucursales[];
  productBySucursalList: producto[];
  selectedProduct: any = [];
  categoriasList: categoria[];
  product: producto;
  productAddEdit = new producto();
  addProductForm: FormGroup;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  disabledTipo = false;
  userSesion: any;
  options: string[] = [];

  //estado: ['',  [Validators.required, Validators.email]],

  constructor(
    public dialogRef: MatDialogRef<AddEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
      this.addProductForm = this.fb.group({
        categoria: ['',  [Validators.required, Validators.maxLength(50)]],
        estado: ['',  [Validators.required, Validators.maxLength(20)]],
        sucursal: ['', [Validators.required, Validators.maxLength(6)]],
        serie: ['', ''],
        existencia: ['', [Validators.required, Validators.max(99999)]],
        preciocosto: ['', [Validators.required, Validators.max(99999)]],
        preciooferta: ['', [Validators.required, Validators.max(99999)]],
        precioregular: ['', [Validators.required, Validators.max(99999)]],
      });
    }

  ngOnInit(): void {
    this.getList();
    this.getSucursales();
    this.getCategoriasList();
    if(this.data != null){
      this.userSesion = this.authService.currentUserValue;
      this.selectedSucursal = this.userSesion.idsucursal;
      this.selectedSucursal = this.data.idsucursal;
      this.productAddEdit.idprodinv = this.data.idprodinv;
      this.productAddEdit.categoria = this.data.categoria;
      this.productAddEdit.dateadd = this.data.dateadd;
      this.productAddEdit.datemod = this.data.datemod;
      this.productAddEdit.estado = this.data.estado;
      this.productAddEdit.existencia = this.data.existencia;
      this.productAddEdit.idsucursal = this.data.idsucursal;
      this.productAddEdit.iduseradd = this.data.iduseradd;
      this.productAddEdit.idusermod = this.data.idusermod;
      this.productAddEdit.nombre = this.data.nombre;
      this.productAddEdit.preciocosto = this.data.preciocosto;
      this.productAddEdit.preciooferta = this.data.preciooferta;
      this.productAddEdit.precioregular = this.data.precioregular;
      this.productAddEdit.serie = this.data.serie;
      this.productAddEdit.cantidad = this.data.cantidad;
      this.productAddEdit.precioTotal = this.data.precioTotal;
      this.disabledTipo = true;
      this.selectedValue = 1;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getList(){
    this.listaValores = [
      { value: 1, description: 'Existe en la base de datos' },
      { value: 2, description: 'No existente en la base de datos' }
    ];
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

  setcategoriaByDefault(){
    if(this.data == null){
      this.productAddEdit.categoria = "Selecciona una categoria";
    }    
  }

  getCategoriasList(){
    this.SpinnerService.show(); 
      this.api.getCategoriasList().subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.categoriasList = response.data;
              var cate = new categoria();
              cate.idcategoria = 0;
              cate.nombre = "Selecciona una categoria";
              this.categoriasList.push(cate);                  
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

  getProductsBySucursal(){
    if(this.selectedValue == 1 && (this.productAddEdit.serie == null || this.productAddEdit.serie == undefined || this.productAddEdit.serie == "")){
      if(this.productAddEdit.categoria != "Selecciona una categoria"){
      this.product = new producto();
      this.product.categoria = this.productAddEdit.categoria;    
      this.clearWindows();
      if(this.selectedSucursal){
        this.SpinnerService.show();          
        this.product.idsucursal = this.selectedSucursal;
        this.api.getListProductsBySucursalAndCategoria(this.product).subscribe(
          (response) => {
            if (response != null) {
              if (response.state == "Success") {
                this.productBySucursalList = response.data;
                this.options = response.data.map(a => a.nombre);   
                this.filteredOptions = this.myControl.valueChanges
                .pipe(
                  startWith(''),
                  map(value => this._filter(value))
                );
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
      }
    }       
  }

  clearWindows(){
    if(this.data == null){
      this.productAddEdit = new producto();
    }    
  }

  deleteProductName() {
    if (this.productAddEdit != null) {
      this.productAddEdit.nombre = '';
    }
  }

  fillDataProductSerie(){
    if(this.selectedValue != 2){
      Object.keys(this.addProductForm.controls).forEach((key) => {
        this.addProductForm.get(key).setErrors(null);
      });
  
      this.deleteProductName();
      
      if(this.productAddEdit.serie === undefined || this.productAddEdit.serie === ''){
        return;
      }
      this.SpinnerService.show();
  
      this.productAddEdit.idsucursal = this.selectedSucursal;  
      this.api.findProductByNameAndSucursalAndCode(this.productAddEdit).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == 'Success') {
              if (response.data != null) {
                this.productAddEdit = response.data;
              }
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
          if (error.includes('403')) {
            this.authService.logout();
          }
        }
      );
    }
  }

  fillDataProduct(){
    if(this.productAddEdit.categoria != "Selecciona una categoria"){
      this.SpinnerService.show();  
    this.productAddEdit.idsucursal = this.selectedSucursal;
      this.api.findProductByName(this.productAddEdit).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.productAddEdit = response.data;                         
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
  }

  private _filter(value: string): string[] {
    const name = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(name));
  }

  saveProduct(){ 
    if(this.addProductForm.valid){
      if(this.productAddEdit.nombre == null){
        this.api.openSnackBar("Nombre del producto incorrecto", 'X', 'error');
      }else if(this.productAddEdit.nombre == undefined){
        this.api.openSnackBar("Nombre del producto incorrecto", 'X', 'error');
      }else if(this.productAddEdit.nombre == ""){
        this.api.openSnackBar("Nombre del producto incorrecto", 'X', 'error');
      }else{
        if(this.selectedValue == 1){
          this.SpinnerService.show();
          this.api.updateProduct(this.productAddEdit).subscribe(
            (response) => {
              if (response != null) {            
                if (response.state == "Success") {
                  this.dialogRef.close();
                  this.api.openSnackBar("Producto agregado exitosamente", 'X', 'success');
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
        }else if(this.selectedValue == 2){
          this.SpinnerService.show();
          this.productAddEdit.idsucursal = this.selectedSucursal;
          this.api.saveProduct(this.productAddEdit).subscribe(
            (response) => {
              if (response != null) {            
                if (response.state == "Success") {
                  this.dialogRef.close();
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
              if(error.includes("403")){
                this.authService.logout();
              }
            }
          );
        }
      }
    }else{
      this.api.openSnackBar("Todos los campos son requeridos", 'X', 'error');
    } 
  }
}
