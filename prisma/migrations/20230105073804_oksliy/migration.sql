-- CreateTable
CREATE TABLE "Tools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "slug" TEXT,
    "category" TEXT,
    "status" TEXT,
    "imageUrl" TEXT,
    "model" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tools_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Toolgen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "slug" TEXT,
    "isSaved" TEXT DEFAULT 'false',
    "toolId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Toolgen_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tools" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Toolgen_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Toolgen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Copygen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT,
    "isSaved" TEXT DEFAULT 'false',
    "toolgenId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Copygen_toolgenId_fkey" FOREIGN KEY ("toolgenId") REFERENCES "Toolgen" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Productdescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productname" TEXT,
    "productcharacteristics" TEXT,
    "toneofvoice" TEXT,
    "toolgenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Productdescription_toolgenId_fkey" FOREIGN KEY ("toolgenId") REFERENCES "Toolgen" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Productdescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Productdescription_toolgenId_key" ON "Productdescription"("toolgenId");
