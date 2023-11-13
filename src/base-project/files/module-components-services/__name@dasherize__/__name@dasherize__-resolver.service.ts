import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseResolverService } from 'src/app/base/base-resolver.service';
import { <%= classify(name) %> } from 'src/app/models/<%= dasherize(name) %>';
import { <%= classify(name) %>Service } from 'src/app/services/<%= dasherize(name) %>.service';

@Injectable()
export class <%= classify(name) %>ResolverService extends BaseResolverService<<%= classify(name) %>> {
  routeBack = ['/'];

  constructor(
    public override readonly router: Router,
    public override readonly toastr: ToastrService,
    private apiService: <%= classify(name) %>Service) {
    super(router,toastr,overlay);
  }

  findOne(id: any) {
    return this.apiService.findOne(id);
  }
}
