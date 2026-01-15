import { vi } from "vitest";
import { AggregateRoot } from "../entities/aggregate-root.js";
import { UniqueEntityID } from "../entities/unique-entity-id.js";
import type { DomainEvent } from "./domain-event.js";
import { DomainEvents } from "./domain-events.js";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe("Domain Events", () => {
  it("should be able to dispatch and listen to events", () => {
    const callbackSpy = vi.fn();

    // Subsriber cadastrado (ouvindo event de resposta criada)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Criando resposta sem salvar no banco
    const aggregate = CustomAggregate.create();

    // Assegurando que o evento foi criado, mas não disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Salvando resposta no banco e disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // Subscriber ouve o evento e executa ações com o dado
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
