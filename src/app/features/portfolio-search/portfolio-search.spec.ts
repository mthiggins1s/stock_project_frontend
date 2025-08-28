import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSearch } from './portfolio-search';

describe('PortfolioSearch', () => {
  let component: PortfolioSearch;
  let fixture: ComponentFixture<PortfolioSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
