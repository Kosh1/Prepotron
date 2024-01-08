import { ObjectId, Entity, Column } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';

// TODO: DELETE THIS FILE WHEN AUTH IS REWORKED
@Entity()
export class Session extends EntityHelper {
  @Column()
  id: ObjectId;
}
