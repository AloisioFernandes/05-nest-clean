import { DomainEvents } from "@/core/events/domain-events.js";
import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository.js";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import type { Question } from "@/domain/forum/enterprise/entities/question.js";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
}
