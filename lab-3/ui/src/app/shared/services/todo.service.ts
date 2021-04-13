import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TodoItem } from '../models/todoItem.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getAllTodoItems(
    sortingElement: string = 'DUE_DATE',
    sortingOrder: string = 'ASC'
  ): Observable<TodoItem[]> {
    return this.httpClient
      .get<TodoItem[]>(
        `http://localhost:3000/get?sortingElement=${sortingElement}&sortingOrder=${sortingOrder}`
      )
      .pipe(
        map((todoItems) =>
          todoItems.map((todoItem) => ({
            id: todoItem.id,
            title: todoItem.title,
            description: todoItem.description,
            isDone: todoItem.isDone,
            dueDate: todoItem.dueDate,
            attachments: todoItem.attachments,
          }))
        )
      );
  }

  addTodoItem(title: string) {
    this.httpClient
      .post(`http://localhost:3000/create`, { title: title })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      .subscribe(() => {});
  }

  updateTodoItem(
    id: number,
    title: string,
    description: string,
    dueDate: Date
  ) {
    this.httpClient
      .put(`http://localhost:3000/update/${id}`, {
        title: title,
        description: description,
        dueDate: dueDate,
      })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      .subscribe(() => {});
  }

  deleteTodoItem(todoItemId: number) {
    this.httpClient
      .delete(`http://localhost:3000/delete/${todoItemId}`)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      .subscribe(() => {});
  }

  changeStatus(todoItemId: number) {
    this.httpClient
      .put(`http://localhost:3000/change-status/${todoItemId}`, null)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      .subscribe(() => {});
  }
}
