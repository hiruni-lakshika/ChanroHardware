import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../../pages/page-error/page-error.component";
import {PageLoadingComponent} from "../../../pages/page-loading/page-loading.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {POStatus} from "../../../core/entity/postatus";
import {Employee} from "../../../core/entity/employee";
import {Purchaseorder} from "../../../core/entity/purchaseorder";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";
import {PurchaseorderService} from "../../../core/service/purchaseorder/purchaseorder.service";
import {POItem} from "../../../core/entity/poitem";
import {Item} from "../../../core/entity/item";
import {Supplier} from "../../../core/entity/supplier";
import {ItemService} from "../../../core/service/purchaseorder/item.service";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {SupplierService} from "../../../core/service/supplier/supplier.service";
import {PostatusService} from "../../../core/service/purchaseorder/postatus.service";
import {RegexService} from "../../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {Supply} from "../../../core/entity/supply";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../../core/util/toast.service";

@Component({
  selector: 'app-purchaseorder',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridList,
    MatGridTile,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './purchaseorder.component.html',
  styleUrl: './purchaseorder.component.scss'
})
export class PurchaseorderComponent implements OnInit{
  isFailed: any;
  isLoading: any;

  employees:Employee[] = [];
  postatuses:POStatus[] = [];
  items:Item[] = [];
  suppliers:Supplier[] = [];
  purchaseorders:Purchaseorder[] = [];
  innerdata: POItem[] = [];

  purchaseOrder!:Purchaseorder;
  oldPurchaseOrder!:Purchaseorder;

  inndata!: any;
  oldInndata!: any;

  isInnerDataUpdated:boolean = false;

  regexes: any;

  purchaseorderSearchForm!:FormGroup;
  purchaseorderForm!:FormGroup;
  innerForm!: FormGroup;

  protected hasUpdateAuthority = this.auths.hasAuthority("PurchaseOrder-UPDATE"); //need to be false
  protected hasDeleteAuthority = this.auths.hasAuthority("PurchaseOrder-DELETE"); //need to be false
  protected hasWriteAuthority = this.auths.hasAuthority("PurchaseOrder-WRITE"); //need to be false
  protected hasReadAuthority = this.auths.hasAuthority("PurchaseOrder-READ"); //need to be false

