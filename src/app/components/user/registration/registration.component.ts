import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CustomCarouselComponent } from '../custom-carousel/custom-carousel.component';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { registrationForm } from '../../../models/user-formType-model';
import { CommonFunctionService } from '../../../services/common-function.service';
import { UserService } from '../../../services/user.service';
import { StatusCodes } from '../../../common/constant';
import { RegisterDTO } from '../../../models/user-models';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, CustomCarouselComponent,MatIcon],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  private ngUnsubscribe = new Subject<void>();
  passwordHide = true;
  confirmPasswordHide = true;

  registerForm: FormGroup<registrationForm> = new FormGroup<registrationForm>({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    phoneNumber: new FormControl("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]),
    confirmPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)])
  });

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public commonFunctionService: CommonFunctionService,
    private router: Router,
    private userservice: UserService
  ) { }

  get ctrl(): registrationForm {
    return this.registerForm.controls;
  }

  checkpassword() {
    if (this.ctrl.password.value != this.ctrl.confirmPassword.value) {
      this.ctrl.confirmPassword.setErrors({ invalid: true });
    }
  }

  submit = (): void => {
      this.userservice.IsUserExist(this.ctrl.email.value).subscribe((result) => {
      if (result.code === StatusCodes.Ok) {
        this.registerForm.controls.email.setErrors({ incorrect: true });
      }
      else{
        if (this.registerForm.valid) {
          const data: RegisterDTO = { ...this.registerForm.value } as RegisterDTO;
          this.userservice.CreateUser(data).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
            if (result.code === StatusCodes.Ok) {
              this.snackBar.open('Registration Successfull', 'OK', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
              this.redirectToUrl("/");
            }
            else {
              this.snackBar.open('Registration UnSuccessfull', 'OK', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
            }
          });
        }
      }
    });
  }

  redirectToUrl(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
