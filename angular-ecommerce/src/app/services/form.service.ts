import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  //base url for countries and states
  private cUrl = 'http://localhost:8080/api/countries';
  private sUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  //get countries list from db
  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.cUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  //get states list from db based on code
  getStates(code: string): Observable<State[]> {

    //build search url
    const searchUrl = `${this.sUrl}/search/findByCountryCode?code=${code}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  //build months list for drop-down list in card's expiration month
  getMonths(): Observable<number[]> {
    
    let data: number[] = [];

    for (let m = 1; m <= 12; m++) {
      data.push(m);
    }

    return of(data);
  }

  //build years list for drop-down list in card's expiration year
  getYears(): Observable<number[]> {
    
    let data: number[] = [];

    //create years list based on current year and years in 10 years 
    const start: number = new Date().getFullYear();
    const end: number = start + 10;

    for (let y = start; y <= end; y++) {
      data.push(y);
    }

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}