import { left, right, type Either } from "@/core/either.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error.js";
import { QuestionComment } from "../../enterprise/entities/question-comment.js";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
