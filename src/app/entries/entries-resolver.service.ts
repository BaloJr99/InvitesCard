import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, Observable, catchError, map } from "rxjs";
import { IEntryResolved } from "../core/models/entries";
import { EntriesService } from "../core/services/entries.service";

export const entriesResolver: ResolveFn<IEntryResolved> = (
  route: ActivatedRouteSnapshot): Observable<IEntryResolved> => {
  
  const entriesService = inject(EntriesService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? "";

  const entryFound = entriesService.getInvite(id).pipe(
    map(entry => ({ entry: entry})),
    catchError(() => {
      router.navigate(['/error/page-not-found'])
      return EMPTY
    })
  )

  return entryFound;
} 