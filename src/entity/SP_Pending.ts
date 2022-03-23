import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { SP_Category } from "./SP_Category";
import { User } from "./User";

@Entity({ name: "sp_pending" })
export class PendingParts extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    user_id : number;

    @ManyToOne(type => User, user => user.pendingParts)
    @JoinColumn({ name: "user_id", referencedColumnName: "id"})
    user : User

    @Column()
    part_id : number;

    @ManyToOne(type => SP_Category, category => category.standardParts)
    @JoinColumn({ name : "part_id", referencedColumnName : "id" })
    spCategory : SP_Category;

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
    approved_by : number;

    @ManyToOne(type => User, user => user.pendingParts)
    @JoinColumn({ name: "approved_by", referencedColumnName: "id"})
    approveUser : User

    @Column({ type : "mediumtext" })
    sub : string;

    @Column()
    section : string;
}