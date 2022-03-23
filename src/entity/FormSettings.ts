import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "form_settings" })
export class FormSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  section: string;

  @Column()
  settings: string;

  @Column({ type: "datetime" })
  updated_date: Date;
}
