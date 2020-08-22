import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() contact: Contact;
  
  @HostBinding('class') columnClass = 'four wide column';

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

}
