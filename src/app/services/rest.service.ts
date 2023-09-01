import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Observable, catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }


  get(url: string) {
    return this.http.get(`${environment.apiurl}${url}`, {
      headers: this.getHeaders()
    });
  }
 

  post(url: string, body: any) {
    return this.http.post(`${environment.apiurl}${url}`, JSON.stringify(body), {
      headers: this.getHeaders()
    });
  }

  put(url: string, body: any) {
    return this.http.put(`${environment.apiurl}${url}`, JSON.stringify(body), {
      headers: this.getHeaders()
    });
  }

  delete(url: string) {
    return this.http.delete(`${environment.apiurl}${url}`, {
      //method: 'DELETE',
      headers: this.getHeaders(),
      
    });
  }

  uploadImage(url: string,file:any) {
    const fd = new FormData();  
    fd.append('image', file);
      return this.http.post(`${environment.apiurl}${url}`,fd);
}


exportExcel(url: string): Observable<HttpResponse<Blob>> {

  const headers = new HttpHeaders({
     'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return this.http.get(`${environment.apiurl}${url}`, {
    headers: headers,
    observe: 'response',
    responseType: 'blob'
  });

}


  getHeaders() {
    return {
      'Content-Type': 'application/json',
    }
  }

  getHeaderWithAtoken() {
    return {
      'Content-Type': 'application/json',
    }
  }
  
  getPdfDocument(url: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });
    return this.http
               .get(`${environment.apiurl}${url}`,
                    { responseType: 'arraybuffer' }
                );
   }

  goUpload(url: string,file:any) {  
    const fd = new FormData();  
    fd.append('file', file);
    return this.http.post(`${environment.apiurl}${url}`,fd); 
         
  }

  
  path(url: string) {
        return `${environment.apiurl}${url}`;
  }

  


}
