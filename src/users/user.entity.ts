import { Exclude } from "class-transformer";
import { Report } from "src/reports/report.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({default: true})
  admin: boolean;

  @Column()
  //@Exclude() // Esto no es un mecanismo muy util pues restringue la posiblidad de tenerdiferentes 
               //rutas con diferente informacion del usuario segun se necesite
  password: string;

  @OneToMany(()=>Report, (report) => report.user)
  reports: Report[]

}