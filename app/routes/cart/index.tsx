import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ListCart from "~/components/listCart";
import Menu from "~/components/menu";







export default function Cart(){
    
    return (
        <div>
           <div> <Menu/></div>
           <div>
                <ListCart/>
           </div>
        </div>
        
    );
}