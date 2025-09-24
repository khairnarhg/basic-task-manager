import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  tid!: number;

  @Column()
  tname!: string;

  @Column({ nullable: true })
  tdesc!: string;

  @Column({ default: 0 })
  status!: number;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date' })
  dueDate!: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user!: User;
}
