import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { UserFilterInterface } from '../interface/user-filter.interface';
import { Observable, of } from 'rxjs';
import { UserDto } from '../dto/user.dto';
import { orderBy } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  /**
   * Dependencies
   */
  private firestore = inject(Firestore);

  /**
   * Read users filtered by @filters and sorted by "acl" DESC
   */
  read(filters: UserFilterInterface): Observable<UserDto[]> {

    // Must have IDs filter
    if (filters.ids.length === 0) {

      return of([]);
    }

    return collectionData(
      query(
        collection(this.firestore, 'users'),
        where('id', 'in', filters.ids),
      )
    ) as Observable<UserDto[]>;
  }

  /**
   * Write user
   */
  async write(user: UserDto): Promise<UserDto> {

    return setDoc(doc(this.firestore, 'users', user.id), user)
      .then(() => Promise.resolve(user));
  }
}
