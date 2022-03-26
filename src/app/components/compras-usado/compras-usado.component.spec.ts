import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasUsadoComponent } from './compras-usado.component';

describe('ComprasUsadoComponent', () => {
  let component: ComprasUsadoComponent;
  let fixture: ComponentFixture<ComprasUsadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprasUsadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasUsadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
