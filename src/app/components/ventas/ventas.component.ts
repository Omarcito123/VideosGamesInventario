import { Component, OnInit, ViewChild } from '@angular/core';
import { lista } from '../../models/lista';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { producto } from '../../models/producto';
import { sucursales } from '../../models/sucursales';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { productoCar } from '../../models/productoCar';
import { userInv } from '../../models/userInv';
import { venta } from '../../models/venta';
import { compra } from '../../models/compra';
import { cupones } from '../../models/cupones';
import { DatePipe } from '@angular/common';
import { cajaInv } from '../../models/cajaInv';
import { Location } from '@angular/common';

interface Valores {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})

export class VentasComponent implements OnInit {

  cuponUsado = new cupones();
  selectedTipoPago: string;
  tipoPagoVenta: string;
  selectedPost: string;
  selectedSucursal: number;
  selectedComprobante: string;
  selectedVendedor: number;
  comprobantesList: lista[];
  tipoPagoList: lista[];
  tipoPostList: lista[];
  myControl = new FormControl();
  myControlSerie = new FormControl();
  product: producto;
  caja = new cajaInv();
  productBySucursalList: producto[];
  sucursalesList: sucursales[];
  productSell = new producto();
  cuponFind = new cupones();
  productAddCarList: Array<productoCar> = [];
  ventaList: Array<venta> = [];
  ventaCar: venta;
  filteredOptions: Observable<string[]>;
  filteredSeriesOptions: Observable<string[]>;
  userSesion: any;
  options: string[] = [];
  optionsSerie: string[] = [];
  itemsInCar = 0;
  addProductCarForm: FormGroup;
  payProductCarForm: FormGroup;
  usersList: userInv[];
  numberFactura: string;
  numberRecibo: string;
  fecha: Date;
  ventasVen = new venta();
  ventasBySucursalList: Array<venta> = [];
  totalVentas = 0;
  totalVentasTarjetas = 0;
  totalAgricola = 0;
  totalCuscatlan = 0;
  totalDavi = 0;
  totalCredo = 0;
  totalEfectivo = 0;
  totalEfectivoEntregar = 0;
  totalQR = 0;
  totalReserva = 0;
  totalPagoOnLine = 0;
  ventaTotalSucursal = 0;
  totalComprasSucursal = 0;
  comprasBySucursalList: Array<compra> = [];
  cuponActive = false;
  codigoCupon = '';
  categorias = '';
  rol = '';
  tipoVentaList: Array<Valores> = [];
  selectedtipoVenta: string;
  totalCompra = 0;
  esOferta = false;
  esperando = 'No';
  namePost = '';
  pagoConCupon = false;
  noInProgres = true;

  displayedColumns: string[] = [
    'cantidad',
    'nombre',
    'precioregular',
    'precioTotal',
    'descuento',
    'options',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private api: ApiService,
    private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.addProductCarForm = this.fb.group({
      existencia: ['', [Validators.required, Validators.max(99999)]],
      cantidadProduct: ['', [Validators.required, Validators.max(99999)]],
      precioregular: ['', [Validators.required, Validators.max(99999)]],
      preciooferta: ['', [Validators.required, Validators.max(99999)]],
      totalProduct: ['', [Validators.required, Validators.max(99999)]],
      tipoPagoVentaSelect: ['', [Validators.required]],
      postS: ['', ''],
    });

    this.payProductCarForm = this.fb.group({
      vendedorS: ['', [Validators.required]],
      tipoVenta: ['', [Validators.required]],
      comprobanteS: ['', [Validators.required]],
      facturaS: ['', ''],
      reciboS: ['', ''],
    });
  }

  ngOnInit(): void {
    this.fecha = new Date();
    this.userSesion = this.authService.currentUserValue;
    this.selectedSucursal = this.userSesion.idsucursal;
    this.rol = this.userSesion.rolname;
    this.getVentasBySucursal();
    this.getComprobanteList();
    this.getTipoPagoList();
    this.getSucursales();
    this.getProductsBySucursal();
    this.getUserList();
    this.getPostList();
    this.getTipoVentaList();
  }

