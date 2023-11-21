import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { <%= classify(name)%>DetailComponent } from './<%= dasherize(name)%>-detail/<%= dasherize(name)%>-detail.component';
import { <%= classify(name)%>ListComponent } from './<%= dasherize(name)%>-list/<%= dasherize(name)%>-list.component';
import { <%= classify(name)%>ResolverService } from './<%= dasherize(name)%>-resolver.service';

const ROUTES: Route[] = [
    { path: '', component: <%= classify(name)%>ListComponent, pathMatch: 'full' },
    { path: 'new', component: <%= classify(name)%>DetailComponent, pathMatch: 'full' },
    { path: ':id', component: <%= classify(name)%>DetailComponent, resolve: { <%= camelize(name)%>: <%= classify(name)%>ResolverService  } },
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class <%= classify(name)%>RoutingModule { }
