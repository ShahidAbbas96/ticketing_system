import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrEditDepartmentComponent } from '../../departments/create-or-edit-department/create-or-edit-department.component';



describe('CreateOrEditDepartmentComponent', () => {
  let component: CreateOrEditDepartmentComponent;
  let fixture: ComponentFixture<CreateOrEditDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrEditDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
