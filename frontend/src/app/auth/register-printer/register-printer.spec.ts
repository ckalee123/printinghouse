import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPrinter } from './register-printer';

describe('RegisterPrinter', () => {
  let component: RegisterPrinter;
  let fixture: ComponentFixture<RegisterPrinter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPrinter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPrinter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
