import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  newMessage: string;
  nick: string;
  messageList: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    });

    console.log(this.messageList.length);
  }

  sendMessage() {
    this.chatService.sendMessage(this.nick + ': ' + this.newMessage);
  }
}
