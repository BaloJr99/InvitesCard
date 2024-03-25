import { inject } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, Observable, catchError, map } from "rxjs";
import { EntriesService } from "src/core/services/entries.service";
import { IEntryResolved } from "src/shared/interfaces";

export const entriesResolver: ResolveFn<IEntryResolved> = (
  route: ActivatedRouteSnapshot): Observable<IEntryResolved> => {
  
  const entriesService = inject(EntriesService);
  const router = inject(Router);
  const meta = inject(Meta);

  const id = route.paramMap.get('id') ?? "";

  const entryFound = entriesService.getInvite(id).pipe(
    map(entry => ({ entry: entry})),
    catchError(() => {
      router.navigate(['/error/page-not-found'])
      return EMPTY
    })
  )

  meta.addTags([
    {
      property: 'og:title',
      content: 'Testing Meta'
    },
    {
      name: 'og:description',
      content: 'Testing description'
    },
    {
      property: 'og:image',
      itemprop: 'image',
      content: 'https://img.freepik.com/vector-gratis/panda-lindo-bambu_138676-3053.jpg?size=338&ext=jpg&ga=GA1.1.1319243779.1711238400&semt=ais'
    }
  ])

  return entryFound;
} 