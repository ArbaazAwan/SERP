import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpandService {
  public expandedSource = new Subject<boolean>();
  expanded$ = this.expandedSource.asObservable();

  toggleExpanded(expanded: boolean) {
    this.expandedSource.next(expanded);
  }
}
