/**
 * Dummy image URLs — semua dari Unsplash CDN.
 * TIDAK ada file gambar di repo → project tetap ringan.
 * Ganti URL ini dengan foto asli Kang Bejo saat tersedia.
 *
 * Format Unsplash: ?auto=format&fit=crop&w={width}&q={quality}
 * q=75 → file kecil tapi tetap jernih untuk card
 * q=60 → lebih kecil lagi untuk hero (tapi di-cover)
 */

const UNS = "https://images.unsplash.com"

export const HERO_IMAGE =
  `${UNS}/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=65`

export const ABOUT_IMAGE =
  `${UNS}/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=75`

/** Map nama fasilitas → URL gambar */
export const FACILITY_IMAGES = {
  "Kebun Kangkung":
    `${UNS}/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=75`,
  "Pujasera":
    `${UNS}/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=75`,
  "Edukasi Pertanian Kangkung":
    `${UNS}/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=75`,
  "Spot Foto":
    `${UNS}/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=75`,
}

export const DEFAULT_FACILITY_IMAGE =
  `${UNS}/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=75`

/** Gradient CSS per index kegiatan (6 warna berbeda) */
export const ACTIVITY_GRADIENTS = [
  "linear-gradient(135deg,#1B4332,#40916C)",  // Bazar — deep forest
  "linear-gradient(135deg,#064E3B,#059669)",  // Jelajah — emerald
  "linear-gradient(135deg,#4C1D95,#7C3AED)",  // Tari — purple
  "linear-gradient(135deg,#92400E,#D97706)",  // Geber — amber
  "linear-gradient(135deg,#1E3A5F,#2563EB)",  // Ruang Pintar — blue
  "linear-gradient(135deg,#14532D,#16A34A)",  // Tanam — green
]