  cancelarCupon(): void {
    this.cuponActive = false;
  }

  saveFantanteSobrante(): void {
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.SpinnerService.show();
    this.api.saveFantanteSobrante(this.caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
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

  saveInicioCajaMonedas(): void {
    if (this.rol !== 'SuperAdmin' && this.rol !== 'Administrador'){
      this.api.openSnackBar('No tienes los permisos para realizar esta accion', 'X', 'error');
      return;
    }
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.SpinnerService.show();
    this.api.saveInicioCajaMonedas(this.caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            location.reload();
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

  saveMonedas(): void{
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.SpinnerService.show();
    this.api.saveMonedas(this.caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            location.reload();
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

  getTipoVentaList(): void {
    this.tipoVentaList = [
      { value: 'Venta', viewValue: 'Venta' },
      { value: 'Reserva', viewValue: 'Reserva' },
      { value: 'Garantia', viewValue: 'Garantia' },
    ];
  }

  getTipoPagoList(): void {
    this.tipoPagoList = [
      { value: 1, description: 'Tarjeta' },
      { value: 2, description: 'Efectivo' },
      { value: 3, description: 'QR o Transferencias' },
      { value: 4, description: 'Pago en linea retira en sucursal' },
    ];
  }

  getPostList(): void {
    this.tipoPostList = [
      { value: 1, description: 'Agricola' },
      { value: 2, description: 'Credomatic' },
      { value: 3, description: 'Davivienda' },
      { value: 4, description: 'Cuscatlan' },
    ];
  }

  getComprobanteList(): void {
    this.comprobantesList = [
      { value: 1, description: 'Factura' },
      { value: 2, description: 'Sin Recibo' },
      { value: 3, description: 'Recibo' },
    ];
  }

  activeCuponDiv(): void {
    this.cuponActive = true;
  }

  getDescuentoCupon(): void {
    this.SpinnerService.show();
    this.cuponFind.cupon = this.codigoCupon;
    let categorias = '';
    this.productAddCarList.forEach((value, index) => {
      if (value.nombre !== 'totalAllProduct') {
        categorias += value.categoria + ',';
      }
    });
    this.cuponFind.categoria = categorias;
    const myDate = new Date();
    this.cuponFind.fechavalido = this.datePipe.transform(
      myDate,
      'yyyy/MM/dd hh:mm:ss'
    );

    this.api.findCuponByCodigoAndDate(this.cuponFind).subscribe(
      (response) => {
        if (response != null) {
          console.log(response);
          if (response.state === 'Success') {
            this.cuponUsado = response.data;
            console.log('cupon correcto');
            this.productAddCarList.forEach((value, index) => {
              if (value.categoria === response.data.categoria || response.data.categoria === 'TODAS') {
                value.descuento = response.data.descuento * value.cantidad;
              }
            });
            const descuentoTotal = this.productAddCarList
              .filter((item) => item.nombre !== 'totalAllProduct')
              .reduce((sum, current) => sum + current.descuento, 0);
            const itemTotales = this.productAddCarList
              .filter((item) => item.nombre === 'totalAllProduct')
              .find((i) => i);
            itemTotales.descuento = descuentoTotal;
            this.totalCompra = itemTotales.precioTotal - descuentoTotal;
            this.cuponActive = false;
            this.pagoConCupon = true;
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

  findCajaByDateAndSucursal(): void {
    this.SpinnerService.show();
    this.caja.idsucursal = this.userSesion.idsucursal;
    this.api.findCajaByDateAndSucursal(this.caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.caja = response.data;
            this.caja.monedas = this.caja.monedas;
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

  getVentasBySucursal(): void {
    this.SpinnerService.show();
    this.ventasVen.idsucursal = this.userSesion.idsucursal;
    const myDate = new Date();
    this.ventasVen.dateadd = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    this.api.getVentasBySucursal(this.ventasVen).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.ventasBySucursalList = response.data;
            this.montoTotalVentas();
            this.getComprasBySucursal();
            this.findCajaByDateAndSucursal();
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

  montoTotalVentas(): void {
    this.totalVentas = this.ventasBySucursalList
      .filter((item) => item.preciototal != null)
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalVentasTarjetas = this.ventasBySucursalList
      .filter((item) => item.preciototal != null && item.tipopago === 'Tarjeta')
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalAgricola = this.ventasBySucursalList
      .filter(
        (item) =>
          item.preciototal != null &&
          item.tipopago === 'Tarjeta' &&
          item.post === 'Agricola'
      )
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalCuscatlan = this.ventasBySucursalList
      .filter(
        (item) =>
          item.preciototal != null &&
          item.tipopago === 'Tarjeta' &&
          item.post === 'Cuscatlan'
      )
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalDavi = this.ventasBySucursalList
      .filter(
        (item) =>
          item.preciototal != null &&
          item.tipopago === 'Tarjeta' &&
          item.post === 'Davivienda'
      )
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalCredo = this.ventasBySucursalList
      .filter(
        (item) =>
          item.preciototal != null &&
          item.tipopago === 'Tarjeta' &&
          item.post === 'Credomatic'
      )
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalEfectivoEntregar = this.ventasBySucursalList
      .filter((item) => item.preciototal != null && item.tipopago === 'Efectivo')
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalEfectivo = this.ventasBySucursalList
      .filter((item) => item.preciototal != null && item.tipopago === 'Efectivo')
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalQR = this.ventasBySucursalList
      .filter(
        (item) =>
          item.preciototal != null && item.tipopago === 'QR o Transferencias'
      )
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalPagoOnLine = this.ventasBySucursalList
      .filter(
        (item) =>
          item.preciototal != null &&
          item.tipopago === 'Pago en linea retira en sucursal'
      )
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.totalReserva = this.ventasBySucursalList
      .filter((item) => item.preciototal != null && item.tipoventa === 'Reserva')
      .reduce((sum, current) => sum + current.preciototal, 0);

    this.ventaTotalSucursal = this.totalVentas - this.totalPagoOnLine;
  }

  getComprasBySucursal(): void {
    this.SpinnerService.show();
    const compraId = new compra();
    compraId.idsucursal = this.userSesion.idsucursal;
    this.api.getListComprasBySucursal(compraId).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.comprasBySucursalList = response.data;
            this.montoTotalCompras();
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

  montoTotalCompras(): void {
    this.totalComprasSucursal = this.comprasBySucursalList
      .filter((item) => item.total != null)
      .reduce((sum, current) => sum + current.total, 0);
    this.totalEfectivoEntregar =
      this.totalEfectivoEntregar - this.totalComprasSucursal;
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
      }
    );
  }

  getProductsBySucursal(): void {
    this.SpinnerService.show();
    this.product = new producto();
    this.product.idsucursal = this.selectedSucursal;
    this.api.getProductsBySucursal(this.product).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.productBySucursalList = response.data;
            this.options = response.data.map((a) => a.nombre);
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter(value))
            );
            this.optionsSerie = response.data.map((s) => s.serie);
            this.filteredSeriesOptions = this.myControlSerie.valueChanges.pipe(
              startWith(''),
              map((values) => this._filterSerie(values))
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
      }
    );
  }

  getUserList(): void {
    this.SpinnerService.show();
    this.api.getUsersListBySucursal(this.userSesion.idsucursal).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.usersList = response.data;
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

  deleteProductSerie(): void {
    if (this.productSell != null) {
      this.productSell.serie = '';
    }
  }

  fillDataProduct(): void {
    this.deleteProductSerie();
    this.tipoPagoVenta = '';

    Object.keys(this.addProductCarForm.controls).forEach((key) => {
      this.addProductCarForm.get(key).setErrors(null);
    });

    if (this.productSell.nombre === undefined || this.productSell.nombre === ''){
      return;
    }

    this.SpinnerService.show();

    this.productSell.idsucursal = this.userSesion.idsucursal;
    this.api.findProductByNameAndSucursalAndCode(this.productSell).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            if (response.data != null) {
              this.productSell = response.data;
              if (response.data.existencia > 0) {
                response.data.cantidad = 1;
                this.tipoPagoVenta = 'Efectivo';
              }
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
      }
    );
  }

  fillDataProductSerie(): void{
    this.deleteProductName();
    this.tipoPagoVenta = '';

    Object.keys(this.addProductCarForm.controls).forEach((key) => {
      this.addProductCarForm.get(key).setErrors(null);
    });

    if (this.productSell.serie === undefined || this.productSell.serie === ''){
      return;
    }

    this.SpinnerService.show();

    this.productSell.idsucursal = this.userSesion.idsucursal;
    this.api.findProductByNameAndSucursalAndCode(this.productSell).subscribe(
      (response) => {
        console.log(response);
        if (response != null) {
          if (response.state === 'Success') {
            if (response.data != null) {
              this.productSell = response.data;
              if (response.data.existencia > 0) {
                response.data.cantidad = 1;
                this.tipoPagoVenta = 'Efectivo';
              }
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
      }
    );
  }

  deleteProductName(): void {
    if (this.productSell != null) {
      this.productSell.nombre = '';
    }
  }

  fillDataProduct2(): void {
    this.tipoPagoVenta = '';

    Object.keys(this.addProductCarForm.controls).forEach((key) => {
      this.addProductCarForm.get(key).setErrors(null);
    });

    this.SpinnerService.show();

    this.productSell.idsucursal = this.userSesion.idsucursal;
    this.api.findProductByNameAndSucursalAndCode(this.productSell).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            if (response.data != null) {
              this.productSell = response.data;
              if (response.data.existencia > 0) {
                response.data.cantidad = 1;
                this.tipoPagoVenta = 'Efectivo';
              }
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
      }
    );
  }

  calcularTotalProd(): void {
    if (!this.esOferta) {
      this.productSell.precioTotal =
        this.productSell.cantidad * this.productSell.precioregular;
    } else {
      this.productSell.precioTotal =
        this.productSell.cantidad * this.productSell.preciooferta;
    }
  }

  agregarProducto(): void {
    if (this.addProductCarForm.valid) {
      if (this.productSell.nombre == null) {
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      } else if (this.productSell.nombre === undefined) {
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      } else if (this.productSell.nombre === '') {
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      } else if (
        this.productSell.cantidad == null ||
        this.productSell.cantidad === undefined
      ) {
        this.api.openSnackBar('Ingresa los campos requeridos', 'X', 'error');
      } else if (this.productSell.cantidad === 0) {
        this.api.openSnackBar(
          'Ingresa la cantidad de producto a vender',
          'X',
          'error'
        );
        return;
      } else if (this.productSell.cantidad > this.productSell.existencia) {
        this.api.openSnackBar(
          this.productSell.nombre + ' no tiene suficientes existencias',
          'X',
          'error'
        );
        return;
      } else {
        const productAddCar = new productoCar(
          this.productSell.idprodinv,
          this.productSell.categoria,
          this.productSell.dateadd,
          this.productSell.datemod,
          this.productSell.estado,
          this.productSell.existencia,
          this.productSell.idsucursal,
          this.productSell.iduseradd,
          this.productSell.idusermod,
          this.productSell.nombre,
          this.productSell.preciocosto,
          this.productSell.preciooferta,
          this.productSell.precioregular,
          this.productSell.serie,
          this.productSell.cantidad,
          this.productSell.precioTotal,
          0
        );
        this.productAddCarList.push(productAddCar);
        const indexTotal = this.findTotalAllProduct('totalAllProduct');
        this.addItemTotalProducts(indexTotal);
        this.dataSource = new MatTableDataSource(this.productAddCarList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.selectedTipoPago = this.tipoPagoVenta;
        this.namePost = this.selectedPost;
        this.api.openSnackBar('Producto agregado al carrito', 'X', 'success');
        this.clearProduct();
        this.addProductCarForm.reset();
        this.itemsInCar = this.productAddCarList.length - 1;
        Object.keys(this.addProductCarForm.controls).forEach((key) => {
          this.addProductCarForm.get(key).setErrors(null);
        });
      }
    } else {
      this.api.openSnackBar('Todos los campos son requeridos', 'X', 'error');
    }
  }

  deleteProductCar(item: any): void {
    const index = this.productAddCarList.findIndex(
      (i) => i.idprodinv === item.idprodinv
    );
    this.productAddCarList.splice(index, 1);
    const indexTotal = this.findTotalAllProduct('totalAllProduct');
    this.addItemTotalProducts(indexTotal);
    this.dataSource = new MatTableDataSource(this.productAddCarList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.api.openSnackBar('Producto eliminado del carrito', 'X', 'success');
    this.itemsInCar = this.productAddCarList.length - 1;
  }

  findTotalAllProduct(name: any): number {
    return this.productAddCarList.findIndex((i) => i.nombre === name);
  }

  addItemTotalProducts(index: any): void {
    if (index !== -1) {
      this.productAddCarList.splice(index, 1);
    }
    const sum = this.productAddCarList
      .filter((item) => item.nombre !== 'totalAllProduct')
      .reduce((suma, current) => suma + current.precioTotal, 0);
    const sumDes = this.productAddCarList
      .filter((item) => item.nombre !== 'totalAllProduct')
      .reduce((suma, current) => suma + current.descuento, 0);
    this.totalCompra = sum - sumDes;
    const itemTotal = new productoCar(
      0,
      '',
      '',
      '',
      '',
      0,
      0,
      0,
      0,
      'totalAllProduct',
      0,
      0,
      0,
      '',
      0,
      sum,
      sumDes
    );
    this.productAddCarList.push(itemTotal);
  }

  private _filter(value: string): string[] {
    const name = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(name));
  }

  private _filterSerie(valuese: string): string[] {
    if (valuese != null) {
      const nameSerie = valuese.toLowerCase();
      return this.optionsSerie.filter((optionS) =>
        optionS.toLowerCase().includes(nameSerie)
      );
    }
  }

  clearProduct(): void {
    this.productSell.idprodinv = null;
    this.productSell.categoria = '';
    this.productSell.dateadd = '';
    this.productSell.datemod = '';
    this.productSell.estado = '';
    this.productSell.existencia = null;
    this.productSell.idsucursal = null;
    this.productSell.iduseradd = null;
    this.productSell.idusermod = null;
    this.productSell.nombre = '';
    this.productSell.preciocosto = null;
    this.productSell.preciooferta = null;
    this.productSell.precioregular = null;
    this.productSell.serie = '';
    this.productSell.cantidad = null;
    this.productSell.precioTotal = null;
  }

  realizarVenta(): void {
    this.noInProgres = false;
    if (this.payProductCarForm.valid) {
      if (this.selectedTipoPago === 'Tarjeta') {
        if (
          this.namePost == null ||
          this.namePost === undefined ||
          this.namePost === ''
        ) {
          this.api.openSnackBar('Seleccione el post', 'X', 'error');
          this.noInProgres = true;
          return;
        }
      }
      if (
        this.selectedComprobante === 'Factura'
      ) {
        if (
          this.numberFactura == null ||
          this.numberFactura === undefined ||
          this.numberFactura === ''
        ) {
          this.api.openSnackBar(
            'Ingrese el numero de la factura',
            'X',
            'error'
          );
          this.noInProgres = true;
          return;
        }
      }
      if (
        this.selectedComprobante === 'Recibo'
      ) {
        if (
          this.numberRecibo == null ||
          this.numberRecibo === undefined ||
          this.numberRecibo === ''
        ) {
          this.api.openSnackBar(
            'Ingrese el numero del recibo',
            'X',
            'error'
          );
          this.noInProgres = true;
          return;
        }
      }
      if (
        this.selectedComprobante === 'Factura'
      ) {
        this.numberRecibo = '';
      }
      if (
        this.selectedComprobante === 'Recibo'
      ) {
        this.numberFactura = '';
      }
      if (
        this.selectedComprobante === 'Sin Recibo'
      ) {
        this.numberFactura = '';
        this.numberRecibo = '';
      }

      this.SpinnerService.show();
      this.ventaList = [];
      this.productSell.idsucursal = this.userSesion.idsucursal;
      const iduseradd = this.selectedVendedor;
      this.productAddCarList.forEach((ventaObj) => {
        if (ventaObj.nombre !== 'totalAllProduct') {
          this.ventaCar = new venta();
          this.ventaCar.tipopago = this.selectedTipoPago;
          this.ventaCar.tipoventa = this.selectedtipoVenta;
          this.ventaCar.estadoreserva = this.selectedtipoVenta;
          this.ventaCar.post = this.namePost;
          this.ventaCar.factura = this.numberFactura;
          this.ventaCar.recibo = this.numberRecibo;
          this.ventaCar.idproducto = ventaObj.idprodinv;
          this.ventaCar.categoria = ventaObj.categoria;
          this.ventaCar.nombreproducto = ventaObj.nombre;
          this.ventaCar.cantidad = ventaObj.cantidad;
          this.ventaCar.preciounitario = ventaObj.precioregular;
          this.ventaCar.preciototal = ventaObj.precioTotal - ventaObj.descuento;
          this.ventaCar.descuento = ventaObj.descuento;
          this.ventaCar.idsucursal = ventaObj.idsucursal;
          this.ventaCar.iduseradd = iduseradd;
          this.ventaCar.idusermod = 0;
          this.ventaCar.serie = ventaObj.serie;
          this.ventaList.push(this.ventaCar);
        }
      });
      this.esperando = 'Si';
      this.api.createVenta(this.ventaList).subscribe(
        (response) => {
          this.esperando = 'No';
          if (response != null) {
            if (response.state === 'Success') {
              this.caja.idsucursal = this.userSesion.idsucursal;
              // this.calcularCierreCaja(this.caja);
              this.modifyCupon();
              location.reload();
              // window.location.reload();
              this.api.openSnackBar(
                'Venta realizada exitosamente',
                'X',
                'success'
              );
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
            this.noInProgres = true;
          } else {
            this.noInProgres = true;
            this.api.openSnackBar(response.message, 'X', 'error');
          }
          this.noInProgres = true;
          this.SpinnerService.hide();
        },
        (error) => {
          this.noInProgres = true;
          this.esperando = 'No';
          this.SpinnerService.hide();
        }
      );
    } else {
      this.noInProgres = true;
      $('#vendedorSelect').trigger('focus');
      $('#tipoVentaSelect').trigger('focus');
      $('#vendedorSelect').trigger('focusout');
      $('#vendedorSelect').trigger('blur');
      $('#tipoPagoSelect').trigger('focus');
      $('#tipoPagoSelect').trigger('focusout');
      $('#tipoPagoSelect').trigger('blur');
      $('#comprobanteSelect').trigger('focus');
      $('#comprobanteSelect').trigger('focusout');
      $('#comprobanteSelect').trigger('blur');
    }
  }

  modifyCupon(): void{
    if (this.pagoConCupon){
      this.cuponUsado.numerouso = this.cuponUsado.numerouso + 1;
      this.SpinnerService.show();
      this.api.modifyCupon(this.cuponUsado).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            location.reload();
            // window.location.reload();
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

  calcularCierreCaja(caja: cajaInv): void {
    this.SpinnerService.show();
    this.api.calcularCierreCaja(caja).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            location.reload();
            // window.location.reload();
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

  getPrecioByTipoPago(event): void {
    if (event === 'Tarjeta') {
      this.esOferta = false;
    } else if (
      event != null &&
      event !== undefined &&
      event !== '' &&
      event !== 'Tarjeta'
    ) {
      this.esOferta = true;
    }
    this.calcularTotalProd();
  }
}