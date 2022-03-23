import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StandardParts } from "./SP";
import { SP_Category } from "./SP_Category";

@Entity({ name: "sp_type_item" })
export class SP_TypeItems extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_id: number;

  @ManyToOne((type) => SP_Category, (category) => category.typeItems)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  public category: SP_Category;

  @Column()
  type_item: string;

  @Column()
  status: number;

  @OneToMany(() => StandardParts, (standardPart) => standardPart.type_item)
  public standardParts: StandardParts[];
}
