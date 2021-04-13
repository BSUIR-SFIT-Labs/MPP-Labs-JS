import { Component, OnInit } from '@angular/core';
import { TodoItem } from '../shared/models/todoItem.model';
import { TodoService } from '../shared/services/todo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  todoItems: TodoItem[] = [];
  todoInput: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.refreshNeeded$.subscribe(() => {
      this.getAllTodoItems();
    });

    this.getAllTodoItems();
  }

  getAllTodoItems(
    sortingElement: string = 'DUE_DATE',
    sortingOrder: string = 'ASC'
  ) {
    this.todoService
      .getAllTodoItems(sortingElement, sortingOrder)
      .subscribe((response: TodoItem[]) => {
        this.todoItems = response;
      });
  }

  addTodoItem() {
    this.todoService.addTodoItem(this.todoInput);
    this.todoInput = '';
  }

  changeStatus(todoItemId: number) {
    this.todoService.changeStatus(todoItemId);
  }

  deleteTodoItem(todoItemId: number) {
    this.todoService.deleteTodoItem(todoItemId);
  }
}
