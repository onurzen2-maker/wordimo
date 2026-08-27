export const metadata = {
    title: "Gizlilik Politikası — Wordimo Academy",
    description: "Wordimo Academy gizlilik politikası ve kişisel verilerin korunması hakkında bilgilendirme.",
  };
  
  export default function GizlilikPolitikasiPage() {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>
        <p className="text-sm text-gray-500 mb-8">Son güncelleme tarihi: 2026</p>
  
        <section className="space-y-6 text-base leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900 mt-6">1. Giriş</h2>
          <p>
            Wordimo Academy olarak kullanıcılarımızın gizliliğine ve kişisel verilerinin güvenliğine büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve mobil uygulamamızı kullandığınızda verilerinizin nasıl işlendiğini açıklar.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mt-6">2. Toplanan Bilgiler</h2>
          <p>
            Uygulamamızın ve web sitemizin temel işlevlerini sunabilmek ve deneyiminizi geliştirmek amacıyla hesap oluşturma sırasında gerekli minimum düzeyde bilgi (kullanıcı adı vb.) toplanabilir. Çocuk kullanıcılarımızın güvenliği en üst düzeyde gözetilmektedir.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Verilerin Kullanımı</h2>
          <p>
            Toplanan veriler yalnızca oyun deneyimini (skor tablosu, kelime ilerlemesi vb.) sağlamak ve hizmet kalitesini artırmak amacıyla kullanılır. Verileriniz asla üçüncü şahıslarla ticari amaçla paylaşılmaz.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mt-6">4. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili her türlü soru ve öneriniz için bizimle web sitemiz üzerinden iletişime geçebilirsiniz.
          </p>
        </section>
      </main>
    );
  }