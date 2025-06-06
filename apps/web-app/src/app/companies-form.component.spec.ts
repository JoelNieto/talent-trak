import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesFormComponent } from './companies-form.component';

describe('CompaniesFormComponent', () => {
  let component: CompaniesFormComponent;
  let fixture: ComponentFixture<CompaniesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
