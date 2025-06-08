import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../core/entity/employee";
import {POStatus} from "../../../core/entity/postatus";
import {Item} from "../../../core/entity/item";
import {Supplier} from "../../../core/entity/supplier";
import {Purchaseorder} from "../../../core/entity/purchaseorder";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";
import {PurchaseorderService} from "../../../core/service/purchaseorder/purchaseorder.service";
import {ItemService} from "../../../core/service/purchaseorder/item.service";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {SupplierService} from "../../../core/service/supplier/supplier.service";
import {PostatusService} from "../../../core/service/purchaseorder/postatus.service";
import {RegexService} from "../../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../../core/util/toast.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {AsyncPipe} from "@angular/common";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {PageErrorComponent} from "../../../pages/page-error/page-error.component";
import {PageLoadingComponent} from "../../../pages/page-loading/page-loading.component";
import {Grn} from "../../../core/entity/grn";

@Component({
  selector: 'app-grn',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatGridList,
    MatGridTile,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss'
})
export class GrnComponent implements OnInit{

  isFailed: any;
  isLoading: any;

  employees:Employee[] = [];
  grnstatuses:GrnStatus[] = [];
  items:Item[] = [];
  suppliers:Supplier[] = [];
  grn:Grn[] = [];
  innerdata: GrnItem[] = [];

  grn!:Grn;
  oldGrn!:Grn;

  inndata!: any;
  oldInndata!: any;

  isInnerDataUpdated:boolean = false;

  regexes: any;

  grnSearchForm!:FormGroup;
  grnForm!:FormGroup;
  innerForm!: FormGroup;

  protected hasUpdateAuthority = this.auths.hasAuthority("Grn-UPDATE"); //need to be false
  protected hasDeleteAuthority = this.auths.hasAuthority("Grn-DELETE"); //need to be false
  protected hasWriteAuthority = this.auths.hasAuthority("Grn-WRITE"); //need to be false
  protected hasReadAuthority = this.auths.hasAuthority("Grn-READ"); //need to be false

  dataSource!: MatTableDataSource<Grn>;
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
    this.grnSearchForm = this.fb.group({
      ssnumber:[null],
      ssemployee:['default',Validators.required],
      sspostatus:['default',Validators.required],
    });

    this.grnForm = this.fb.group({
      "id": new FormControl('',[Validators.required]),
      "doreceived": new FormControl('',[Validators.required]),
      "grandtotal": new FormControl('',[Validators.required]),
      "purchaseorder_id": new FormControl('',[Validators.required]),
      "grnstatus_id": new FormControl('',[Validators.required]),
      "supplierIdsupplier": new FormControl(null,[Validators.required]),
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
      next:data => this.grnstatuses = data,
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
    this.grnForm.controls['id'].setValidators([Validators.required]);
    this.grnForm.controls['doreceived'].setValidators([Validators.required]);
    this.grnForm.controls['grandtotal'].setValidators([Validators.required]);
    this.grnForm.controls['purchaseorder_id'].setValidators([Validators.required]);
    this.grnForm.controls['grnstatus_id'].setValidators([Validators.required]);
    this.grnForm.controls['supplierIdsupplier'].setValidators([Validators.required]);

    Object.values(this.grnForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.grnForm.controls) {
      const control = this.grnForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldGrn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.grn[controlName]) {
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
        this.grns = data;
        this.dataSource = new MatTableDataSource<Grn>(this.grns);
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


  fillForm(po:Grn){
    this.enableButtons(false,true,true);

    this.grn = po;
    this.oldGrn = this.grn;

    // @ts-ignore
    this.innerdata = this.grn.grnitems;

    this.grnForm.setValue({
      id: this.grn.id,
      doreceived: this.grn.doreceived,
      grandtotal: this.grn.grandtotal,
      purchaseorder_id: this.grn.urchaseorder_id,
      grnstatus_id: this.grn.grn?.id,
      supplierIdsupplier: this.grn.supplierIdsupplier?.id,
    });

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

    this.grnForm.markAsPristine();

  }

  id = 0;
  expectedlinetotal = 0;
  grandtotal = 0;
  grnstatuses: any;
  grns: any;

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

    this.grnForm.controls['expectedtotal'].setValue(this.grandtotal);
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
    for (const controlName in this.grnForm.controls) {
      const control = this.grnForm.controls[controlName];
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

    for (const controlName in this.grnForm.controls) {
      const control = this.grnForm.controls[controlName];
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

      if (this.grnForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);

        const data:Purchaseorder = {
          id: this.grnForm.controls['id'].value,
          doreceived: this.grnForm.controls['doreceived'].value,
          grandtotal: this.grnForm.controls['grandtotal'].value,
          grnitems: this.innerdata,

          grnstatus: {id: parseInt(this.grnForm.controls['grn'].value)},
          PurchaseOrderId: {id: parseInt(this.grnForm.controls['purchaseorderid'].value)},
          supplierIdsupplier: {id: parseInt(this.grnForm.controls['supplierIdsupplier'].value)},
        }

        this.dialog.open(ConfirmDialogComponent, {data: "Add Grn"})
          .afterClosed().subscribe(res => {
          if (res) {
            this.pos.save(data).subscribe({
              next: () => {
                this.tst.handleResult('success',"Grn Saved Successfully");
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

  update(dat: Grn) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Grn Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Grn Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const data:Purchaseorder = {
              id: dat.id,
              doreceived: this.grnForm.controls['doreceived'].value,
              grandtotal: this.grnForm.controls['grandtotal'].value,
              grnitems: this.innerdata,

              grnstatus: {id: parseInt(this.grnForm.controls['grn'].value)},
              purchaseOrderId: {id: parseInt(this.grnForm.controls['purchaseOrderId'].value)},
              supplierIdsupplier: {id: parseInt(this.grnForm.controls['supplierIdsupplier'].value)},
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

  delete(purchaseOrder: Grn[]) {

    this.dialog.open(ConfirmDialogComponent,{data:"Delete PO "})
      .afterClosed().subscribe((res:boolean) => {
      if(res && purchaseOrder.id){
        this.pos.delete(this.grn.id).subscribe({
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
    this.grnForm.reset();
    this.grnForm.controls['grn'].setValue(null);
    this.grnForm.controls['supplierIdsupplier'].setValue(null);
    this.grnForm.controls['purchaseorderId'].setValue(null);

    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true,false,false);
  }

  handleSearch(){

    const ssid  = this.grnSearchForm.controls['ssid'].value;
    const sspurchaseorder  = this.grnSearchForm.controls['sspurchaseorder'].value;
    const ssgrn  = this.grnSearchForm.controls['ssgrn'].value;

    let query = ""

    if(ssid != null && ssid.trim() !="") query = query + "&id=" + ssid;
    if(ssgrn != 'default') query = query + "&grn_id=" + parseInt(ssgrn);
    if(sspurchaseorder != 'default') query = query + "&purchaseorderid=" + parseInt(sspurchaseorder);

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
        this.grnSearchForm.reset();
        this.grnSearchForm.controls['sspostatus'].setValue('default');
        this.grnSearchForm.controls['ssemployee'].setValue('default');
        this.loadTable("");
      }
    });
  }

}


