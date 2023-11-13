import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { <%= classify(name) %> } from 'src/app/models/<%=dasherize(name) %>';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { iif, Subscription } from 'rxjs';
import { <%= classify(name) %>Service } from 'src/app/services/<%= dasherize(name) %>.service';
import { cleanEmptyProperties } from 'src/app/utils/clean-empty-properties';
@Component({
  selector: 'app-<%= dasherize(name) %>-detail',
  templateUrl: './<%= dasherize(name) %>-detail.component.html',
  styleUrls: ['./<%= dasherize(name) %>-detail.component.scss']
})
export class <%= classify(name) %>DetailComponent implements OnInit {

  form: FormGroup;
  isNew!: boolean;
  <%= camelize(name)%>?: <%= classify(name) %>

  private sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
    private <%= camelize(name) %>Service: <%= classify(name)%>Service,
  ) { 
    <%= formBuilder %>
  }

  ngOnInit() {
    this.sub = this.route.data.subscribe(( data: any) => {
      console.log("data --> ", data)
      this.initForm(data.<%= camelize(name)%>)
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  initForm(<%= camelize(name) %>: <%= classify(name) %>) {
    this.<%= camelize(name)%> = <%= camelize(name)%> || null;
    this.isNew = !this.<%= camelize(name)%>;
    this.form.patchValue(this.<%= camelize(name)%>);
  }

  save() {
    if (this.form.valid) {
      iif(
        () => this.isNew,
        this.<%= camelize(name) %>Service.createOne(cleanEmptyProperties(this.form.value)),
        this.<%= camelize(name) %>Service.updateOne(
          this.form.value.id,
          cleanEmptyProperties(this.form.value)
        )
      ).subscribe(
        <%= camelize(name) %> => {
          this.toastr.info(this.translate.instant('<%= classify(name) %>s.Messages.Saved'));
          if (this.isNew) {
            this.router.navigate(['/<%= dasherize(name) %>', <%= camelize(name) %>.id]);
          } else {
            this.initForm(<%= camelize(name) %>);
          }
        },
        err => console.log(err)
      );
    }
  }

}
