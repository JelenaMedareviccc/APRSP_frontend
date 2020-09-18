import { TestBed } from '@angular/core/testing';
import {PdfMakerService} from 'pdfmake';



describe('PdfMakerService', () => {
  let service: PdfMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
