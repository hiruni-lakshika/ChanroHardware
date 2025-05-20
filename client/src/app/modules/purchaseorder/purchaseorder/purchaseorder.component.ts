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
  innerdata: Array<POItem> | undefined = [];

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
  }

  loadTable(query:string){
    this.pos.getAll("").subscribe({
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

  addToTable(){}
  deleteRow(innData:any){}

  handleSearch(){

  }
  clearSearch(){}


  add() {

  }

  update(purchaseOrder: any) {

  }

  delete(purchaseOrder: Purchaseorder) {

  }

  clearForm() {

  }
}
