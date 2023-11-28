import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseurl : string = 'http://localhost:8080/enquiry'

  constructor(private http: HttpClient) { }

  postRegistration(registerObj: User) {
    console.log(registerObj);
    return this.http.post<User>(`${this.baseurl}`,registerObj)
  }

  getRegisteredUser() {
    return this.http.get<User[]>(`${this.baseurl}`)
  }

  updateRegisterUser(registerObj: User, id: number) {
    return this.http.put<User>(`${this.baseurl}/${id}`, registerObj)
  }

  deleteRegister(id: number) {
    return this.http.delete<User>(`${this.baseurl}/${id}`)
   }

   gerRegisteredUserId(id: number) {
    return this.http.get<User>(`${this.baseurl}/${id}`)
   }
  
}
