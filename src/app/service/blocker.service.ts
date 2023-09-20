import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc } from '@angular/fire/firestore';
import { orderBy } from '@firebase/firestore';
import { BlockerFilterInterface } from '../interface/blocker-filter.interface';
import { BlockerDto } from '../dto/blocker.dto';

@Injectable({
  providedIn: 'root',
})
export class BlockerService {

  /**
   * Dependencies
   */
  private firestore = inject(Firestore);

  /**
   * Read blockers filtered by @filters and sorted by "acl" DESC
   */
  read(filters: BlockerFilterInterface): Observable<BlockerDto[]> {

    return collectionData(
      query(
        collection(this.firestore, 'projects', filters.projectId, 'blockers'),
        orderBy('createTimestamp', 'desc'),
      )
    ) as Observable<BlockerDto[]>;
  }

  /**
   * Write blocker
   */
  async write(blocker: BlockerDto): Promise<BlockerDto> {

    let promise: Promise<BlockerDto> = Promise.resolve(blocker);

    // Add
    if (!blocker.id) {

      promise = addDoc(
        collection(this.firestore, 'projects', blocker.projectId, 'blockers'),
        blocker,
      )
      .then((documentReference) => {

        // Update DTO with generated ID
        blocker.id = documentReference.id;

        return Promise.resolve(blocker);
      })
    }

    // Upsert
    return promise
    .then(blocker => setDoc(doc(this.firestore, 'projects', blocker.projectId, 'blockers', blocker.id), blocker))
    .then(() => Promise.resolve(blocker));
  }
}
