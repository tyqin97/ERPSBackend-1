import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "news_announcement" })
export class NewsAnnouncement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  title : string;

  @Column()
  content : string;

  @Column({ type : "datetime" })
  datetime : Date;

  @Column()
  user_id : number;

  @ManyToOne(type => User, user => user.newsAnnouncement)
  @JoinColumn({ name: "user_id", referencedColumnName: "id"})
  user : User

  @Column()
  status : number;
}
