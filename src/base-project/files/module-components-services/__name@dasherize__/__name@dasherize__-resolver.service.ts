import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseResolverService } from '../base/base-resolver.service';
import { <%= classify(name) %> } from '../models/<%= dasherize(name) %>';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';

@Injectable()
export class <%= classify(name) %>ResolverService extends BaseResolverService<<%= classify(name) %>> {
  routeBack = ['/'];

  constructor(
    public override readonly router: Router,
    public override readonly toastr: ToastrService,
    private apiService: <%= classify(name) %>Service) {
    super(router,toastr);
  }

  findOne(id: any) {
    return this.apiService.findOne({
      where: {
        id: id
      }
    });
  }
}
