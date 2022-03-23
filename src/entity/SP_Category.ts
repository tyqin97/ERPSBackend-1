import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { StandardParts } from "./SP";
import { PendingParts } from "./SP_Pending";
import { SP_TypeItems } from "./SP_TypeItem";

@Entity({ name : "sp_category" })
export class SP_Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    category_type : string;

    @Column()
    description : string;

    @Column()
    code : string;

    @Column()
    status : number;

    @OneToMany(() => StandardParts, standardPart => standardPart.SPCategory)
    standardParts : StandardParts[]

    @OneToMany(() => PendingParts, pendingPart => pendingPart.spCategory)
    pendingParts : PendingParts[]

    @OneToMany(() => SP_TypeItems, typeItems => typeItems.category)
    typeItems : SP_TypeItems[];
}