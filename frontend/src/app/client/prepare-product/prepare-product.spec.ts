import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareProduct } from './prepare-product';

describe('PrepareProduct', () => {
  let component: PrepareProduct;
  let fixture: ComponentFixture<PrepareProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepareProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
