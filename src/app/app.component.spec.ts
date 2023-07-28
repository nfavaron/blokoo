import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PageHousingComponent } from '../le-backup-du-tutorial/tutorial---page-housing/page-housing.component';

describe('AppComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppComponent, RouterTestingModule, PageHousingComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'blokoo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('blokoo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('blokoo app is running!');
  });

  describe('increment()', () => {

    it('should return the incremented value', () => {

      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.count = 0;
      app.increment();

      expect(app.count).toEqual(1);
    })
  });

  describe('decrement()', () => {

    it('should return the decremented value', () => {

      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.count = 10;
      app.decrement();

      expect(app.count).toEqual(9);
    })
  });
});
