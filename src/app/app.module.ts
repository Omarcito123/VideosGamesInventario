import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComprasUsadoComponent } from './components/compras-usado/compras-usado.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { ControlHorasComponent } from './components/control-horas/control-horas.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './utils/angular-material/angular-material.module';
import { ListVentasComponent } from './components/ventas/list-ventas/list-ventas.component';
import { FormsModule } from '@angular/forms';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { ActiveUrlService } from './utils/auth/active-url.service';
import { SafePipe } from './services/safe-pipe.service';
import { InventarioComponent } from './components/inventario/inventario.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { DialogConfirmacionComponent } from './components/dialog-confirmacion/dialog-confirmacion.component';
import { AddEditProductComponent } from './components/inventario/add-edit-product/add-edit-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEditUserComponent } from './components/usuarios/add-edit-user/add-edit-user.component';
import { ListComprasComponent } from './components/compras-usado/list-compras/list-compras.component';
import { ListComisionesVendedorComponent } from './components/comisiones/list-comisiones-vendedor/list-comisiones-vendedor.component';
import { AddEditComisionComponent } from './components/comisiones/add-edit-comision/add-edit-comision.component';
import { CuponesComponent } from './components/cupones/cupones.component';
import { AddEditCuponComponent } from './components/cupones/add-edit-cupon/add-edit-cupon.component';
import { AddInventarioExcelComponent } from './components/inventario/add-inventario-excel/add-inventario-excel.component';
import { ChangePassComponent } from './components/mi-perfil/change-pass/change-pass.component';
import { DatePipe } from '@angular/common';
import { HistorialControlHorasComponent } from './components/control-horas/historial-control-horas/historial-control-horas.component';
import { VentasMensualesComponent } from './components/ventas/ventas-mensuales/ventas-mensuales.component';
import { VentasDiariasComponent } from './components/ventas/ventas-diarias/ventas-diarias.component';
import { SucursalesComponent } from './components/control-horas/sucursales/sucursales.component';
import { TrasladarProductoComponent } from './components/inventario/trasladar-producto/trasladar-producto.component';
import { ReparacionesComponent } from './components/reparaciones/reparaciones.component';
import { SucursalesInventarioComponent } from './components/sucursales-inventario/sucursales-inventario.component';
import { AddEditSucursalComponent } from './components/sucursales-inventario/add-edit-sucursal/add-edit-sucursal.component';
import { AddEditReparacionComponent } from './components/reparaciones/add-edit-reparacion/add-edit-reparacion.component';
import { AddEditDetalleRepComponent } from './components/reparaciones/add-edit-detalle-rep/add-edit-detalle-rep.component';
import { ComprasMensualesComponent } from './components/compras-usado/compras-mensuales/compras-mensuales.component';
import { RealizarCierreCajaComponent } from './components/ventas/realizar-cierre-caja/realizar-cierre-caja.component';
import { HistorialCierreCajaComponent } from './components/ventas/historial-cierre-caja/historial-cierre-caja.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { AddEditCategoriaComponent } from './components/categorias/add-edit-categoria/add-edit-categoria.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { CrearPedidoComponent } from './components/pedidos/crear-pedido/crear-pedido.component';
import { VerPedidoSucursalComponent } from './components/pedidos/ver-pedido-sucursal/ver-pedido-sucursal.component';
import { AddEditPedidoComponent } from './components/pedidos/crear-pedido/add-edit-pedido/add-edit-pedido.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { HistorialReservaComponent } from './components/reserva/historial-reserva/historial-reserva.component';
import { AddReservaComponent } from './components/reserva/add-reserva/add-reserva.component';
import { ReservasPorSucursalComponent } from './components/ventas/reservas-por-sucursal/reservas-por-sucursal.component';
import { ReporteVentasComponent } from './components/inventario/reporte-ventas/reporte-ventas.component';
import { ReporteComprasComponent } from './components/inventario/reporte-compras/reporte-compras.component';
import { NotasComponent } from './components/notas/notas.component';
import { AddEditNotaComponent } from './components/notas/add-edit-nota/add-edit-nota.component';
import { EliminarInventatioComponent } from './components/inventario/eliminar-inventatio/eliminar-inventatio.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuariosComponent,
    ComprasUsadoComponent,
    VentasComponent,
    ComisionesComponent,
    ControlHorasComponent,
    DashboardComponent,
    ListVentasComponent,
    MiPerfilComponent,
    SafePipe,
    InventarioComponent,
    DialogConfirmacionComponent,
    AddEditProductComponent,
    AddEditUserComponent,
    ListComprasComponent,
    ListComisionesVendedorComponent,
    AddEditComisionComponent,
    CuponesComponent,
    AddEditCuponComponent,
    AddInventarioExcelComponent,
    ChangePassComponent,
    HistorialControlHorasComponent,
    VentasMensualesComponent,
    VentasDiariasComponent,
    SucursalesComponent,
    TrasladarProductoComponent,
    ReparacionesComponent,
    SucursalesInventarioComponent,
    AddEditSucursalComponent,
    AddEditReparacionComponent,
    AddEditDetalleRepComponent,
    ComprasMensualesComponent,
    RealizarCierreCajaComponent,
    HistorialCierreCajaComponent,
    CategoriasComponent,
    AddEditCategoriaComponent,
    PedidosComponent,
    CrearPedidoComponent,
    VerPedidoSucursalComponent,
    AddEditPedidoComponent,
    ReservaComponent,
    HistorialReservaComponent,
    AddReservaComponent,
    ReservasPorSucursalComponent,
    ReporteVentasComponent,
    ReporteComprasComponent,
    NotasComponent,
    AddEditNotaComponent,
    EliminarInventatioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    ActiveUrlService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
