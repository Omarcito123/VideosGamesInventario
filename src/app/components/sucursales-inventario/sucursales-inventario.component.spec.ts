import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesInventarioComponent } from './sucursales-inventario.component';

describe('SucursalesInventarioComponent', () => {
  let component: SucursalesInventarioComponent;
  let fixture: ComponentFixture<SucursalesInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalesInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalesInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
