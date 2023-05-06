import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICapsule } from 'src/app/capsule/icapsule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/authenticate/ErrorStateMatcher';
import { FacultyService } from '../faculty.service';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { UserService } from 'src/app/user/user.service';
import { IUser } from 'src/app/user/iuser';
import { IReview } from '../ireview';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DateService } from 'src/app/shared/date.service';

@Component({
  selector: 'app-assigned-research',
  templateUrl: './assigned-research.component.html',
  styleUrls: ['../faculty.component.css']
})
export class AssignedResearchComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'by', 'submittedDate', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = false
  viewModalShow: boolean = false
  reviewModalShow: boolean = false
  matcher!: MyErrorStateMatcher
  user!: IUser
  capsuleDetails!: ICapsule
  reviewForm!: FormGroup
  comment!: FormControl
  grade!: FormControl
  capsuleToEditId!: any

  constructor(private userService: UserService,
    private facultyService: FacultyService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private _snack: SnackbarService,
    private api: EnvironmentService,
    private _dateService: DateService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.matcher = new MyErrorStateMatcher()
    this.comment = new FormControl('', Validators.required)
    this.grade = new FormControl(0, Validators.required)
    this.reviewForm = this.fb.group({
      comment: this.comment,
      grade: this.grade
    })
    this.isLoading = true
    this.userService.getCurrentUser().subscribe((response) => {
      this.user = response

    }, (err) => { console.log(err) })
    this.facultyService.assignedCapsules().subscribe((response: ICapsule[]) => {
      const res = response.map((c: any) => {
        c.created_at = this._dateService.transformDate(c.created_at)
        return { ...c }
      })
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false
      console.log(response)
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
    this.reviewForm.reset()
  }

  openReviewModal(id: number) {
    this.reviewModalShow = true
    this.capsuleToEditId = id
  }

  closeReviewModal() {
    this.reviewModalShow = false
    this.capsuleToEditId = undefined
    this.reviewForm.reset()
  }
  isReviewable(row: any): boolean {
    const review: IReview = row.reviews.find((review: IReview) => { return review.user?.id === this.user.id });
    return review && !review.isReviewed && review.grade !== 0;
  }
  isUnrevisable(row: any): boolean {
    const review: IReview = row.reviews.find((review: IReview) => { return review.user?.id === this.user.id });
    return review && review.isReviewed && review.grade === 0
  }

  reviewCapsule(form: any) {

    this.isLoading = true
    const formData = new FormData()
    formData.append('grade', form.grade)
    formData.append('comment', form.comment)
    formData.append('capsule_id', this.capsuleToEditId)
    if (this.reviewForm.valid) {
      this.facultyService.reviewCapsule(formData).subscribe((response) => {
        // console.log(response)
        const res = response.map((c: any) => {
          c.created_at = this._dateService.transformDate(c.created_at)
          return { ...c }
        })
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false
        this._snack.success(`Capsule with the id of ${this.capsuleToEditId} has been reviewed successfully`)
        this.reviewModalShow = false
      }, (err) => {
        console.log(err)
        this._snack.error(err.error.message)
        this.isLoading = false
      })
    }
    else {
      this.isLoading = false
      this._snack.error('Please fill all fields')
    }

  }

  rejectCapsule(id: number) {
    this.isLoading = true
    const dataObject = {
      capsule_id: id
    }
    this.facultyService.rejectCapsule(dataObject).subscribe((response) => {
      console.log(response)
      const res = response.map((c: any) => {
        c.created_at = this._dateService.transformDate(c.created_at)
        return { ...c }
      })
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false
      this._snack.success(`Capsule with the id of ${id} has been rejected successfully`)
    }, (err) => {
      console.log(err)
      this._snack.error(err.error.message)
      this.isLoading = false
    })
  }

  unreviseCapsule(id: number) {
    this.isLoading = true
    const dataObject = {
      capsule_id: id
    }
    this.facultyService.unreviseCapsule(dataObject).subscribe((response) => {
      console.log(response)
      const res = response.map((c: any) => {
        c.created_at = this._dateService.transformDate(c.created_at)
        return { ...c }
      })
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false
      this._snack.success(`Capsule with the id of ${id} has been unrevised successfully`)
    }, (err) => {
      console.log(err)
      this._snack.error(err.error.message)
      this.isLoading = false
    })
  }

  getFileLink(path: string | undefined): SafeResourceUrl {
    const url = `${this.api.DOMAIN_URL}/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }





}
