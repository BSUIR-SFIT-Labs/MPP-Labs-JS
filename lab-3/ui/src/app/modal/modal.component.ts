import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Attachment } from '../shared/models/attachment.model';
import { AttachmentService } from '../shared/services/attachment.service';
import { TodoService } from '../shared/services/todo.service';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalContent implements OnInit {
  @Input() id!: number;
  @Input() title!: string;
  @Input() description!: string;
  @Input() dueDate!: Date;

  attachments!: Attachment[];

  todoTitle!: string;
  todoDescription!: string;
  todoDueDate!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private todoService: TodoService,
    private attachmentService: AttachmentService
  ) {}

  ngOnInit(): void {
    this.attachmentService.refreshNeeded$.subscribe(() => {
      this.getAttachments();
    });
    this.getAttachments();

    const dateTime = this.dueDate ? this.dueDate.toString().slice(0, -5) : '';

    this.todoTitle = this.title;
    this.todoDescription = this.description;
    this.todoDueDate = dateTime;
  }

  editTodoItem() {
    this.todoService.updateTodoItem(
      this.id,
      this.todoTitle,
      this.todoDescription,
      new Date(this.todoDueDate)
    );
  }

  addAttachment(event: any) {
    this.attachmentService.addAttachment(this.id, event.target.files[0]);
  }

  removeAttachment(attachmentId: number) {
    const fileName = this.attachments
      .find((a) => a.id == attachmentId)
      ?.pathToAttachment.split('/')
      .reverse()[0];

    this.attachmentService.removeAttachment(attachmentId, fileName);
  }

  private getAttachments() {
    this.attachmentService
      .getAttachments(this.id)
      .subscribe((response: Attachment[]) => {
        this.attachments = response;
      });
  }
}
