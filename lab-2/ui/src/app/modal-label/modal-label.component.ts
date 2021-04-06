import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContent } from '../modal/modal.component';
import { TodoItem } from '../shared/models/todoItem.model';

@Component({
  selector: 'app-modal-label',
  templateUrl: './modal-label.component.html',
  styleUrls: ['./modal-label.component.scss'],
})
export class ModalLabelComponent implements OnInit {
  @Input() public todoItem: TodoItem | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open() {
    // const modalRef = this.modalService.open(ModalContent);
    const modalRef = this.modalService.open(ModalContent, { size: 'lg' });
    modalRef.componentInstance.id = this.todoItem?.id;
    modalRef.componentInstance.title = this.todoItem?.title;
    modalRef.componentInstance.description = this.todoItem?.description;
    modalRef.componentInstance.dueDate = this.todoItem?.dueDate;
    modalRef.componentInstance.attachments = this.todoItem?.attachments;
  }
}
