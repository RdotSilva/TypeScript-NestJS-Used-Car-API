import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Report } from 'src/reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true }) // TODO: Change this default after development
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // Custom hooks that are executed only when creating and using a new Entity instance
  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with ID ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with ID ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User with ID ${this.id}`);
  }
}
