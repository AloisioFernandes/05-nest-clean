import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { QuestionComment, type QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment.js";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return questionComment;
}
