export const metadata = {
    title: "İngilizce Kelime Listeleri ve Çalışma Rehberi — Wordimo Academy",
    description: "Türkiye Yüzyılı Maarif Modeli uyumlu örnek İngilizce kelime listeleri ve eğlenceli kelime öğrenme oyunları.",
  };
  
  export default function KelimelerPage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          İngilizce Kelime Listeleri ve Çalışma Rehberi
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Wordimo Academy, ilkokul ve ortaokul öğrencilerinin İngilizce kelimeleri sıkılmadan, oyun oynayarak kalıcı bir şekilde öğrenmesi için tasarlandı. İşte örnek birkaç kelime grubu:
        </p>
  
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Örnek Ünite Kelimeleri</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-800">
            <li className="bg-gray-50 p-3 rounded-lg">🎯 Playground (Oyun parkı)</li>
            <li className="bg-gray-50 p-3 rounded-lg">🎯 Classroom (Sınıf)</li>
            <li className="bg-gray-50 p-3 rounded-lg">🎯 Library (Kütüphane)</li>
            <li className="bg-gray-50 p-3 rounded-lg">🎯 Science Lab (Fen lab.)</li>
            <li className="bg-gray-50 p-3 rounded-lg">🎯 Canteen (Kantin)</li>
            <li className="bg-gray-50 p-3 rounded-lg">🎯 Art Room (Resim atölyesi)</li>
          </ul>
        </div>
  
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Tüm Kelimelerle Oynamak İster misiniz?</h3>
          <p className="text-blue-700 mb-4">Yüzlerce kelimeyi oyunlaştırarak öğrenmek için hemen giriş yapın veya uygulamamızı indirin.</p>
          <a
            href="https://play.google.com/store/apps/details?id=..." 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition-all"
          >
            Google Play'den İndir / Giriş Yap
          </a>
        </div>
      </main>
    );
  }