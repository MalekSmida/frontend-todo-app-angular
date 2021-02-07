import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/Todo';
import { environment } from '../../../environments/environment';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Todo[];
  inputTodo: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.httpClient.get<any>(`${API_URL}`).subscribe(
      (response) => (this.todos = response.slice(0, 5)),
      (error) => alert('Service error, please try again')
    );
  }

  toggleDone(id: number): void {
    this.httpClient.put<Todo>(`${API_URL}/${id}`, {}).subscribe(
      (response) => {
        this.todos.map((item) => {
          if (item.id === id) item.completed = !item.completed;
          return item;
        });
      },
      (error) => alert('Service error, please try again')
    );
  }

  deleteTodo(id: number): void {
    this.httpClient.delete<Todo>(`${API_URL}/${id}`).subscribe(
      (response) => {
        this.todos = this.todos.filter((item) => item.id !== id);
      },
      (error) => alert('Service error, please try again')
    );
  }

  addTodo(): void {
    // validate input
    if (!/\w+/.test(this.inputTodo)) {
      alert('Invalid input, please try again');
      return;
    }

    this.httpClient
      .post<Todo>(`${API_URL}`, {
        title: this.inputTodo,
      })
      .subscribe(
        (response) => {
          this.todos.push({
            id: response.id, // Math.floor(Math.random() * 100)
            title: this.inputTodo,
            completed: false,
          });
          this.inputTodo = '';
        },
        (error) => alert('Service error, please try again')
      );
  }
}
