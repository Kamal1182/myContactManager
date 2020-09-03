import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-delete-contact-modal',
  templateUrl: './delete-contact-modal.component.html',
  styleUrls: ['./delete-contact-modal.component.css']
})
export class DeleteContactModalComponent implements OnInit {

  closeResult = '';

  @Input() contact: Contact;

  constructor(private modalService: NgbModal,
              public api: ApiService){ }

  ngOnInit(): void {
  }

  editContactId(id) {
    console.log('from contact.component.ts');
    console.log(id);
  }

  deleteContactById(contactId, confirmDeleteModal) {
    this.modalService.open(confirmDeleteModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('result from delete-contact-modal.component.ts');
      console.log(result);
      this.api.delete('contacts/'+ contactId)
        .subscribe(data => {
          if(data !== null ) {console.log(data.value.firstName)};
          console.log(data);
        });
      this.api.makeRefresh();
      //this.refreshContactsEvent.emit();
      //location.reload();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
