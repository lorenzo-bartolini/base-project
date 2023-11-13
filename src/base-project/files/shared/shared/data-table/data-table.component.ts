import { Component, EventEmitter, Input, OnChanges, AfterViewInit, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, AfterViewChecked } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Observable, max } from 'rxjs';

export class DatatableColumn<T> {
  name!: string;
  title?: Observable<string>;
  type?: 'text' | 'link' | 'icon' | 'templateRef' = 'text';
  flex?: string;
  sticky?: boolean;
  color?: (element: T) => 'primary' | 'warn' | 'error';
  cssClass?: (element: T) => string[];
  sortDisabled?: boolean;
  routerLink?: (element: T) => string[];
  value(element: T): any {
    return null;
  };
  sort?: (element: T) => any
  templateRef?: (element: T) => Observable<TemplateRef<any>>;
  tooltip?: (element: T) => Observable<String>;

  constructor(column: Partial<DatatableColumn<T>>) {
    Object.assign(this, column);
  }
}

export class DatatableAction<T> {
  label?: Observable<string>;
  color?: string;
  icon(element: T): string {
    return ''
  };
  iconButton?: boolean = true;
  spinner?: boolean;
  disabled?(element: T): boolean {
    return false
  }

  constructor(action: Partial<DatatableAction<T>>) {
    Object.assign(this, action);
  }

  onClick(element: T): void { }
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

  @Input()isActionsSticky : boolean = false
  @Input() data!: any[];
  @Input() columns!: DatatableColumn<any>[];
  @Input() displayedColumns: string[] = [];
  @Input() actions: DatatableAction<any>[] = [];
  @Input() sortActive = 'id';
  @Input() sortDirection: SortDirection = 'asc';
  @Input() hasPagination = true;
  @Input() hasHeader = true;
  @Input() pageSize = 15;
  @Input() pageSizeOptions = [15, 30, 60];
  @Input() selected: any;
  @Input() dynamicColWidth?: boolean;
  @Output() rowSelected = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter();


  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator | null;

  dataSource = new MatTableDataSource<any>()
  hoverRow: any;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {

    //this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      let column = this.columns.find(column => column.name === property)
      if(column && column.sort !== undefined){
        return column.sort(item)
      }else if(column){
        return column.value(item)
      }else{
        return null
      }
      // switch (property) {
      //   case 'price': return item.realPrice;
      //   case 'workType': return item.workType.workType;
      //   case 'address': return item.building.streetName;
      //   case 'buildingAddress': return item.streetName;
      //   case 'statusRequest': return this.translate.instant('LABEL.' + item.status.uiLabel);
      //   case 'subjectId': return item.nameSubject;
      //   case 'buildingId': return item.nameBuilding;
      //   case 'roofCoordinates': return item.coordY;
      //   //case 'callAttempts': return item.trackedCalls.length;
      //   case 'roofCoordinatesReq': return item.building.coordY;
      //   case 'status': return this.translate.instant('LABEL.' + item.status.uiLabel);
      //   case 'request':
      //     // console.log("Item --> ", item)
      //     return item.requests.sort((a: any, b: any) => a.updatedAt <= b.updatedAt? -1 : 1)[0].id;
      //   case 'createdAt': case 'updatedAt': case 'lastCallAttempt': return new Date(item[property]) //new Date(this.columns.find(column => column.name === property)?.value(item))
      //   default: return this.columns.find(column => column.name === property)?.value(item)
      // }
    };
     this.dataSource.sort = this.matSort;

    if (this.actions.length > 0 && !this.displayedColumns.includes('actions')) {
      this.displayedColumns.unshift('actions');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  ngAfterViewChecked(): void {
    this.dynamicColWidth?
      this.adjustColumns():
      console.log()
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue !== changes['data'].previousValue) {
      this.dataSource.data = changes['data'].currentValue
      // this.adjustColumns()
    }
    if (this.actions.length > 0 && !this.displayedColumns.includes('actions')) {
      this.displayedColumns.unshift('actions');
      // this.adjustColumns()
    }

  }


  selectRow(row: any) {
    this.rowSelected.next(row);
  }

  onMatRowHover(event: any, row: any) {
    if (event.leave) {
      this.hoverRow = null;
    } else {
      this.hoverRow = row;
    }
  }

  onSelectionChange(event: any, element: any) {
    this.selectionChanged.next({ event: event, element: element })
  }

  adjustColumns() {
    // console.log('adjusting columns fired');
    let columns: any = []
    Object.assign(columns, this.columns)
    columns.push({
      name: 'actions'
    })
    let summarize = 0;
    for (let icol = 0; icol < columns.length; icol++) {
      const cells = Array.from(document.getElementsByClassName('column-data')).filter(cell => cell.classList.contains('mat-column-' + columns[icol].name))
      for (let icel = 0; icel < cells.length; icel++) {

        const element = cells[icel] as HTMLElement; // Cast the element to HTMLElement
        try {
          summarize = summarize + element!.scrollWidth;
        } catch (error) {
        }
      }
    }
    let bd = document.getElementById("dt-child")?.getBoundingClientRect()?.width;
    if (bd == null)
      bd = 0;
    const projection = (bd) / summarize;//
   // console.log('[mat-table]projection width %o actual %o total %o', projection, bd, summarize);
    for (let icol = 0; icol < columns.length; icol++) {
      const cells = Array.from(document.getElementsByClassName('column-data')).filter(cell => cell.classList.contains('mat-column-' + columns[icol].name))
      let maxWidth = 0;
      for (let icel = 0; icel < cells.length; icel++) {

        try {
          const element = cells[icel].classList.contains('cdk-header-cell')?
          (cells[icel].lastElementChild as HTMLElement).scrollWidth + 20:
          (cells[icel] as HTMLElement).scrollWidth; // Cast the element to HTMLElement
          maxWidth = Math.max(maxWidth, element);
          //console.log('col.name %o col.width %o', columns[icol].name, element.lastElementChild!.scrollWidth);
        } catch (error) {
        }
      }
      //  if(maxWidth > 500)
      //  maxWidth = 500;
      // Set the maximum width as the width for all cells in the column

      for (let icel = 0; icel < cells.length; icel++) {
        const element = cells[icel] as HTMLElement; // Cast the element to HTMLElement
        if (projection > 1)
          maxWidth = maxWidth * projection;
        element.style.width = `${maxWidth}px`;
      }
    }
  }

}
