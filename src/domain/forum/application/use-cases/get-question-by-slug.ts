import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error.js";
import type { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
