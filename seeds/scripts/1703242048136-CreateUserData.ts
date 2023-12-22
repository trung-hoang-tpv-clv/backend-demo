import { MigrationInterface, QueryRunner } from "typeorm"
import { v4 as uuidv4 } from 'uuid';
import { User } from "../../src/domain/entities";
const userId = uuidv4();

export class CreateUserData1703242048136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User);
        await userRepository.insert(new User({
            userId,
            code: 'C0001',
            email: 'test@gmail.com',
            firstName: 'trung',
            lastName: 'hoang',
            password: '123',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User);
        await userRepository.delete({ userId });
    }

}
