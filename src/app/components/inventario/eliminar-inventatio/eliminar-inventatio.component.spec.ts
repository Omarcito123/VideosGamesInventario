import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarInventatioComponent } from './eliminar-inventatio.component';

describe('EliminarInventatioComponent', () => {
  let component: EliminarInventatioComponent;
  let fixture: ComponentFixture<EliminarInventatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarInventatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarInventatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
