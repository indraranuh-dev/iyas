function journeyApp() {
  return {
    isLoading: true,
    screen: "start",
    quizStep: 0,
    quizAnswer: "",
    puzzle: "",
    treasure: "",
    launchConfetti: function () {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      }
    },
    quizQuestions: [
      {
        question:
          "Momen mana yang pertama kali bikin kamu senyum-senyum sendiri kalau ingat aku?",
        options: [
          { text: "Waktu aku kirim chat aneh", correct: false },
          { text: "Waktu kita dipertemukan kembali", correct: true },
          { text: "Waktu aku kasih surprise kecil", correct: false },
        ],
        correctMsg: "Tepat! Aku juga nggak akan pernah lupa momen itu ❤️",
        wrongMsg:
          "Hehe, bukan yang itu, coba lagi! Tapi itu juga kenangan manis.",
      },
      {
        question: "Apa makanan favoritku yang sering aku ceritain ke kamu?",
        options: [
          { text: "Bakso", correct: false },
          { text: "Pak Pur", correct: false },
          { text: "Gacoan", correct: true },
          { text: "Bebek Madura", correct: false },
        ],
        correctMsg: "Yap, Gacoan! Kamu memang perhatian banget 😘",
        wrongMsg: "Bukan itu, coba ingat lagi obrolan kita ya!",
      },
      {
        question:
          "Warna apa yang paling sering aku pakai waktu kita jalan bareng?",
        options: [
          { text: "Biru", correct: false },
          { text: "Pink", correct: false },
          { text: "Hitam", correct: true },
        ],
        correctMsg: "Benar! Pink selalu jadi andalan aku, kamu hafal banget 💖",
        wrongMsg: "Hehe, bukan itu. Coba perhatikan lagi di foto-foto kita!",
      },
    ],
    selectQuizOption(option) {
      if (this.quizAnswer === "") {
        this.quizAnswer = option.correct ? "benar" : "salah";
        if (option.correct) {
          setTimeout(() => {
            if (this.quizStep + 1 === this.quizQuestions.length) {
              this.screen = "puzzle";
              this.quizAnswer = "";
            } else {
              this.quizStep++;
              this.quizAnswer = "";
            }
          }, 1000);
        } else {
          setTimeout(() => {
            this.quizAnswer = "";
          }, 1000);
        }
      }
    },
    init() {
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    },
  };
}
document.addEventListener("alpine:init", () => {
  Alpine.data("journeyApp", journeyApp);
});

window.addEventListener("load", function () {
  const favicon = document.getElementById("favicon");

  // 1. Simpan kode SVG Anda sebagai string.
  // Saya telah menyederhanakan style agar lebih mudah dikontrol dari JavaScript.
  const svgString = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f43f5e">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>`;

  // 2. Buat elemen <canvas> virtual untuk menggambar frame animasi.
  const canvas = document.createElement("canvas");
  canvas.width = 64; // Resolusi favicon (64x64)
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  // 3. Buat objek gambar dan muat SVG ke dalamnya.
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  img.src = url;

  img.onload = function () {
    // Setelah gambar SVG siap, mulai loop animasi.
    animateFavicon(0);
  };

  // 4. Fungsi loop animasi utama.
  function animateFavicon(time) {
    // Membersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simpan state canvas
    ctx.save();

    // Logika animasi detak jantung (menggunakan fungsi sinus untuk osilasi halus)
    const period = 2000; // 2 detik untuk satu siklus detak
    const scale = 1 + 0.15 * Math.sin((time * 2 * Math.PI) / period); // Skala antara 0.85 dan 1.15

    // Pindahkan titik pusat ke tengah canvas agar skala dari tengah
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Gambar SVG ke canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Kembalikan state canvas
    ctx.restore();

    // 5. Update href favicon dengan data dari canvas.
    favicon.href = canvas.toDataURL("image/png");

    // Minta browser untuk menggambar frame berikutnya
    requestAnimationFrame(animateFavicon);
  }
});
