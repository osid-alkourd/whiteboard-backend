import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWhiteboardCollaboratorsTable1731810000000
  implements MigrationInterface
{
  name = 'CreateWhiteboardCollaboratorsTable1731810000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "whiteboard_collaborators_role_enum" AS ENUM ('viewer', 'editor');
    `);

    await queryRunner.query(`
      CREATE TABLE "whiteboard_collaborators" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "whiteboard_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" "whiteboard_collaborators_role_enum" NOT NULL DEFAULT 'viewer',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_whiteboard_collaborators" PRIMARY KEY ("id"),
        CONSTRAINT "FK_whiteboard_collaborators_board" FOREIGN KEY ("whiteboard_id") REFERENCES "whiteboards"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_whiteboard_collaborators_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_whiteboard_collaborator_unique" ON "whiteboard_collaborators" ("whiteboard_id", "user_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_whiteboard_collaborator_unique"`,
    );
    await queryRunner.query(`DROP TABLE "whiteboard_collaborators"`);
    await queryRunner.query(`DROP TYPE "whiteboard_collaborators_role_enum"`);
  }
}
