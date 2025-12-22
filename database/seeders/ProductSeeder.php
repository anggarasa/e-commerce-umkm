<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductMedia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define products for each category
        $productData = [
            // Elektronik - Handphone
            'handphone' => [
                ['name' => 'iPhone 15 Pro Max', 'price' => 21999000, 'stock' => 15, 'description' => 'iPhone terbaru dengan chip A17 Pro, kamera 48MP, dan Dynamic Island. Performa luar biasa untuk gaming dan produktivitas.'],
                ['name' => 'Samsung Galaxy S24 Ultra', 'price' => 19999000, 'stock' => 20, 'description' => 'Flagship Samsung dengan S Pen built-in, kamera 200MP, dan layar AMOLED 6.8 inch. Produktivitas maksimal.'],
                ['name' => 'Xiaomi 14 Ultra', 'price' => 14999000, 'stock' => 25, 'description' => 'Kolaborasi dengan Leica untuk kamera profesional. Snapdragon 8 Gen 3 dan fast charging 90W.'],
                ['name' => 'OPPO Find X7 Ultra', 'price' => 16999000, 'stock' => 18, 'description' => 'Dual periscope camera pertama di dunia. Hasselblad color science dan charging 100W.'],
                ['name' => 'Vivo X100 Pro', 'price' => 13999000, 'stock' => 22, 'description' => 'Zeiss optics dengan sensor 1 inch. MediaTek Dimensity 9300 untuk performa gaming terbaik.'],
                ['name' => 'Google Pixel 8 Pro', 'price' => 15999000, 'stock' => 12, 'description' => 'AI photography terbaik dengan Magic Eraser dan Best Take. 7 tahun update OS.'],
                ['name' => 'OnePlus 12', 'price' => 12999000, 'stock' => 30, 'description' => 'Flagship killer dengan Snapdragon 8 Gen 3, 100W charging, dan display 2K LTPO.'],
                ['name' => 'Realme GT5 Pro', 'price' => 8999000, 'stock' => 35, 'description' => 'Performa flagship dengan harga mid-range. Snapdragon 8 Gen 3 dan kamera Sony IMX890.'],
                ['name' => 'ASUS ROG Phone 8 Pro', 'price' => 17999000, 'stock' => 10, 'description' => 'Gaming phone ultimate dengan AirTrigger, cooling system advanced, dan display 165Hz.'],
                ['name' => 'Samsung Galaxy Z Fold5', 'price' => 24999000, 'stock' => 8, 'description' => 'Foldable premium dengan layar inner 7.6 inch dan multitasking terbaik di kelasnya.'],
            ],

            // Elektronik - Laptop
            'laptop' => [
                ['name' => 'MacBook Pro 14" M3 Pro', 'price' => 32999000, 'stock' => 10, 'description' => 'Laptop profesional Apple dengan chip M3 Pro, 18GB RAM, dan display Liquid Retina XDR.'],
                ['name' => 'ASUS ROG Strix G16', 'price' => 24999000, 'stock' => 15, 'description' => 'Gaming laptop dengan RTX 4070, Intel Core i9-13980HX, dan layar 240Hz.'],
                ['name' => 'Lenovo ThinkPad X1 Carbon', 'price' => 28999000, 'stock' => 12, 'description' => 'Ultrabook bisnis premium dengan build quality terbaik dan keyboard legendary.'],
                ['name' => 'Dell XPS 15', 'price' => 26999000, 'stock' => 14, 'description' => 'Laptop premium dengan OLED 3.5K, Intel Core i7-13700H, dan desain InfinityEdge.'],
                ['name' => 'HP Spectre x360', 'price' => 23999000, 'stock' => 18, 'description' => 'Convertible laptop premium dengan OLED touchscreen dan stylus support.'],
                ['name' => 'Acer Predator Helios 16', 'price' => 29999000, 'stock' => 11, 'description' => 'Gaming beast dengan RTX 4080, Intel Core i9, dan cooling system 5th Gen AeroBlade.'],
                ['name' => 'MSI Stealth 16 Studio', 'price' => 35999000, 'stock' => 8, 'description' => 'Creator laptop dengan RTX 4070, layar Mini LED 4K, dan desain ultra-slim.'],
                ['name' => 'Razer Blade 15', 'price' => 33999000, 'stock' => 9, 'description' => 'Gaming laptop premium dengan CNC aluminum body dan RGB per-key keyboard.'],
                ['name' => 'ASUS ZenBook Pro 14', 'price' => 22999000, 'stock' => 20, 'description' => 'Creator laptop dengan OLED 2.8K, Intel Core Ultra 9, dan DialPad.'],
                ['name' => 'Lenovo Legion Pro 7i', 'price' => 31999000, 'stock' => 13, 'description' => 'Esports-grade gaming laptop dengan RTX 4080 dan display 240Hz IPS.'],
            ],

            // Elektronik - Aksesoris
            'aksesoris-elektronik' => [
                ['name' => 'Apple AirPods Pro 2', 'price' => 3999000, 'stock' => 40, 'description' => 'TWS premium dengan ANC adaptive, spatial audio, dan USB-C charging case.'],
                ['name' => 'Sony WH-1000XM5', 'price' => 5499000, 'stock' => 25, 'description' => 'Over-ear headphone dengan ANC terbaik industri dan 30 jam battery life.'],
                ['name' => 'Samsung Galaxy Buds2 Pro', 'price' => 2799000, 'stock' => 35, 'description' => 'TWS dengan Hi-Fi 24bit audio, ANC intelligent, dan 360 Audio.'],
                ['name' => 'Logitech MX Master 3S', 'price' => 1599000, 'stock' => 50, 'description' => 'Mouse produktivitas premium dengan scroll elektromagnetik dan sensor 8000 DPI.'],
                ['name' => 'Keychron Q1 Pro', 'price' => 2899000, 'stock' => 30, 'description' => 'Mechanical keyboard premium dengan QMK/VIA support dan gasket mount.'],
                ['name' => 'Anker PowerCore 26800mAh', 'price' => 899000, 'stock' => 60, 'description' => 'Power bank kapasitas besar dengan PD 45W dan dual USB-C port.'],
                ['name' => 'Razer DeathAdder V3 Pro', 'price' => 2299000, 'stock' => 28, 'description' => 'Gaming mouse wireless dengan sensor Focus Pro 30K dan 90 jam battery.'],
                ['name' => 'Apple Magic Keyboard', 'price' => 1999000, 'stock' => 45, 'description' => 'Keyboard wireless Apple dengan Touch ID dan numeric keypad.'],
                ['name' => 'Bose QuietComfort Ultra Earbuds', 'price' => 4999000, 'stock' => 20, 'description' => 'TWS dengan CustomTune sound dan immersive audio technology.'],
                ['name' => 'SteelSeries Arctis Nova Pro', 'price' => 5299000, 'stock' => 15, 'description' => 'Gaming headset premium dengan ANC, swappable battery, dan Hi-Res audio.'],
            ],

            // Fashion - Pakaian Pria
            'pakaian-pria' => [
                ['name' => 'Kemeja Batik Premium Pekalongan', 'price' => 450000, 'stock' => 50, 'description' => 'Batik tulis Pekalongan dengan motif klasik. Bahan katun premium, nyaman dipakai seharian.'],
                ['name' => 'Kaos Polo Ralph Lauren', 'price' => 1299000, 'stock' => 35, 'description' => 'Polo shirt original dengan logo embroidered. Bahan pique cotton berkualitas tinggi.'],
                ['name' => 'Jaket Kulit Domba Asli', 'price' => 2500000, 'stock' => 20, 'description' => 'Jaket kulit domba genuine leather. Desain classic biker dengan quilted lining.'],
                ['name' => 'Celana Chino Uniqlo', 'price' => 499000, 'stock' => 60, 'description' => 'Celana chino slim fit dengan stretch fabric. Cocok untuk casual dan semi-formal.'],
                ['name' => 'Kemeja Flannel Premium', 'price' => 349000, 'stock' => 45, 'description' => 'Flannel shirt dengan pattern classic plaid. Bahan cotton brushed yang hangat.'],
                ['name' => 'Sweater Wool Blend', 'price' => 599000, 'stock' => 40, 'description' => 'Sweater hangat dengan blend wool dan akrilik. Cocok untuk cuaca dingin.'],
                ['name' => 'Formal Suit 2-Piece Navy', 'price' => 3500000, 'stock' => 15, 'description' => 'Jas formal slim fit dengan celana. Bahan wool blend premium, ideal untuk acara bisnis.'],
                ['name' => 'Jeans Denim Selvedge', 'price' => 899000, 'stock' => 38, 'description' => 'Raw denim selvedge dari Jepang. Akan develop fade yang unik seiring pemakaian.'],
                ['name' => 'T-Shirt Basic Essential', 'price' => 159000, 'stock' => 100, 'description' => 'Kaos basic dengan bahan cotton combed 30s. Tersedia berbagai warna.'],
                ['name' => 'Bomber Jacket Varsity', 'price' => 750000, 'stock' => 30, 'description' => 'Jaket bomber dengan desain varsity. Bahan polyester dengan satin lining.'],
            ],

            // Fashion - Pakaian Wanita
            'pakaian-wanita' => [
                ['name' => 'Dress Batik Modern', 'price' => 550000, 'stock' => 45, 'description' => 'Dress batik dengan cutting modern A-line. Cocok untuk acara formal dan casual.'],
                ['name' => 'Blouse Silk Premium', 'price' => 899000, 'stock' => 30, 'description' => 'Blouse sutra dengan detail ruffle. Elegan untuk kantor atau dinner date.'],
                ['name' => 'Rok Plisket Midi', 'price' => 299000, 'stock' => 55, 'description' => 'Rok plisket dengan panjang midi. Bahan satin dengan elastic waistband.'],
                ['name' => 'Cardigan Rajut Oversize', 'price' => 425000, 'stock' => 40, 'description' => 'Cardigan rajut chunky dengan fit oversize. Cozy untuk layering.'],
                ['name' => 'Jumpsuit Wide Leg', 'price' => 650000, 'stock' => 25, 'description' => 'Jumpsuit dengan wide leg dan belt. Bahan linen blend untuk look effortless chic.'],
                ['name' => 'Kebaya Kutubaru Modern', 'price' => 750000, 'stock' => 35, 'description' => 'Kebaya kutubaru dengan border lace. Design modern untuk acara tradisional.'],
                ['name' => 'Maxi Dress Floral', 'price' => 499000, 'stock' => 50, 'description' => 'Dress panjang dengan print bunga. Bahan rayon yang ringan dan flowy.'],
                ['name' => 'Blazer Oversized Linen', 'price' => 850000, 'stock' => 28, 'description' => 'Blazer linen dengan fit oversized. Versatile untuk berbagai situasi.'],
                ['name' => 'Tunik Brukat Premium', 'price' => 475000, 'stock' => 42, 'description' => 'Tunik dengan detail brukat. Cocok untuk acara formal atau kondangan.'],
                ['name' => 'Pants Palazzo High Waist', 'price' => 375000, 'stock' => 48, 'description' => 'Celana palazzo dengan high waist. Memberi kesan kaki jenjang.'],
            ],

            // Fashion - Sepatu
            'sepatu' => [
                ['name' => 'Nike Air Jordan 1 Retro', 'price' => 2799000, 'stock' => 20, 'description' => 'Sneakers iconic dengan desain classic. Original colorway yang timeless.'],
                ['name' => 'Adidas Ultraboost 23', 'price' => 2999000, 'stock' => 25, 'description' => 'Running shoes dengan Boost midsole. Comfort dan responsiveness terbaik.'],
                ['name' => 'Sepatu Pantofel Kulit', 'price' => 1250000, 'stock' => 35, 'description' => 'Pantofel kulit genuine leather. Finishing glossy dengan construction blake stitch.'],
                ['name' => 'Converse Chuck 70', 'price' => 1099000, 'stock' => 40, 'description' => 'Canvas sneakers classic dengan premium build. Lebih nyaman dari Chuck Taylor biasa.'],
                ['name' => 'Vans Old Skool Premium', 'price' => 899000, 'stock' => 45, 'description' => 'Skate shoes legendary dengan sidestripe iconic. Suede dan canvas combo.'],
                ['name' => 'New Balance 990v6', 'price' => 3299000, 'stock' => 18, 'description' => 'Dad shoes premium made in USA. Comfort dan durability terbaik di kelasnya.'],
                ['name' => 'Dr. Martens 1460', 'price' => 2899000, 'stock' => 22, 'description' => 'Boots iconic dengan Goodyear welt construction. Makin nyaman setelah break-in.'],
                ['name' => 'Sandal Birkenstock Arizona', 'price' => 1599000, 'stock' => 50, 'description' => 'Sandal dengan cork footbed yang legendary. Orthopedic comfort sepanjang hari.'],
                ['name' => 'Sepatu Running Brooks Ghost 15', 'price' => 2199000, 'stock' => 28, 'description' => 'Neutral running shoe dengan DNA Loft cushioning. Transisi smooth untuk long run.'],
                ['name' => 'Heels Pointed Toe Stiletto', 'price' => 850000, 'stock' => 35, 'description' => 'High heels dengan pointed toe design. Heel height 9cm, elegant untuk formal events.'],
            ],

            // Makanan & Minuman - Makanan Ringan
            'makanan-ringan' => [
                ['name' => 'Keripik Singkong Pedas Level 5', 'price' => 35000, 'stock' => 150, 'description' => 'Keripik singkong dengan bumbu pedas level ekstrem. Tantangan pecinta pedas!'],
                ['name' => 'Brownies Panggang Premium', 'price' => 85000, 'stock' => 80, 'description' => 'Brownies dengan dark chocolate Belgium. Fudgy texture dengan topping almond.'],
                ['name' => 'Kue Kering Nastar Homemade', 'price' => 120000, 'stock' => 60, 'description' => 'Nastar dengan selai nanas asli tanpa pengawet. Lumer di mulut.'],
                ['name' => 'Sambal Bu Rudy Original', 'price' => 45000, 'stock' => 100, 'description' => 'Sambal bawang legendaris dari Surabaya. Asli dari Bu Rudy.'],
                ['name' => 'Dendeng Balado Padang', 'price' => 95000, 'stock' => 70, 'description' => 'Dendeng sapi dengan bumbu balado authentic Padang. Gurih dan pedas.'],
                ['name' => 'Keripik Tempe Crispy', 'price' => 28000, 'stock' => 120, 'description' => 'Keripik tempe super crispy dengan berbagai varian rasa. UMKM lokal.'],
                ['name' => 'Cheese Cake Japanese Style', 'price' => 145000, 'stock' => 40, 'description' => 'Cheesecake lembut ala Jepang. Jiggly dan fluffy dengan cream cheese premium.'],
                ['name' => 'Madu Murni Hutan 500ml', 'price' => 185000, 'stock' => 55, 'description' => 'Madu asli hutan tanpa campuran. Khasiat tinggi untuk kesehatan.'],
                ['name' => 'Kurma Ajwa Madinah 500gr', 'price' => 275000, 'stock' => 45, 'description' => 'Kurma Ajwa asli dari Madinah. Manis alami dengan tekstur lembut.'],
                ['name' => 'Coklat Bar Dark 70% Cacao', 'price' => 55000, 'stock' => 90, 'description' => 'Dark chocolate dengan 70% cacao. Single origin dari Sulawesi.'],
            ],

            // Makanan & Minuman - Minuman
            'minuman' => [
                ['name' => 'Kopi Arabica Toraja 250gr', 'price' => 125000, 'stock' => 70, 'description' => 'Biji kopi arabica single origin dari Toraja. Medium roast dengan notes fruity.'],
                ['name' => 'Teh Oolong Taiwan Premium', 'price' => 95000, 'stock' => 50, 'description' => 'Teh oolong high mountain dari Taiwan. Aroma flowery dan aftertaste manis.'],
                ['name' => 'Matcha Ceremonial Grade', 'price' => 280000, 'stock' => 35, 'description' => 'Matcha kualitas upacara dari Uji, Kyoto. Halus dan creamy tanpa pahit.'],
                ['name' => 'Sirup Gula Aren Premium', 'price' => 65000, 'stock' => 80, 'description' => 'Sirup gula aren asli tanpa pengawet. Cocok untuk kopi, teh, dan dessert.'],
                ['name' => 'Jus Cold Pressed Detox', 'price' => 45000, 'stock' => 100, 'description' => 'Jus buah dan sayur cold pressed. Nutrisi terjaga tanpa pasteurisasi.'],
                ['name' => 'Susu Almond Homemade 1L', 'price' => 85000, 'stock' => 60, 'description' => 'Susu almond fresh tanpa pengawet. Plant-based milk berkualitas tinggi.'],
                ['name' => 'Wedang Uwuh Instan', 'price' => 55000, 'stock' => 90, 'description' => 'Minuman tradisional Jogja dengan rempah asli. Hangat dan menyehatkan.'],
                ['name' => 'Kopi Luwak Arabica 100gr', 'price' => 450000, 'stock' => 25, 'description' => 'Kopi luwak asli arabica dari Gayo. Smooth tanpa aftertaste pahit.'],
                ['name' => 'Teh Hijau Organik 100gr', 'price' => 75000, 'stock' => 65, 'description' => 'Teh hijau organik certified. Antioksidan tinggi untuk kesehatan.'],
                ['name' => 'Minuman Jahe Merah Instan', 'price' => 42000, 'stock' => 110, 'description' => 'Jahe merah instan tanpa gula. Menghangatkan tubuh dan meningkatkan imun.'],
            ],

            // Kesehatan
            'kesehatan' => [
                ['name' => 'Vitamin C 1000mg 60 Tablet', 'price' => 185000, 'stock' => 80, 'description' => 'Suplemen vitamin C dosis tinggi. Meningkatkan daya tahan tubuh.'],
                ['name' => 'Omega 3 Fish Oil 90 Softgel', 'price' => 245000, 'stock' => 60, 'description' => 'Minyak ikan dengan EPA DHA tinggi. Baik untuk jantung dan otak.'],
                ['name' => 'Masker N95 Medical Grade', 'price' => 85000, 'stock' => 200, 'description' => 'Masker N95 standar medical dengan filtrasi 95%. Isi 10 pcs.'],
                ['name' => 'Hand Sanitizer Gel 500ml', 'price' => 45000, 'stock' => 150, 'description' => 'Sanitizer dengan alkohol 70%. Membunuh 99.9% kuman dan bakteri.'],
                ['name' => 'Multivitamin Lengkap 30 Tablet', 'price' => 165000, 'stock' => 75, 'description' => 'Multivitamin lengkap A-Z. Memenuhi kebutuhan nutrisi harian.'],
                ['name' => 'Alat Cek Gula Darah', 'price' => 350000, 'stock' => 40, 'description' => 'Glucometer akurat dengan strip 25 pcs. Mudah digunakan di rumah.'],
                ['name' => 'Tensimeter Digital', 'price' => 285000, 'stock' => 45, 'description' => 'Alat ukur tekanan darah digital. Akurat dan mudah dibaca.'],
                ['name' => 'Thermometer Infrared', 'price' => 175000, 'stock' => 70, 'description' => 'Termometer non-contact infrared. Hasil dalam 1 detik tanpa menyentuh.'],
                ['name' => 'Suplemen Kolagen 30 Sachet', 'price' => 395000, 'stock' => 50, 'description' => 'Kolagen marine peptide untuk kulit, rambut, dan sendi. Mudah diserap tubuh.'],
                ['name' => 'Probiotik 30 Kapsul', 'price' => 225000, 'stock' => 55, 'description' => 'Probiotik dengan 10 strain bakteri baik. Menjaga kesehatan pencernaan.'],
            ],

            // Rumah Tangga
            'rumah-tangga' => [
                ['name' => 'Rice Cooker Digital 1.8L', 'price' => 895000, 'stock' => 35, 'description' => 'Rice cooker dengan fuzzy logic technology. Multi cook function untuk berbagai masakan.'],
                ['name' => 'Blender High Speed 2L', 'price' => 1250000, 'stock' => 28, 'description' => 'Blender kecepatan tinggi untuk smoothie dan soup. Motor 1500W dengan blade titanium.'],
                ['name' => 'Vacuum Cleaner Cordless', 'price' => 2450000, 'stock' => 20, 'description' => 'Vacuum cleaner wireless dengan suction kuat. Runtime 45 menit, mudah dijangkau.'],
                ['name' => 'Set Wajan Anti Lengket', 'price' => 550000, 'stock' => 50, 'description' => 'Set wajan 3 ukuran dengan coating anti lengket. Handle tahan panas ergonomis.'],
                ['name' => 'Dispenser Air Galon Bawah', 'price' => 1650000, 'stock' => 18, 'description' => 'Dispenser dengan posisi galon di bawah. Hot, normal, dan cold water function.'],
                ['name' => 'Microwave Oven 25L', 'price' => 1450000, 'stock' => 25, 'description' => 'Microwave dengan fungsi grill dan convection. 25 program auto cook.'],
                ['name' => 'Air Fryer Digital 5L', 'price' => 1350000, 'stock' => 30, 'description' => 'Air fryer tanpa minyak kapasitas besar. 8 preset menu dengan kontrol digital.'],
                ['name' => 'Set Pisau Dapur Stainless', 'price' => 425000, 'stock' => 45, 'description' => 'Set pisau stainless steel 6 pcs dengan holder. Tajam dan tahan karat.'],
                ['name' => 'Setrika Uap Steam Pro', 'price' => 685000, 'stock' => 35, 'description' => 'Setrika uap dengan ceramic soleplate. Steam burst untuk hasil maksimal.'],
                ['name' => 'Panci Set Stainless 5 Pcs', 'price' => 750000, 'stock' => 40, 'description' => 'Set panci stainless steel 5 ukuran dengan tutup kaca. Compatible untuk induksi.'],
            ],
        ];

        // Get all categories
        $categories = Category::all()->keyBy('slug');

        $productCount = 0;
        foreach ($productData as $categorySlug => $products) {
            $category = $categories->get($categorySlug);
            if (! $category) {
                $this->command->warn("Category not found: $categorySlug");

                continue;
            }

            foreach ($products as $productInfo) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $productInfo['name'],
                    'slug' => Str::slug($productInfo['name']),
                    'price' => $productInfo['price'],
                    'stock' => $productInfo['stock'],
                    'description' => $productInfo['description'],
                    'is_active' => true,
                ]);
                $productCount++;
            }
        }

        $this->command->info('Created '.$productCount.' products across categories.');

        // Add sample media for some products (optional - commented out if no actual files)
        // Uncomment and modify if you want to generate dummy media records
        /*
        $productsWithMedia = Product::inRandomOrder()->limit(30)->get();
        foreach ($productsWithMedia as $product) {
            $mediaCount = rand(1, 4);
            for ($i = 0; $i < $mediaCount; $i++) {
                ProductMedia::create([
                    'product_id' => $product->id,
                    'path' => 'products/sample-' . $product->id . '-' . $i . '.jpg',
                    'type' => 'image',
                    'is_primary' => $i === 0,
                    'sort_order' => $i,
                ]);
            }
        }
        */
    }
}
