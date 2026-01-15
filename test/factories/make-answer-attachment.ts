import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerAttachment, type AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment.js";

export function makeAnswerAttachment(override: Partial<AnswerAttachmentProps> = {}, id?: UniqueEntityID) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id
  );

  return answerAttachment;
}