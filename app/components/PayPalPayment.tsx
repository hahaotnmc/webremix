import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalPayment = () => {
  
 const createOrder = (data: any, actions: unknown) => {
        // Order is created on the server and the order id is returned
        return fetch("/my-server/create-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product skus and quantities
                body: JSON.stringify({
                    productCart: [{
                        name: "this productname",
                        quantity: "YOUR_PRODUCT_QUANTITY",
                        total:" 550"
                    }, ],
                }),
            })
            .then((response) => response.json())
            .then((order) => order.id);
    };
    const onApprove = (data: { orderID: any; }, actions: any) => {
        // Order is captured on the server and the response is returned to the browser
        return fetch("/my-server/capture-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderID: data.orderID
                })
            })
            .then((response) => response.json());
    };

  return (
    <PayPalButtons 
        createOrder = {(data: any, actions) => createOrder(data, actions)}
        onApprove = {(data: any,actions) => onApprove(data, actions)}
    />
  );
};

export default PayPalPayment;
