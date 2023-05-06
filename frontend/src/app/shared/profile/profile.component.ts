import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/authenticate/ErrorStateMatcher';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { IUser } from 'src/app/user/iuser';
import { UserService } from 'src/app/user/user.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  currentUser!: IUser;

  userDetailsForm!: FormGroup;
  email!: FormControl;
  firstName!: FormControl;
  lastName!: FormControl;

  imagePreview!: string;
  photoError!: string;
  isFormDirty = false;


  matcher = new MyErrorStateMatcher();

  constructor(private aRoute: ActivatedRoute,
    private userService: UserService,
    private _snack: SnackbarService,
    private api: EnvironmentService) { }
  ngOnInit(): void {
    this.matcher = new MyErrorStateMatcher()
    this.currentUser = this.aRoute.snapshot.data['userResolve'];

    this.email = new FormControl(this.currentUser.email, [Validators.required, Validators.email])
    this.firstName = new FormControl(this.currentUser.firstName, [Validators.required])
    this.lastName = new FormControl(this.currentUser.lastName, [Validators.required])

    this.userDetailsForm = new FormGroup({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    });

  }
  update(form: any) {
    if (this.userDetailsForm.valid && form) {
      const sameData = this.currentUser.email == form.email && this.currentUser.firstName == form.firstName && this.currentUser.lastName == form.lastName
      if (sameData) {
      this._snack.info('You have changed nothing on your details');
      }
      else {
        const userDetails: IUser = {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
        }
        this.isLoading = true;
        this.userService.updateUserDetails(userDetails).subscribe(
          (data: any) => {
            this.isLoading = false;
            this.currentUser = userDetails;
           this._snack.success(data.message);
          },
          (err) => {
            this.isLoading = false;
          this._snack.error(err.error.message);
          }
        );
      }
    }
    else {
     this._snack.error('Something went wrong');
    }
  }

  updateProfilePhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.photoError = "File is not an image file"
        return
      }
      if (file.size > 2000000) {
        this.photoError = "File must be less than 2MB"
        return
      }
    }
    this.photoError = '';
    let formArray = new FormData();
    formArray.append('photo', file);
    this.isLoading = true;
    this.userService.updatePhoto(formArray).subscribe(
      (data: any) => {
        this.isLoading = false;
        this._snack.success(data.message)
        this.currentUser.photo = data.imageUrl;
      },
      (err) => {
        this.isLoading = false;
        this._snack.error(err.error.message);
      }
    );

  }

  getPhoto() {
    return `${this.api.DOMAIN_URL}/${this.currentUser.photo}`;
  }

  discardChanges() {
    this.email.setValue(this.currentUser.email);
    this.firstName.setValue(this.currentUser.firstName);
    this.lastName.setValue(this.currentUser.lastName);
    this.isFormDirty = false;
  }
}
