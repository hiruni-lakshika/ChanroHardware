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
import {User} from "../../../core/entity/user";
import {UserStatus} from "../../../core/entity/userstatus";
import {Role} from "../../../core/entity/role";

class UserTypeService {
}

class user {
}

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
export class UserComponent implements OnInit{
  isFailed = false;
  isLoading = false;

  users: User[] = [];
  roles: Role[] = [];
  userstatuses: UserStatus[] = [];

  regexes:any;

  oldUser!: User;
  user!:User;
  selectedRow!:User;

  currentOperation = '';

  imageempurl: any = 'assets/tabledefault.png';

  protected hasUpdateAuthority = this.auths.hasAuthority("User-UPDATE"); //need to be false
  protected hasDeleteAuthority = this.auths.hasAuthority("User-DELETE"); //need to be false
  protected hasWriteAuthority = this.auths.hasAuthority("User-WRITE"); //need to be false
  protected hasReadAuthority = this.auths.hasAuthority("User-READ"); //need to be false

  userSearchForm:FormGroup;
  userForm!:FormGroup;

  dataSource!: MatTableDataSource<User>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;
  private user: string;

  constructor(
    private dialog:MatDialog,
    private ds:DesignationService,
    private fb:FormBuilder,
    private tst:ToastService,
    private rs:RegexService,
    private ets:UserTypeService,
    private ess:EmployeestatusService,
    private auths:AuthorizationService,
    private cdr:ChangeDetectorRef
  ) {

    this.userSearchForm = this.fb.group({
      sslastname:[null,[Validators.pattern(/^([A-Z][a-z]*[.]?[\s]?)*([A-Z][a-z]*)$/)]],
      ssnumber:[null,[Validators.pattern(/^E[0-9]{3}$/)]],
      ssgender:['default',Validators.required],
      ssdesignation:['default',Validators.required],
    });

    this.userForm = this.fb.group({
      "username": new FormControl('',[Validators.required]),
      "password": new FormControl('',[Validators.required]),
      "salt": new FormControl('',[Validators.required]),
      "docreated": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "tocreated": new FormControl('',[Validators.required]),
    },{updateOn:'change'});
  }

  ngOnInit(): void {
    this.initialize();

  }

  initialize(){

    this.loadTable("");

    this.ds.getAll().subscribe({
     // next:data => this.designations = data,
      //error: () => this.handleResult('failed')
    });

    this.rs.getRegexes('user').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

    this.ess.getAll().subscribe({
      next:data => this.userstatuses=data;
    });

    this.ets.getAll().subscribe({
      next:data => this.usertype=data;
    });
  }

