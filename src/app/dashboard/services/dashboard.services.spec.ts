import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { DashboardServices } from './dashboard.services';

describe('DashboardServices', () => {
  let service: DashboardServices;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        DashboardServices,
      ],
    });
    service = TestBed.inject(DashboardServices);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
