import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSalesTransactionTable1703235772104 implements MigrationInterface {
    name = 'CreateSalesTransactionTable1703235772104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP COLUMN \`region\``);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD \`amount\` decimal(18,6) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD \`amount\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD \`region\` varchar(100) NULL`);
    }

}
