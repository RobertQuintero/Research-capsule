import { Routes } from "@angular/router";
import { SubmittedResearchComponent } from "./submitted-research/submitted-research.component";
import { AssignedResearchComponent } from "./assigned-research/assigned-research.component";
import { AuthGuard } from "../authenticate/auth.guard";
import { ResearchGuard } from "../authenticate/research.guard";

export const routes: Routes = [
    {path: 'faculty', children: [
        {path: 'submitted-research', component: SubmittedResearchComponent},
        {path: 'assigned-research', component: AssignedResearchComponent}
    ],
    canActivate: [AuthGuard, ResearchGuard]
  }
]
