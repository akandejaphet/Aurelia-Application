require('bootstrap/dist/css/bootstrap.min.css');
import {HttpClient, json} from 'aurelia-fetch-client';
import { inject, ObserverLocator  } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';

let httpClient = new HttpClient();

interface Form {

}
@inject(ValidationControllerFactory, Validator, ObserverLocator)
export class App {
  public message: string = 'Applicant Dashboard';
  form = {
    address : '',
    familyName : '',
    countryOfOrigin : '',
    eMailAddress : '',
    age : '',
    hired : false,
    disabledAction : '',
  };
  controller = null;
  validator = null;
  canSave = null;

  constructor(controllerFactory, validator, ol) {
    console.log(controllerFactory)
    this.controller = controllerFactory.createForCurrentScope();
    this.validator = validator;
    this.canSave = false;
    ValidationRules
        .ensure('address').required().minLength(3).withMessage('Title must at least be 3 chars long.')
        .on(this.form);

      ol.getObserver(this.form,'address').subscribe(() => {
        this.validate();
    });
}

attached() {
    this.validate();
}

validate() {
  this.validator.validateObject(this.form).then(results => {
      let valid = true;

      // results is an array of validation results. Each result has a
      // valid property set to true if the rule is valid.
      for (let result of results) {
          valid = valid && result.valid;
      }

      this.canSave = valid;
  });
}

  triggerAction (){
    // this.validate()
    fetch('https://localhost:44354/',{
      method:'POST',
      credentials: 'same-origin',
      body: JSON.stringify(this.form)
    })
    .then(
      response => response.json()
    )
    .then(
      response => console.log(response)
    )
    console.log("float");
  }
}
