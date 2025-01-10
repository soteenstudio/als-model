const text = "Hello, world!"; // Ganti dengan teks yang diinginkan

// Mengonversi setiap kata menjadi biner
const binary = text.split(' ').map(word => {
  return word.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0'); // Konversi setiap karakter dalam kata
  }).join(''); // Gabungkan biner dari setiap karakter dalam kata
}).join(' '); // Gabungkan biner tiap kata dengan spasi antar kata

console.log(binary); // Hasil: String biner dari seluruh teks per kata

// Menentukan panjang bit per karakter (8 bit per karakter)
const charBitLength = 8;

// Memecah string biner menjadi blok-blok biner per karakter (8 bit per karakter)
const result = binary.split(' ').map(wordBinary => {
  return wordBinary.match(new RegExp('.{8}', 'g')) // Pemisahan 8 bit per karakter dalam kata
    .map(bin => String.fromCharCode(parseInt(bin, 2))) // Ubah setiap blok biner menjadi karakter
    .join(''); // Gabungkan menjadi string kata
}).join(' '); // Gabungkan kata-kata menjadi string teks

console.log(result); // Menampilkan teks asli yang terkonversi dari biner