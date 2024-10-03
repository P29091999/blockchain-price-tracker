import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('alerts')
export class Alert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chain: string;

    @Column('decimal', { precision: 18, scale: 8 })
    price: number;

    @Column()
    email: string;

    @CreateDateColumn()
    createdAt: Date;
}
