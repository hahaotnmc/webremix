import { PrismaClient } from "@prisma/client";
import { Product } from "./products";


export type Cart = {
    id: number;
    productId: number;
    quantity: number;
  };
export type CartWithProduct = {
    id: number;
    productId: number;
    quantity: number;
    product: Product;
};
// export async function GetCart(){
//     const prisma = new PrismaClient();
  
//     // const cartItems = await prisma.cart.findMany({
//     //   include: {
//     //     product: true, // Bao gồm thông tin từ bảng `product`
//     //   },
//     // });
//     // return ()
//         // cartItems as CartWithProduct[])
// }

  

 
  