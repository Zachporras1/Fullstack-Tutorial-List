import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { TutorialListComponent } from './components/tutorial-list/tutorial-list.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
{path:'', redirectTo:'home', pathMatch:'full'},
{path:'home', component:HomeComponent},
{path:'tutorials', component:TutorialListComponent},
{path:'tutorials/:id', component:TutorialDetailsComponent},
{path:'add', component:AddTutorialComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
