import { right, type Either } from "@/core/either.js";
import type { QuestionComment } from "../../enterprise/entities/question-comment.js";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository.js";

interface FetchQuestionCommentsUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
