import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from 'src/app/user/iuser';
import { UserService } from 'src/app/user/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/authenticate/ErrorStateMatcher';
import { AdminService } from '../admin.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { DateService } from 'src/app/shared/date.service';
import { ToastService } from 'src/app/shared/toast.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-registered-faculty',
  templateUrl: './registered-faculty.component.html',
  styleUrls: ['./registered-faculty.component.css']
})
export class RegisteredFacultyComponent implements OnInit {
  displayedColumns: string[] = ['id', 'Fullname', 'created_at', 'capsub', 'asscap', 'actions'];
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = false
  editModal: boolean = false
  editForm!: FormGroup
  firstNameFormControl!: FormControl
  lastNameFormControl!: FormControl
  emailFormControl!: FormControl
  matcher!: any
  currentFaculty!: number | undefined
  deleteFacId!: any
  deleteModal: boolean = false



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private userService: UserService,
    private route: Router,
    private adminService: AdminService,
    private _snack: SnackbarService,
    private api: EnvironmentService,
    private sanitizer: DomSanitizer,
    private _dateService: DateService,
    private _toast: ToastService,

  ) {
    this.matcher = new MyErrorStateMatcher()
    this.editForm = new FormGroup({
      firstName: this.firstNameFormControl = new FormControl('', [Validators.required]),
      lastName: this.lastNameFormControl = new FormControl('', [Validators.required]),
      email: this.emailFormControl = new FormControl('', [Validators.required])
    })
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getApprovedFaculty().subscribe((response: any) => {
      console.log(response);
      this.isLoading = false;
      const res = response.map((f: any) => {
        f.created_at = this._dateService.transformDate(f.created_at)
        return { ...f }
      })
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
      console.log(err);
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(data: { id: number, firstName: string, lastName: string, email: string, duration: string, delay: string }) {
    const { id, firstName, lastName, email, duration, delay } = data;
    if (id) this.editModal = true
    this.currentFaculty = id
    this.firstNameFormControl.setValue(firstName);
    this.lastNameFormControl.setValue(lastName);
    this.emailFormControl.setValue(email);
  }
  closeModal() {
    this.editModal = false;
    this.currentFaculty = undefined;
    this.editForm.reset();
  }

  editFaculty(form: any) {
    this.isLoading = true
    if (this.editForm.valid && form) {
      const facultyObject: IUser = {
        id: this.currentFaculty,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      }
      this.adminService.editFaculty(facultyObject).subscribe((response) => {
        console.log(response)
        this.closeModal()
        this._snack.success('Faculty saved!')
        const res = response.map((f: any) => {
          f.created_at = this._dateService.transformDate(f.created_at)
          return { ...f }
        })
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false
      }, (err) => {
        this._snack.error(err.error.message);
        this.isLoading = false
        console.log(err)
      })
    }
    else {
      this.isLoading = false
    }
  }

  openDeleteModal(id: number) {
    this.deleteModal = true
    this.deleteFacId = id
  }

  closeDeleteModal() {
    this.deleteModal = false
    this.deleteFacId = undefined
  }

  destroyFaculty(id: number) {
    this.isLoading = true
    this.adminService.destroyFaculty(id).subscribe((response) => {
      const res = response.map((f: any) => {
        f.created_at = this._dateService.transformDate(f.created_at)
        return { ...f }
      })
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._snack.success("Faculty removed!")
      console.log(response)
      this.isLoading = false
      this.closeDeleteModal()
    }, (err) => {
      this.isLoading = false
      this._snack.error(err.error.message)
      console.log(err)
      this.closeDeleteModal()
    })
  }

  // accept(id: number) {
  //   this.isLoading = true
  //   this.userService.approveFaculty(id).subscribe((response: any) => {
  //     this.dataSource = new MatTableDataSource(response.faculties)
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.isLoading = false
  //     this.toast.success(response.message)
  //     console.log(response)
  //   }, (err) => {
  //     console.log(err)
  //     this.isLoading = false
  //   })
  // }

  // reject(id: number) {
  //   this.isLoading = true
  //   this.userService.rejectFaculty(id).subscribe((response: any) => {
  //     this.dataSource = new MatTableDataSource(response.faculties)
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.isLoading = false
  //     this.toast.success(response.message)
  //     console.log(response)
  //   }, (err) => {
  //     console.log(err)
  //     this.isLoading = false
  //   })
  // }
  getFileLink(path: string | undefined): SafeResourceUrl {
    const url = `${this.api.DOMAIN_URL}/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
