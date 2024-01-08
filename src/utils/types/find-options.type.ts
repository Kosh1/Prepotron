import { EntityCondition } from './entity-condition.type';

export type FindOptions<T> = {
  where: EntityCondition<T>[] | EntityCondition<T>;
};

export type FindOption<T> = {
  where: EntityCondition<T>;
};
