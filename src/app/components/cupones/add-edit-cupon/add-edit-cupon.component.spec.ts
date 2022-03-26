import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCuponComponent } from './add-edit-cupon.component';

describe('AddEditCuponComponent', () => {
  let component: AddEditCuponComponent;
  let fixture: ComponentFixture<AddEditCuponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCuponComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCuponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
