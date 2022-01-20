import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { DataService } from './data.service';

@Injectable()
export class AuthguardService implements CanActivate {
  constructor(
    private router: Router,
    private location: Location,
    private dataservice: DataService,
    private activatedRoute: ActivatedRoute
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return true;
    const currUrl = this.dataservice.getSessionData('currentUrl');
    if (currUrl === state.url) {
      return true;
    } else {
      this.router.navigateByUrl(currUrl);
      return false;
    }
  }
}
