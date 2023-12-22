import { In, MigrationInterface, QueryRunner } from "typeorm"
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { SalesTransaction, User } from "../../src/domain/entities";

const users: User[] = [];
for (let i = 0; i < 100; i++) {
    users.push(new User({
        userId: uuidv4(),
        code: `${faker.finance.bic({ includeBranchCode: false })}${i}`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }));
}
const userIds = users.map(user => user.userId);

export class GenerateSalesTransaction1703242366923 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const salesTransaction: SalesTransaction[] = [];
        for (let i = 0; i < 1000; i++) {
            salesTransaction.push(new SalesTransaction({
                transactionId: uuidv4(),
                transactionCode: `${faker.finance.bic({ includeBranchCode: false })}${i}`,
                itemName: faker.commerce.productName(),
                amount: Number(faker.commerce.price()),
                payment: faker.helpers.arrayElement(['Paypal', 'Credit', 'Visa', 'Zalo Pay', 'Momo']),
                source: faker.helpers.arrayElement(['Website', 'App', 'Facebook', 'Zalo', 'TikTok']),
                userId: faker.helpers.arrayElement(userIds),
            }))
        }
        await queryRunner.manager.transaction(async (entityManager) => {
            await entityManager.insert(User, users);
            await entityManager.insert(SalesTransaction, salesTransaction);
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.transaction(async (entityManager) => {
            await entityManager.delete(User, { userId: In(userIds) });
            await entityManager.delete(SalesTransaction, {});
        });
    }

}
