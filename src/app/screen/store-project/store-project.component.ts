import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { Router} from '@angular/router';
import { Project, Store } from 'src/app/_shared/model/model';

@Component({
  selector: 'app-store-project',
  templateUrl: './store-project.component.html',
  styleUrls: ['./store-project.component.scss'],
})
export class StoreProjectComponent implements OnInit {
  createForm: FormGroup = this.fb.group({
    Store: null,
    Project: null,
    Branch: null,
  });

  storeResponse$: any[] = [];
  projectOptions: Project[] = [];
  branchOptions: any = [];
  StoreOptions: Store[] = [];
  @Input() selectedStore: number = 0;
  @Input() selectedProject: number = 0;
  @Input() componentName: string | undefined;
  defaultSelectedValue: any;
  @Output() selectedValueChange = new EventEmitter<any>();
  globalBranchCode!: number;
  globalUserCode!: number;
  @Input() showInput1: boolean = true;
  @Input() showInput2: boolean = true;
  @Input() showInput3: boolean = false;
  @Input() hide: boolean = true;
  private subscription: Subscription;
  selectedStoreNew: number = 0;
  selectedProjectNew: number = 0;
  userName: string | null = '';
  loginTime: string | null = '';
  selectBranch!: number;
  localBranchName!: string;
  companyName!: string;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private cdr: ChangeDetectorRef,
    private storeProjectService: StoreProjectService,
    private router:Router,
  ) {
    this.subscription = this.storeProjectService.selectedOption$.subscribe(
      (option) => {
        // console.log('Selected option changed:', option);
        // Update your component based on the new selected option
      }
    );
  }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;

    this.branchOptions = JSON.parse(localStorage.getItem('AllowedBranches')!);

    if(this.branchOptions){
      if(!!this.globalBranchCode){
        this.createForm.get('Branch')?.setValue(this.globalBranchCode);
      }
      else{
        this.createForm.get('Branch')?.setValue( this.branchOptions[0].BranchCode);
        this.globalBranchCode = this.branchOptions[0].BranchCode;
      }

    }

    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });

    this.loadProjects();
    this.loadStores();

    this.onSelectionChange();
    this.cdr.detectChanges();

    this.userName = localStorage.getItem('Username');
    this.loginTime = localStorage.getItem('LoginTime');
  }

  loadStores() {
    this.apiService
      .get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.StoreOptions = res.data.map((x: Store) => ({
          DepartmentCode: x.DepartmentCode,
          DepartmentName: x.DepartmentName,
        }));
        if (Array.isArray(this.StoreOptions) && this.StoreOptions.length > 0) {
          if (this.selectedStore === 0 || this.selectedStore === null) {
            this.createForm.controls['Store'].setValue(this.StoreOptions[0]);
            this.selectedStore = this.StoreOptions[0].DepartmentCode;
            this.updateSelectedOption();
          } else {
            for (let i = 0; i < this.StoreOptions.length; i++) {
              if (this.StoreOptions[i].DepartmentCode === this.selectedStore) {
                this.createForm.controls['Store'].setValue(
                  this.StoreOptions[i]
                );
                break;
              }
            }
          }
          //   this.createForm.controls['Store'].setValue(this.StoreOptions[0]);
        } else {
          console.log('No stores found.');
        }
      });
  }

  loadProjects() {
    this.apiService
      .get(
        ApiEndpoints.GetProjectsByBranchCode +
          `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {
        this.projectOptions = res.map((x: Project) => ({
          ProjectName: x.ProjectName,
          ProjectCode: x.ProjectCode,
        }));
        if (
          Array.isArray(this.projectOptions) &&
          this.projectOptions.length > 0
        ) {
          //  this.defaultSelectedValue = this.projectResponse$[0];
          if (this.selectedProject === 0 || this.selectedProject === null) {
            this.createForm.controls['Project'].setValue(
              this.projectOptions[0]
            );
            this.selectedProject = this.projectOptions[0].ProjectCode;
            this.updateSelectedOption();
          }
          // this.createForm.controls['Project'].setValue(this.projectOptions[0]);
          else {
            for (let i = 0; i < this.projectOptions.length; i++) {
              if (this.projectOptions[i].ProjectCode === this.selectedProject) {
                this.createForm.controls['Project'].setValue(
                  this.projectOptions[i]
                );
                break; // Exit the loop once a match is found
              }
            }
          }

          // this.createForm.controls['StoreCode'].setValue(this.projectResponse$[0].StoreCode);
        } else {
          console.log('No projects found.');
        }
      });
  }

  onSelectionChange() {
    this.selectedValueChange.emit(this.defaultSelectedValue);
  }

  //====================================================================

  changeStore(e: any) {
    this.selectedStore = e.value.DepartmentCode;
    this.updateSelectedOption();
    // window.location.reload();
  }

  changeProject(e: any) {
    this.selectedProject = e.value.ProjectCode;
    this.updateSelectedOption();
    // window.location.reload();
  }

  changeBranch(e: any) {

    this.selectBranch = +e.value;
    let branch = this.branchOptions.find((option:any) => option.BranchCode == this.selectBranch);
    localStorage.setItem('BranchCode', e.value);
    localStorage.setItem('BranchName', branch.BranchName);

    // stores and projects will loaded according to branch code
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
    this.loadProjects();

    // on branch change previous selected store and project shuold be 0
    this.selectedStore = 0;
    this.selectedProject = 0;
    this.updateSelectedOption();

    window.location.reload();
  }

  private updateSelectedOption() {
    // localStorage.setItem('projectCode', this.selectedProject.toString());
    // localStorage.setItem('StoreCode', this.selectedStore.toString());
    const selectedOption = {
      DepartmentCode: this.selectedStore,
      ProjectCode: this.selectedProject,
    };
    this.storeProjectService.setSelectedOption(selectedOption);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/Login'])
  }
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
