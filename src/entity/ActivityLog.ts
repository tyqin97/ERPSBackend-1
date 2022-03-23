import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StandardParts } from "./SP";
import { User } from "./User";

@Entity({ name: "activity_log" })
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id : number;

  @Column({ type : "datetime" })
  timelog : Date;

  @Column()
  std_part_id : number;

  @ManyToOne(type => StandardParts, sp => sp.activityLog)
  @JoinColumn({ name: "std_part_id", referencedColumnName: "id"})
  sp : StandardParts

  @Column()
  title : string;

  @Column()
  description : string;

  @Column()
  user_id : number;

  @ManyToOne(type => User, user => user.activityLog)
  @JoinColumn({ name: "user_id", referencedColumnName: "id"})
  user : User
}
