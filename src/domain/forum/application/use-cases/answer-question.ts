import { right, type Either } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { Answer } from "../../enterprise/entities/answer";
import type { AnswersRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
  questionId: string;
  instructorId: string;
  attachmentsIds: string[];
  content: string;
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
