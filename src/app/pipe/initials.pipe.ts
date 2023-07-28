import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true,
})
export class InitialsPipe implements PipeTransform {

  /**
   * Transforms a name into its initials
   */
  transform(name: string): string {

    const chunks = name.split(/[\s'\-.]/i);
    const initials = [];

    if (chunks[0]) {

      initials.push(chunks[0][0]);
    }

    if (chunks.length > 1 && chunks[chunks.length - 1]) {

      initials.push(chunks[chunks.length - 1][0]);
    }

    return initials.join('').toUpperCase();
  }
}
