import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuantities } from './update-quantities';

describe('UpdateQuantities', () => {
  let component: UpdateQuantities;
  let fixture: ComponentFixture<UpdateQuantities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuantities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuantities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
