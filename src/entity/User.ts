import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
  } from "typeorm";
import { ActivityLog } from "./ActivityLog";
import { NewsAnnouncement } from "./News";
import { StandardParts } from "./SP";
import { PendingParts } from "./SP_Pending";

@Entity({name: "user" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    employeeID : string;

    @Column()
    fullname : string;

    @Column()
    name : string;

    @Column()
    email : string;

    @Column()
    password : string;

    @Column()
    last_login : Date;

    @Column()
    section : string;

    @Column()
    role : string;

    @Column()
    status : number;

    @OneToMany(() => StandardParts, standardPart => standardPart.user)
    standardParts : StandardParts[];

    @OneToMany(() => PendingParts, pendingPart => pendingPart.user)
    pendingParts : PendingParts[];

    @OneToMany(() => PendingParts, pendingPart => pendingPart.approveUser)
    pendingApproved : PendingParts[];

    @OneToMany(() => NewsAnnouncement, newsAnnouncement => newsAnnouncement.user)
    newsAnnouncement : NewsAnnouncement[];

    @OneToMany(() => ActivityLog, activityLog => activityLog.user)
    activityLog : ActivityLog[];
}