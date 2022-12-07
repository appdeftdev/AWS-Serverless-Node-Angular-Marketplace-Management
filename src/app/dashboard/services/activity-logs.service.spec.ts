import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { ActivityLogsServices } from './activity-logs.service';

describe('ActivityLogsServices', () => {
  let service: ActivityLogsServices;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ActivityLogsServices,
      ],
    });
    service = TestBed.inject(ActivityLogsServices);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
