import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css'],
})
export class TutorialListComponent implements OnInit {
  tutorials!: Tutorial[];

  currentTutorial: Tutorial = {};

  currentindex = -1;

  title = '';

  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.getTutorialList();
  }

  getTutorialList() {
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.getTutorialList();
    this.currentTutorial = {};
    this.currentindex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentindex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAllTutorials().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentindex = -1;
    this.tutorialService.findbyTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  deleteSingleTutorial(id:any){
    this.tutorialService.deleteTutorial(id).subscribe(data =>{

      console.log(data)
      this.reloadList();

    } )

  }

  reloadList(){
    window.location.reload();
  }


}
