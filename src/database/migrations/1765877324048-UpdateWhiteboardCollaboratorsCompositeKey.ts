import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWhiteboardCollaboratorsCompositeKey1765877324048
  implements MigrationInterface
{
  name = 'UpdateWhiteboardCollaboratorsCompositeKey1765877324048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique index first (if it exists)
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_whiteboard_collaborator_unique";
    `);

    // Drop the existing primary key constraint on 'id'
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators" 
      DROP CONSTRAINT IF EXISTS "PK_whiteboard_collaborators";
    `);

    // Drop the 'id' column
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators" 
      DROP COLUMN IF EXISTS "id";
    `);

    // Create composite primary key on (whiteboard_id, user_id)
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators" 
      ADD CONSTRAINT "PK_whiteboard_collaborators" 
      PRIMARY KEY ("whiteboard_id", "user_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the composite primary key
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators" 
      DROP CONSTRAINT IF EXISTS "PK_whiteboard_collaborators";
    `);

    // Add back the 'id' column
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators" 
      ADD COLUMN "id" uuid NOT NULL DEFAULT uuid_generate_v4();
    `);

    // Create primary key on 'id'
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators" 
      ADD CONSTRAINT "PK_whiteboard_collaborators" 
      PRIMARY KEY ("id");
    `);

    // Recreate the unique index
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_whiteboard_collaborator_unique" 
      ON "whiteboard_collaborators" ("whiteboard_id", "user_id");
    `);
  }
}