  dataSource!: MatTableDataSource<Purchaseorder>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private fb:FormBuilder,
    private auths:AuthorizationService,
    private pos:PurchaseorderService,
    private cdr:ChangeDetectorRef,
    private is:ItemService,
    private es:EmployeeService,
    private ss:SupplierService,
    private poss: PostatusService,
    private rs:RegexService,
    private dialog:MatDialog,
    private tst:ToastService,
  ) {
    this.purchaseorderSearchForm = this.fb.group({
      ssnumber:[null],
      ssemployee:['default',Validators.required],
      sspostatus:['default',Validators.required],
    });

    this.purchaseorderForm = this.fb.group({
      "number": new FormControl('',[Validators.required]),
      "doexpected": new FormControl('',[Validators.required]),
      "expectedtotal": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "date": new FormControl('',[Validators.required]),
      "supplierIdsupplier": new FormControl(null,[Validators.required]),
      "postatus": new FormControl(null,[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});

    this.innerForm = this.fb.group({
      "quantity": new FormControl(''),
      "expectedlinetotal": new FormControl(''),
      "item": new FormControl(null),
    }, {updateOn: 'change'});
  }

  ngOnInit(): void {

    this.initialize();

  }

  initialize(){
    this.loadTable("");

    this.is.getAll().subscribe({
      next:data => this.items = data,
    });

    this.poss.getAll().subscribe({
      next:data => this.postatuses = data,
    });

    this.es.getAll("").subscribe({
      next:data => this.employees = data,
    });

    this.ss.getAll("").subscribe({
      next:data => this.suppliers = data,
    });

    this.rs.getRegexes('po').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  createForm(){
    this.purchaseorderForm.controls['number'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['doexpected'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['expectedtotal'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['description'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['date'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['supplierIdsupplier'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['postatus'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['employee'].setValidators([Validators.required]);
    this.purchaseorderForm.controls['employee'].setValidators([Validators.required]);

    Object.values(this.purchaseorderForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.purchaseorderForm.controls) {
      const control = this.purchaseorderForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldPurchaseOrder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purchaseOrder[controlName]) {
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
    for (const controlName in this.innerForm.controls) {
      const control = this.innerForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldInndata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.inndata[controlName]) {
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

  loadTable(query:string){
    this.pos.getAll(query).subscribe({
      next: data => {
        this.purchaseorders = data;
        this.dataSource = new MatTableDataSource<Purchaseorder>(this.purchaseorders);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }


  fillForm(po:Purchaseorder){
    this.enableButtons(false,true,true);

    this.purchaseOrder = po;
    this.oldPurchaseOrder = this.purchaseOrder;

    // @ts-ignore
    this.innerdata = this.purchaseOrder.poitems;

    this.purchaseorderForm.setValue({
      number: this.purchaseOrder.number,
      doexpected: this.purchaseOrder.doexpected,
      expectedtotal: this.purchaseOrder.expectedtotal,
      date: this.purchaseOrder.date,
      employee: this.purchaseOrder.employee?.id,
      postatus: this.purchaseOrder.postatus?.id,
      supplierIdsupplier: this.purchaseOrder.supplierIdsupplier?.id,
      description: this.purchaseOrder.description,
    });

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

    this.purchaseorderForm.markAsPristine();

  }

  id = 0;
  expectedlinetotal = 0;
  grandtotal = 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.item == null || this.inndata.quantity == "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - PO Item Add ", message: "Please Add Required Details"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.inndata != null) {

        this.calculateLineTotal(this.inndata.item.cost, this.inndata.quantity)

        let poi = new POItem(this.id, this.inndata.item, this.inndata.quantity, this.expectedlinetotal);

        let tem: POItem[] = [];
        if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

        this.innerdata = [];
        // @ts-ignore
        tem.forEach((t) => this.innerdata.push(t));

        // Clear the original array
        this.innerdata = [];

        // Add the existing records back to the original array
        // @ts-ignore
        tem.forEach((t) => this.innerdata.push(t));

        // Check if the new record already exists in the array
        let exists = this.innerdata.some(record => record.item?.id === poi.item?.id);

        if (!exists) {
          // If it does not exist, add the new record
          this.innerdata.push(poi);
        } else {
          // If it exists, you can handle it as needed, e.g., show a message
          this.dialog.open(WarningDialogComponent, {
            data: {heading: "Errors - PO Item Add ", message: "Duplicate record.<br>This record already exists in the table."}
          }).afterClosed().subscribe(res => {
            if (!res) {
              return;
            }
          });
        }

        this.id++;

        this.calculateGrandTotal();
        this.innerForm.reset();
        this.isInnerDataUpdated = true;

        for (const controlName in this.innerForm.controls) {
          this.innerForm.controls[controlName].clearValidators();
          this.innerForm.controls[controlName].updateValueAndValidity();
        }
      }
    }

  }

  calculateLineTotal(unitprice: number, qty: number) {
    this.expectedlinetotal = qty * unitprice;
  }

  calculateGrandTotal() {
    this.grandtotal = 0;

    // @ts-ignore
    this.innerdata.forEach((e) => {
      this.grandtotal = this.grandtotal + e.expectedlinetotal;
    });

    this.purchaseorderForm.controls['expectedtotal'].setValue(this.grandtotal);
  }

  deleteRow(x: any) {

    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Delete PO Item"})
      .afterClosed().subscribe(res => {
      if (res) {

        // @ts-ignore
        const index = datasources.findIndex(item => item.id === x.id);

        if (index > -1) {
          // @ts-ignore
          datasources.splice(index, 1);
        }

        this.innerdata = datasources;
        this.calculateGrandTotal();
        this.isInnerDataUpdated = true;
      }
    });
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.purchaseorderForm.controls) {
      const control = this.purchaseorderForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if(this.isInnerDataUpdated){
      updates = updates + "<br>" + "Item Quentity Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.purchaseorderForm.controls) {
      const control = this.purchaseorderForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    // @ts-ignore
    if(this.innerdata.length == 0) {
      errors = errors + "<br>Invalid Item Quentity";
    }
    return errors;
  }


  add() {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Purchase Order Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.purchaseorderForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);

        const data:Purchaseorder = {
          number: this.purchaseorderForm.controls['number'].value,
          doexpected: this.purchaseorderForm.controls['doexpected'].value,
          date: this.purchaseorderForm.controls['date'].value,
          expectedtotal: this.purchaseorderForm.controls['expectedtotal'].value,
          description: this.purchaseorderForm.controls['description'].value,
          poitems: this.innerdata,

          employee: {id: parseInt(this.purchaseorderForm.controls['employee'].value)},
          postatus: {id: parseInt(this.purchaseorderForm.controls['postatus'].value)},
          supplierIdsupplier: {id: parseInt(this.purchaseorderForm.controls['supplierIdsupplier'].value)},
        }

        this.dialog.open(ConfirmDialogComponent, {data: "Add Purchase Order"})
          .afterClosed().subscribe(res => {
          if (res) {
            this.pos.save(data).subscribe({
              next: () => {
                this.tst.handleResult('success',"Purchase Order Saved Successfully");
                this.loadTable("");
                this.clearForm();
              },
              error: (err: any) => {
                this.tst.handleResult('failed',err.error.data.message);
              }
            });
          }
        })
      }

    }
  }


  update(dat: Purchaseorder) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Purchase Order Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Purchase Order Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const data:Purchaseorder = {
              id: dat.id,
              number: this.purchaseorderForm.controls['number'].value,
              doexpected: this.purchaseorderForm.controls['doexpected'].value,
              date: this.purchaseorderForm.controls['date'].value,
              expectedtotal: this.purchaseorderForm.controls['expectedtotal'].value,
              description: this.purchaseorderForm.controls['description'].value,
              poitems: this.innerdata,

              employee: {id: parseInt(this.purchaseorderForm.controls['employee'].value)},
              postatus: {id: parseInt(this.purchaseorderForm.controls['postatus'].value)},
              supplierIdsupplier: {id: parseInt(this.purchaseorderForm.controls['supplierIdsupplier'].value)},
            }

            this.dialog.open(ConfirmDialogComponent,{data:"PO Update "})
              .afterClosed().subscribe(res => {
              if(res) {
                this.pos.update(data).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"PO Updated Successfully");
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

  delete(purchaseOrder: Purchaseorder) {

    this.dialog.open(ConfirmDialogComponent,{data:"Delete PO "})
      .afterClosed().subscribe((res:boolean) => {
      if(res && purchaseOrder.id){
        this.pos.delete(purchaseOrder.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","PO Deleted Successfully");
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
    this.purchaseorderForm.reset();
    this.purchaseorderForm.controls['employee'].setValue(null);
    this.purchaseorderForm.controls['supplierIdsupplier'].setValue(null);
    this.purchaseorderForm.controls['postatus'].setValue(null);

    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true,false,false);
  }

  handleSearch(){

    const ssnumber  = this.purchaseorderSearchForm.controls['ssnumber'].value;
    const sspostatus  = this.purchaseorderSearchForm.controls['sspostatus'].value;
    const ssemployee  = this.purchaseorderSearchForm.controls['ssemployee'].value;

    let query = ""

    if(ssnumber != null && ssnumber.trim() !="") query = query + "&number=" + ssnumber;
    if(ssemployee != 'default') query = query + "&employeeid=" + parseInt(ssemployee);
    if(sspostatus != 'default') query = query + "&postatusid=" + parseInt(sspostatus);

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
        this.purchaseorderSearchForm.reset();
        this.purchaseorderSearchForm.controls['sspostatus'].setValue('default');
        this.purchaseorderSearchForm.controls['ssemployee'].setValue('default');
        this.loadTable("");
      }
    });
  }

}
