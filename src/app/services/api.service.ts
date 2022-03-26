import { reparacionEnc } from './../models/reparacionEnc';
import { producto } from './../models/producto';
import { compra } from './../models/compra';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response';
import { AuthService } from 'src/app/services/auth.service';
import { user } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { venta } from '../models/venta';
import { userInv } from '../models/userInv';
import { comisiones } from '../models/comisiones';
import { comisionVendedor } from '../models/comisionVendedor';
import { cupones } from '../models/cupones';
import { controlHoras } from '../models/controlHoras';
import { cajaInv } from '../models/cajaInv';
import { reparacionDet } from '../models/reparacionDet';
import { pedidoInv } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlServer: string;
  userCredencial: user;
  userSesion: any;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private authService: AuthService) {
    this.urlServer = `${environment.apiUrl}/api`;
  }

  login(data: user): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let url = `${this.urlServer}/authentification/loginInv`;
    this.userCredencial = new user();
    this.userCredencial.username = btoa(data.username);
    this.userCredencial.pass = btoa(data.pass);
    let body = JSON.stringify(this.userCredencial);
    let options = { headers: headers };
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getSucursales(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/sucursales/getSucursalesList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveSucursalInv(sucursal: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/sucursales/saveSucursal`;
    let options = { headers: headers };
    this.userSesion = this.authService.currentUserValue;
    sucursal.iduseradd = this.userSesion.iduser;
    let body = JSON.stringify(sucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateSucursalInv(sucursal: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/sucursales/saveSucursal`;
    let options = { headers: headers };
    this.userSesion = this.authService.currentUserValue;
    sucursal.idusermod = this.userSesion.iduser;
    let body = JSON.stringify(sucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteSucursal(sucursal: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/sucursales/deleteSucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(sucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getProductsBySucursal(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/getListProductsBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  eliminarInventario(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/eliminarInventario`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListProductsBySucursalAndCategoria(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/getListProductsBySucursalAndCategoria`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getRepuestoBodegaAndCategoria(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/getRepuestoBodegaAndCategoria`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveProduct(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/saveProductInv`;
    let options = { headers: headers };
    this.userSesion = this.authService.currentUserValue;
    product.iduseradd = this.userSesion.iduser;
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveProductListInv(productList: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/saveProductListInv`;
    let options = { headers: headers };
    let body = JSON.stringify(productList);
    console.log(productList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateProduct(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/updateProductInv`;
    let options = { headers: headers };
    this.userSesion = this.authService.currentUserValue;
    product.idusermod = this.userSesion.iduser;
    let body = JSON.stringify(product);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteProduct(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/deleteProductInv`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findProductByName(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/findProductbyName`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findProductByNameAndSucursalAndCode(product: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/findProductByNameAndSucursalAndCode`;
    let options = { headers: headers };
    let body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUserList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/getUsersList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersListBySucursal(idsucursal: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/getUsersListBySucursal`;
    let options = { headers: headers };
    this.userCredencial = new user();
    this.userCredencial.idsucursal = idsucursal;
    let body = JSON.stringify(this.userCredencial);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersBodegaList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/getUsersBodegaList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createVenta(ventaList: Array<venta>): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/createVenta`;
    let options = { headers: headers };
    let body = JSON.stringify(ventaList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasBySucursal(idSucursal: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getListVentaBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaReservaBySucursal(idSucursal: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getListVentaReservaBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasReporte(venta: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getVentasReporte`;
    let options = { headers: headers };
    let body = JSON.stringify(venta);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getHistorialCierreCajaBySucursal(historial: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/historialCajaInv/findCajaByRangoDateAndSucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(historial);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  eliminarCierreCaja(historial: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/historialCajaInv/deleteHistorialCajaById`;
    let options = { headers: headers };
    let body = JSON.stringify(historial);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaMensualBySucursal(idSucursal: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getListVentaMensualBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasBySucursalAndUser(idSucursal: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getListVentaBySucursalAndByVendedor`;
    let options = { headers: headers };
    let body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaReservaBySucursalAndByVendedor(idSucursal: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getListVentaReservaBySucursalAndByVendedor`;
    let options = { headers: headers };
    let body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaReservaOnlyBySucursal(idSucursal: venta): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/getListVentaReservaOnlyBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteVenta(venta: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/deleteVentaById`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(venta);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  entregarReserva(venta: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/ventaInv/entregarReserva`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(venta);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  geInfoPerfil(usuario: userInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/getInfoPerfil`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduser = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersInvList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/getUsersList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersSucurList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/getUsersSucurList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveUserInv(usuario: userInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/saveUserInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateUserInv(usuario: userInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/updateUserInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(usuario);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePerfil(usuario: userInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/updatePerfilInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  changePass(actual: any, nueva: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/changePass`;
    this.userSesion = this.authService.currentUserValue;   
    var info = { id: this.userSesion.iduser, passActual: actual, newPass: nueva };
    let options = { headers: headers };
    return this.http.post<ResponseModel>(url, info, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteUsuario(usuario: userInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/userInv/deleteUserInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createCompra(compraList: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/compraInv/createCompra`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(compraList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListComprasBySucursal(compra: compra): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/compraInv/getListComprasBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(compra);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComprasReporte(compra: compra): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/compraInv/getComprasReporte`;
    let options = { headers: headers };
    let body = JSON.stringify(compra);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComprasMensualBySucursal(compra: compra): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/compraInv/getListComprasBySucursalAndByVendedorMensuales`;
    let options = { headers: headers };
    let body = JSON.stringify(compra);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListComprasBySucursalAndByVendedor(compra: compra): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/compraInv/getListComprasBySucursalAndByVendedor`;
    let options = { headers: headers };
    let body = JSON.stringify(compra);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteCompra(compra: compra): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/compraInv/deleteCompraById`;
    let options = { headers: headers };
    let body = JSON.stringify(compra);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComisionesList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/comisionInv/getComisionesList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveComisionInv(comision: comisiones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/comisionInv/createComision`;
    this.userSesion = this.authService.currentUserValue;
    comision.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(comision);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateComisionInv(comision: comisiones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/comisionInv/editComision`;
    this.userSesion = this.authService.currentUserValue;
    comision.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(comision);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteComisionById(idComision: comisiones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/comisionInv/deleteComisionById`;
    let options = { headers: headers };
    let body = JSON.stringify(idComision);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComisionVendedorList(comisionV: comisionVendedor): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/comisionVendedorInv/getComisionesByVendedorList`;
    let options = { headers: headers };
    let body = JSON.stringify(comisionV);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getCuponesList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cuponInv/getCuponesList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findCuponByCodigoAndDate(cupon: cupones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cuponInv/findCuponByCodigoAndDate`;
    let options = { headers: headers };
    let body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveCuponInv(cupon: cupones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cuponInv/createCupon`;
    this.userSesion = this.authService.currentUserValue;
    cupon.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateCuponInv(cupon: cupones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cuponInv/editCupon`;
    this.userSesion = this.authService.currentUserValue;
    cupon.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteCuponById(cupon: cupones): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cuponInv/deleteCuponById`;
    let options = { headers: headers };
    let body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getCategoriasList(): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/categoriaInv/getCategoriasList`;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveCategoriaInv(item: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/categoriaInv/createCategoria`;
    this.userSesion = this.authService.currentUserValue;
    item.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateCategoriaInv(item: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/categoriaInv/editCategoria`;
    this.userSesion = this.authService.currentUserValue;
    item.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteCategoria(item: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/categoriaInv/deleteCategoriaById`;
    this.userSesion = this.authService.currentUserValue;
    item.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveTurno(control: controlHoras): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/controlHorasInv/createControl`;
    this.userSesion = this.authService.currentUserValue;
    control.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(control);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getControlByUserAndFecha(control: controlHoras): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/controlHorasInv/getControlByUserFecha`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(control);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getControlByUserMonth(control: controlHoras): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/controlHorasInv/getControlByUserMonth`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(control);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  setCajaInicial(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/createCajaInicial`;
    this.userSesion = this.authService.currentUserValue;    
    caja.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findCajaByDateAndSucursal(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/findCajaByDateAndSucursal`;
    this.userSesion = this.authService.currentUserValue;    
    caja.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  calcularCierreCaja(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/updateCajaIC`;
    this.userSesion = this.authService.currentUserValue;    
    caja.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveFantanteSobrante(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/updateCajaFS`;
    this.userSesion = this.authService.currentUserValue;    
    caja.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  guardarCierreCaja(cierreCaja: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/historialCajaInv/createHistorialCaja`;
    this.userSesion = this.authService.currentUserValue;    
    cierreCaja.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(cierreCaja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveInicioCierreCaja(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/updateInicioCierreCaja`;
    this.userSesion = this.authService.currentUserValue;    
    caja.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveInicioCajaMonedas(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/saveInicioCajaMonedas`;
    this.userSesion = this.authService.currentUserValue;    
    caja.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveMonedas(caja: cajaInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cajaInv/saveMonedas`;
    this.userSesion = this.authService.currentUserValue;    
    caja.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  trasladarProducto(producto: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/traslaProductoSucursal`;
    this.userSesion = this.authService.currentUserValue;    
    producto.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(producto);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  traslaProductoSucursales(producto: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/traslaProductoSucursales`;
    this.userSesion = this.authService.currentUserValue;    
    producto.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(producto);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateExistenciasBodega(producto: producto): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/productoInv/updateExistenciasBodega`;
    this.userSesion = this.authService.currentUserValue;    
    producto.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(producto);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getReparacionesInvList(reparacion: reparacionEnc): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionEncInv/findAllByStatusAndSucursal`;
    this.userSesion = this.authService.currentUserValue;    
    reparacion.idsucursal = this.userSesion.idsucursal;
    reparacion.estado = true;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveReparacionInv(reparacion: reparacionEnc): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionEncInv/createReparacionEnc`;
    this.userSesion = this.authService.currentUserValue;    
    reparacion.idsucursal = this.userSesion.idsucursal;
    reparacion.estado = true;
    reparacion.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateReparaionInv(reparacion: reparacionEnc): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionEncInv/updateReparacionEnc`;
    this.userSesion = this.authService.currentUserValue;    
    reparacion.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  logicDeleteReparacion(reparacion: reparacionEnc): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionEncInv/deleteReparacionEncById`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteReparacionDet(reparacion: reparacionEnc): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionDetInv/deleteReparacionDetById`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getReparacionDetallesInvList(det: reparacionDet): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionDetInv/findDetallesByIdEnc`;
    this.userSesion = this.authService.currentUserValue;
    let options = { headers: headers };
    let body = JSON.stringify(det);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveDetalleRepInv(reparacion: reparacionDet): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionDetInv/createReparacionDet`;
    this.userSesion = this.authService.currentUserValue;    
    reparacion.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateDetalleRepInv(reparacion: reparacionDet): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/reparacionDetInv/createReparacionDet`;
    this.userSesion = this.authService.currentUserValue;    
    reparacion.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getPedidosListBySucursal(pedido: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/pedidoInv/getListPedidosBySucursal`;
    let options = { headers: headers };
    let body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  savePedidoInv(pedido: pedidoInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/pedidoInv/createPedido`;
    this.userSesion = this.authService.currentUserValue;    
    pedido.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePedidoInv(pedido: pedidoInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/pedidoInv/editPedido`;
    this.userSesion = this.authService.currentUserValue;    
    pedido.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deletePedido(pedido: pedidoInv): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/pedidoInv/deletePedidoById`;
    this.userSesion = this.authService.currentUserValue;    
    pedido.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListNotasByUserAndDates(nota: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/notasInv/getNotasListByUserAndDates`;
    let options = { headers: headers };
    let body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteNota(nota: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/notasInv/deleteNotaById`;
    let options = { headers: headers };
    let body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveNotaInv(nota: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/notasInv/createNota`;
    this.userSesion = this.authService.currentUserValue;    
    nota.iduseradd = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateNotaInv(nota: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/notasInv/editNota`;
    this.userSesion = this.authService.currentUserValue;    
    nota.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  modifyCupon(cupon: any): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + this.authService.getJwt() });
    let url = `${this.urlServer}/cuponInv/editCupon`;
    this.userSesion = this.authService.currentUserValue;    
    cupon.idusermod = this.userSesion.iduser;
    let options = { headers: headers };
    let body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  openSnackBar(message: string, action: string, type) {
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: [type]
    });
  }
}
