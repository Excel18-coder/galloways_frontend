import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentFields1712345678902 implements MigrationInterface {
    name = 'AddPaymentFields1712345678902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new payment fields
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "method" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "paymentMethod" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "paymentProvider" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "transactionId" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "customerEmail" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "customerPhone" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "customerName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "consultationId" integer`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "diasporaRequestId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the added fields
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "diasporaRequestId"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "consultationId"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "customerName"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "customerPhone"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "customerEmail"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "paymentProvider"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "method" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "user_id" SET NOT NULL`);
    }
}