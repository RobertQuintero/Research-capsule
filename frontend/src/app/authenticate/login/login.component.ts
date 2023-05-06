import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../ErrorStateMatcher';
import { AuthenticateService } from '../authenticate.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../authenticate.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailFormControl!: FormControl;
  passwordFormControl!: FormControl;
  token!: string;
  hide = true;
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthenticateService,
  private route: Router,
  private _snack: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.matcher = new MyErrorStateMatcher()
    this.loginForm = new FormGroup({
      email: this.emailFormControl = new FormControl('', [Validators.required, Validators.email]),
      password: this.passwordFormControl = new FormControl('', [Validators.required])
    });
  }

  login(form: any) {

    if (this.loginForm.valid && form) {
      const email = form.email;
      const password = form.password;
      this.authService.login(email, password).subscribe(
        (data: any) => {

          this._snack.success('Successfully logged in!')
          this.token = data.access_token;
          localStorage.setItem('access_token', JSON.stringify(this.token));

          if(data.level == 0){
            this.route.navigate(['/admin/dashboard']);
          }
          else {
            this.route.navigate(['/faculty/submitted-research']);
          }
        },
        (err) => {
          console.log(err)
          this._snack.error(err.error.message)
        },
        () => {
        }
      );
    }
    else {
      this._snack.error("Please check all fields!");
    }
  }


}
