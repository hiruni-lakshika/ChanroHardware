import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../../pages/page-error/page-error.component";
import {PageLoadingComponent} from "../../../pages/page-loading/page-loading.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {POStatus} from "../../../core/entity/postatus";
import {Employee} from "../../../core/entity/employee";
import {Purchaseorder} from "../../../core/entity/purchaseorder";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";
import {PurchaseorderService} from "../../../core/service/purchaseorder/purchaseorder.service";
import {Supplier} from "../../../core/entity/supplier";

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
  purchaseorders:Purchaseorder[] = [];

  purchaceOrder!:Purchaseorder;
  oldPurchaceOrder!:Purchaseorder;

  purchaseorderSearchForm!:FormGroup;

  // supplierForm!:FormGroup;
  // innerForm!: FormGroup;

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
  ) {
    this.purchaseorderSearchForm = this.fb.group({
      ssnumber:[null],
      ssemployee:['default',Validators.required],
      sspostatus:['default',Validators.required],
    });
  }

  ngOnInit(): void {

    this.initialize();

  }

  initialize(){
    this.loadTable("");
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


  fillForm(po:Purchaseorder){

  }

  handleSearch(){

  }
  clearSearch(){}


}
