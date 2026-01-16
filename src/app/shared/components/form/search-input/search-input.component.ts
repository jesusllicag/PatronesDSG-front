import { Component, input, output, signal, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);

  placeholder = input<string>('Buscar...');
  debounceMs = input<number>(3000);
  className = input<string>('');

  searchChange = output<string>();

  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  private searchSubscription?: Subscription;

  ngOnInit(): void {
    const searchTerm$ = toObservable(this.searchTerm);

    this.searchSubscription = searchTerm$.pipe(
      skip(1), // Skip initial value
      debounceTime(this.debounceMs()),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.isSearching.set(false);
      this.searchChange.emit(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.isSearching.set(true);
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.isSearching.set(false);
    this.searchChange.emit('');
  }
}
