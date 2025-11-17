import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWhiteboardTable1763385161253 implements MigrationInterface {
  name = 'CreateWhiteboardTable1763385161253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "whiteboards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "is_public" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "PK_c9b7a16e551b6190f23ad5741a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "whiteboards" ADD CONSTRAINT "FK_24dfd7d46644232fd65376956c4" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "whiteboards" DROP CONSTRAINT "FK_24dfd7d46644232fd65376956c4"`,
    );
    await queryRunner.query(`DROP TABLE "whiteboards"`);
  }
}
