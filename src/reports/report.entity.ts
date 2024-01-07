import { User } from "src/users/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";

@Entity()
export class Report {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @ManyToOne(()=>User, (user) => user.reports)
  user: User
}