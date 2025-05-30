import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DesignationService} from "../../../core/service/employee/designation.service";
import {ToastService} from "../../../core/util/toast.service";
import {EmployeestatusService} from "../../../core/service/employee/employeestatus.service";
import {AsyncPipe} from "@angular/common";
import {RegexService} from "../../../core/service/regexes/regex.service";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";
import {PageLoadingComponent} from "../../../pages/page-loading/page-loading.component";
import {PageErrorComponent} from "../../../pages/page-error/page-error.component";
import {User} from "../../../core/entity/user";
import {UserStatus} from "../../../core/entity/userstatus";
import {Role} from "../../../core/entity/role";
import {Employee} from "../../../core/entity/employee";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {UserService} from "../../../core/service/user/user.service";
import {RoleService} from "../../../core/service/user/role.service";
import {UserstatusService} from "../../../core/service/user/userstatus.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  isFailed = false;
  isLoading = false;

  users: User[] = [];
  roles: Role[] = [];
  userstatuses: UserStatus[] = [];
  employees: Employee[] = [];

  regexes: any;

  oldUser!: User;
  user!: User;
  selectedRow!: User;

  currentOperation = '';

  imageempurl: any = 'assets/tabledefault.png';

  protected hasUpdateAuthority = this.auths.hasAuthority("User-UPDATE"); //need to be false
  protected hasDeleteAuthority = this.auths.hasAuthority("User-DELETE"); //need to be false
  protected hasWriteAuthority = this.auths.hasAuthority("User-WRITE"); //need to be false
  protected hasReadAuthority = this.auths.hasAuthority("User-READ"); //need to be false

  userSearchForm: FormGroup;
  userForm!: FormGroup;

  dataSource!: MatTableDataSource<User>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private tst: ToastService,
    private rx: RegexService,
    private rs: RoleService,
    private auths: AuthorizationService,
    private cdr: ChangeDetectorRef,
    private es: EmployeeService,
    private us: UserService,
    private uss: UserstatusService
  ) {

    this.userSearchForm = this.fb.group({
      ssusername: [null],
      ssrole: ['default', Validators.required],
      ssuserstatus: ['default', Validators.required],
    });

    this.userForm = this.fb.group({
      "username": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "userstatus": new FormControl(null, [Validators.required]),
      "role": new FormControl(null, [Validators.required]),
      "employee": new FormControl(null, [Validators.required])
    }, {updateOn: 'change'});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {

    this.loadTable("");

    this.rs.getAll().subscribe({
      next: data => this.roles = data,
      //error: () => this.handleResult('failed')
    });

    this.rx.getRegexes('user').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

    this.uss.getAll().subscribe({
      next: data => this.userstatuses = data,
    });

    this.es.getAll("").subscribe({
      next: data => this.employees = data,
    });
  }

  loadTable(query: string) {
    this.us.getAll(query).subscribe({
      next: data => {
        this.users = data;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
  }


  createForm() {
    this.userForm.controls['username'].setValidators([Validators.required, Validators.pattern(this.regexes['username']['regex'])]);
    this.userForm.controls['password'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.userForm.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.userForm.controls['role'].setValidators([Validators.required]);
    this.userForm.controls['employee'].setValidators([Validators.required]);
    this.userForm.controls['userstatus'].setValidators([Validators.required]);

    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.userForm.controls) {
      const control = this.userForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldUser != undefined && control.valid) {
            // @ts-ignore
            if (value === this.user[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  fillForm(user: User) {
    this.enableButtons(false, true, true);

    this.selectedRow = user;

    this.user = user;
    this.oldUser = this.user;


  this.userForm.setValue({
    username: this.user.username,
    password: this.user.password,
    employee: this.user.employee?.id,
    userstatus: this.user.userstatus?.id,
    role:this.user.role?.id,
    description: this.user.description,
  });

  this.userForm.markAsPristine();

}


getUpdates():string {
  let updates: string = "";
  for (const controlName in this.userForm.controls) {
    const control = this.userForm.controls[controlName];
    if (control.dirty) {
      updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
    }
  }
  return updates;
}

getErrors(){

  let errors:string = "";

  for(const controlName in this.userForm.controls){
    const control = this.userForm.controls[controlName];
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

addUser(){
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - User Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      const user:User = {
        username: this.userForm.controls['username'].value,
        password: this.userForm.controls['password'].value,
        description: this.userForm.controls['description'].value,

        userstatus: {id: parseInt(this.userForm.controls['userstatus'].value)},
        employee: {id: parseInt(this.userForm.controls['employee'].value)},
        role: {id: parseInt(this.userForm.controls['role'].value)},

      }


      this.currentOperation = "User Add " +user.username;

      this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
        .afterClosed().subscribe(res => {
        if(res) {
          this.us.save(user).subscribe({
            next:() => {
              this.tst.handleResult('success',"User saved successfully");
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

updateUser(user:User){

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - User Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - User Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const obj:User = {
              id: user.id,
              username: this.userForm.controls['username'].value,
              password: this.userForm.controls['password'].value,
              description: this.userForm.controls['description'].value,

              userstatus: {id: parseInt(this.userForm.controls['userstatus'].value)},
              employee: {id: parseInt(this.userForm.controls['employee'].value)},
              role: {id: parseInt(this.userForm.controls['role'].value)},

            }
            this.currentOperation = "User Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.us.update(obj).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"User Updated Successfully");
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
          data:{heading:"Updates - User Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }

}

deleteUser(user:User){

    const operation = "Delete User (" + user.username + ") ";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && user.id){
        this.us.delete(user.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","User Deleted Successfully");
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

    this.userForm.reset();
    this.userForm.controls['role'].setValue(null);
    this.userForm.controls['employee'].setValue(null);
    this.userForm.controls['userstatus'].setValue(null);
    this.enableButtons(true,false,false);

}

handleSearch(){

  const ssusername  = this.userSearchForm.controls['ssusername'].value;
  const ssrole  = this.userSearchForm.controls['ssrole'].value;
  const ssuserstatus  = this.userSearchForm.controls['ssuserstatus'].value;

  let query = ""

  if(ssusername != null && ssusername.trim() !="") query = query + "&username=" + ssusername;
  if(ssrole != 'default') query = query + "&roleid=" + parseInt(ssrole);
  if(ssuserstatus != 'default') query = query + "&userstatusid=" + parseInt(ssuserstatus);

  if(query != "") query = query.replace(/^./, "?")
  this.loadTable(query);
}

clearSearch(){

  const operation = "Clear Search";

  this.dialog.open(ConfirmDialogComponent,{data:operation})
    .afterClosed().subscribe((res: any) => {
    if (!res) {
      return;
    } else {
      this.userSearchForm.reset();
      this.userSearchForm.controls['ssrole'].setValue('default');
      this.userSearchForm.controls['ssuserstatus'].setValue('default');
      this.loadTable("");
    }
  })

  }

}

