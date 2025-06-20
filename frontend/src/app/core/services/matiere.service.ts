import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private baseUrl = 'http://127.0.0.1:3000/matieres/';
  
  constructor(private http: HttpClient) {}

  // Créer une nouvelle matière
  create(data: { nom: string, description?: string, classes?: string[] }) {
    return this.http.post(this.baseUrl, data);
  }

  // Lister toutes les matières
  list() {
    return this.http.get(this.baseUrl);
  }

  // Obtenir une matière par ID
  byId(id: string) {
    return this.http.get(this.baseUrl + id);
  }

  // Mettre à jour une matière
  update(id: string, data: { nom?: string, description?: string, classes?: string[] }) {
    return this.http.put(this.baseUrl + id, data);
  }

  // Supprimer une matière
  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }

  // Obtenir les matières d'un formateur
  getByFormateur(formateurId: string) {
    return this.http.get(`${this.baseUrl}byformateur/${formateurId}`);
  }

  // Obtenir les matières d'une classe
  getByClasse(classeId: string) {
    return this.http.get(`${this.baseUrl}byclasse/${classeId}`);
  }
}