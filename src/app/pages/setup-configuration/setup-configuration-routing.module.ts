import { CompanyConfigComponent } from './company-config/company-config.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupDashboardComponent } from './setup-dashboard/setup-dashboard.component';
import { BranchComponent } from './branch/branch.component';
import { ProjectComponent } from './project/project.component';
import { UserDefinationComponent } from './user-defination/user-defination.component';
import { UserBranchesComponent } from './user-branches/user-branches.component';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UservouchertypeComponent } from './uservouchertype/uservouchertype.component';
import { PartySetupComponent } from './party-setup/party-setup.component';
import { PartyTypeComponent } from './party-type/party-type.component';
import { UsermenurightsComponent } from './usermenurights/usermenurights.component';
import { DocumentTypesComponent } from './Approvals/document-types/document-types.component';
import { AttachmentTypesComponent } from './Approvals/attachment-types/attachment-types.component';
import { ApprovalHirarchyComponent } from './Approvals/approval-hirarchy/approval-hirarchy.component';
import { DocumentAttachmentsComponent } from './Approvals/document-attachments/document-attachments.component';
import { DocumentApprovalsComponent } from './Approvals/document-approvals/document-approvals.component';
import { UserModulesComponent } from './user-modules/user-modules.component';
import { UserDataEntryrightComponent } from './user-data-entryright/user-data-entryright.component';
import { UserRightsComponent } from './user-rights/user-rights.component';
import { DocumentsPathComponent } from './documents-path/documents-path.component';


const routes: Routes = [

  {
    path: '',
    component: SetupDashboardComponent,
    children: [

      { path: 'document-types', component: DocumentTypesComponent },
      { path: 'attachment-types', component: AttachmentTypesComponent},
      { path: 'approval-hirarchy', component: ApprovalHirarchyComponent},
      { path: 'document-attachments', component: DocumentAttachmentsComponent},
      { path: 'document-approvals', component: DocumentApprovalsComponent},
      { path: 'company-configuration', component: CompanyConfigComponent},
      { path: 'branch',component: BranchComponent},
      { path: 'project', component: ProjectComponent},
      { path: 'party-setup', component: PartySetupComponent},
      { path: 'party-type', component: PartyTypeComponent},
      { path: 'user-defination', component: UserDefinationComponent},
      { path: 'user-modules', component: UserModulesComponent},
      { path: 'user-rights', component: UserRightsComponent},
      { path: 'user-data-entry-rights', component: UserDataEntryrightComponent},
      { path: 'documents-path', component: DocumentsPathComponent},
      { path: 'user-branches', component: UserBranchesComponent},
      { path: 'user-projects', component: UserProjectsComponent},
      { path: 'uservouchertype', component: UservouchertypeComponent},
      { path: 'usermenurights',component: UsermenurightsComponent},
     

    ],
  },
  { path: '**', redirectTo: 'Dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupConfigurationRoutingModule {}
