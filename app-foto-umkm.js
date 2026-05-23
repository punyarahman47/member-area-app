// app-foto-umkm.js
export function FotoUMKMApp() {
    import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Settings, 
  ShoppingBag, 
  MessageCircle, 
  Image as ImageIcon, 
  Sparkles,
  Download,
  RefreshCw,
  Moon,
  Sun
} from 'lucide-react';

const apiKey = ""; // Environment will provide this

const App = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [brandName, setBrandName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [category, setCategory] = useState('makanan');
  const [theme, setTheme] = useState('dark');
  const [manualPrompt, setManualPrompt] = useState('');

  const categories = [
    { id: 'makanan', label: 'Makanan', icon: '🍔' },
    { id: 'fashion', label: 'Fashion', icon: '👕' },
    { id: 'aksesoris', label: 'Aksesoris', icon: '💍' },
    { id: 'buku', label: 'Buku', icon: '📚' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setImage(reader.result.split(',')[1]); // Base64 without header
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIPost = async () => {
    if (!image) {
      setError("Silakan upload foto produk terlebih dahulu.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Prompt logic
    const basePrompt = `Transform this product photo into a professional commercial advertisement. 
    Product: ${productName}, Brand: ${brandName}, Price: Rp${price}, WhatsApp: ${whatsapp}.
    Category: ${category}.
    Style: Professional food/product poster design, ultra-detailed realistic photo, studio lighting, ${theme === 'dark' ? 'dark sophisticated background' : 'bright clean background'} with bokeh effect, premium commercial photography, modern composition, large bold title text for "${productName}", clear price discount tag, high quality 4K, 9:16 vertical format.
    Additional Instructions: ${manualPrompt}`;

    const payload = {
      contents: [{
        parts: [
          { text: basePrompt },
          { inlineData: { mimeType: "image/png", data: image } }
        ]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    };

    try {
      let response;
      let retries = 0;
      const maxRetries = 5;
      
      while (retries < maxRetries) {
        try {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) break;
        } catch (e) {
          console.error(e);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }

      const result = await response.json();
      const generatedBase64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      
      if (generatedBase64) {
        setResultImage(`data:image/png;base64,${generatedBase64}`);
      } else {
        throw new Error("Gagal menghasilkan gambar. Coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memproses gambar. Silakan coba beberapa saat lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-300 to-orange-500 py-6 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <Camera className="text-orange-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">FOTO UMKM</h1>
          </div>
          <div className="bg-orange-600/20 px-3 py-1 rounded-full text-white text-sm font-medium">
            AI Powered Editor
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Form & Upload */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload size={20} className="text-orange-500" />
              Upload Foto Produk
            </h2>
            
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${previewUrl ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
              style={{ minHeight: '200px' }}
            >
              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-xl">
                    <span className="text-white font-medium">Ganti Foto</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <ImageIcon className="text-orange-600" />
                  </div>
                  <span className="text-gray-500 text-sm">Klik untuk upload foto</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Settings size={20} className="text-orange-500" />
              Detail Produk
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Brand</label>
                <input 
                  placeholder="Contoh: Sambal Ibu" 
                  className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Produk</label>
                <input 
                  placeholder="Contoh: Sambal Cumi XL" 
                  className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Harga (Rp)</label>
                <input 
                  placeholder="Contoh: 25.000" 
                  className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">WhatsApp</label>
                <input 
                  placeholder="0812..." 
                  className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Kategori</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${category === cat.id ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200'}`}
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Pilihan Latar Belakang</label>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-white border-orange-500 text-orange-600 shadow-sm' : 'bg-gray-50 border-transparent text-gray-400'}`}
                >
                  <Sun size={18} /> Terang
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-gray-900 border-orange-500 text-white shadow-sm' : 'bg-gray-50 border-transparent text-gray-400'}`}
                >
                  <Moon size={18} /> Gelap
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Prompt Tambahan (Opsional)</label>
              <textarea 
                placeholder="Misal: Tambahkan aksen daun jeruk di sekitar botol..."
                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all h-20 resize-none mt-1"
                value={manualPrompt}
                onChange={(e) => setManualPrompt(e.target.value)}
              />
            </div>
          </section>

          <button 
            onClick={generateAIPost}
            disabled={isGenerating || !image}
            className={`w-full py-4 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${isGenerating || !image ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={24} />
                Memproses Foto...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Jadikan Foto Pro!
              </>
            )}
          </button>
        </div>

        {/* Right Column: Result */}
        <div className="sticky top-28 space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500" size={24} />
                </div>
                <p className="font-medium text-gray-600">AI sedang menata studio foto digital Anda...</p>
                <p className="text-xs text-gray-400 px-8 italic">"Foto realistis ultra detail, pencahayaan dramatis, komposisi premium..."</p>
              </div>
            ) : resultImage ? (
              <div className="w-full space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[9/16]">
                  <img src={resultImage} alt="Generated result" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-widest shadow-lg">
                    AI Generated
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={resultImage} 
                    download="foto-umkm-pro.png"
                    className="flex-1 bg-gray-900 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-black transition-colors"
                  >
                    <Download size={20} /> Unduh Hasil
                  </a>
                  <button 
                    onClick={() => setResultImage(null)}
                    className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-50">
                <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                  <ImageIcon size={40} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Hasil Edit Anda</h3>
                  <p className="text-sm text-gray-400 px-10">Lengkapi detail di sebelah kiri dan klik tombol untuk melihat keajaiban AI.</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
                {error}
              </div>
            )}
          </section>

          {/* Social Proof/Hint */}
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
              <ShoppingBag size={16} /> Tips Jualan Laris
            </h4>
            <p className="text-xs text-orange-700 leading-relaxed">
              Foto produk yang profesional meningkatkan rasa percaya pembeli hingga 80%. Gunakan "Latar Belakang Gelap" untuk kesan mewah, dan "Latar Belakang Terang" untuk kesan bersih dan minimalis.
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden flex justify-between items-center z-50">
        <div className="flex gap-4">
          <div className="text-orange-600 flex flex-col items-center">
            <Sparkles size={20} />
            <span className="text-[10px] font-bold">AI Edit</span>
          </div>
          <div className="text-gray-400 flex flex-col items-center">
            <MessageCircle size={20} />
            <span className="text-[10px] font-bold">Support</span>
          </div>
        </div>
        <button 
           onClick={generateAIPost}
           disabled={isGenerating || !image}
           className="bg-orange-500 text-white px-8 py-2 rounded-full font-bold shadow-lg text-sm active:scale-95 transition-all"
        >
          {isGenerating ? "Processing..." : "Buat Sekarang"}
        </button>
      </div>
    </div>
  );
};

export default App;
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            {/* ...isi komponen aplikasi Anda... */}
        </div>
    );
}
