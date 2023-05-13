import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    iconColor: 'white',
    timer: 3000,
    customClass: {
      popup: 'colored-toast'
    },
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  errorToastMessage(message: string) {
    this.Toast.fire({
      icon: 'error',
      title: message,
    })
  }

  infoToastMessage(message: string) {
    this.Toast.fire({
      icon: 'info',
      title: message,
    })
  }
  successToastMessage(message: string) {
    this.Toast.fire({
      icon: 'success',
      title: message,
    })
  }
  errorModalMessage(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }
  infoModalMessage(title: string, message: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
    });
  }
  successModalMessage(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
    });
  }

  confirmModalMessage(title: string, message: string, onConfirm: Function) {
    let result: boolean
    Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      showConfirmButton: true,

    }).then((data) => {
      if (data.isConfirmed) {
        onConfirm();
        return true
      }
      result = false
      return false;
    })
  }
}
