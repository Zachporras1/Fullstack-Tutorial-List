import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ToastService } from 'src/app/services/toast.service';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit, OnDestroy {
  tutorial: Tutorial = { title: '', description: '', published: false, name: '' };
  submitted = false;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private tutorialService: TutorialService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveTutorial(): void {
    this.isLoading = true;
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description,
      name: this.tutorial.name,
      published: false
    };

    this.tutorialService.createTutorial(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitted = true;
          this.isLoading = false;
          this.toastService.success('Tutorial added successfully!');
        },
        error: () => {
          this.isLoading = false;
          this.toastService.error('Failed to save tutorial. Please try again.');
        }
      });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = { title: '', description: '', published: false, name: '' };
  }
}
