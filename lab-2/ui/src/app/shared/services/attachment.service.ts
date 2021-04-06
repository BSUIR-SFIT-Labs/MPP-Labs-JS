import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Attachment } from '../models/attachment.model';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private _refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getAttachments(todoItemId: number): Observable<Attachment[]> {
    return this.httpClient
      .get<Attachment[]>(`http://localhost:3000/get-attachments/${todoItemId}`)
      .pipe(
        map((attachments) =>
          attachments.map((attachment) => ({
            id: attachment.id,
            pathToAttachment: attachment.pathToAttachment,
          }))
        )
      );
  }

  addAttachment(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.httpClient
      .put(`http://localhost:3000/add-attachment/${id}`, formData)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      .subscribe(() => {});
  }

  removeAttachment(attachmentId: number, fileName: any) {
    this.httpClient
      .delete(
        `http://localhost:3000/remove-attachment/${attachmentId}?fileName=${fileName}`
      )
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      .subscribe(() => {});
  }
}
