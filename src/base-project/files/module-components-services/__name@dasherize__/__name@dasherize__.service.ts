import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from '../environments/environment';
import { <%= classify(name) %> } from '../models/<%= dasherize(name) %>';
import { LibService } from '../base/lib.service';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service extends BaseService<<%= classify(name) %>> {

  baseApiUrl: string = environment.baseApiUrl + "<%= dasherize(name) %>"

  constructor(public service : LibService){
    super(service);
  }
}