import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "sp_uom_type" })
export class SP_UomTypes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  uom_type : string;

  @Column()
  status : number;
}
