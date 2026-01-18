import { right, type Either } from "@/core/either";
import type { Answer } from "../../enterprise/entities/answer";
import type { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    return right({ answers });
  }
}
