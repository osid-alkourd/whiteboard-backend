import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWhiteboardSnapshots1763390343600
  implements MigrationInterface
{
  name = 'CreateWhiteboardSnapshots1763390343600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "whiteboard_snapshots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "whiteboard_id" uuid NOT NULL, CONSTRAINT "PK_715757fb9b12eb52895e8ab0b04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "whiteboard_snapshots" ADD CONSTRAINT "FK_9c6471540415cd0b122137457fa" FOREIGN KEY ("whiteboard_id") REFERENCES "whiteboards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "whiteboard_snapshots" DROP CONSTRAINT "FK_9c6471540415cd0b122137457fa"`,
    );
    await queryRunner.query(`DROP TABLE "whiteboard_snapshots"`);
  }
}
