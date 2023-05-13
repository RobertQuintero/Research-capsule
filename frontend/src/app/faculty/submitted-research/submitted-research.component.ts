import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICapsule } from 'src/app/capsule/icapsule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/authenticate/ErrorStateMatcher';
import { FacultyService } from '../faculty.service';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
  selector: 'app-submitted-research',
  templateUrl: './submitted-research.component.html',
  styleUrls: ['../faculty.component.css']
})
export class SubmittedResearchComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'by', 'submittedDate', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = false
  viewModalShow: boolean = false
  editModalShow: boolean = false
  addModalShow: boolean = false
  capsuleDetails!: ICapsule
  matcher!: MyErrorStateMatcher
  addForm!: FormGroup
  description!: FormControl
  title!: FormControl
  editForm!: FormGroup
  editTitle!: FormControl
  editDescription!: FormControl
  capsuleToEditId!: number | undefined
  capsuleToReviseId!: any
  reviseForm!: FormGroup
  reviseTitle!: FormControl
  reviseDescription!: FormControl
  reviseModalShow: boolean = false
  isFormDirty = false;

  constructor(private facultyService: FacultyService,
    private fb: FormBuilder,
    private api: EnvironmentService,
    private sanitizer: DomSanitizer,
    private _snack: SnackbarService,
    private _dateService: DateService
  ) { }


  ngOnInit(): void {
    this.matcher = new MyErrorStateMatcher()
    // add capsule
    this.title = new FormControl('', Validators.required)
    this.description = new FormControl('', Validators.required)
    this.addForm = this.fb.group({
      title: this.title,
      description: this.description,
      capsule: ['']
    })
    // edit capsule
    this.editTitle = new FormControl('', Validators.required)
    this.editDescription = new FormControl('', Validators.required)
    this.editForm = this.fb.group({
      editTitle: this.editTitle,
      editDescription: this.editDescription,
      editCapsule: ['']
    })
    //revise capsule
    this.reviseTitle = new FormControl('', Validators.required)
    this.reviseDescription = new FormControl('', Validators.required)
    this.reviseForm = this.fb.group({
      reviseTitle: this.reviseTitle,
      reviseDescription: this.reviseDescription,
      reviseCapsule: ['']
    })

    // display capsules table
    this.isLoading = true
    this.facultyService.getUserCapsules().subscribe((response: ICapsule[]) => {
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isInvalid(): boolean {

    return (this.title.invalid && this.title.touched)
      || (this.description.invalid && this.description.touched)
  }

  titleInvalid(): boolean {
    return this.title.invalid && this.title.touched
  }

  descriptionInvalid(): boolean {
    return this.description.invalid && this.description.touched
  }

  openViewModal(capsuleData: ICapsule) {
    this.viewModalShow = true
    this.capsuleDetails = capsuleData
  }

  closeViewModal() {
    this.viewModalShow = false
  }

  openEditModal(data: { id: number; title: string; description: any; }) {
    const { id, title, description } = data
    if (id) this.editModalShow = true
    this.capsuleToEditId = id
    this.editTitle.setValue(title)
    this.editDescription.setValue(description)
  }
  closeEditModal() {
    this.editModalShow = false
    this.capsuleToEditId = undefined
    this.editForm.reset()
    this.discardChanges()
  }



  openReviseModal(id: number) {
    this.reviseModalShow = true
    this.capsuleToReviseId = id
  }

  closeReviseModal() {
    this.reviseModalShow = false
    this.capsuleToReviseId = undefined
    this.reviseForm.reset()
    this.discardChanges()
  }



  openAddModal() {
    this.addModalShow = true
  }
  closeAddModal() {
    this.addModalShow = false
    this.addForm.reset()
    this.discardChanges()
  }


  handleFileInput(event: any, num: number) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > 10000000) {
        this._snack.error("File must be less than 10MB")
        return
      }
      // if (!file.type.startsWith('application/pdf') && !file.type.startsWith('docx/') && !file.type.startsWith('doc/') && !file.type.startsWith('docs/')) {
      //   this.toast.errorToastMessage("File is not of type document file")
      //   return
      // }
      if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this._snack.error("File is not of type document file")
        return
      }
      if (num === 1) {
        this.addForm.get(`capsule`)?.setValue(file)
      }
      else if (num === 2) {
        this.editForm.get('editCapsule')?.setValue(file)
      }
      else if (num === 3) {
        this.reviseForm.get('reviseCapsule')?.setValue(file)
      }
    }

  }

  addCapsule(formValues: any): void {
    const capsule = this.addForm.get('capsule')?.value
    const formData = new FormData()
    formData.append('title', formValues.title)
    formData.append('description', formValues.description)
    formData.append('capsule', capsule)
    if (this.addForm.valid) {
      if (!!capsule) {
        this.isLoading = true
        this.facultyService.addCapsule(formData).subscribe((response: any) => {
          const res = response.data.map((c: any) => {
            c.created_at = this._dateService.transformDate(c.created_at)
            return { ...c }
          })
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(response)
          this.isLoading = false
          this.addModalShow = false
          this._snack.success(response.message)
        }, (err) => {
          this.isLoading = false
          console.log(err.error.message)
          this._snack.error(err.error.message);
        })
      }
      else {
        this._snack.error("Research Capsule File is empty")
        return
      }
    }
    else {
      this._snack.error("Please fill all fields")
      return
    }
  }
  editCapsule(formValues: any) {
    const editCapsule = this.editForm.get('editCapsule')?.value
    const formData = new FormData()
    formData.append('editTitle', formValues.editTitle)
    formData.append('editDescription', formValues.editDescription)
    formData.append('editCapsule', editCapsule)
    formData.append('id', String(this.capsuleToEditId));
    if (this.editForm.valid) {
      if (!!editCapsule) {
        this.isLoading = true
        this.facultyService.editCapsule(formData).subscribe((response: any) => {
          const res = response.data.map((c: any) => {
            c.created_at = this._dateService.transformDate(c.created_at)
            return { ...c }
          })
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(response)
          this.isLoading = false
          this.editModalShow = false
          this._snack.success(response.message)
        }, (err) => {
          this.isLoading = false
          console.log(err.error.message)
        })

      }
      else {
        this._snack.error("Research Capsule File is empty")
        return
      }
    }
    else {
      this._snack.error('Please fill all fields')
    }
  }

  reviseCapsule(formValues: any) {
    this.isLoading = true
    const reviseCapsule = this.reviseForm.get('reviseCapsule')?.value
    const formData = new FormData()
    formData.append('reviseTitle', formValues.reviseTitle)
    formData.append('reviseDescription', formValues.reviseDescription)
    formData.append('reviseCapsule', reviseCapsule)
    formData.append('id', this.capsuleToReviseId)
    if (this.reviseForm.valid) {
      this.facultyService.reviseCapsule(formData).subscribe((response) => {
        console.log(response)
        const res = response.map((c: any) => {
          c.created_at = this._dateService.transformDate(c.created_at)
          return { ...c }
        })
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false
        this._snack.error("Research capsule revised successfully!")
        this.reviseModalShow = false
      }, (err) => {
        this.isLoading = false
        console.log(err)
      })
    }
    else {
      this._snack.error("Please fill all fields")
    }
  }

  getFileLink(path: string | undefined): SafeResourceUrl {
    const url = `${this.api.DOMAIN_URL}/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  discardChanges() {

    this.isFormDirty = false;
  }
}
