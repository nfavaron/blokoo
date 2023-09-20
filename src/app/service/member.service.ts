import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, collectionData, doc, Firestore, query, setDoc } from '@angular/fire/firestore';
import { orderBy } from '@firebase/firestore';
import { MemberFilterInterface } from '../interface/member-filter.interface';
import { MemberDto } from '../dto/member.dto';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  /**
   * Dependencies
   */
  private firestore = inject(Firestore);

  /**
   * Read members filtered by @filters and sorted by "acl" DESC
   */
  read(filters: MemberFilterInterface): Observable<MemberDto[]> {

    return collectionData(
      query(
        collection(this.firestore, 'projects', filters.projectId, 'members'),
        orderBy('acl', 'desc'),
      )
    ) as Observable<MemberDto[]>;
  }

  /**
   * Write member
   */
  async write(member: MemberDto): Promise<MemberDto> {

    return setDoc(doc(this.firestore, 'projects', member.projectId, 'members', member.userId), member)
      .then(() => Promise.resolve(member));
  }
}
