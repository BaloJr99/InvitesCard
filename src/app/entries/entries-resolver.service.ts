import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Observable, catchError, map, of } from "rxjs";
import { EntriesService } from "src/core/services/entries.service";
import { IEntryResolved } from "src/shared/interfaces";

export const entriesResolver: ResolveFn<IEntryResolved> = (
  route: ActivatedRouteSnapshot): Observable<IEntryResolved> => {
  
  const entriesService = inject(EntriesService);

  const id = route.paramMap.get('id');

  if (!id) {
    const message = `Entry id was not valid: ${id}`
    return of({entry: null, error: message})
  } 

  return entriesService.getEntrieById(id).pipe(
    map(entry => ({ entry: entry})),
    catchError(error => {
      const message = `Retrieval error: ${error}`
      return of({ entry: null, error: message})
    })
  )
} 