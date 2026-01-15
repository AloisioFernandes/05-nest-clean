import { Entity } from "@/core/entities/entity.js";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachment(props, id);
    
    return questionAttachment;
  }
}
