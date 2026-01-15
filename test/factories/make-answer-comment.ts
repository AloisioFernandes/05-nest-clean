import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerComment, type AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment.js";
import { faker } from "@faker-js/faker";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return answerComment;
}
