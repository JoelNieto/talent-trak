import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserChargesComponent } from './user-charges.component';

describe('UserChargesComponent', () => {
  let component: UserChargesComponent;
  let fixture: ComponentFixture<UserChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChargesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
