import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import { plainToClassFromExist } from 'class-transformer';
import { Moment } from 'moment';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
 //import { Log } from '../models/log';
// import { AuthService } from '../auth/auth.service';
 import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LibService {
  @BlockUI() blockUI!: NgBlockUI;
  adminLock: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public translate: TranslateService,
    // private auth: AuthService
  ) {}

  handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      this.showMessageError('An error occurred:' + error.error.message);
    } else {
      if (error.status !== 401) {
        this.showMessageError(
          'Backend returned code ' +
            error.status +
            ' message: ' +
            error.statusText
        );
      }
    }
    return throwError(() => error);
  };

  showMessageError = (parMessage: string, parMessages: string[] = []) => {
    this.toastr.error(`${parMessage}`, this.translate.instant('TOASTR.ERROR'));
    this.unlockPage();
  };

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result?.toString();
        resolve(text!);
      };

      reader.readAsText(file);
    });
  }

  lockPageAdmin = (parMessage: string) => {
    this.adminLock = true;
    setTimeout(() => {
      this.blockUI.start(parMessage);
    });
  };

  lockPage = (parMessage: string) => {
    setTimeout(() => {
      this.blockUI.start(parMessage);
    });
  };

  unlockPage = () => {
    if (this.adminLock === false) {
      setTimeout(() => {
        this.blockUI.stop();
      });
    }
  };

  postData = <T>(
    parRequest: any,
    parBaseUrl: string,
    parPath: string
  ): Observable<T> => {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'x-user-email': this.auth.user()?.email,
      }),
    };
    return this.http
      .post<T>(parBaseUrl + parPath, parRequest, httpOptions)
      .pipe(
        map((response: T) => plainToClassFromExist(response, response)),
      catchError(error => {
        return this.handleError(error)
      })
    );
  }

  postDataWithAccessToken = <T>(accesstoken: string, parRequest: any, parBaseUrl: string, parPath: string): Observable<T> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'accesstoken': accesstoken
      })
    };
    return this.http.post<T>(parBaseUrl + parPath, parRequest, httpOptions).pipe(
      map((response: T) => plainToClassFromExist(response, response)),
      catchError(error => {
        return this.handleError(error)
      })
    );
  }

  postDataWithOptions = (
    parBaseUrl: string,
    parPath: string,
    parAuth: any
  ): Observable<any> => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ZHVuZWdyb3VwOmlBRkdsMHlzQTcxcHomS0Y=',
      }),
    };
    return this.http.post<any>(parBaseUrl + parPath, {}, httpOptions);
  };

  putData = <T>(
    parRequest: any,
    parBaseUrl: string,
    parPath: string
  ): Observable<T> => {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
    };
    return this.http.put<T>(parBaseUrl + parPath, parRequest, httpOptions).pipe(
      map((response: T) => plainToClassFromExist(response, response)),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  };

  deleteData = <T>(
    parRequest: any,
    parBaseUrl: string,
    parPath: string
  ): Observable<T> => {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'x-user-email': this.auth.user()?.email,
      }),
      body: parRequest
    };
    return this.http.delete<T>(parBaseUrl + parPath, httpOptions).pipe(
      map((response: any) => plainToClassFromExist(response, response)),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  };

  getData = <T>(parBaseUrl: string, parPath: string): Observable<T> => {
    return this.http.get<T>(parBaseUrl + parPath).pipe(
      map((response: T) => plainToClassFromExist(response, response)),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  };

  navigateTo = (parPath: string) => {
    this.router.navigate([parPath]);
  };

  paginate = (parArray: [any], pageSize: number, pageNumber: number) => {
    --pageNumber;
    return {
      array: parArray.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize),
      pages: Math.ceil(parArray.length / pageSize),
    };
  };

  confirm = (parMessage: string) => {
    return self.confirm(parMessage);
  };

  cloneObject<T>(parObject: any): T {
    return JSON.parse(JSON.stringify(parObject));
  }

  getlocalStorage = (parKey: string, parDefault: any) => {
    const result = localStorage.getItem(parKey) || parDefault;
    return result;
  };

  setlocalStorageItem(key: string, item: any): void {
    if (item) {
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      localStorage.removeItem(key);
    }
  }

  getlocalStorageItem(key: string): any {
    let result = null;
    const data: any = localStorage.getItem(key);
    if (!data) {
      return null;
    }
    try {
      result = JSON.parse(data);
    } catch (error) {
      console.error(error);
      result = null;
    }
    return result;
  }

  getLanguage = (parLanguageKeyStorage: string, parDefaultLanguage: string) => {
    const language =
      localStorage.getItem(parLanguageKeyStorage) || parDefaultLanguage;
    return language;
  };

  getLocale = (parLocaleKeyStorage: string, parDefaultLocale: string) => {
    const locale =
      localStorage.getItem(parLocaleKeyStorage) || parDefaultLocale;
    return locale;
  };

  setLanguage = (
    parLanguageKeyStorage: string,
    parLocaleKeyStorage: string,
    parLanguage: any
  ) => {
    localStorage.setItem(parLanguageKeyStorage, parLanguage.Lng);
    localStorage.setItem(parLocaleKeyStorage, parLanguage.Loc);
    window.location.reload();
  };

  timeToMoment(parTime: string, parFormat: string = 'HH:mm:ss'): Moment {
    return moment.utc(parTime, parFormat);
  }
  timeToDateIso(parTime: string, parFormat: string = 'HH:mm:ss'): string {
    return moment.utc(parTime, parFormat).format('YYYY-MM-DDTHH:mm:ss');
  }

  timeToDate(parTime: string, parFormat: string = 'HH:mm:ss'): string {
    return moment(parTime, parFormat).format('YYYY-MM-DDTHH:mm:ss');
  }

  getDaysDelta(date: Date, compared: Date) {
    return moment(date).diff(compared, 'days');
  }

  getAge(parDate: any): number {
    return moment().diff(parDate, 'years', false);
  }

  writeLog(method: string, path: string, request?: any, response?: any) {
   /*  let action = {
      method: method,
      path: path,
      params: request,
    };
    let uname = 'not logged';
    let log: Log = {
      userEmail: uname,
      timestamp: new Date(),
      action: JSON.stringify(action),
      response: response,
    }; */
  }
}
