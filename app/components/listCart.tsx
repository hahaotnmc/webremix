
import { Link } from "@remix-run/react";
import { useEffect, useReducer } from "react";
import { CartWithProduct } from "~/API/carts";


const initState ={
    products: [],
    money:'',

}

//action:
const SET_PRODUCTS = 'set_products'
const SET_MONEY = 'set_money'

const ADD_PRODUCT = 'add_product'
const SUB_PRODUCT = 'sub_product'
const DEL_PRODUCT = 'del_product'

const setProduct = ()=>{
    return {
        type: SET_PRODUCTS,
        
    }
}
const setMoney = ()=>{
    return {
        type: SET_MONEY,
    
    }
}

const addProduct = (payload:any)=>{
    return {
        type: ADD_PRODUCT,
        payload
    }
}
const subProduct = (payload:any)=>{
    return {
        type: SUB_PRODUCT,
        payload
    }
}
const delProduct = (payload:any)=>{
    return {
        type: DEL_PRODUCT,
        payload
    }
}


//reducer

const reducer = (state:any , action: any) =>{
    let Newstate;
    switch(action.type){
        case SET_PRODUCTS:{

            Newstate =
            {
                ...state,
                products: JSON.parse(localStorage.getItem('cart')||'[]'),
            }
            break;

        }
        case SET_MONEY:{
            Newstate= {
                ...state,
                money: state.products.reduce((total:any, cartItem:any) => (
                    total + cartItem.quantity * cartItem.product.price
                ), 0).toLocaleString()
            }
            break;
        }
        case ADD_PRODUCT:{
            
            const updatedProducts = state.products.map((item: any) =>
                item.id === action.payload
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedProducts));
            Newstate = {
                ...state,
                updatedProducts,
            };
            break;
        }
        case SUB_PRODUCT:{
            
            let updatedProducts = state.products.map((item: any) =>
            {   if(item.id === action.payload){  
                    return { ...item, quantity: item.quantity - 1 }
                }
                else {

                    return item
                }
            });
            const updatedProducts2 = updatedProducts.filter(
                (item: any) => item.quantity > 0
            );

            
            localStorage.setItem("cart", JSON.stringify(updatedProducts2));
            Newstate = {
                ...state,
                updatedProducts2,
            };
            break;
        }
        case DEL_PRODUCT:{
            
            const updatedProducts = state.products.filter((item: any) => {
                return item.id !== action.payload;
            });
                      
            localStorage.setItem("cart", JSON.stringify(updatedProducts));
            Newstate = {
                ...state,
                updatedProducts,
            };
            break;
        }

        default:
            throw new Error("Khong ro action");
            
    }
    
    return Newstate     
}

export default function ListCart(){
    const [state , dispatch] = useReducer(reducer , initState);
    const {products , money} = state;

    function handleAddproduct (id: number){
        dispatch(addProduct(id));
        dispatch(setProduct());
    }
    function handleSubproduct (id: number){
        dispatch(subProduct(id));
        dispatch(setProduct());
    }
    function handleDelproduct (id: number){
        dispatch(delProduct(id));
        dispatch(setProduct());
    }
    
    useEffect(() => {
        dispatch(setProduct());
    }, []);
    
    useEffect(() => {
        dispatch(setMoney());
    }, [products]);
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">List Product</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((item:any) => (
                <div
                    key={item.id}
                    className="border rounded-lg shadow-lg overflow-hidden bg-white"
                >
                    <Link to={`/products/${item.product.id}`}>
                    <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-48 object-cover"
                    />
                    </Link>
                    <div className="p-4">
                    <Link to={`/products/${item.product.id}`}>

                    <h2 className="text-lg font-semibold text-gray-800">
                        Tên sản phẩm: {item.product.name}
                    </h2>
                    </Link>

                    <div className="flex items-center mt-2">
                        <button
                             // Hàm giảm số lượng
                             onClick={()=>{handleSubproduct(item.id)}}
                            className="px-3 py-1 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
                        >
                            -
                        </button>
                        <p className="text-gray-600 mx-4">
                            Số lượng: <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <button
                             // Hàm tăng số lượng
                             onClick={()=>{handleAddproduct(item.id)}}
                            className="px-3 py-1 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
                        >
                            +
                        </button>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        //xoa san pham
                        onClick={()=>{
                            handleDelproduct(item.id)
                        }}
                        >
                        Xóa sản phẩm
                        </button>
                        <span className="text-gray-800 font-semibold">
                        {item.product.price.toLocaleString()} VND
                        
                        </span>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            <div className="mt-8">
                <h1 className="text-2xl font-bold text-gray-800">
                Tổng Cộng: {money} VND
                </h1>
            </div>
            </div>

        
    );
}