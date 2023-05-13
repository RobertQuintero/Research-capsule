import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticateService } from '../authenticate.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { MyErrorStateMatcher } from '../ErrorStateMatcher';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../authenticate.css']
})
export class ForgotPasswordComponent implements OnInit{

  forgotGroup!: FormGroup
  emailControl!: FormControl
  allFieldsFilled = false;
  matcher = new MyErrorStateMatcher();
  constructor(
    private _route: ActivatedRoute,
    private _auth : AuthenticateService,
    private _snack: SnackbarService,
  ){}

  ngOnInit(): void {
    this.matcher = new MyErrorStateMatcher()
    this.emailControl =new FormControl('', [Validators.required,Validators.email])
    this.forgotGroup = new FormGroup({
      email: this.emailControl
    })

    const emailControl = this.forgotGroup.get('email');
    if (emailControl) {
      emailControl.valueChanges.subscribe(() => {
        this.updateAllFieldsFilled();
      });
    }



  }

  submit(form: any){
    if(form && this.forgotGroup.valid){
      this._auth.sendRequest(form.email).subscribe(
        (data:any) => {
          this._snack.success(data.message)
        },
        (err) => {
          this._snack.error(err.error.message)
        }
      )
    }
    else{
      this._snack.error("Please check your email")
    }
  }
  updateAllFieldsFilled() {
    this.allFieldsFilled = this.forgotGroup.valid;
  }

}
