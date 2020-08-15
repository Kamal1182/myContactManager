import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { Contact } from '../shared/contact.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() contact: Contact;
  
  @Output() contactIdDeleteEvent = new EventEmitter<string>();
  
  @Output() contactIdEditEvent = new EventEmitter<string>();

  @HostBinding('class') columnClass = 'four wide column';

  constructor() { }

  ngOnInit() {
  }

  editContactId(id) {
    console.log('from contact.component.ts');
    console.log(id);
    this.contactIdEditEvent.emit(id);
  }

  deleteContactId(id) {
    console.log('from contact.component.ts');
    console.log(id);
    this.contactIdDeleteEvent.emit(id);
  }
}
