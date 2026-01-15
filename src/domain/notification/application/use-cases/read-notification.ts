import { left, right, type Either } from "@/core/either.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { Notification } from "../../enterprise/entities/notification.js";
import type { NotificationsRepository } from "../repositories/notifications-repository.js";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
