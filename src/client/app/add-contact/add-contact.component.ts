import { Component, OnInit } from '@angular/core';
import { NgForm ,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Contact } from '../shared/contact.model';
import { ApiService } from '../shared/api.service';

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
  phoneServerError = '';
  photoServerError = '';

  constructor(public api: ApiService,
              private fb: FormBuilder
             ) { 
                  this.validateLoginForm();
               }

   validateLoginForm() {
    this.addContactForm = this.fb.group({
      firstName:  ["", Validators.required],
      lastName:   ["", Validators.required],
      address:    ["", Validators.required],
      // areaCode:   ["", Validators.required],
      // prefix:     ["", Validators.required],
      // lineNumber: ["", Validators.required],
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
      photo:      ["", Validators.required]
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;

    const formValues = Object.assign({}, this.addContactForm.value);

    const contact: Contact = {
      name      : `${formValues.firstName} ${formValues.lastName}`,
      address   : formValues.address,
      areaCode  : formValues.areaCode,
      prefix    : formValues.prefix,
      lineNumber: formValues.lineNumber,
      photoUrl  : formValues.photo
    };

    this.api.post('/contacts',contact )
      .subscribe(data => {
        this.addContactForm.reset();
        this.loading = false;
        this.newContact = data;
      });
  }

}
