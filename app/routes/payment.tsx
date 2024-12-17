import React, { useState, useEffect, useReducer, useRef } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { json } from "@remix-run/react";
import handleRequest from "~/entry.server";
import Menu from "~/components/menu";
import PayPalPayment from "~/components/PayPalPayment";





const initState ={
    products: [],
    money:'',
    payment:[]

}

//action:
const SET_PRODUCTS = 'set_products'
const SET_MONEY = 'set_money'

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
                ), 0).toFixed(2)
            }
            break;
        }
        default:
            throw new Error("Khong ro action");
            
    }
    
    return Newstate     
}


const initialOptions = {
    clientId: "ARoe3S4zMXkY2erRqFnVRJghH216cIekbG0thWnSRGtvSQ-8DFoedjxY4SKt00byeFTVEV1xFZpeNvhP",
    currency: "USD",
    intent: "capture",
};







export default function Payment() {
    const [state , dispatch] = useReducer(reducer , initState);
    const {products , money, payment} = state;
     
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
    });
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngừng hành động mặc định của nút form submit

        // Kiểm tra dữ liệu đầu vào
        if (!formData.name || !formData.email || !formData.address || !formData.phone) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if(money == 0){
            alert("Không thể tạo đơn hàng, Hãy thêm sản phẩm vào giỏ hàng trước.");
            window.location.href = "/cart";
            return
        }
        let paymentData = JSON.parse(localStorage.getItem('paymentData')||'[]')
        const Data = {
            ...formData,
            total: money,
            status: 'Chưa thanh toán',
            date: Date(),
            cart: products.map((item: any) => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            })),
        };
        paymentData = [...paymentData, Data]

        localStorage.setItem("paymentData", JSON.stringify(paymentData));
        localStorage.removeItem("cart");
        alert("Order thành công!");
        window.location.href = "/donhang";
};




    // Lấy thông tin giỏ hàng từ localStorage
    useEffect(() => {
        dispatch(setProduct());
    }, []);
    
    useEffect(() => {
        dispatch(setMoney());
    }, [products]);
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    let formDataRef = useRef(formData);

    useEffect(() => {
        formDataRef.current = formData; // Luôn cập nhật giá trị mới nhất của formData
    }, [formData]);


    return (
         <PayPalScriptProvider options={initialOptions}>
            <div>
                <Menu/>
            </div>
            <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Xác nhận thanh toán</h2>

                {/* Hóa đơn sản phẩm */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4">Hóa đơn của bạn</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
                                    <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                                    <th className="border border-gray-300 px-4 py-2">Đơn giá</th>
                                    <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item:any) => (
                                    <tr key={item.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.product.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${item.product.price.toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right mt-4 text-xl font-semibold">
                        Tổng số tiền: ${money||0}
                    </div>
                </div>

                {/* Form thông tin thanh toán */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4">Thông tin thanh toán</h3>
                    <form className="space-y-4" >
                        <div>
                            <label className="block text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border-gray-300 bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-gray-100 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full bg-gray-100 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập địa chỉ"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-gray-100 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                        <button
                            onClick={handlePayment}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Order sản phẩm
                        </button>
                    </form>
                </div>

                {/* Nút PayPal */}
                <div>
                    <PayPalButtons
                    createOrder={(data, actions) => {
                        // Kiểm tra xem actions.order có sẵn không
                        if (!formDataRef.current.name || !formDataRef.current.email || !formDataRef.current.address || !formDataRef.current.phone) {
                          
                            throw new Error("Không thể tạo đơn hàng, vui lòng nhập đầy đủ thông tin và thử lại.");
                        }
                        if(money ==0){
                            alert("Không thể tạo đơn hàng, Hãy thêm sản phẩm vào giỏ hàng trước.");
                            window.location.href = "/cart";
                            
                        }
                        if (!actions || !actions.order) {
                            throw new Error("Không thể tạo đơn hàng, vui lòng thử lại.");
                        }

                        // Tạo thông tin đơn hàng cho PayPal
                        const orderData = {
                        intent: "CAPTURE", // CAPTURE hoặc AUTHORIZE
                        purchase_units: [
                            {
                                reference_id: "order_" + new Date().getTime(), // ID tham chiếu đơn hàng
                                amount: {
                                    currency_code: "USD", // Mã tiền tệ
                                    value: money, // Tổng số tiền (string)
                                    breakdown: {
                                        item_total: {
                                            currency_code: "USD",
                                            value: money, // Phải khớp với giá trị trên
                                        },
                                    },
                                },
                                description: "Đơn hàng từ website của bạn",
                                items: products.map((item:any) => ({
                                    name: item.product.name, // Tên sản phẩm
                                    quantity: item.quantity.toString(), // Số lượng (chuỗi)
                                    unit_amount: {
                                        currency_code: "USD", // Mã tiền tệ
                                        value: item.product.price.toFixed(2), // Đơn giá (string)
                                    },
                                })),
                            },
                        ],
                    };

                // Tạo đơn hàng và trả về ID đơn hàng cho PayPal
                return actions.order.create(orderData);
            }}
            onApprove={(data, actions) => {
                // Kiểm tra xem actions.order có sẵn không
                if (!actions || !actions.order) {
                    throw new Error("Không thể xác nhận đơn hàng, vui lòng thử lại.");
                }
               

                return actions.order.capture().then((details) => {
                    // Xử lý thanh toán thành công, có thể lưu thông tin vào database hoặc localStorage
                    console.log("Payment successful", details);
                    alert("Thanh toán thành công!");
                    
                    // Ví dụ lưu đơn hàng vào localStorage hoặc gửi đến backend
                    let paymentData = JSON.parse(localStorage.getItem('paymentData') || '[]');
                    const paymentInfo = {
                        ...formDataRef.current,
                        total: money,
                        status: 'Đã thanh toán',
                        date: Date(),
                        cart: products.map((item: any) => ({
                            productId: item.product.id,
                            productName: item.product.name,
                            price: item.product.price,
                            quantity: item.quantity,
                        })),
                    };
                    console.log(paymentInfo);
                    
                    paymentData = [...paymentData, paymentInfo]

                    localStorage.setItem("paymentData", JSON.stringify(paymentData));
                    localStorage.removeItem("cart");

                    // Chuyển hướng đến trang xác nhận đơn hàng
                    window.location.href = "/donhang";
                });
            }}
            onError={(err) => {
                
                alert(err);
            }}
        />



            </div>
            </div>
         </PayPalScriptProvider> 
    );
}
