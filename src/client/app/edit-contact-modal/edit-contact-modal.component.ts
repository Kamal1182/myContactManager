import { Component, OnInit, Input } from '@angular/core';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/api.service';
import { Contact } from '../shared/contact.model';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.css']
})
export class EditContactModalComponent implements OnInit {

  @Input() contact: Contact;

  closeResult = '';

  loading: Boolean = false;

  contactEdited: Contact;

  editContactForm: FormGroup;

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
        //this.validateLoginForm();
      }

  validateLoginForm() {
    this.editContactForm = this.fb.group({
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
                    RxwebValidators.image({maxHeight:1200,maxWidth:1200}),
                    RxwebValidators.extension({extensions:["jpeg","jpg","gif"]})
                  ])              
            ]
    })
  }

  ngOnInit(): void {
    this.editContactForm = this.fb.group({
      firstName:  [this.contact.name ? this.contact.name : this.contact.firstName, Validators.required],
      lastName:   [this.contact.name ? "" : this.contact.lastName, Validators.required],
      address:    [this.contact.address, Validators.required],
      areaCode:   [this.contact.areaCode, Validators.compose
                    ([
                      Validators.maxLength(5),
                      Validators.required
                    ])
              ],
      prefix:     [this.contact.prefix, Validators.compose
                    ([
                      Validators.maxLength(3),
                      Validators.required
                    ])
              ],
      lineNumber: [this.contact.lineNumber, Validators.compose
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

/*   editContactId(id) {
    console.log('from contact.component.ts');
    console.log(id);
  } */

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
  
  editContactId(contactId, addNewContactModal) {
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

    const formValues = Object.assign({}, this.editContactForm.value);

     const contact : Contact = {
      _id: this.contact._id,
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
    //this.editContactForm.reset(this.editContactForm.value);
    this.api.put( 'contacts/'+this.contact._id, contact )
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
          this.editContactForm.reset(this.editContactForm.value);
        } else {
          this.editContactForm.reset();
          this.loading = false;
          this.contactEdited = data;
          this.api.makeRefresh();
       }
      }); 
  }  

}
