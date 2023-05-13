import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../ErrorStateMatcher';
import { AuthenticateService } from '../authenticate.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';

const SECRET_KEY = '0x4AAAAAAAEjQm_SGFHipLNGc9GLcU7X3U0';

async function handlePost(request: { formData: () => any; headers: { get: (arg0: string) => any; }; }) {
  const body = await request.formData();
  // Turnstile injects a token in "cf-turnstile-response".
  const token = body.get('cf-turnstile-response');
  const ip = request.headers.get('CF-Connecting-IP');

  // Validate the token by calling the "/siteverify" API.
  let formData = new FormData();
  formData.append('secret', SECRET_KEY);
  formData.append('response', token);
  formData.append('remoteip', ip);

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    body: formData,
    method: 'POST',
  });

  const outcome = await result.json();
  if (!outcome.success) {
    return new Response('The provided Turnstile token was not valid! \n' + JSON.stringify(outcome));
  }
  // The Turnstile token was successfully validated. Proceed with your application logic.
  // Validate login, redirect user, etc.
  // For this demo, we just echo the "/siteverify" response:
  return new Response('Turnstile token successfully validated. \n' + JSON.stringify(outcome));
}

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

  constructor(
    private authService: AuthenticateService,
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

  async login(form: any) {
    if (this.loginForm.valid && form) {
      const email = form.email;
      const password = form.password;
      this.authService.login(email, password).subscribe(
        async (data: any) => {
          // Send POST request to validate Turnstile token
          const response = await fetch('/login', {
            method: 'POST',
            body: new FormData(document.forms[0])
          });
          const text = await response.text();
          console.log(text);

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
    } else {
      this._snack.error("Please check all fields!");
    }
  }
}
