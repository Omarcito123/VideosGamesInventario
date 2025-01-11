import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ComprasUsadoComponent } from './components/compras-usado/compras-usado.component';
import { ControlHorasComponent } from './components/control-horas/control-horas.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { ActiveUrlService } from './utils/active-url.service';
import { InventarioComponent } from './components/inventario/inventario.component';
import { CuponesComponent } from './components/cupones/cupones.component';
import { ReparacionesComponent } from './components/reparaciones/reparaciones.component';
import { SucursalesInventarioComponent } from './components/sucursales-inventario/sucursales-inventario.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { NotasComponent } from './components/notas/notas.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ActiveUrlService], children: [
    { path: '', component: UsuariosComponent, canActivate: [ActiveUrlService] },
    { path: 'perfil', component: MiPerfilComponent, canActivate: [ActiveUrlService] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [ActiveUrlService] },
    { path: 'controlhoras', component: ControlHorasComponent, canActivate: [ActiveUrlService] },
    { path: 'ventas', component: VentasComponent, canActivate: [ActiveUrlService] },
    { path: 'reparaciones', component: ReparacionesComponent, canActivate: [ActiveUrlService] },
    { path: 'comprasusado', component: ComprasUsadoComponent, canActivate: [ActiveUrlService] },
    { path: 'comision', component: ComisionesComponent, canActivate: [ActiveUrlService] },
    { path: 'cupones', component: CuponesComponent, canActivate: [ActiveUrlService] },
    { path: 'sucursales', component: SucursalesInventarioComponent, canActivate: [ActiveUrlService] },
    { path: 'inventario', component: InventarioComponent, canActivate: [ActiveUrlService] },
    { path: 'categorias', component: CategoriasComponent, canActivate: [ActiveUrlService] },
    { path: 'pedidos', component: PedidosComponent, canActivate: [ActiveUrlService] },
    { path: 'reservas', component: ReservaComponent, canActivate: [ActiveUrlService] },
    { path: 'notas', component: NotasComponent, canActivate: [ActiveUrlService] }
  ] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
