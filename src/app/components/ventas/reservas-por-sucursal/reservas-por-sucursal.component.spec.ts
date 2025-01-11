import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPorSucursalComponent } from './reservas-por-sucursal.component';

describe('ReservasPorSucursalComponent', () => {
  let component: ReservasPorSucursalComponent;
  let fixture: ComponentFixture<ReservasPorSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservasPorSucursalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasPorSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
