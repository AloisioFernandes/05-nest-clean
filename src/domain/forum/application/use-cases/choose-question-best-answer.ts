import { left, right, type Either } from "@/core/either.js";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error.js";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error.js";
import type { Question } from "../../enterprise/entities/question.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
