import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/throttle';
import { Observable } from 'rxjs/Observable';
import { throwError, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {

  private baseUrl = environment.apiUrl;

  private refreshNeeded = new Subject();

  refreshCall$ = this.refreshNeeded.asObservable();

  makeRefresh() {
    this.refreshNeeded.next();
  }

  constructor(private http: Http,
              private auth: AuthService
             ) { }

  get(url: String) {
    return this.request(url, RequestMethod.Get);
  }
  
  post(url: String, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }
  
  put(url: String, body: Object) {
    return this.request(url, RequestMethod.Put, body);
  }
  
  delete(url: String) {
    return this.request(url, RequestMethod.Delete);
  }

  request(url: String, method: RequestMethod, body?: Object) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.auth.getToken()}`);
    
    const requestOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);

    return this.http.request(request)
      .map((res: Response) => res.json())
      .catch((res: Response) => this.onRequestError(res));
  }

  onRequestError(res: Response) {
    const statusCode = res.status;
    const body = res.json();
    
    const error = {
      statusCode : statusCode,
      error : body.error
    }

    if(body.error == 'jwt expired') {
      this.auth.logout(true);
    }

    console.log('from api.service.ts')
    console.log(error);
    
    throwError(error);
    
    return Observable.create((e) => {e.next(error)});
  }

}
