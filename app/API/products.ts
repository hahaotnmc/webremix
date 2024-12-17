import { PrismaClient, Tag } from "@prisma/client";
import initProduct from "./initProduct";


export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    createdAt: Date;
    tagId: number;
    tag: Tag
    
};
export async function getProducts() {
  const prisma = new PrismaClient();
  
  const products = await prisma.product.findMany();
  if (products.length ==0){
    initProduct();
  }
  return products as Product[];
}

 
  