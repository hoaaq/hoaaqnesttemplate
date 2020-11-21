import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @Column()
  disabled: boolean;
  @Column()
  createddate: Date;

  jwttoken?: string;
  @Column()
  jwttoken_refresh?: string;
}
