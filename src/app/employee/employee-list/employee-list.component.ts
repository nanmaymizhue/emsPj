import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { RestService } from 'src/app/services/rest.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {


  defaultProfile:string ="assets/defaultProfile.png";

  closeResult!: string;

  fileToUpload!: any;

  _totalListcount:number=0;
  employeelist: Array<any>=[];
  syskey:string="";
  isloading:boolean=false;
  search:any = "";

  currentpage = 1;
  pagesize = 4;

  private isEmployeeIdDescending=false;  
  private isNameDescending=false;
  private isPositionDescending=false;  
  private isDepartmentDescending=false;
  private isNrcDescending=false;  
  private isLicenseDescending=false;
  private isTaxNoDescending=false;  
  private isImageDescending=false;



  constructor(private rest: RestService,private messageService: MessageService,private router:Router,private modalService:NgbModal) {

  }

  async ngOnInit(): Promise<void> {
    await this.getEmployeeList();
  }

  async getEmployeeList(){
    let  searchObj = {
      "pagesize": this.pagesize,
      "currentpage": this.currentpage,
      "searchval": this.search
      };

      this.isloading=true;
      this.employeelist=[];

      const res: any = await lastValueFrom(this.rest.post('service001/getEmployeeList',searchObj));
      this.isloading=false;

        if(res.state){
          this._totalListcount=res.total;
          this.employeelist=res.data;       
        }else{
          this.messageService.openSnackBar("Data not found !",'');
          this._totalListcount=0;
        }
  }

  handlePageChange(event:any): void {
    this.currentpage = event;
    this.getEmployeeList();
  }

  goNew(){
    this.router.navigate(['add-employee']);
  }

  goGet(syskey:string){
    this.router.navigate(['add-employee',syskey]);
  }

 

async exportToExcel():Promise<void>{   
     try {      
      const res: HttpResponse<Blob> =await lastValueFrom(this.rest.exportExcel('service001/export'));
     
      await this.downloadFile(res);
       this.messageService.openSnackBar("Download Successful !",'');
    } catch (error) {
       this.messageService.openSnackBar("Download Failed !",'');
    }
 
  }

async downloadFile(response: HttpResponse<Blob>) {
    const contentDispositionHeader: string | null = response.headers.get('Content-Disposition');
    const filename = contentDispositionHeader
      ? contentDispositionHeader.split(';')[1].trim().split('=')[1]
      : 'employee.xlsx';
  
    if (!response.body) {
      console.error('Response body is empty.');
      return;
    }
  
    const url = window.URL.createObjectURL(response.body);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

 importEmployeeModal(importEmployee:any){
  this.modalService.open(importEmployee,{ariaLabelledBy:'importEmployee'})
 }

onFileSelected(event:Event):void{
  const inputElement=event.target as HTMLInputElement;
  if(inputElement && inputElement.files && inputElement.files.length > 0){
    this.fileToUpload = inputElement.files[0];    
  }
}

async onSubmit():Promise<void>{
  if(!this.fileToUpload){
    console.log("No file selected");
    return;
  }
 
    const res:any= await lastValueFrom(this.rest.goUpload('service001/import',this.fileToUpload));
    if(res.state){
       this.messageService.openSnackBar("Import Successful !", '');
      this.modalService.dismissAll();
      await  this.getEmployeeList();
    }else{
       this.messageService.openSnackBar("Import Failed !", '');
      this.modalService.dismissAll();
    }    
 
}

sortEmployeeId(){
 this.isEmployeeIdDescending = !this.isEmployeeIdDescending;
 this.employeelist.sort((a,b)=>{
  return this.isEmployeeIdDescending? b.employeeId.localeCompare(a.employeeId) : a.employeeId.localeCompare(b.employeeId)
 })
}
sortName(){
  this.isNameDescending = !this.isNameDescending;
  this.employeelist.sort((a,b)=>{
   return this.isNameDescending? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  })
 }
 sortPosition(){
  this.isPositionDescending = !this.isPositionDescending;
  this.employeelist.sort((a,b)=>{
   return this.isPositionDescending? b.position.localeCompare(a.position) : a.position.localeCompare(b.position)
  })
 }
 sortDepartment(){
  this.isDepartmentDescending = !this.isDepartmentDescending;
  this.employeelist.sort((a,b)=>{
   return this.isDepartmentDescending? b.department.localeCompare(a.department) : a.department.localeCompare(b.department)
  })
 }
 sortNrc(){
  this.isNrcDescending = !this.isNrcDescending;
  this.employeelist.sort((a,b)=>{
   return this.isNrcDescending? b.nrc.localeCompare(a.nrc) : a.nrc.localeCompare(b.nrc)
  })
 }
 sortLicense(){
  this.isLicenseDescending = !this.isLicenseDescending;
  this.employeelist.sort((a,b)=>{
   return this.isLicenseDescending? b.license.localeCompare(a.license) : a.license.localeCompare(b.license)
  })
 }
 sortTaxNo(){
  this.isTaxNoDescending = !this.isTaxNoDescending;
  this.employeelist.sort((a,b)=>{
   return this.isTaxNoDescending? b.taxNo.localeCompare(a.taxNo) : a.taxNo.localeCompare(b.taxNo)
  })
 }
 sortImage(){
  this.isImageDescending = !this.isImageDescending;
  this.employeelist.sort((a,b)=>{
   return this.isImageDescending? b.image.localeCompare(a.image) : a.image.localeCompare(b.image)
  })
 }

}  
 