import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../ErrorStateMatcher';
import { IUserRegister } from 'src/app/user/iuser';
import { AuthenticateService } from '../authenticate.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../authenticate.css']
})
export class RegisterComponent implements OnInit {
  isLoading: boolean = false
  registerForm!: FormGroup
  firstNameFormControl!: FormControl
  lastNameFormControl!: FormControl
  emailFormControl!: FormControl
  passwordFormControl!: FormControl
  confirmPassFormControl!: FormControl
  matcher = new MyErrorStateMatcher();
  showPassword: string = 'password';
  allFieldsFilled = false;
  constructor(private authService: AuthenticateService,
    private _snack: SnackbarService,
    private route: Router){}

    ngOnInit(): void {
      this.matcher = new MyErrorStateMatcher();
      this.registerForm = new FormGroup({
        firstName: this.firstNameFormControl = new FormControl('', [Validators.required]),
        lastName: this.lastNameFormControl = new FormControl('', [Validators.required]),
        email: this.emailFormControl = new FormControl('', [Validators.required, Validators.email]),
        password: this.passwordFormControl = new FormControl('', [Validators.required,Validators.pattern('(?=.*\\d)(?=.*[a-zA-Z])(?=.*\\W).{8,}') ]),
        confirmPass: this.confirmPassFormControl = new FormControl('', [Validators.required])
      });

      // Add the code below to update the allFieldsFilled property on value changes
      const firstNameControl = this.registerForm.get('firstName');
      if (firstNameControl) {
        firstNameControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }

      const lastNameControl = this.registerForm.get('lastName');
      if (lastNameControl) {
        lastNameControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }

      const emailControl = this.registerForm.get('email');
      if (emailControl) {
        emailControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }

      const passwordControl = this.registerForm.get('password');
      if (passwordControl) {
        passwordControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }

      const confirmPassControl = this.registerForm.get('confirmPass');
      if (confirmPassControl) {
        confirmPassControl.valueChanges.subscribe(() => {
          this.updateAllFieldsFilled();
        });
      }
    }


  register(form: any) {
    this.isLoading = true
    if(this.registerForm.valid && form){
      const registerFormObject: IUserRegister = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        password_confirmation: form.confirmPass,

      }
      this.authService.register(registerFormObject).subscribe(

        (data: any) => {
          this.isLoading = false
          this._snack.success('Registered succesful!')
          this.route.navigate([''])

        },
        (err) => {
          console.log(err)
          this.isLoading = false
          this._snack.error(err.error.message);
        }
      );

    }
    else {
      this.isLoading = false
    }
  }

  toggleShowPassword(): void {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }
  get passwordValidMessage(): string {
    return this.registerForm.get('password')?.valid ? 'Password meets requirements' : '';
  }
  updateAllFieldsFilled() {
    this.allFieldsFilled = this.registerForm.valid;
  }

}
