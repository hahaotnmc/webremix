import { ActionFunction, json, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Action xử lý dữ liệu form gửi lên
export const action: ActionFunction = async ({ request }) => {
  // Lấy dữ liệu từ form
  const formData = await request.formData();
  const tag = formData.get("tag");

  // Kiểm tra dữ liệu hợp lệ
  if (!tag || typeof tag !== "string" || tag.trim() === "") {
    return json({ error: "Tag không được để trống" }, { status: 400 });
  }

  try {
    // Lưu tag vào database sử dụng Prisma
    await prisma.tag.create({
      data: {
        name: tag.trim(),
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error adding tag:", error);
    return json({ error: "Có lỗi xảy ra khi thêm tag" }, { status: 500 });
  }

  // Redirect hoặc trả về thông báo thành công
  return redirect("/add"); // Redirect tới trang thành công
};

// Component hiển thị UI
export default function AddTag() {
  return (
    <div>
      
      <h1>Thêm Tag Thành Công</h1>
    </div>
  );
}
