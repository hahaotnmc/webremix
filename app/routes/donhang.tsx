import { useEffect, useState } from "react";
import Menu from "~/components/menu";

export default function PaymentDetails() {
  const [paymentItems, setPaymentItems] = useState<any[]>([]);

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    const paymentData = JSON.parse(localStorage.getItem("paymentData") || "[]");
    setPaymentItems(paymentData);
  }, []);

  return (
    <div>
        <div><Menu/></div>
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Danh sách thanh toán</h2>

      {paymentItems.length > 0 ? (
          paymentItems.map((item1: any, index: number) => (
              <div
              key={index}
              className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-300"
              >
            <h3 className="text-2xl font-semibold mb-4">Thanh toán #{index + 1}</h3>

            {/* Hiển thị thông tin thanh toán */}
            <div className="space-y-4">
                <div className="flex justify-between">
                <p className="font-semibold">Ngày đặt hàng:</p>
                <p>{item1.date}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Họ và tên:</p>
                <p>{item1.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Email:</p>
                <p>{item1.email}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Địa chỉ:</p>
                <p>{item1.address}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Số điện thoại:</p>
                <p>{item1.phone}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Tổng tiền:</p>
                <p className="text-green-500 font-bold">{item1.total} VNĐ</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Trạng thái:</p>
                <p
                  className={
                      item1.status === "Chưa thanh toán"
                      ? "text-red-500 font-bold"
                      : "text-green-500 font-bold"
                    }
                    >
                  {item1.status}
                </p>
              </div>
            </div>

            {/* Hiển thị giỏ hàng */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-2">Chi tiết giỏ hàng</h4>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">Tên SP</th>
                    <th className="px-4 py-2 border border-gray-300">Số lượng</th>
                    <th className="px-4 py-2 border border-gray-300">Giá SP</th>
                  </tr>
                </thead>
                <tbody>
                  {item1.cart.map((item2: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {item2.productName}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item2.quantity}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {item2.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
    ) : (
        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
    )}
    </div>
    </div>
  );
}
