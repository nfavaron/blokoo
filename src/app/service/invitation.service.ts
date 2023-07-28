import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InvitationDto } from '../dto/invitation.dto';
import { InvitationFilterInterface } from '../interface/invitation-filter.interface';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {

  /**
   * Dependencies
   */
  private firestore = inject(Firestore);

  /**
   * Read invitations filtered by @filters
   */
  read(filters: InvitationFilterInterface): Observable<InvitationDto[]> {

    // Must have ID filter
    if (!filters.id) {

      return of([]);
    }

    return collectionData(
      query(
        collection(this.firestore, 'invitations'),
        where('id', '==', filters.id),
      )
    ) as Observable<InvitationDto[]>;
  }

  /**
   * Write an invitation
   */
  async write(invitation: InvitationDto): Promise<InvitationDto> {

    // Upsert
    return addDoc(collection(this.firestore, 'invitations'), invitation)
      .then(documentReference => {

        // Update DTO with generated ID
        invitation.id = documentReference.id;

        // Update invitation ID
        return setDoc(doc(this.firestore, 'invitations', invitation.id), invitation).then(() => Promise.resolve(invitation));

      })

      // TODO[nico] Review if this path should be in "/acl" instead
      .then(invitation => Promise.all(
        invitation.forProjectIds.map(projectId => setDoc(doc(this.firestore, 'invitations', invitation.id, 'projects', projectId), { id: projectId })),
      ))

      // Resolve with invitation
      .then(() => Promise.resolve(invitation));
  }
}
