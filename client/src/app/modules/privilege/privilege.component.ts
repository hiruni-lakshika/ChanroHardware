import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {PageLoadingComponent} from "../../pages/page-loading/page-loading.component";
import {PageErrorComponent} from "../../pages/page-error/page-error.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {ToastService} from "../../core/util/toast.service";
import {MatDialog} from "@angular/material/dialog";
import {RoleService} from "../../core/service/user/role.service";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {Observable} from "rxjs";
import {Role} from "../../core/entity/role";
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PrivilegeService} from "../../core/service/privilege/privilege.service";
import {Privilege} from "../../core/entity/privilege";
import {Operation} from "../../core/entity/operation";
import {ModuleService} from "../../core/service/privilege/module.service";
import {OperationService} from "../../core/service/privilege/operation.service";
import {Module} from "../../core/entity/module";

@Component({
  selector: 'app-privilege',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    ReactiveFormsModule,
    MatPaginator,
    PageLoadingComponent,
    PageErrorComponent,
    AsyncPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './privilege.component.html',
  styleUrl: './privilege.component.scss'
})
export class PrivilegeComponent implements OnInit{
  isFailed = false;
  isLoading = false;

  privilegeSearchForm:FormGroup;
  privilegeForm:FormGroup;

  roles: Role[] = [];
  modules: Module[] = [];
  operations: Operation[] = [];

  privileges: Privilege[] = [];

  privilege!: Privilege;
  oldprivilege!: Privilege;

  dataSource!: MatTableDataSource<Privilege>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  protected hasUpdateAuthority = this.auths.hasAuthority("Privilege-UPDATE"); //need to be false
  protected hasDeleteAuthority = this.auths.hasAuthority("Privilege-DELETE"); //need to be false
  protected hasWriteAuthority = this.auths.hasAuthority("Privilege-WRITE"); //need to be false
  protected hasReadAuthority = this.auths.hasAuthority("Privilege-READ"); //need to be false

  constructor(
    private fb:FormBuilder,
    private auths: AuthorizationService,
    private ps:PrivilegeService,
    private cdr:ChangeDetectorRef,
    private ms:ModuleService,
    private rs:RoleService,
    private os:OperationService,
    private dialog: MatDialog,
    private tst:ToastService
  ) {
    this.privilegeSearchForm = this.fb.group({
      ssrole:['default',Validators.required],
      ssmodule:['default',Validators.required],
      ssoperation:['default',Validators.required],
    },{updateOn:"change"});

    this.privilegeForm = this.fb.group({
      "role": new FormControl(null,[Validators.required]),
      "module": new FormControl(null,[Validators.required]),
      "operation": new FormControl(null,[Validators.required]),

    },{updateOn:"change"});
  }
  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.rs.getAll().subscribe({
      next: data=>{
        this.roles = data;
      }
    });

    this.os.getAll().subscribe({
      next: data=>{
        this.operations = data;
      }
    })

    this.ms.getAll().subscribe({
      next: data=>{
        this.modules = data;
      }
    })

    this.createForm();
  }

  loadTable(query:string){
    this.ps.getAll(query).subscribe({
      next: value => {
        this.privileges = value;
        this.dataSource = new MatTableDataSource<Privilege>(this.privileges);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      },
      error: (err:any) => {
        console.log(err);
      }
    })
  }

  createForm(){

    this.privilegeForm.controls['role'].setValidators([Validators.required]);
    this.privilegeForm.controls['module'].setValidators([Validators.required]);
    this.privilegeForm.controls['operation'].setValidators([Validators.required]);

    Object.values(this.privilegeForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.privilegeForm.controls) {
      const control = this.privilegeForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldprivilege != undefined && control.valid) {
            // @ts-ignore
            if (value === this.privilege[controlName]) {
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

  fillForm(data:Privilege){
    this.enableButtons(false,true,true);

    this.privilege = data;
    this.oldprivilege = this.privilege;

    this.privilegeForm.setValue({
      operation: this.privilege.operation?.id,
      module: this.privilege.module?.id,
      role: this.privilege.role?.id,
    });

    this.privilegeForm.markAsPristine();

  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.privilegeForm.controls) {
      const control = this.privilegeForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.privilegeForm.controls){
      const control = this.privilegeForm.controls[controlName];
      if(control.errors){
        errors = errors + "<br>Invalid " + controlName;
      }
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Privilege Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{
      //this.employee = this.employeeForm.getRawValue();
      const obj:Privilege = {

        module: {id: parseInt(this.privilegeForm.controls['module'].value)},
        operation: {id: parseInt(this.privilegeForm.controls['operation'].value)},
        role: {id: parseInt(this.privilegeForm.controls['role'].value)},

      }

      this.dialog.open(ConfirmDialogComponent,{data:"Add Privilege "})
        .afterClosed().subscribe(res => {
        if(res) {
          this.ps.save(obj).subscribe({
            next:() => {
              this.tst.handleResult('success',"Privilege Saved Successfully");
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

  update(privilege: Privilege) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Privilege Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Privilege Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const obj:Privilege = {
              id: privilege.id,
              module: {id: parseInt(this.privilegeForm.controls['module'].value)},
              operation: {id: parseInt(this.privilegeForm.controls['operation'].value)},
              role: {id: parseInt(this.privilegeForm.controls['role'].value)},

            }

            this.dialog.open(ConfirmDialogComponent,{data:"Privilege Update "})
              .afterClosed().subscribe(res => {
              if(res) {
                this.ps.update(obj).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Privilege Updated Successfully");
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
          data:{heading:"Updates - Privilege Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(privilege: Privilege) {
    const operation = "Delete Privilege ";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && privilege.id){
        this.ps.delete(privilege.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","Privilege Deleted Successfully");
            this.clearForm();
          },
          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    })
  }

  clearForm() {
    this.privilegeForm.controls['module'].setValue(null);
    this.privilegeForm.controls['operation'].setValue(null);
    this.privilegeForm.controls['role'].setValue(null);
    this.enableButtons(true,false,false);
  }

  handleSearch() {
    const ssrole  = this.privilegeSearchForm.controls['ssrole'].value;
    const ssmodule  = this.privilegeSearchForm.controls['ssmodule'].value;
    const ssoperation  = this.privilegeSearchForm.controls['ssoperation'].value;

    let query = ""

    if(ssrole != 'default') query = query + "&roleid=" + parseInt(ssrole);
    if(ssmodule != 'default') query = query + "&moduleid=" + parseInt(ssmodule);
    if(ssoperation != 'default') query = query + "&operationid=" + parseInt(ssoperation);

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
        this.privilegeSearchForm.controls['ssrole'].setValue('default');
        this.privilegeSearchForm.controls['ssmodule'].setValue('default');
        this.privilegeSearchForm.controls['ssoperation'].setValue('default');
        this.loadTable("");
      }
    });
  }

}