  loadTable(query:string){
    this.es.getAll(query).subscribe({
      next:data =>{
        this.users=data;
        this.dataSource = new MatTableDataSource<Employee>(this.users);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
  }


  createForm(){
    this.userForm.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.userForm.controls['firstname'].setValidators([Validators.required, Validators.pattern(this.regexes['firstname']['regex'])]);
    this.userForm.controls['lastname'].setValidators([Validators.required, Validators.pattern(this.regexes['lastname']['regex'])]);
    this.userForm.controls['gender'].setValidators([Validators.required]);
    this.userForm.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.userForm.controls['dob'].setValidators([Validators.required]);
    this.userForm.controls['photo'].setValidators([Validators.required]);
    this.userForm.controls['doassigned'].setValidators([Validators.required]);
    this.userForm.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.userForm.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
    this.userForm.controls['land'].setValidators([Validators.required,Validators.pattern(this.regexes['land']['regex'])]);
    this.userForm.controls['designation'].setValidators([Validators.required]);
    this.userForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.userForm.controls['employeetype'].setValidators([Validators.required]);
    this.userForm.controls['employeestatus'].setValidators([Validators.required]);

    Object.values(this.userForm.controls).forEach( control => { control.markAsTouched(); } );

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
    this.enableButtons(true,false,false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  selectImage(event: any): void {
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imageempurl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  urlToImage(url:string){
    return 'data:image/jpeg;base64,' + url;
  }

  clearImage(): void {
    this.imageempurl = 'assets/tabledefault.png';
    this.userForm.controls['photo'].setErrors({'required': true});
  }

  fillForm(user:user{
    this.enableButtons(false,true,true);

    this.selectedRow = user;

    this.user=this.user;
   this.oldUser=this.user;

    }

    //this.employee.photo = "";


    //this.employeeForm.patchValue(this.employee);

    this.userForm.setValue({
      username: this.user.username,
      password: this.user.password,
      salt: this.user.salt,
      docreated: this.user.docreated,
      tocreated:this.user.tocreated,
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
      //this.employee = this.employeeForm.getRawValue();
      const user:User = {
        id:this.userForm.controls['id'].value,
        username: this.userForm.controls['username'].value,
        password: this.userForm.controls['password'].value,
        user: this.userForm.controls['user'].value,
        docreated:this.userForm.controls['docreated'].value,
        tocreated:this.userForm.controls['tocreated'].value,
        description: this.userForm.controls['description'].value,


        userstatus: {id: parseInt(this.userForm.controls['userstatus'].value)},
        usertype: {id: parseInt(this.userForm.controls['usertype'].value)},

      }

      //console.log(user);

      this.currentOperation = "User Add " +user.name + " ("+this.user.name) ";

      this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
        .afterClosed().subscribe(res => {
        if(res) {
          this.es.save(user).subscribe({
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

            const users:User = {
              id: user.id,
              photo: this.imageempurl.split(',')[1],
              number: this.userForm.controls['username'].value,
              email: this.userForm.controls['password'].value,
              description: this.userForm.controls['description'].value,

              userstatus: {id: parseInt(this.userForm.controls['userstatus'].value)},
              gender: {id: parseInt(this.userForm.controls['gender'].value)},
              usertype: {id: parseInt(this.userForm.controls['usertype'].value)},

            }
            this.currentOperation = "User Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.es.update(users).subscribe({
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

    const operation = "Delete User"+user.username+ user.name +") ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && user.id){
        this.es.delete(user.id).subscribe({
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

  // generateRandomNumber(){
  //   const numbers = this.employees.map(n => parseInt(<string>n.number?.substring(1)));
  //   const maxno = Math.max(...numbers);
  //   const nextno = maxno + 1;
  //   const formattedNextNumber = 'E' + nextno.toString().padStart(5, '0');
  //   this.userForm.controls['number'].setValue(formattedNextNumber);
  // }

  clearForm(){

    this.userForm.reset();
    this.userForm.controls['designation'].setValue(null);
    this.userForm.controls['userstatus'].setValue(null);
    this.enableButtons(true,false,false);

    this.clearImage();

  }

  handleSearch(){

    const sslastname  = this.userSearchForm.controls['sslastname'].value;
    const ssnumber  = this.userSearchForm.controls['ssnumber'].value;
    // const ssgender  = this.userSearchForm.controls['ssgender'].value;
    // const ssdesignation  = this.userSearchForm.controls['ssdesignation'].value;

    let query = ""

    if(ssnumber != null && ssnumber.trim() !="") query = query + "&number=" + ssnumber;
    if(sslastname != null && sslastname.trim() !="") query = query + "&lastname=" + sslastname;
    if(ssgender != 'default') query = query + "&genderid=" + parseInt(ssgender);
    if(ssdesignation != 'default') query = query + "&designationid=" + parseInt(ssdesignation);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch();{

    const operation = "Clear Search";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res: any) => {
      if(!res){
        return;
      }else{
        this.userSearchForm.reset();
        // this.userSearchForm.controls['ssgender'].setValue('default');
        // this.userSearchForm.controls['ssdesignation'].setValue('default');
        this.loadTable("");
      }
    });
  }

