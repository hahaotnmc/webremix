import { PrismaClient } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json,  } from "@remix-run/react";
import ProductList from "~/components/listProduct";



import Menu from "~/components/menu";

const prisma = new PrismaClient();
export const loader: LoaderFunction = async () => {
  
    
  try {
    // Lấy dữ liệu từ database
    const tags2 = await prisma.tag.findMany();
    const products = await prisma.product.findMany();
 
    
    // Trả về dữ liệu dưới dạng JSON
    return json({
      tags2: tags2 || [],
      products: products || [],
    });
  } catch (error) {
    throw new Response("Failed to load data", { status: 500 });
  }
};


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};





export default function Index() {


  
  return (




    <div>
      <div>
        <Menu/>
      </div>
      <div>
      <h2 className="text-2xl font-bold m-4">List Product</h2>

        <ProductList/>
      </div>
    </div>
  );
}

function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

