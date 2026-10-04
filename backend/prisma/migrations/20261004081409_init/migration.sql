/*
  Warnings:

  - You are about to drop the column `quantity` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `quantityInStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockStatus` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalPrice";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quantityInStock",
DROP COLUMN "stockStatus",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
