import { LoaderFunction } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getProducts } from "~/API/products";

import ProductList from "~/components/listProduct";





export  const loader: LoaderFunction = ()=>{
    
    return getProducts();
}

export const meta: MetaFunction = () =>{
    return [{ 
        title: 'Products', 
        description: 'List of product',
    }]
};

export default function ProductIndex(){
    
    return (
        <div>
            <ProductList/>
        </div>
    );
}