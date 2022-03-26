import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDetalleRepComponent } from './add-edit-detalle-rep.component';

describe('AddEditDetalleRepComponent', () => {
  let component: AddEditDetalleRepComponent;
  let fixture: ComponentFixture<AddEditDetalleRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDetalleRepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDetalleRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
