import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCollaboratorRoleEnum1765895104945
  implements MigrationInterface
{
  name = 'UpdateCollaboratorRoleEnum1765895104945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Update existing 'viewer' values to 'editor' (since all users can update)
    await queryRunner.query(`
      UPDATE "whiteboard_collaborators"
      SET "role" = 'editor'
      WHERE "role" = 'viewer';
    `);

    // Step 2: Drop the default constraint first
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators"
      ALTER COLUMN "role" DROP DEFAULT;
    `);

    // Step 3: Create new enum type with 'editor' and 'owner'
    await queryRunner.query(`
      CREATE TYPE "whiteboard_collaborators_role_enum_new" AS ENUM ('editor', 'owner');
    `);

    // Step 4: Alter the column to use the new enum type
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators"
      ALTER COLUMN "role" TYPE "whiteboard_collaborators_role_enum_new"
      USING "role"::text::"whiteboard_collaborators_role_enum_new";
    `);

    // Step 5: Drop the old enum type
    await queryRunner.query(`
      DROP TYPE "whiteboard_collaborators_role_enum";
    `);

    // Step 6: Rename the new enum type to the original name
    await queryRunner.query(`
      ALTER TYPE "whiteboard_collaborators_role_enum_new" 
      RENAME TO "whiteboard_collaborators_role_enum";
    `);

    // Step 7: Set the new default value
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators"
      ALTER COLUMN "role" SET DEFAULT 'editor'::"whiteboard_collaborators_role_enum";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Update existing 'owner' values to 'editor' (revert to old enum)
    await queryRunner.query(`
      UPDATE "whiteboard_collaborators"
      SET "role" = 'editor'
      WHERE "role" = 'owner';
    `);

    // Step 2: Drop the default constraint first
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators"
      ALTER COLUMN "role" DROP DEFAULT;
    `);

    // Step 3: Create old enum type with 'viewer' and 'editor'
    await queryRunner.query(`
      CREATE TYPE "whiteboard_collaborators_role_enum_old" AS ENUM ('viewer', 'editor');
    `);

    // Step 4: Alter the column to use the old enum type
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators"
      ALTER COLUMN "role" TYPE "whiteboard_collaborators_role_enum_old"
      USING "role"::text::"whiteboard_collaborators_role_enum_old";
    `);

    // Step 5: Drop the new enum type
    await queryRunner.query(`
      DROP TYPE "whiteboard_collaborators_role_enum";
    `);

    // Step 6: Rename the old enum type back
    await queryRunner.query(`
      ALTER TYPE "whiteboard_collaborators_role_enum_old" 
      RENAME TO "whiteboard_collaborators_role_enum";
    `);

    // Step 7: Set default value back to 'viewer'
    await queryRunner.query(`
      ALTER TABLE "whiteboard_collaborators"
      ALTER COLUMN "role" SET DEFAULT 'viewer'::"whiteboard_collaborators_role_enum";
    `);
  }
}

