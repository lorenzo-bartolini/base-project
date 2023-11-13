import { Component, OnInit } from '@angular/core';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { LibService } from 'src/app/base/lib.service';

import { <%= classify(name) %> } from 'src/app/models/<%= dasherize(name) %>';

import { DatatableAction, DatatableColumn } from 'src/app/shared/data-table/data-table.component';

@Component({
  selector: 'app-<%= dasherize(name) %>-list',
  templateUrl: './<%= dasherize(name) %>-list.component.html',
})
export class <%= classify(name) %>ListComponent implements OnInit {

  <%= camelize(name) %>s$ : Observable<<%= classify(name) %>[]>

  dataSource : any
  <%= displayedColumns %>
  <%= columns %>

  actions: DatatableAction<<%= classify(name) %>>[]=[
    {
      label: of(''),
      onClick: <%= camelize(name) %> => this.router.navigate(['/<%= dasherize(name) %>', <%= camelize(name) %>.id]),
      color: 'primary',
      icon: profile =>  {
          return 'edit'
      },
    }
  ]

  constructor(
    private translate : TranslateService,
    public libService: LibService,
    private router: Router,
    public <%= camelize(name)%>Service: <%= classify(name) %>Service
  ) {
      this.<%= camelize(name) %>s$ = this.<%= camelize(name)%>Service.getAll() 
   }

  ngOnInit(): void {
    this.<%= camelize(name) %>s$.subscribe(<%= camelize(name) %>s =>{
      this.dataSource = <%= camelize(name) %>s
    })
  }

}
