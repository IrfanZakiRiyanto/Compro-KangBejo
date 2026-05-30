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

export const HERO_IMAGES = [
  `${UNS}/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=65`,
  `${UNS}/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=65`,
  `${UNS}/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1920&q=65`,
]

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

/** Map nama aktivitas → URL gambar */
export const ACTIVITY_IMAGES = {
  "Bazar Kangkung": `${UNS}/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=75`,
  "Jelajah Alam": `${UNS}/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=75`,
  "Belajar Bertani": `${UNS}/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=75`,
}

export const DEFAULT_ACTIVITY_IMAGE =
  `${UNS}/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=75`
