 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  getValue(){
    return this.http.get("http://localhost:8080/speedlimit?pid=102");
  }
}