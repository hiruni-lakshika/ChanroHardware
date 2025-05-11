import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {Employee} from "../../../core/entity/employee";
import {Gender} from "../../../core/entity/gender";
import {Designation} from "../../../core/entity/designation";
import {EmployeeType} from "../../../core/entity/employeetype";
import {EmployeeStatus} from "../../../core/entity/employeestatus";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {GenderService} from "../../../core/service/employee/gender.service";
import {DesignationService} from "../../../core/service/employee/designation.service";
import {ToastService} from "../../../core/util/toast.service";
import {EmployeetypeService} from "../../../core/service/employee/employeetype.service";
import {EmployeestatusService} from "../../../core/service/employee/employeestatus.service";
import {AsyncPipe} from "@angular/common";
import {RegexService} from "../../../core/service/regexes/regex.service";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {PageLoadingComponent} from "../../../pages/page-loading/page-loading.component";
import {PageErrorComponent} from "../../../pages/page-error/page-error.component";
import {SupplierstatusService} from "../../../core/service/supplier/supplierstatus.service";
import {CategoryService} from "../../../core/service/supplier/category.service";
import {SupplierStatus} from "../../../core/entity/supplierstatus";
import {Supplier} from "../../../core/entity/supplier";
import {SupplierService} from "../../../core/service/supplier/supplier.service";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatGridList,
    MatGridTile,
    MatPaginator,
    AsyncPipe,
    PageLoadingComponent,
    PageErrorComponent
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit{
  isFailed = false;
  isLoading = false;

  employees: Employee[] = [];
  suppliers: Supplier[] = [];
  supplierstatuses: SupplierStatus[] = [];

  regexes:any;

  supplier!:Supplier;


  currentOperation = '';

  imageempurl: any = 'assets/tabledefault.png';

  protected hasUpdateAuthority = this.auths.hasAuthority("Supplier-UPDATE"); //need to be false
  protected hasDeleteAuthority = this.auths.hasAuthority("Supplier-DELETE"); //need to be false
  protected hasWriteAuthority = this.auths.hasAuthority("Supplier-WRITE"); //need to be false
  protected hasReadAuthority = this.auths.hasAuthority("Supplier-READ"); //need to be false

  supplierSearchForm:FormGroup;
  supplierForm!:FormGroup;

  dataSource!: MatTableDataSource<Supplier>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private dialog:MatDialog,
    private es:EmployeeService,
    private sss:SupplierstatusService,
    private ss:SupplierService,
    private fb:FormBuilder,
    private tst:ToastService,
    private rs:RegexService,
    private cs:CategoryService,
    private auths:AuthorizationService,
    private cdr:ChangeDetectorRef
  ) {

    this.supplierSearchForm = this.fb.group({
      ssname:[null],
      ssemail:[null],
      ssemployee:['default',Validators.required],
    });

    this.supplierForm = this.fb.group({
      "name": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "tpoffice": new FormControl('',[Validators.required]),
      "email": new FormControl('',[Validators.required]),
      "contactperson": new FormControl('',[Validators.required]),
      "tpcontact": new FormControl('',[Validators.required]),
      "doregistered": new FormControl('',[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
      "supplierstatus": new FormControl(null,[Validators.required]),
      "description": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});
  }

  ngOnInit(): void {
    this.initialize();

  }

  initialize(){

    this.loadTable("");

    this.sss.getAll().subscribe({
      next:data => this.supplierstatuses = data,
      // error: () => this.handleResult('failed')
    });

    this.es.getAll("").subscribe({
      next:data => this.employees = data,
      //error: () => this.handleResult('failed')
    });

    this.rs.getRegexes('supplier').subscribe({
      next:data => {
        this.regexes = data;
        // this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

  }

  loadTable(query:string){
    this.ss.getAll(query).subscribe({
      next:data =>{
        this.suppliers = data;
        this.dataSource = new MatTableDataSource<Supplier>(this.suppliers);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
  }


  // createForm(){
  //   this.employeeForm.controls['number'].setValidators([Validators.required]);
  //   this.employeeForm.controls['firstname'].setValidators([Validators.required]);
  //   this.employeeForm.controls['lastname'].setValidators([Validators.required]);
  //   this.employeeForm.controls['gender'].setValidators([Validators.required]);
  //   this.employeeForm.controls['nic'].setValidators([Validators.required]);
  //   this.employeeForm.controls['dob'].setValidators([Validators.required]);
  //   this.employeeForm.controls['photo'].setValidators([Validators.required]);
  //   this.employeeForm.controls['doassigned'].setValidators([Validators.required]);
  //   this.employeeForm.controls['email'].setValidators([Validators.required]);
  //   this.employeeForm.controls['mobile'].setValidators([Validators.required]);
  //   this.employeeForm.controls['land'].setValidators([Validators.required]);
  //   this.employeeForm.controls['designation'].setValidators([Validators.required]);
  //   this.employeeForm.controls['description'].setValidators([Validators.required]);
  //   this.employeeForm.controls['employeetype'].setValidators([Validators.required]);
  //   this.employeeForm.controls['employeestatus'].setValidators([Validators.required]);
  //
  //   Object.values(this.employeeForm.controls).forEach( control => { control.markAsTouched(); } );
  //
  //   for (const controlName in this.employeeForm.controls) {
  //     const control = this.employeeForm.controls[controlName];
  //     control.valueChanges.subscribe(value => {
  //
  //         if (this.oldEmployee != undefined && control.valid) {
  //           // @ts-ignore
  //           if (value === this.employee[controlName]) {
  //             control.markAsPristine();
  //           } else {
  //             control.markAsDirty();
  //           }
  //         } else {
  //           control.markAsPristine();
  //         }
  //       }
  //     );
  //
  //   }
  //   this.enableButtons(true,false,false);
  // }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  fillForm(employee:Employee){
    this.enableButtons(false,true,true);

    // this.selectedRow = employee;
    //
    // this.employee = employee;
    // this.oldEmployee = this.employee;

    this.supplierForm.setValue({
      // firstname: this.employee.firstname,
      // lastname: this.employee.lastname,
      // nic: this.employee.nic,
      // email: this.employee.email,
      // mobile: this.employee.mobile,
      // land: this.employee.land,
      // doassigned: this.employee.doassigned,
      // number: this.employee.number,
      // gender: this.employee.gender?.id,
      // designation: this.employee.designation?.id,
      // employeestatus: this.employee.employeestatus?.id,
      // employeetype: this.employee.employeetype?.id,
      // dob: this.employee.dob,
      // description: this.employee.description,
      // photo: "",
    });

    this.supplierForm.markAsPristine();

  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.supplierForm.controls) {
      const control = this.supplierForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.supplierForm.controls){
      const control = this.supplierForm.controls[controlName];
      if(control.errors){
        if(this.regexes[controlName] != undefined){
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        }else{
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  addEmployee(){
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Employee Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{
      //this.employee = this.employeeForm.getRawValue();
      const employee:Employee = {
        number: this.supplierForm.controls['number'].value,
        email: this.supplierForm.controls['email'].value,
        firstname: this.supplierForm.controls['firstname'].value,
        lastname: this.supplierForm.controls['lastname'].value,
        dob: this.supplierForm.controls['dob'].value,
        land: this.supplierForm.controls['land'].value,
        mobile: this.supplierForm.controls['mobile'].value,
        nic: this.supplierForm.controls['nic'].value,
        description: this.supplierForm.controls['description'].value,
        doassigned: this.supplierForm.controls['doassigned'].value,

        designation: {id: parseInt(this.supplierForm.controls['designation'].value)},
        employeestatus: {id: parseInt(this.supplierForm.controls['employeestatus'].value)},
        gender: {id: parseInt(this.supplierForm.controls['gender'].value)},
        employeetype: {id: parseInt(this.supplierForm.controls['employeetype'].value)},

      }

      //console.log(employee);

      this.currentOperation = "Employee Add " +employee.firstname + " ("+employee.number+ ") ";

      this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
        .afterClosed().subscribe(res => {
        if(res) {
          this.es.save(employee).subscribe({
            next:() => {
              this.tst.handleResult('success',"Employee Saved Successfully");
              this.loadTable("");
              this.clearForm();
            },
            error:(err:any) => {
              this.tst.handleResult('failed',err.error.data.message);
              //console.log(err);
            }
          });
        }
      })
    }

  }

  updateEmployee(employee:Employee){

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Employee Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Employee Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const employees:Employee = {
              id: employee.id,
              number: this.supplierForm.controls['number'].value,
              email: this.supplierForm.controls['email'].value,
              firstname: this.supplierForm.controls['firstname'].value,
              lastname: this.supplierForm.controls['lastname'].value,
              dob: this.supplierForm.controls['dob'].value,
              land: this.supplierForm.controls['land'].value,
              mobile: this.supplierForm.controls['mobile'].value,
              nic: this.supplierForm.controls['nic'].value,
              description: this.supplierForm.controls['description'].value,
              doassigned: this.supplierForm.controls['doassigned'].value,

              designation: {id: parseInt(this.supplierForm.controls['designation'].value)},
              employeestatus: {id: parseInt(this.supplierForm.controls['employeestatus'].value)},
              gender: {id: parseInt(this.supplierForm.controls['gender'].value)},
              employeetype: {id: parseInt(this.supplierForm.controls['employeetype'].value)},

            }
            this.currentOperation = "Employee Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.es.update(employees).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Employee Updated Successfully");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.tst.handleResult('failed',err.error.data.message);
                    //console.log(err);
                  }
                });
              }
            })

          }
        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Employee Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }

  }

  deleteEmployee(employee:Employee){

    const operation = "Delete Employee " + employee.lastname +" ("+ employee.number +") ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && employee.id){
        this.es.delete(employee.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","Employee Deleted Successfully");
            this.clearForm();
          },
          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    })
  }


  clearForm(){

    this.supplierForm.reset();
    this.supplierForm.controls['gender'].setValue(null);
    this.supplierForm.controls['designation'].setValue(null);
    this.supplierForm.controls['employeestatus'].setValue(null);
    this.enableButtons(true,false,false);


  }

  handleSearch(){

    const ssname  = this.supplierSearchForm.controls['ssname'].value;
    const ssemail  = this.supplierSearchForm.controls['ssemail'].value;
    const ssemployee  = this.supplierSearchForm.controls['ssemployee'].value;

    let query = ""

    if(ssname != null && ssname.trim() !="") query = query + "&name=" + ssname;
    if(ssemail != null && ssemail.trim() !="") query = query + "&email=" + ssemail;
    if(ssemployee != 'default') query = query + "&employeeid=" + parseInt(ssemployee);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {

      const operation = "Clear Search";

      this.dialog.open(ConfirmDialogComponent,{data:operation})
        .afterClosed().subscribe(res => {
        if(!res){
          return;
        }else{
          this.supplierSearchForm.reset();
          this.supplierSearchForm.controls['ssemployee'].setValue('default');
          this.loadTable("");
        }
      });
  }
}
