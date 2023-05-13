import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DateService {

  constructor(private datePipe: DatePipe) { }
  transformDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'MMMM dd, yyyy') ?? "";
  }
}
