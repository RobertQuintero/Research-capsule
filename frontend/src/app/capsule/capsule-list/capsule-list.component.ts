import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from 'src/app/user/iuser';
import { CapsuleService } from 'src/app/capsule/capsule.service';
import { ICapsule } from '../icapsule';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/authenticate/ErrorStateMatcher';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { DateService } from 'src/app/shared/date.service';
@Component({
  selector: 'app-capsule-list',
  templateUrl: './capsule-list.component.html',
  styleUrls: ['./capsule-list.component.css']
})
export class CapsuleListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'by', 'submittedDate', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = false
  capsuleDetails!: ICapsule
  capsuleToReviewId!: number | undefined
  viewModalShow: boolean = false
  assignModalShow: boolean = false
  assignForm!: FormGroup
  availableReviewers!: IUser[];
  reviewerFormControl!: FormControl
  matcher!: any
  shouldAssign!: boolean



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private capsuleService: CapsuleService,
    private api: EnvironmentService,
    private sanitizer: DomSanitizer,
    private _snack: SnackbarService,
    private _dateService: DateService
  ) {
    this.matcher = new MyErrorStateMatcher
    this.assignForm = new FormGroup({
      reviewer: this.reviewerFormControl = new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    //fetch capsules and put data in dataSource
    this.isLoading = true
    this.capsuleService.getCapsules().subscribe((response) => {
      console.log(response)
      const res = response.map((c: any) => {
        c.created_at = this._dateService.transformDate(c.created_at)
        return { ...c }
      })
      this.dataSource = new MatTableDataSource(res)
      this.isLoading = false
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log(response)
    }, (err) => {
      console.log(err)
      this.isLoading = false
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openViewModal(capsuleData: ICapsule) {
    this.viewModalShow = true
    this.capsuleDetails = capsuleData

  }
  closeViewModal() {
    this.viewModalShow = false
  }

  openAssignModal(id: number) {
    // assign faculty to review capsule
    this.assignModalShow = true
    this.isLoading = true
    this.capsuleToReviewId = id
    this.capsuleService.getAvailableReviewers(id).subscribe((response) => {
      this.availableReviewers = response
      console.log(this.availableReviewers)
      this.isLoading = false
    }, (err) => {
      this.isLoading = false
      console.log(err)
    })
  }

  closeAssignModal() {
    this.capsuleToReviewId = undefined
    this.assignModalShow = false
    this.assignForm.reset()
  }

  assignReviewer(form: any) {
    this.isLoading = true
    const assignObject = {
      capsule_id: this.capsuleToReviewId as number,
      user_id: form.reviewer as number
    }

    this.capsuleService.assignReviewer(assignObject).subscribe((response) => {
      console.log(response)
      const res = response.data.map((c: any) => {
        c.created_at = this._dateService.transformDate(c.created_at)
        return { ...c }
      })
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._snack.success("Successfully assigned!")
      this.isLoading = false
      this.closeAssignModal()
    }, (err) => {
      this.isLoading = false
      this._snack.error(err.error.message);
    })

  }

  ifMax(row: any): boolean {
    if (row.reviews.length >= 3) return true
    else {
      return false
    }
  }

  max() {
    this._snack.error("The capsule is already being reviewed by three faculty members");
  }
  getFileLink(path: string | undefined): SafeResourceUrl {
    const url = `${this.api.DOMAIN_URL}/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
