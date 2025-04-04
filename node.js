const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let notlar = [];

function notlarıYükle() {
  try {
    if (fs.existsSync("notlar.json")) {
      const data = fs.readFileSync("notlar.json", "utf8");
      notlar = JSON.parse(data);
    }
  } catch (err) {
    console.err("Notlar dosyayı okuyamadı:", err.message);
    notlar = [];
  }
}

function notlarıKaydet() {
  try {
    fs.writeFileSync("notlar.json", JSON.stringify(notlar, null, 2), "utf8");
  } catch (err) {
    console.error("Notlar dosyaya yazılamadı:", err.message);
  }
}

function exam() {
  rl.question(
    "Hangi işlemi yapmak istersiniz (EKLE / LİSTE / SİL / EXİT) : ",
    (işlem) => {
      if (işlem.toLowerCase() === "exit") {
        rl.close();
        console.log("Çıkış yapılıyor.");
        return;
      }
      if (işlem.toLowerCase() === "ekle") {
        rl.question("Yeni notunuz:", (not) => {
          let yeniNot = {
            id: notlar.length + 1,
            deger: not,
          };
          notlar.push(yeniNot);
          notlarıKaydet();
          console.log("Yeni not eklendi.", yeniNot);
          exam();
        });
      } else if (işlem.toLowerCase() === "liste") {
        console.log("Tüm notlar", notlar);
        exam();
      } else if (işlem.toLowerCase() === "sil") {
        rl.question("Sİlmek istediğiniz notun ID ' si : ", (ıd) => {
          const silinecekID = parseInt(ıd);
          const eskiUzunluk = notlar.length;
          notlar = notlar.filter((not) => not.id !== silinecekID);
          if (notlar.length < eskiUzunluk) {
            console.log(`ID ${silinecekID} olan not silindi.`);
            notlar.forEach((not, index) => {
              not.id = index + 1;
            });
            notlarıKaydet();
          } else {
            console.log("Bu ID ile eşleşen not bulunamadı.");
          }
          exam();
        });
      } else {
        console.log("Bilinmeyen işlem.Lütfen tekrar deneyin.");
        exam();
      }
    }
  );
}

notlarıYükle();
exam();
