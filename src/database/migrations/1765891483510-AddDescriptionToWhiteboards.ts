import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToWhiteboards1765891483510
  implements MigrationInterface
{
  name = 'AddDescriptionToWhiteboards1765891483510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "whiteboards" 
      ADD COLUMN "description" text;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "whiteboards" 
      DROP COLUMN IF EXISTS "description";
    `);
  }
}

