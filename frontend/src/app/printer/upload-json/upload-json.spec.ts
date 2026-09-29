import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadJson } from './upload-json';

describe('UploadJson', () => {
  let component: UploadJson;
  let fixture: ComponentFixture<UploadJson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadJson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadJson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
