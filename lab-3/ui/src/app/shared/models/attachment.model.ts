export class Attachment {
  id: number;
  pathToAttachment: string;

  constructor(id: number, pathToAttachment: string) {
    this.id = id;
    this.pathToAttachment = pathToAttachment;
  }
}
