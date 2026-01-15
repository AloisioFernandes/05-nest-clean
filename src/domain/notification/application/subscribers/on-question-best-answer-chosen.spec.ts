import { makeAnswer } from "test/factories/make-answer.js";
import { makeQuestion } from "test/factories/make-question.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachements-repository.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { waitFor } from "test/utils/wait-for.js";
import type { MockInstance } from "vitest";
import { SendNotificationUseCase } from "../use-cases/send-notification.js";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen.js";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Question Best Answer Chosen ", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase
    );
  });

  it("should send a notification when question has new best answer chosen", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionsRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
