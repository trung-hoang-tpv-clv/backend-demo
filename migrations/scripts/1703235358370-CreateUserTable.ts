import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1703235358370 implements MigrationInterface {
    name = 'CreateUserTable1703235358370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, \`code\` varchar(50) NOT NULL, \`first_name\` varchar(50) NOT NULL, \`last_name\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(500) NOT NULL, INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), INDEX \`IDX_0df0139cdb76b2db0ccaa2d435\` (\`first_name\`, \`last_name\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0df0139cdb76b2db0ccaa2d435\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
