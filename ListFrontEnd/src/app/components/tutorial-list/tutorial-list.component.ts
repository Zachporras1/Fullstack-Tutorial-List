import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ToastService } from 'src/app/services/toast.service';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css'],
})
export class TutorialListComponent implements OnInit, OnDestroy {
  tutorials: Tutorial[] = [];
  currentTutorial: Tutorial = {};
  currentindex = -1;
  title = '';
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  activeFilter: 'all' | 'published' = 'all';

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private tutorialService: TutorialService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.currentPage = 0;
      if (term) {
        this.searchByTitle(term);
      } else {
        this.getTutorialList();
      }
    });

    this.getTutorialList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTutorialList(): void {
    this.isLoading = true;
    this.tutorialService.getAll(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tutorials = data.content;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load tutorials');
          this.isLoading = false;
        },
      });
  }

  private getPublishedTutorials(): void {
    this.isLoading = true;
    this.tutorialService.getPublished(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tutorials = data.content;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load published tutorials');
          this.isLoading = false;
        },
      });
  }

  private searchByTitle(term: string): void {
    this.isLoading = true;
    this.tutorialService.findbyTitle(term, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tutorials = data.content;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Search failed');
          this.isLoading = false;
        },
      });
  }

  onSearchInput(term: string): void {
    this.searchSubject.next(term);
  }

  setFilter(filter: 'all' | 'published'): void {
    this.activeFilter = filter;
    this.currentPage = 0;
    this.currentTutorial = {};
    this.currentindex = -1;
    if (filter === 'published') {
      this.getPublishedTutorials();
    } else {
      this.getTutorialList();
    }
  }

  refreshList(): void {
    this.title = '';
    this.currentTutorial = {};
    this.currentindex = -1;
    this.currentPage = 0;
    this.activeFilter = 'all';
    this.getTutorialList();
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentindex = index;
  }

  removeAllTutorials(): void {
    if (!confirm('Delete ALL tutorials? This cannot be undone.')) return;
    this.isLoading = true;
    this.tutorialService.deleteAllTutorials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('All tutorials deleted');
          this.refreshList();
        },
        error: () => {
          this.toastService.error('Failed to delete all tutorials');
          this.isLoading = false;
        },
      });
  }

  deleteSingleTutorial(id: number): void {
    if (!confirm('Delete this tutorial?')) return;
    this.tutorialService.deleteTutorial(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Tutorial deleted');
          this.refreshList();
        },
        error: () => this.toastService.error('Failed to delete tutorial'),
      });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCurrentPage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCurrentPage();
    }
  }

  private loadCurrentPage(): void {
    if (this.title) {
      this.searchByTitle(this.title);
    } else if (this.activeFilter === 'published') {
      this.getPublishedTutorials();
    } else {
      this.getTutorialList();
    }
  }
}
