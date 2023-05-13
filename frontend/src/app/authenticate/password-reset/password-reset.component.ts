import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ToastService } from 'src/app/shared/toast.service';
import { UserService } from 'src/app/user/user.service';
import { AuthenticateService } from '../authenticate.service';
import { MyErrorStateMatcher } from '../ErrorStateMatcher';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['../authenticate.css']
})
export class PasswordResetComponent implements OnInit{
  token!: string;

  resetPasswordForm!: FormGroup;
  passwordFormControl!: FormControl;
  confirmPasswordFormControl!: FormControl;
  allFieldsFilled = false;
  showPassword: string = 'password';
  matcher = new MyErrorStateMatcher();

  constructor(
    private _aRoute: ActivatedRoute,
    private _auth : AuthenticateService,
    private _router: Router,
    private _snack: SnackbarService
  ){}

  ngOnInit(): void {
      this.matcher = new MyErrorStateMatcher();
      this.token = String(this._aRoute.snapshot.paramMap.get('token'));

      //check token
      this._auth.checkToken(this.token).subscribe(
        (data:any) => {
          console.log(data.message)
        },
        (err) => {
          console.log(err.error.message)
          this._router.navigate(['/']);
          this._snack.error(err.error.message);
        }
      );


        this.resetPasswordForm = new FormGroup({
          // passwordControl : new FormControl('', Validators.required),
          // confirmPasswordControl : new FormControl('', Validators.required),
          passwordControl: this.passwordFormControl = new FormControl('', [Validators.required,Validators.pattern('(?=.*\\d)(?=.*[a-zA-Z])(?=.*\\W).{8,}') ]),
          confirmPasswordControl: this.confirmPasswordFormControl = new FormControl('', [Validators.required])
        });

        const passwordControl = this.resetPasswordForm.get('passwordControl');
      if (passwordControl) {
        passwordControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }

      const confirmPassControl = this.resetPasswordForm.get('confirmPasswordControl');
      if (confirmPassControl) {
        confirmPassControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }

  }

  submit(form: any){
    if(form && this.resetPasswordForm.valid){
      this._auth.submitResetPassword(
        {
          password: form.passwordControl,
          password_confirmation: form.confirmPasswordControl
        },
        this.token
      ).subscribe(
        (data: any) => {
          this._snack.success("Password reset successful");
          this._router.navigate(['/']);
        },
        (err) => {
          console.log(err)
          this._snack.error(err.error.message);
        }
      )
    }
    else {
      this._snack.error("Please check all fields")
    }
  }

  toggleShowPassword(): void {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }
  get passwordValidMessage(): string {
    return this.resetPasswordForm.get('passwordControl')?.valid ? 'Password meets requirements' : '';
  }
  updateAllFieldsFilled() {
    this.allFieldsFilled = this.resetPasswordForm.valid;
  }
}
