import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActualiteService {

  url = 'http://127.0.0.1:3000/actualite/';
  url1 = 'http://127.0.0.1:3000/notif/';
  url2 = 'http://127.0.0.1:3000/cours/';


  constructor(private http: HttpClient) {}

  create(data: FormData) {
    return this.http.post(this.url + 'create', data);
  }

  list() {
    return this.http.get(this.url);
  }

  byid(id: any) {
    return this.http.get(this.url  + id);
  }

  update(id: any, data: FormData) {
    return this.http.put(this.url  + id, data);
  }

  delete(id: any) {
    return this.http.delete(this.url  + id);
  }

  // Optional: Add these if you implement them in your backend
  getByCategory(category: string) {
    return this.http.get(this.url + 'bycategory/' + category);
  }

  search(query: string) {
    return this.http.get(this.url + 'search?q=' + query);
  }

  getallnotification (){
    return this.http.get(this.url1 + 'notifications');
  }
  lu(id:any) {
    return this.http.put(this.url1 + 'notification/'+ id , { lu: true });
  }

  createCours(data: FormData) {
    return this.http.post(this.url2 + 'create', data);
  }
  listcours(){
    return this.http.get(this.url2);
  }
  listcoursbyidClass(id: any) {
    return this.http.get(this.url2 + 'class/' + id);
  }
  getCoursById(id: any) {
    return this.http.get(this.url2 + id);
  }
  deletecours(id: any) {
    return this.http.delete(this.url2 + id);
  }
}