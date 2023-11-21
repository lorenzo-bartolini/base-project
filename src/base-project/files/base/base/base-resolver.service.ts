import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, delay, take, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export abstract class BaseResolverService<T> implements Resolve<T> {

  constructor(
    public readonly router: Router,
    public readonly toastr: ToastrService,
  ) { }

  abstract routeBack: any[];
  abstract findOne(id: any): Observable<T>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    //this.overlay.show();
    const id = route.paramMap.get('id');
    return this.findOne(id).pipe(
      delay(200),
      take(1),
      catchError(err => {
        //this.overlay.hide();
        this.router.navigate(this.routeBack);
        this.toastr.error(err.error ? err.error.message : err.message);
        return of(err);
      }));
  }

}
