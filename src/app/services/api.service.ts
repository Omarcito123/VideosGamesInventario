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

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private authService: AuthService) {
    this.urlServer = `${environment.apiUrl}/api`;
  }

  login(data: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/authentification/loginInv`;
    this.userCredencial = new user();
    this.userCredencial.username = btoa(data.username);
    this.userCredencial.pass = btoa(data.pass);
    const body = JSON.stringify(this.userCredencial);
    const options = { headers };
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getSucursales(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/sucursales/getSucursalesList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveSucursalInv(sucursal: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/sucursales/saveSucursal`;
    const options = { headers };
    this.userSesion = this.authService.currentUserValue;
    sucursal.iduseradd = this.userSesion.iduser;
    const body = JSON.stringify(sucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateSucursalInv(sucursal: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/sucursales/saveSucursal`;
    const options = { headers };
    this.userSesion = this.authService.currentUserValue;
    sucursal.idusermod = this.userSesion.iduser;
    const body = JSON.stringify(sucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteSucursal(sucursal: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/sucursales/deleteSucursal`;
    const options = { headers };
    const body = JSON.stringify(sucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getProductsBySucursal(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/getListProductsBySucursal`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  eliminarInventario(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/eliminarInventario`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListProductsBySucursalAndCategoria(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/getListProductsBySucursalAndCategoria`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getRepuestoBodegaAndCategoria(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/getRepuestoBodegaAndCategoria`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveProduct(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/saveProductInv`;
    const options = { headers };
    this.userSesion = this.authService.currentUserValue;
    product.iduseradd = this.userSesion.iduser;
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveProductListInv(productList: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/saveProductListInv`;
    const options = { headers };
    const body = JSON.stringify(productList);
    console.log(productList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateProduct(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/updateProductInv`;
    const options = { headers };
    this.userSesion = this.authService.currentUserValue;
    product.idusermod = this.userSesion.iduser;
    const body = JSON.stringify(product);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteProduct(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/deleteProductInv`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findProductByName(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/findProductbyName`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findProductByNameAndSucursalAndCode(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/findProductByNameAndSucursalAndCode`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUserList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/getUsersList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersListBySucursal(idsucursal: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/getUsersListBySucursal`;
    const options = { headers };
    this.userCredencial = new user();
    this.userCredencial.idsucursal = idsucursal;
    const body = JSON.stringify(this.userCredencial);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersBodegaList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/getUsersBodegaList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createVenta(ventaList: Array<venta>): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/createVenta`;
    const options = { headers };
    const body = JSON.stringify(ventaList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasBySucursal(idSucursal: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getListVentaBySucursal`;
    const options = { headers };
    const body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaReservaBySucursal(idSucursal: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getListVentaReservaBySucursal`;
    const options = { headers };
    const body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasReporte(venta1: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getVentasReporte`;
    const options = { headers };
    const body = JSON.stringify(venta1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getHistorialCierreCajaBySucursal(historial: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/historialCajaInv/findCajaByRangoDateAndSucursal`;
    const options = { headers };
    const body = JSON.stringify(historial);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  eliminarCierreCaja(historial: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/historialCajaInv/deleteHistorialCajaById`;
    const options = { headers };
    const body = JSON.stringify(historial);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaMensualBySucursal(idSucursal: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getListVentaMensualBySucursal`;
    const options = { headers };
    const body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasBySucursalAndUser(idSucursal: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getListVentaBySucursalAndByVendedor`;
    const options = { headers };
    const body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaReservaBySucursalAndByVendedor(idSucursal: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getListVentaReservaBySucursalAndByVendedor`;
    const options = { headers };
    const body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListVentaReservaOnlyBySucursal(idSucursal: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/getListVentaReservaOnlyBySucursal`;
    const options = { headers };
    const body = JSON.stringify(idSucursal);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteVenta(venta1: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/deleteVentaById`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(venta1);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  entregarReserva(venta1: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/ventaInv/entregarReserva`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(venta1);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  geInfoPerfil(usuario: userInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/getInfoPerfil`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduser = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersInvList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/getUsersList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUsersSucurList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/getUsersSucurList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveUserInv(usuario: userInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/saveUserInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateUserInv(usuario: userInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/updateUserInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePerfil(usuario: userInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/updatePerfilInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  changePass(actual: any, nueva: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/changePass`;
    this.userSesion = this.authService.currentUserValue;
    const info = { id: this.userSesion.iduser, passActual: actual, newPass: nueva };
    const options = { headers };
    return this.http.post<ResponseModel>(url, info, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteUsuario(usuario: userInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/userInv/deleteUserInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createCompra(compraList: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '')});
    const url = `${this.urlServer}/compraInv/createCompra`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(compraList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListComprasBySucursal(compra1: compra): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/compraInv/getListComprasBySucursal`;
    const options = { headers };
    const body = JSON.stringify(compra1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComprasReporte(compra1: compra): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/compraInv/getComprasReporte`;
    const options = { headers };
    const body = JSON.stringify(compra1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComprasMensualBySucursal(compra1: compra): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/compraInv/getListComprasBySucursalAndByVendedorMensuales`;
    const options = { headers };
    const body = JSON.stringify(compra1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListComprasBySucursalAndByVendedor(compra1: compra): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/compraInv/getListComprasBySucursalAndByVendedor`;
    const options = { headers };
    const body = JSON.stringify(compra1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteCompra(compra1: compra): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/compraInv/deleteCompraById`;
    const options = { headers };
    const body = JSON.stringify(compra1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComisionesList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/comisionInv/getComisionesList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveComisionInv(comision: comisiones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/comisionInv/createComision`;
    this.userSesion = this.authService.currentUserValue;
    comision.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(comision);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateComisionInv(comision: comisiones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/comisionInv/editComision`;
    this.userSesion = this.authService.currentUserValue;
    comision.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(comision);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteComisionById(idComision: comisiones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/comisionInv/deleteComisionById`;
    const options = { headers };
    const body = JSON.stringify(idComision);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getComisionVendedorList(comisionV: comisionVendedor): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/comisionVendedorInv/getComisionesByVendedorList`;
    const options = { headers };
    const body = JSON.stringify(comisionV);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getCuponesList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cuponInv/getCuponesList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findCuponByCodigoAndDate(cupon: cupones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cuponInv/findCuponByCodigoAndDate`;
    const options = { headers };
    const body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveCuponInv(cupon: cupones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cuponInv/createCupon`;
    this.userSesion = this.authService.currentUserValue;
    cupon.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateCuponInv(cupon: cupones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cuponInv/editCupon`;
    this.userSesion = this.authService.currentUserValue;
    cupon.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteCuponById(cupon: cupones): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cuponInv/deleteCuponById`;
    const options = { headers };
    const body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getCategoriasList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/categoriaInv/getCategoriasList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveCategoriaInv(item: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/categoriaInv/createCategoria`;
    this.userSesion = this.authService.currentUserValue;
    item.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateCategoriaInv(item: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/categoriaInv/editCategoria`;
    this.userSesion = this.authService.currentUserValue;
    item.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteCategoria(item: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/categoriaInv/deleteCategoriaById`;
    this.userSesion = this.authService.currentUserValue;
    item.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveTurno(control: controlHoras): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/controlHorasInv/createControl`;
    this.userSesion = this.authService.currentUserValue;
    control.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(control);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getControlByUserAndFecha(control: controlHoras): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/controlHorasInv/getControlByUserFecha`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(control);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getControlByUserMonth(control: controlHoras): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/controlHorasInv/getControlByUserMonth`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(control);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  setCajaInicial(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/createCajaInicial`;
    this.userSesion = this.authService.currentUserValue;
    caja.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findCajaByDateAndSucursal(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/findCajaByDateAndSucursal`;
    this.userSesion = this.authService.currentUserValue;
    caja.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  calcularCierreCaja(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/updateCajaIC`;
    this.userSesion = this.authService.currentUserValue;
    caja.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveFantanteSobrante(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/updateCajaFS`;
    this.userSesion = this.authService.currentUserValue;
    caja.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  guardarCierreCaja(cierreCaja: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/historialCajaInv/createHistorialCaja`;
    this.userSesion = this.authService.currentUserValue;
    cierreCaja.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(cierreCaja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveInicioCierreCaja(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/updateInicioCierreCaja`;
    this.userSesion = this.authService.currentUserValue;
    caja.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveInicioCajaMonedas(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/saveInicioCajaMonedas`;
    this.userSesion = this.authService.currentUserValue;
    caja.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveMonedas(caja: cajaInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cajaInv/saveMonedas`;
    this.userSesion = this.authService.currentUserValue;
    caja.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(caja);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  trasladarProducto(producto1: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/traslaProductoSucursal`;
    this.userSesion = this.authService.currentUserValue;
    producto1.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(producto1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  traslaProductoSucursales(producto1: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/traslaProductoSucursales`;
    this.userSesion = this.authService.currentUserValue;
    producto1.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(producto1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateExistenciasBodega(producto1: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/productoInv/updateExistenciasBodega`;
    this.userSesion = this.authService.currentUserValue;
    producto1.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(producto1);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getReparacionesInvList(reparacion: reparacionEnc): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionEncInv/findAllByStatusAndSucursal`;
    this.userSesion = this.authService.currentUserValue;
    reparacion.idsucursal = this.userSesion.idsucursal;
    reparacion.estado = true;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveReparacionInv(reparacion: reparacionEnc): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionEncInv/createReparacionEnc`;
    this.userSesion = this.authService.currentUserValue;
    reparacion.idsucursal = this.userSesion.idsucursal;
    reparacion.estado = true;
    reparacion.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateReparaionInv(reparacion: reparacionEnc): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionEncInv/updateReparacionEnc`;
    this.userSesion = this.authService.currentUserValue;
    reparacion.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  logicDeleteReparacion(reparacion: reparacionEnc): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionEncInv/deleteReparacionEncById`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteReparacionDet(reparacion: reparacionEnc): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionDetInv/deleteReparacionDetById`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getReparacionDetallesInvList(det: reparacionDet): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionDetInv/findDetallesByIdEnc`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(det);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveDetalleRepInv(reparacion: reparacionDet): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionDetInv/createReparacionDet`;
    this.userSesion = this.authService.currentUserValue;
    reparacion.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateDetalleRepInv(reparacion: reparacionDet): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/reparacionDetInv/createReparacionDet`;
    this.userSesion = this.authService.currentUserValue;
    reparacion.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(reparacion);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getPedidosListBySucursal(pedido: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/pedidoInv/getListPedidosBySucursal`;
    const options = { headers };
    const body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  savePedidoInv(pedido: pedidoInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/pedidoInv/createPedido`;
    this.userSesion = this.authService.currentUserValue;
    pedido.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePedidoInv(pedido: pedidoInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/pedidoInv/editPedido`;
    this.userSesion = this.authService.currentUserValue;
    pedido.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deletePedido(pedido: pedidoInv): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/pedidoInv/deletePedidoById`;
    this.userSesion = this.authService.currentUserValue;
    pedido.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(pedido);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListNotasByUserAndDates(nota: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/notasInv/getNotasListByUserAndDates`;
    const options = { headers };
    const body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteNota(nota: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/notasInv/deleteNotaById`;
    const options = { headers };
    const body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveNotaInv(nota: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/notasInv/createNota`;
    this.userSesion = this.authService.currentUserValue;
    nota.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateNotaInv(nota: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/notasInv/editNota`;
    this.userSesion = this.authService.currentUserValue;
    nota.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(nota);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  modifyCupon(cupon: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/cuponInv/editCupon`;
    this.userSesion = this.authService.currentUserValue;
    cupon.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(cupon);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  openSnackBar(message: string, action: string, type): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass: [type]
    });
  }
}