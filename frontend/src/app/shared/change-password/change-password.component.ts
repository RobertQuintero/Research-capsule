import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUserChangePassword } from 'src/app/user/iuser';
import { UserService } from 'src/app/user/user.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  isLoading!: boolean;
  changePasswordGroup!: FormGroup;
  passwordOldControl!: FormControl;
  passwordControl!: FormControl;
  passwordConfirmControl!: FormControl;

  constructor(private user: UserService,
    private _snack: SnackbarService,
    ){}

  ngOnInit(): void {

    this.passwordOldControl = new FormControl('', Validators.required);
    this.passwordControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*\\d)(?=.*[a-zA-Z])(?=.*\\W).{8,}') ]);
    this.passwordConfirmControl = new FormControl('', Validators.required);

    this.changePasswordGroup = new FormGroup({
      passwordOldControl: this.passwordOldControl,
      passwordControl: this.passwordControl,
      passwordConfirmControl: this.passwordConfirmControl
    });

  }


  updatePassword(form: any) {
    if(form && this.changePasswordGroup.valid){

      const userObject: IUserChangePassword = {
        password_old: form.passwordOldControl,
        password: form.passwordControl,
        password_confirmation: form.passwordConfirmControl
      }

      this.user.updatePassword(userObject).subscribe(
        (data: any) => {
         this._snack.success("Password changed successfully!")
        },
        (err) => {
          this._snack.error(err.error.message)
          console.log(err.error.message)
        }
      );

    }
    else{
      this._snack.error("Please check all fields")
      console.log("Please check all fields")
    }
  }

}
