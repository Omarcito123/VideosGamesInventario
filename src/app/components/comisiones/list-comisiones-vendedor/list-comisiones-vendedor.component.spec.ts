import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComisionesVendedorComponent } from './list-comisiones-vendedor.component';

describe('ListComisionesVendedorComponent', () => {
  let component: ListComisionesVendedorComponent;
  let fixture: ComponentFixture<ListComisionesVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComisionesVendedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComisionesVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
