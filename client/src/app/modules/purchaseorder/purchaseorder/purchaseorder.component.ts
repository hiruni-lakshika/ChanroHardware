import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../../pages/page-error/page-error.component";
import {PageLoadingComponent} from "../../../pages/page-loading/page-loading.component";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Purchaseorder} from "../../../core/entity/purchaseorder";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {Employee} from "../../../core/entity/employee";
import {query} from "@angular/animations";
import * as url from "node:url";

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
export class PurchaseorderComponent {
  isFailed: any;
  isLoading: any;
  data:any ;
  purchaseorder: any;
  hasReadAuthority: string;
  hasDeleteAuthority: any | boolean;
  enadel: any | boolean;
  enaadd: any | boolean;
  enaupd: any | boolean;
  hasWriteAuthority: any | boolean;
  hasUpdateAuthority: any | boolean;
  purchaseorderForm: FormGroup;
  imageempurl: string;
  purchaseorderSearchForm: FormGroup;
  purchaseorders: any;
  private selectedRow: Purchaseorder;
  private oldPurchaseorder: any;
  private es: any;
  private tst: any;
  private dialog: any;
  private ssdoexpected: null;
  private add: any;
  private upd: any;
  private del: any;
  private dataSource: MatTableDataSource<Employee, MatPaginator>;
  private cdr: any;
  private paginator: MatPaginator | null;

  fillForm(purchaseorder: Purchaseorder) {
    this.enableButtons(false,true,true);

    this.selectedRow = purchaseorder;

    this.purchaseorder = purchaseorder;
    this.oldPurchaseorder = this.purchaseorder;

    if(this.purchaseorder.photo){
      this.imageempurl = this.urlToImage(this.purchaseorder.photo);
      this.purchaseorderForm.controls['photo'].clearValidators();
    }
  }

  clearForm() {
    this.purchaseorderForm.reset();
    this.purchaseorderForm.controls['number'].setValue(null);
    this.purchaseorderForm.controls['doexpected'].setValue(null);
    this.purchaseorderForm.controls['expectedtotal'].setValue(null);
    this.enableButtons(true,false,false);

    this.clearImage();
  }

  deletePurchaseorder(purchaseorder: any) {
    const operation = "Delete Purchase Order " + purchaseorder.lastname +" ("+ purchaseorder.number +") ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && purchaseorder.id){
        this.es.delete(purchaseorder.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","Purchase Order Deleted Successfully");
            this.clearForm();
          },
          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    })
  }

  generateRandomNumber() {
    const numbers = this.purchaseorders.map(n => parseInt(<string>n.number?.substring(1)));
    const maxno = Math.max(...numbers);
    const nextno = maxno + 1;
    const formattedNextNumber = 'E' + nextno.toString().padStart(5, '0');
    this.purchaseorderForm.controls['number'].setValue(formattedNextNumber);
  }

  selectImage(event: any): void {
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imageempurl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/tabledefault.png';
    this.purchaseorderForm.controls['photo'].setErrors({'required': true});
  }

  clearSearch() {
    const operation = "Clear Search";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.purchaseorderSearchForm.reset();
        this.purchaseorderSearchForm.controls['ssnumber'].setValue('default');
        this.purchaseorderSearchForm.controls['ssdoexpected'].setValue('default');
        this.loadTable("");
      }
    });
  }

  handleSearch() {
    const ssnumber  = this.purchaseorderSearchForm.controls['ssnumber'].value;
    const ssdoexpected  = this.purchaseorderSearchForm.controls['ssdoexpected'].value;
    const ssdescription  = this.purchaseorderSearchForm.controls['ssdescription'].value;

    let query = ""

    if(ssnumber != null && ssnumber.trim() !="") query = query + "&number=" + ssnumber;
    if(this.ssdoexpected != null && this.ssdoexpected.trim() !="") query = query + "&doexpected=" + ssdoexpected;
    if(ssdescription != 'default') query = query + "&description=" + parseInt(ssdescription);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  addPurchaseorder() {

  }

  updatePurchaseorder(purchaseorder: any) {

  }

  private urlToImage(url: string) {
    return 'data:image/jpeg;base64,' + url;

  }

  private enableButtons(b: boolean, b2: boolean, b3: boolean) {
    this.enaadd=this.add;
    this.enaupd=this.upd;
    this.enadel=this.del;
  }

  private loadTable(s: string) {
    this.es.getAll(query).subscribe({
      next:data =>{
        this.purchaseorders = data;
        this.dataSource = new MatTableDataSource<Employee>(this.purchaseorders);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
  }
}
