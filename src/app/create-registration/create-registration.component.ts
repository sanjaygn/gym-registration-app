import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {

  public packages: string[] = ["Monthly","Quaterly","Yearly"];
  public genders: string[] = ["Male","Female"];
  public importantList: string[] = [
    "Toxic Fat Reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"
  ]

  public registerForm!: FormGroup;
  public userIdtoUpdate!: number;
  public isUpdateActive: Boolean = false;

  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService, 
    private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      packageType: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });

    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
    })

    this.activatedRoute.params.subscribe(val=>{
      this.userIdtoUpdate = val['id'];

      this.api.gerRegisteredUserId(this.userIdtoUpdate).subscribe(res=>{
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
    })
    })
  }

  submit() {
    this.api.postRegistration(this.registerForm.value)
    .subscribe(res=>{
      this.toastService.success({detail:"Success", summary:"Enquiry Added", duration:3000});
      this.registerForm.reset();
    })
  }

  update() {
    console.log(this.registerForm.value);
    this.api.updateRegisterUser(this.registerForm.value, this.userIdtoUpdate)
    .subscribe(res=>{
      this.toastService.success({detail:"Success", summary:"Enquiry Updated", duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
  })
  } 

  calculateBmi(heightvalue: number) {
    const weight = this.registerForm.value.weight;
    const height = heightvalue;
    const bmi = weight/(height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch (true) {
      case bmi<18.5:
        this.registerForm.controls['bmiResult'].patchValue("Under Weight");
        break;

      case (bmi>=18.5 && bmi<25):
        this.registerForm.controls['bmiResult'].patchValue("Normal Weight");
        break;

      case (bmi>=25 && bmi<30):
        this.registerForm.controls['bmiResult'].patchValue("Over Weight");
        break;
    
      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");
        break;
    }
  }

  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      requireTrainer: user.requireTrainer,
      gender: user.gender,
      packageType: user.packageType,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }

 
}
