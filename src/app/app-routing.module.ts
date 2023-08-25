import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { AddEmployeeComponent } from './employee/add-employee/add-employee.component';

const routes: Routes = [
  
  {path:'',component: EmployeeListComponent}, 
   {path:'add-employee/:syskey',component: AddEmployeeComponent},
   {path:'add-employee',component: AddEmployeeComponent},
   {path:'employee-list',component: EmployeeListComponent},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
