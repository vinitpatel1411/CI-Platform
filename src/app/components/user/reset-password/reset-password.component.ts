import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomCarouselComponent } from '../custom-carousel/custom-carousel.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { resetPasswordForm } from '../../../models/user-formType-model';
import { UserService } from '../../../services/user.service';
import { CommonFunctionService } from '../../../services/common-function.service';
import { StatusCodes } from '../../../common/constant';
import { ResetPasswordDTO } from '../../../models/user-models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    CustomCarouselComponent,
    CommonModule,
    MatIcon
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  private ngUnsubscribe = new Subject<void>();
  token: string = '';
  resetPasswordSuccess = false;
  message: string = '';
  passwordHide = true;
  confirmPasswordHide = true;

  resetPassForm: FormGroup<resetPasswordForm> =
    new FormGroup<resetPasswordForm>({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
      ]),
    });

  constructor(
    private userService: UserService,
    public commonFunctionService: CommonFunctionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  get ctrl(): resetPasswordForm {
    return this.resetPassForm.controls;
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') as string;
  }

  checkpassword() {
    if (this.ctrl.password.value != this.ctrl.confirmPassword.value) {
      this.ctrl.confirmPassword.setErrors({ invalid: true });
    }
  }

  submit = (): void => {

    this.userService.CheckPassWord(this.token, this.ctrl.password.value).subscribe((result) => {
      if (result.code === StatusCodes.Ok) {
        this.ctrl.password.setErrors({ oldpassword: true });
      }

      if (this.resetPassForm.valid) {
        let obj: ResetPasswordDTO = {
          password: this.ctrl.password.value as string,
          token: this.token,
        };
        this.userService
          .ResetPassword(obj)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result) => {
            this.message = result.messages ? result.messages[0] : this.message;
            if (result.code === StatusCodes.Ok) {
              this.resetPasswordSuccess = true;
              this.snackBar.open('Password reset Successfully', 'OK', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
              this.redirectToUrl("/");
            } else {
              this.resetPasswordSuccess = false;
              this.snackBar.open('Token is Expired! Please resend the email.', 'OK', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
            }
          });
      }
    });
  };

  redirectToUrl(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
