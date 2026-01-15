import type { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import type { DomainEvent } from "@/core/events/domain-event.js";
import type { Question } from "../entities/question.js";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date;
  public question: Question;
  public bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
