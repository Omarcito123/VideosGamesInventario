import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPedidoSucursalComponent } from './ver-pedido-sucursal.component';

describe('VerPedidoSucursalComponent', () => {
  let component: VerPedidoSucursalComponent;
  let fixture: ComponentFixture<VerPedidoSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerPedidoSucursalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerPedidoSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
