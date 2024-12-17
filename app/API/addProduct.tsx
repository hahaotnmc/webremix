import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addProduct = async (productData: { name: string, description: string, price: number, image: string , tagID:number}) => {
  await prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      image: productData.image,
      createdAt: new Date(),
      tagId: productData.tagID,
    },
  });
};
