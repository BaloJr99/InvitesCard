import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, Observable, catchError, map } from "rxjs";
import { EntriesService } from "src/core/services/entries.service";
import { IEntryResolved } from "src/shared/interfaces";

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