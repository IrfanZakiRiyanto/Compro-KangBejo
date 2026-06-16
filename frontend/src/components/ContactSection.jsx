import SectionHeader from "./SectionHeader"

const getSafeMapUrl = (url) => {
  const defaultUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8893796594343!2d116.83981881475396!3d-1.236402699097727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df1473fb4e81561%3A0xc343fb608d0a0b63!2sDesa%20Wisata%20Kang%20Bejo!5e0!3m2!1sen!2sid!4v1689234857283!5m2!1sen!2sid"
  if (!url) return defaultUrl
  
  const trimmed = url.trim()
  if (!trimmed) return defaultUrl

  // Jika user menyalin seluruh tag iframe dari Google Maps
  const srcMatch = trimmed.match(/src=["'](https:[^"']+)["']/i)
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1]
  }
  
  // Jika sudah merupakan embed URL yang valid
  if (
    trimmed.includes("google.com/maps/embed") || 
    trimmed.includes("google.com/maps/embed?") || 
    trimmed.includes("output=embed")
  ) {
    return trimmed
  }

  // Jika itu URL lengkap tempat di Google Maps, coba ambil nama tempat atau koordinatnya
  const placeMatch = trimmed.match(/\/maps\/place\/([^/]+)/)
  if (placeMatch && placeMatch[1]) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "))
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
  }

  // Format koordinat: /@lat,lng
  const coordsMatch = trimmed.match(/\/@(-?\d+\.\d+,-?\d+\.\d+)/)
  if (coordsMatch && coordsMatch[1]) {
    return `https://maps.google.com/maps?q=${coordsMatch[1]}&t=&z=16&ie=UTF8&iwloc=&output=embed`
  }
  
  // Jika user memasukkan alamat biasa atau link pencarian biasa, ubah ke embed format search q=
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
}

function ContactSection({ content = {} }) {
  return (
    <section id="kontak" className="section bg-light">
      <div className="container">
        
        <SectionHeader 
          chip={content.chip || "Kontak"}
          title={content.title || "Siap Berkunjung ke Kang Bejo?"} 
          subtitle={content.subtitle || "Rasakan sendiri keindahan desa wisata edukasi di jantung Balikpapan.\nPunya pertanyaan atau ingin reservasi? Hubungi kami segera."}
        />

        <div className="contact-grid">
          {/* Info Kontak */}
          <div className="contact-info">
            
            <div className="contact-item">
              <h4>Alamat Kami</h4>
              <p>{content.address || "Jl. Sumber Rejo, RT. 12, Balikpapan Tengah, Kota Balikpapan"}</p>
            </div>
            
            <div className="contact-item">
              <h4>Email</h4>
              <p><a href={`mailto:${content.email || "info@kangbejo.com"}`}>{content.email || "info@kangbejo.com"}</a></p>
            </div>
            
            <div className="contact-item">
              <h4>Telepon / WA</h4>
              <p><a href={`tel:${(content.phone || "(+62) 811 1234 5678").replace(/\s/g, '')}`}>{content.phone || "(+62) 811 1234 5678"}</a></p>
            </div>

            <div className="social-links">
              <a href={content.instagram || "#"} className="social-link-item" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={content.facebook || "#"} className="social-link-item" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={content.youtube || "#"} className="social-link-item" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>

          {/* Peta Google Maps */}
          <div className="contact-map">
            <iframe
              src={getSafeMapUrl(content.maps_embed_url)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Desa Wisata Kang Bejo"
            ></iframe>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default ContactSection
