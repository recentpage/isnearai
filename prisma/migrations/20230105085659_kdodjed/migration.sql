/*
  Warnings:

  - The primary key for the `Productdescription` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Productdescription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productname" TEXT,
    "productcharacteristics" TEXT,
    "toneofvoice" TEXT,
    "toolgenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Productdescription_toolgenId_fkey" FOREIGN KEY ("toolgenId") REFERENCES "Toolgen" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Productdescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Productdescription" ("createdAt", "id", "productcharacteristics", "productname", "toneofvoice", "toolgenId", "userId") SELECT "createdAt", "id", "productcharacteristics", "productname", "toneofvoice", "toolgenId", "userId" FROM "Productdescription";
DROP TABLE "Productdescription";
ALTER TABLE "new_Productdescription" RENAME TO "Productdescription";
CREATE UNIQUE INDEX "Productdescription_toolgenId_key" ON "Productdescription"("toolgenId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
