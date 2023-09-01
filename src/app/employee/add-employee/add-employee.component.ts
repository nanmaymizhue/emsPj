import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestService } from 'src/app/services/rest.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/app/services/environment';



@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {

  addEmployeeForm: FormGroup;

  educations!: FormArray;

  formBuilder: any;

  @ViewChild('content') modalContent: any;

  profileImageUrl = 'assets/defaultProfile.png';

  closeResult: string = "";

  imageName: string = "";

  syskey: string="0";


  constructor(private messageService: MessageService, private modalService: NgbModal, private rest: RestService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) {

    this.addEmployeeForm = new FormGroup({
      syskey: new FormControl(this.syskey),
      employeeId: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      nrc: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      fatherName: new FormControl('', Validators.required),
      license: new FormControl('', Validators.required),
      taxNo: new FormControl('', Validators.required),
      image: new FormControl(this.imageName),
      education: this.fb.array([], Validators.required),
    });

  }

  async ngOnInit() {       
    this.route.params.subscribe(async (param) => {
     this.syskey = param['syskey'];  
      if (this.syskey !=undefined) {
        await this.goGet();
      }else{       
        await this.addRow();
      }

   });  

  }


  get education() {
    return this.addEmployeeForm.controls["education"] as FormArray;
  }

  async addRow() {
    const educationForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.education.push(educationForm);
  }

  deleteRow(index: number) {
    this.education.removeAt(index);
  }


  async goGet() {

    const res: any = await lastValueFrom(this.rest.get('service001/getEmployeeBySyskey?syskey=' + this.syskey));

    this.addEmployeeForm.patchValue({
      syskey: res.syskey,
      employeeId: res.employeeId,
      name: res.name,
      position: res.position,
      department: res.department,
      address: res.address,
      gender: res.gender,
      nrc: res.nrc,
      dob: res.dob,
      fatherName: res.fatherName,
      license: res.license,
      taxNo: res.taxNo,
      image: res.image,
      education: res.education
    });

    this.profileImageUrl = res.image
      ? environment.apiurl+"service001/getImage?name=" + res.image
      : "assets/defaultProfile.png";

    const educationArray = this.addEmployeeForm.get('education') as FormArray;
    educationArray.clear();

    if (res.education && res.education.length > 0) {
      for (const education of res.education) {
        const educationForm = this.fb.group({
          type: [education.type, Validators.required],
          name: [education.name, Validators.required]
        });
        educationArray.push(educationForm);
      }
    }
  }

  async submitForm() {
    if (this.addEmployeeForm.valid) {
      const employeeData = this.addEmployeeForm.value;
      const res: any = await lastValueFrom(this.rest.post('service001/saveEmployee', employeeData));
      if (res.state) {
        this.messageService.openSnackBar("Save Successful !", '');
        this.router.navigate(['/employee-list']);

      } else {
        this.messageService.openSnackBar("Save Failed !", '');
      }
    } else {
      this.messageService.openSnackBar("Please fill required !", '');
    }
  }

  //image upload
  uploadModal(): void {
    this.modalService
      .open(this.modalContent, { ariaLabelledBy: 'uploadImage' });

  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const res: any = await lastValueFrom(this.rest.uploadImage('service001/uploadImage', file));
      this.imageName = res["img"];
      this.addEmployeeForm.patchValue({ image: this.imageName });
      this.modalService.dismissAll();
      // this.profileImageUrl = "http://localhost:9090/EmployeeManagementSystem/module001/service001/getImage?name=" + this.imageName;
      this.profileImageUrl=environment.apiurl + "service001/getImage?name=" + this.imageName;

    }

  }

  //delete Employee
  deleteModal(close: any, syskey: string) {
    this.syskey = syskey;
    console.log("syskey", syskey);
    this.modalService.open(close, { ariaLabelledBy: 'deleteModal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteEmployee(this.syskey);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async deleteEmployee(syskey: string) {
    console.log("Syskey" + syskey);
    const res: any = await lastValueFrom(this.rest.delete('service001/deleteEmployee?syskey=' + this.syskey));
    if (res.state) {
      this.messageService.openSnackBar("Delete Successful !", '');
    } else {
      this.messageService.openSnackBar("Delete Failed !", '');
    }
    this.router.navigate(['employee-list']);

  }

}



