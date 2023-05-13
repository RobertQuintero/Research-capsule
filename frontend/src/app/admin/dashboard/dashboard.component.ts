import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { ICapsule } from 'src/app/capsule/icapsule';
import { IReview } from 'src/app/faculty/ireview';
import { IUser, IUser2 } from 'src/app/user/iuser';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { DateService } from 'src/app/shared/date.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { CapsuleService } from 'src/app/capsule/capsule.service';
import { MyErrorStateMatcher } from 'src/app/authenticate/ErrorStateMatcher';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  capsules!: ICapsule[];
  reviews!: IReview[];
  users!: IUser2[];
  assigned!: number;
  unassigned!: number;
  underRevision!: number;
  completed!: number;
  topFiveReviewers!: IUser2[];
  sortedCapsules!: any;
  capsulesWithAvgGrade!: any;
  topFiveCapsules!: ICapsule[];
  capsulesWithGrades!: any;


  displayedColumns: string[] = ['id', 'title', 'by', 'submittedDate', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;
  capsuleDetails!: ICapsule
  capsuleToReviewId!: number | undefined
  viewModalShow: boolean = false
  assignModalShow: boolean = false
  assignForm!: FormGroup
  availableReviewers!: IUser[];
  reviewerFormControl!: FormControl
  matcher!: any
  shouldAssign!: boolean

  //charts
  pieData: any;
  pieOptions: any;
  //chart2
  pieData2: any;
  pieOptions2: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
input: any;

  constructor(private adminService: AdminService,private capsuleService: CapsuleService,
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
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.isLoading = true;
    this.adminService.getDashboardData().subscribe(
      (response) => {
        this.capsules = response.capsules;
        this.reviews = response.reviews;
        this.users = response.users;
        this.assigned = this.capsules.filter(
          (capsule) => capsule.status === 'Assigned'
        ).length;
        this.unassigned = this.capsules.filter(
          (capsule) => capsule.status === 'Unassigned'
        ).length;
        this.underRevision = this.capsules.filter(
          (capsule) => capsule.status === 'Under Revision'
        ).length;
        this.completed = this.capsules.filter(
          (capsule) => capsule.status === 'Completed'
        ).length;

        this.topFiveReviewers = this.users
          .sort((a, b) => b.reviews.length - a.reviews.length)
          .slice(0, 5);
        console.log(this.topFiveReviewers);
        // Create the data object for the chart
        this.pieData = {
          labels: this.topFiveReviewers.map((user) => `${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1)} ${user.lastName.charAt(0).toUpperCase()}${user.lastName.slice(1)}`),
          datasets: [
            {
              data: this.topFiveReviewers.map((user) => user.reviews.length),
              borderWidth: 1,
              pointStyle: 'rectRot',
              pointRadius: 5,
              pointBorderColor: 'rgb(0, 0, 0)',
              backgroundColor: [
                'rgba(52, 152, 219, 0.6)', // blue
                'rgba(244, 208, 63, 0.6)', // yellow
                'rgba(46, 204, 113, 0.6)', // green
                'rgba(231, 76, 60, 0.6)', // red
                'rgba(155, 89, 182, 0.6)', // purple
              ],
              hoverBackgroundColor: [
                'rgba(52, 152, 219, 0.8)', // blue
                'rgba(244, 208, 63, 0.8)', // yellow
                'rgba(46, 204, 113, 0.8)', // green
                'rgba(231, 76, 60, 0.8)', // red
                'rgba(155, 89, 182, 0.8)', // purple
              ],

            },
          ],
        };

        this.pieOptions = {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: 'rgb(62, 62, 62)',
                font: {
                  size: 20,
                  weight: '500',
                  transform: 'capitalize',
                  family: 'Roboto, "Helvetica Neue", sans-serif',
                },
                padding: 30,
              },
              position: 'right',
            },
          },
        };


        // end of top five reviewer pie chart

        // Filter out capsules without grades
        this.capsulesWithGrades = this.capsules.filter((capsule) =>
          capsule.reviews.some((review) => review.grade != null)
        );

        // Sort the top five capsules by grade
        this.topFiveCapsules = this.capsulesWithGrades
          .sort(
            (a: any, b: any) =>
              b.reviews.reduce(
                (acc: any, review: any) => acc + (review.grade ?? 0),
                0
              ) -
              a.reviews.reduce(
                (acc: any, review: any) => acc + (review.grade ?? 0),
                0
              )
          )
          .slice(0, 5);

        // Create the pie chart data
        this.pieData2 = {
          labels: this.topFiveCapsules.map((capsule) => capsule.title),
          datasets: [
            {
              data: this.topFiveCapsules.map((capsule) =>
                capsule.reviews.reduce(
                  (acc, review) => acc + (review.grade ?? 0),
                  0
                )
              ),
              backgroundColor: [
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--green-500'),
                documentStyle.getPropertyValue('--red-500'),
                documentStyle.getPropertyValue('--purple-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--green-400'),
                documentStyle.getPropertyValue('--red-400'),
                documentStyle.getPropertyValue('--purple-400'),
              ],
            },
          ],
        };

        // Set the pie chart options
        this.pieOptions2 = {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: 'rgb(62, 62, 62)',
                font: {
                  size: 20,
                  weight: '500',
                  transform: 'capitalize',
                  family: 'Roboto, "Helvetica Neue", sans-serif',
                },
                padding: 30,
              },
              position: 'top',
            },
          },
        };

        // console.log(this.users)

        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
    console.log(this.topFiveReviewers);
    console.log(this.topFiveCapsules);

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
