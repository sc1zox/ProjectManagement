import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }


  getInformation(): string{
    return "test information";
  }
}
