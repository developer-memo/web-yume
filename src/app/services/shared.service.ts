import { ElementRef, Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  domHtml: string;
  private sendDomHtmlSubject = new BehaviorSubject('');
  sendDomHtmlObservable: Observable<any> = this.sendDomHtmlSubject.asObservable();

  constructor() { }


  sendHtmlService = (html:any) =>{
    this.domHtml = html;
    this.sendDomHtmlSubject.next(html);
  }
}
