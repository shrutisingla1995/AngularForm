import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { PolicyService } from '../policy.service';
import { FormGroup, FormControl, FormBuilder, FormArray,ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
portalForm:any;
emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private db: PolicyService,private _formBuilder: FormBuilder,private router: Router) { 
    this.portalForm = this._formBuilder.group({
      name: ['', Validators.required],
      desc: [''],
      website: ['', Validators.required],
      businessOwn: ['', Validators.required],
      businessStruc: ['', Validators.required],
      straddress1 :[''],
      straddress2: [''],
      city: [''],
      state: [''],
      pfname:['', Validators.required],
      plname:['', Validators.required],
      pjob:['', Validators.required],
      pmail:['', [Validators.required, Validators.email]],
      pex:['', Validators.required],
      pfax:[''],
      pmob:['', Validators.required],
      articles:[''],
      certificates:[''],
      evidence:[''],
      labourType: this._formBuilder.array([]),
      searchInput:['']
    });
    this.labourTypeDisplay = this.labourTypes.map(x => Object.assign({}, x));
    
  }
  get articles(): any { 
    return this.portalForm.get('articles');
   }
   get certificates(): any { 
    return this.portalForm.get('certificates');
   }
   get evidence(): any { 
    return this.portalForm.get('evidence');
   }

//initializing
  fileToUpload: File = null;
 
  labourTypes = [
    {id: 1, name: "Contingent Workforce", checked: false},
    {id: 2, name: "Contract to hire", checked: false},
    {id: 3, name: "Full Time", checked: false},
    {id: 4, name: "State of work- Project", checked: false},
    {id: 5, name: "State of work- Sourcing", checked: false},
    {id: 5, name: "Payroll Management", checked: false},
  ];
  labourTypeDisplay = [];
  selectedArray;

  ngOnInit() {
    
  }
// number only format 
  numberOnly(event){
    return (event.charCode !=8 && event.charCode ==0 || ( event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)));
  }
// check url starting with http
  checkURL(event){
    var string = event.target.value;
    if (!~string.indexOf("http")) {
      string = "http://" + string;
    }
    event.target.value = string;
    return event;
  }
  // on form submit
  onSubmit(form: NgForm,event) {
    console.log('Your form data : ', form.value);
    event.preventDefault();
    if(this.portalForm.valid){
      this.db.postForm(form.value).then(
        res => {
          this.portalForm.reset();
          this.router.navigate(['/submissions']);
        }
      )
    }else{
      alert('Please fill the required details *');
    }
  }
  // on selecting checkboxes- labour type
  onSelect(data: String, isChecked: boolean) {
    this.selectedArray = <FormArray>this.portalForm.controls.labourType;
    if(isChecked) {
      this.selectedArray.push(new FormControl(data));
    } else {
      let index = this.selectedArray.controls.findIndex(x => x.value == data)
      this.selectedArray.removeAt(index);
    }
    // keep sync between labourTypes and labourTypeDisplay
    const item = this.labourTypes.find(item => item.name === data);
    item.checked = isChecked;
   }
   // on search labour type
  search(): void {
    this.labourTypeDisplay = this.labourTypes.filter((tag)=>  {
      return tag.name.toLowerCase().indexOf(this.portalForm.value.searchInput) >= 0;
    });
  }

}
