import { Component, OnInit } from '@angular/core';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/api.service';
import { Contact } from '../shared/contact.model';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.css']
})
export class AddContactModalComponent implements OnInit {

  closeResult = '';
  loading: Boolean = false;
  newContact: Contact;

  addContactForm: FormGroup;

  firstnameServerError = '';
  lastnameServerError = '';
  addressServerError = '';
  areaCodeServerError = '';
  prefixCodeServerError = '';
  landLineCodeServerError = '';
  photoServerError = '';

  constructor(private addContactModal: NgbModal,
              public api: ApiService,
              private fb: FormBuilder,
              private router: Router
              ) { 
                  this.validateLoginForm();
                }

  validateLoginForm() {
    this.addContactForm = this.fb.group({
      firstName:  ["", Validators.required],
      lastName:   ["", Validators.required],
      address:    ["", Validators.required],
      areaCode:   ["", Validators.compose
                        ([
                          Validators.maxLength(5),
                          Validators.required
                        ])
                  ],
      prefix:     ["", Validators.compose
                        ([
                          Validators.maxLength(3),
                          Validators.required
                        ])
                  ],
      lineNumber: ["", Validators.compose
                        ([
                          Validators.maxLength(4),
                          Validators.required
                        ])
                  ],
      photo:      ["", Validators.compose
                        ([
                          RxwebValidators.required(),
                          RxwebValidators.image({maxHeight:800,maxWidth:800}),
                          RxwebValidators.extension({extensions:["jpeg","jpg","gif"]})
                        ])              
                  ]
    })
  }

  ngOnInit(): void {
  }

  //define the variable containing the image extension and ASCII data
  imageBase64 = {};

  fileChangeEvent(E) {
    if(E != undefined){
      //this.imageBase64["extension"] = E.target.files[0].name.split('.')[1];
      this.imageBase64["extension"] = E.target.files[0].type.replace(/^.*[\\\/]/, '');
      var files = E.target.files;
      var file = files[0];

      if (files && file) {
        var reader = new FileReader();
        
        reader.onload = this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
        
      }
    }
  }

  _handleReaderLoaded(readerEvt) {
    //console.log(readerEvt);
    var binaryString = readerEvt.target.result;
    //this.imageBase64["data"] = binaryString;
    this.imageBase64["data"] = btoa(binaryString);
  }
  
  addNewContact(addNewContactModal) {
    this.addContactModal.open(addNewContactModal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('result from add-contact-modal.component.ts');
      console.log(result);
      /* this.api.post('contacts/', contact)
        .subscribe(data => {
          if(data !== null ) {console.log(data.value.firstName)};
          console.log(data);
        });
      location.reload(); */
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    this.newContact = null;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit() {
    this.loading = true;

    const formValues = Object.assign({}, this.addContactForm.value);

     const contact : Contact = {
      _id: undefined,
      name      : formValues.name,
      firstName : formValues.firstName,
      lastName  : formValues.lastName,
      address   : formValues.address,
      phone     : formValues.phone,
      areaCode  : formValues.areaCode,
      prefix    : formValues.prefix,
      lineNumber: formValues.lineNumber,
      photoUrl  : this.imageBase64
    };

    //console.log(contact);
    //this.loading = false;
    //this.addContactForm.reset(this.addContactForm.value);
    this.api.post( 'contacts', contact )
      .subscribe(data => {
        if( data.statusCode == 422 ){
          console.log('from add-contact.component.js' + JSON.stringify(data.error));
          this.firstnameServerError = data.error.firstName;
          this.lastnameServerError = data.error.lastName;
          this.addressServerError = data.error.address;
          this.areaCodeServerError = data.error.areaCode;
          this.prefixCodeServerError = data.error.prefix;
          this.landLineCodeServerError = data.error.lineNumber;
          this.photoServerError = data.error.photoUrl;
          this.loading = false;
          this.addContactForm.reset(this.addContactForm.value);
        } else {
          this.addContactForm.reset();
          this.loading = false;
          this.newContact = data;
          this.api.makeRefresh();
       }
      }); 
  }  

}
