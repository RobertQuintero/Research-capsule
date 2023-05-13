import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from 'src/app/user/iuser';
import { UserService } from 'src/app/user/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
  selector: 'app-new-faculty',
  templateUrl: './new-faculty.component.html',
  styleUrls: ['./new-faculty.component.css']
})
export class NewFacultyComponent implements OnInit {
  displayedColumns: string[] = ['id', 'Fullname', 'Email', 'created_at', 'Status', 'Actions'];
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, private route: Router, private _snack: SnackbarService, private _dateService: DateService) {
  }

  ngOnInit(): void {
    this.isLoading = true
    this.userService.getRequest().subscribe((response: any) => {
      this.isLoading = false
      const res = response.map((f: any) => {
        f.created_at = this._dateService.transformDate(f.created_at)
        return { ...f }
      })
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  accept(id: number) {
    this.isLoading = true
    this.userService.approveFaculty(id).subscribe((response: any) => {
      const res = response.faculties.map((f: any) => {
        f.created_at = this._dateService.transformDate(f.created_at)
        return { ...f }
      })
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.data = this.dataSource.data.filter((item: any) => item.id !== id);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
      this._snack.success("Faculty approved!")
      console.log(response)
    }, (err) => {
      console.log(err)
      this._snack.error(err.error.message);
      this.isLoading = false
    })
  }

  reject(id: number) {
    this.isLoading = true
    this.userService.rejectFaculty(id).subscribe((response: any) => {
      const res = response.faculties.map((f: any) => {
        f.created_at = this._dateService.transformDate(f.created_at)
        return { ...f }
      })
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false
      this._snack.success('Faculty was removed from this list');
      console.log(response)
    }, (err) => {
      this._snack.error(err.error.message);
      this.isLoading = false
    })
  }
}
