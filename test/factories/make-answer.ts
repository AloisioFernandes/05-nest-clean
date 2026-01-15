import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import {
  Answer,
  type AnswerProps,
} from "@/domain/forum/enterprise/entities/answer.js";
import { faker } from "@faker-js/faker";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return answer;
}
