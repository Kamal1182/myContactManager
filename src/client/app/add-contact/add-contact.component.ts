import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Contact } from '../shared/contact.model';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

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

  constructor(public api: ApiService,
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

  ngOnInit() {
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
       }
      }); 
  }

}
