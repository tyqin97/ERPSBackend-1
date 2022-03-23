import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from "typeorm";
import { ActivityLog } from "./ActivityLog";
import { SP_Category } from "./SP_Category";
import { User } from "./User";

@Entity({ name: "standard_parts" })
export class StandardParts extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    user_id : number;

    @ManyToOne(type => User, user => user.standardParts)
    @JoinColumn({ name: "user_id", referencedColumnName: "id"})
    user : User

    @Column()
    part_id : number;

    @ManyToOne(type => SP_Category, category => category.standardParts)
    @JoinColumn({ name : "part_id", referencedColumnName : "id" })
    SPCategory : SP_Category;

    @Column()
    erp_code : string;

    @Column()
    type_item : string;

    @Column()
    product_part_number : string;

    @Column()
    greatech_drawing_naming : string;

    @Column()
    description : string;

    @Column()
    brand : string;

    @Column()
    uom : string;

    @Column()
    folder_location : string;

    @Column()
    _2d_folder : string;

    @Column()
    _3d_folder : string;

    @Column()
    solidworks_folder : string;

    @Column({ type:"datetime" })
    insert_date : Date;

    @Column({ type:"datetime" })
    update_date : Date;

    @Column()
    remark : string;

    @Column()
    assign_material : string;

    @Column()
    assign_weight : string;

    @Column()
    vendor : string;

    @Column()
    status : number;

    @Column()
    section : string;

    @OneToMany(() => ActivityLog, activityLog => activityLog.sp)
    activityLog : ActivityLog[];
}