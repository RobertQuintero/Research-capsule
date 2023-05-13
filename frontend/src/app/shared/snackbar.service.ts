import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }

  success(message: string, duration?: number){
    this._snackBar.open(message, '', {
      duration: duration || 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [
        'snack-success'
      ]
    });
  }

  info(message: string, duration?: number){
    this._snackBar.open(message, 'Close', {
      duration: duration || 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [
        'snack-info'
      ]
    });
  }

  error(message: string, duration?: number) {
    this._snackBar.open(message, 'Close', {
      duration: duration || 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [
        'snack-warn'
      ]
    });
  }

}
