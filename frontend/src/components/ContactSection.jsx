function ContactSection() {
  return (
    <section id="kontak" className="section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-chip">Kontak</span>
          <h2 className="section-title">Siap Berkunjung ke Kang Bejo?</h2>
          <p className="section-sub">Rasakan sendiri keindahan desa wisata edukasi di jantung Balikpapan.<br/>Punya pertanyaan atau ingin reservasi? Hubungi kami segera.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <h4>Alamat</h4>
              <p>Jl. Sumber Rejo, RT. 12, Balikpapan Tengah, Kota Balikpapan</p>
            </div>
            <div className="contact-item">
              <h4>Email</h4>
              <p>info@kangbejo.com</p>
            </div>
            <div className="contact-item">
              <h4>Telepon / WhatsApp</h4>
              <p>(+62) 811 1234 5678</p>
            </div>
            <div className="contact-item">
              <h4>Sosial Media</h4>
              <div className="social-links">
                <a href="#" style={{fontWeight: 'bold', color: 'var(--g-800)'}}>Instagram</a>
                <a href="#" style={{fontWeight: 'bold', color: 'var(--g-800)'}}>Facebook</a>
                <a href="#" style={{fontWeight: 'bold', color: 'var(--g-800)'}}>YouTube</a>
              </div>
            </div>
          </div>
          <div className="contact-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8893796594343!2d116.83981881475396!3d-1.236402699097727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df1473fb4e81561%3A0xc343fb608d0a0b63!2sDesa%20Wisata%20Kang%20Bejo!5e0!3m2!1sen!2sid!4v1689234857283!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ContactSection
