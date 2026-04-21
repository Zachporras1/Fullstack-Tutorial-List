import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ToastService } from 'src/app/services/toast.service';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit, OnDestroy {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    published: false,
    name: ''
  };

  message = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private tutorialService: TutorialService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      const id = Number(this.route.snapshot.params['id']);
      if (id) this.getTutorial(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTutorial(id: number): void {
    this.isLoading = true;
    this.tutorialService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.currentTutorial = data;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load tutorial');
          this.isLoading = false;
        }
      });
  }

  updatePublished(status: boolean): void {
    const data: Partial<Tutorial> = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status,
      name: this.currentTutorial.name
    };

    this.tutorialService.updateTutorial(this.currentTutorial.id!, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentTutorial.published = status;
          this.toastService.success(`Tutorial ${status ? 'published' : 'unpublished'}`);
        },
        error: () => this.toastService.error('Failed to update publish status')
      });
  }

  deleteTutorial(): void {
    if (!confirm('Delete this tutorial? This cannot be undone.')) return;
    this.tutorialService.deleteTutorial(this.currentTutorial.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Tutorial deleted');
          this.router.navigate(['/tutorials']);
        },
        error: () => this.toastService.error('Failed to delete tutorial')
      });
  }

  updateTutorial(): void {
    this.message = '';
    this.tutorialService.updateTutorial(this.currentTutorial.id!, this.currentTutorial)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Tutorial updated successfully');
          this.message = 'Tutorial updated successfully';
        },
        error: () => this.toastService.error('Failed to update tutorial')
      });
  }
}
