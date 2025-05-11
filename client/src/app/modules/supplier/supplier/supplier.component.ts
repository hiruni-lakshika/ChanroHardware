import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {Employee} from "../../../core/entity/employee";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {ToastService} from "../../../core/util/toast.service";
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
import {RouterLink} from "@angular/router";
import {Category} from "../../../core/entity/category";

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
    PageErrorComponent,
    RouterLink
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
  categories: Category[] = [];

  regexes:any;

  supplier!:Supplier;
  oldSupplier!: Supplier;
  currentOperation = '';

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

    this.cs.getAll().subscribe({
      next:data => this.categories = data,
      //error: () => this.handleResult('failed')
    });

    this.rs.getRegexes('supplier').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
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


  createForm(){
    this.supplierForm.controls['name'].setValidators([Validators.required]);
    this.supplierForm.controls['address'].setValidators([Validators.required]);
    this.supplierForm.controls['tpoffice'].setValidators([Validators.required]);
    this.supplierForm.controls['email'].setValidators([Validators.required]);
    this.supplierForm.controls['contactperson'].setValidators([Validators.required]);
    this.supplierForm.controls['tpcontact'].setValidators([Validators.required]);
    this.supplierForm.controls['doregistered'].setValidators([Validators.required]);
    this.supplierForm.controls['employee'].setValidators([Validators.required]);
    this.supplierForm.controls['supplierstatus'].setValidators([Validators.required]);
    this.supplierForm.controls['description'].setValidators([Validators.required]);

    Object.values(this.supplierForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.supplierForm.controls) {
      const control = this.supplierForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldSupplier != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supplier[controlName]) {
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

  fillForm(data:Supplier){
    this.enableButtons(false,true,true);

    this.supplier = data;
    this.oldSupplier = this.supplier;

    this.supplierForm.setValue({
      name: this.supplier.name,
      address: this.supplier.address,
      tpoffice: this.supplier.tpoffice,
      email: this.supplier.email,
      contactperson: this.supplier.contactperson,
      tpcontact: this.supplier.tpcontact,
      doregistered: this.supplier.doregistered,
      employee: this.supplier.employee?.id,
      supplierstatus: this.supplier.supplierstatus?.id,
      description: this.supplier.description,
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

  add(){
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Supplier Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{
      const data:Supplier = {
        name: this.supplierForm.controls['name'].value,
        address: this.supplierForm.controls['address'].value,
        tpoffice: this.supplierForm.controls['tpoffice'].value,
        email: this.supplierForm.controls['email'].value,
        contactperson: this.supplierForm.controls['contactperson'].value,
        tpcontact: this.supplierForm.controls['tpcontact'].value,
        doregistered: this.supplierForm.controls['doregistered'].value,
        description: this.supplierForm.controls['description'].value,

        supplierstatus: {id: parseInt(this.supplierForm.controls['supplierstatus'].value)},
        employee: {id: parseInt(this.supplierForm.controls['employee'].value)},

      }

      this.currentOperation = "Supplier Add ";

      this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
        .afterClosed().subscribe(res => {
        if(res) {
          this.ss.save(data).subscribe({
            next:() => {
              this.tst.handleResult('success',"Supplier Saved Successfully");
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

  update(supplier:Supplier){

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Supplier Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Supplier Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const data:Supplier = {
              id: supplier.id,
              name: this.supplierForm.controls['name'].value,
              address: this.supplierForm.controls['address'].value,
              tpoffice: this.supplierForm.controls['tpoffice'].value,
              email: this.supplierForm.controls['email'].value,
              contactperson: this.supplierForm.controls['contactperson'].value,
              tpcontact: this.supplierForm.controls['tpcontact'].value,
              doregistered: this.supplierForm.controls['doregistered'].value,
              description: this.supplierForm.controls['description'].value,

              supplierstatus: {id: parseInt(this.supplierForm.controls['supplierstatus'].value)},
              employee: {id: parseInt(this.supplierForm.controls['employee'].value)},

            }
            this.currentOperation = "Supplier Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.ss.update(data).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Supplier Updated Successfully");
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
          data:{heading:"Updates - Supplier Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }

  }

  delete(supplier:Supplier){

    const operation = "Delete Supplier ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && supplier.id){
        this.ss.delete(supplier.id).subscribe({
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
    this.supplierForm.controls['employee'].setValue(null);
    this.supplierForm.controls['supplierstatus'].setValue(null);
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
