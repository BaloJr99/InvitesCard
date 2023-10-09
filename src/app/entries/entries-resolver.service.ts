import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable, catchError, map, of, tap } from "rxjs";
import { InvitesService } from "src/core/services/invites.service";
import { IEntryResolved } from "src/shared/interfaces";

export const entriesResolver: ResolveFn<IEntryResolved> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<IEntryResolved> => {
  
  const invitesService = inject(InvitesService);

  const id = route.paramMap.get('id');

  if (!id) {
    const message = `Entry id was not valid: ${id}`
    return of({entry: null, error: message})
  } 

  return invitesService.getEntrieById(id).pipe(
    map(entry => ({ entry: entry})),
    catchError(error => {
      const message = `Retrieval error: ${error}`
      return of({ entry: null, error: message})
    })
  )
} 