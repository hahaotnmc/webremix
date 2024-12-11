import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getProducts, Product } from "~/API/products";
import ProductList from "~/components/listProduct";



import Menu from "~/components/menu";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export  const loader: LoaderFunction = ()=>{
  
  return getProducts();
}





export default function Index() {

const products = useLoaderData<Product[]>()

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

