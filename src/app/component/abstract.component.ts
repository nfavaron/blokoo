import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-abstract',
  template: '',
  standalone: true,
})
export abstract class AbstractComponent implements OnDestroy {

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Subscribe to observable
   */
  protected subscribe<S>(observable: Observable<S>, callback: (data: S) => void): void {

    this.subscriptions.push(
      observable.subscribe(data => callback(data))
    );
  }

  /**
   * Unsubscribe fromm all observables
   */
  protected unsubscribe(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.unsubscribe();
  }
}
