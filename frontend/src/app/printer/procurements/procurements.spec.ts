import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterProcurements } from './procurements';

describe('PrinterProcurements', () => {
  let component: PrinterProcurements;
  let fixture: ComponentFixture<PrinterProcurements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinterProcurements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterProcurements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
