import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventarioExcelComponent } from './add-inventario-excel.component';

describe('AddInventarioExcelComponent', () => {
  let component: AddInventarioExcelComponent;
  let fixture: ComponentFixture<AddInventarioExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInventarioExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventarioExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
