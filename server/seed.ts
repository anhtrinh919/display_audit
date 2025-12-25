import { db } from "./db";
import { stores, categories } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed stores
    const storeData = [
      { storeId: "BVI", name: "Big C Vincom", location: "TP.HCM - Quận 1", manager: "Nguyễn Văn A", active: true },
      { storeId: "S001", name: "Siêu thị CoopMart Xa lộ", location: "TP.HCM - Thủ Đức", manager: "Trần Thị B", active: true },
      { storeId: "S002", name: "Lotte Mart Q7", location: "TP.HCM - Quận 7", manager: "Lê Văn C", active: true },
      { storeId: "BVL", name: "Big C Long Biên", location: "Hà Nội - Long Biên", manager: "Phạm Thị D", active: true },
      { storeId: "S003", name: "Mega Market Bình Phú", location: "TP.HCM - Quận 6", manager: "Hoàng Văn E", active: true },
      { storeId: "S004", name: "VinMart Landmark 81", location: "TP.HCM - Bình Thạnh", manager: "Đỗ Thị F", active: true },
      { storeId: "CGV", name: "Co.opXtra Cần Giuộc", location: "Long An - Cần Giuộc", manager: "Vũ Văn G", active: true },
      { storeId: "S005", name: "Emart Gò Vấp", location: "TP.HCM - Gò Vấp", manager: "Bùi Thị H", active: true },
    ];

    console.log("📍 Creating stores...");
    for (const store of storeData) {
      await db.insert(stores).values(store).onConflictDoNothing();
    }
    console.log(`✅ Created ${storeData.length} stores`);

    // Seed categories
    const categoryData = [
      { name: "Trưng bày TET 2025", description: "Chiến dịch trưng bày sản phẩm Tết Nguyên Đán 2025" },
      { name: "Khuyến mãi cuối năm", description: "Hạng mục kiểm tra trưng bày khuyến mãi tháng 12" },
      { name: "Sản phẩm mới", description: "Trưng bày sản phẩm mới ra mắt thị trường" },
      { name: "Góc trải nghiệm", description: "Khu vực trải nghiệm sản phẩm cho khách hàng" },
      { name: "Shelf compliance", description: "Tuân thủ kệ hàng theo planogram chuẩn" },
      { name: "Quảng cáo điểm bán", description: "Kiểm tra POSM và vật dụng quảng cáo" },
    ];

    console.log("📂 Creating categories...");
    for (const category of categoryData) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }
    console.log(`✅ Created ${categoryData.length} categories`);

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
