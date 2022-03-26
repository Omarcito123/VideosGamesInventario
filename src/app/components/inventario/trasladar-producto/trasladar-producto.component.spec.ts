import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasladarProductoComponent } from './trasladar-producto.component';

describe('TrasladarProductoComponent', () => {
  let component: TrasladarProductoComponent;
  let fixture: ComponentFixture<TrasladarProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrasladarProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasladarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
