import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProcurements } from './procurements';

describe('ClientProcurements', () => {
  let component: ClientProcurements;
  let fixture: ComponentFixture<ClientProcurements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProcurements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProcurements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
