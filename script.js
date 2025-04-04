const container = document.querySelector(".container2");
const divFitur = document.querySelector("#div-fitur");
const Home = document.querySelector(".Home");
const lihatSurat = document.querySelector(".lihat-surat");
const daftarSurat = document.querySelector("#daftar-surat");
const titleDaftar = document.querySelector("#title-list");
const titleSurat = document.querySelector("#nama-surat");
const jumlah_ayat = document.querySelector("#jumlah-ayat");
const kontainerSurat = document.querySelector(".kontainer-surat");
const kontainerSuratUtama = document.querySelector(".kontainer-surat-utama");
const mainKontainer = document.querySelector(".main-kontainer");
const namaArab = document.querySelector(".nama-arab");
const arti = document.querySelector(".arti");
const next = document.querySelector(".next");
const mmm = document.querySelector(".mmm");
const surah = document.querySelector("#surah");
const hapus = document.querySelectorAll(".hapus");

container.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("lihat-surat")) {
    divFitur.classList.add("hidden");
  }
});

surah.addEventListener("click", () => {
  mainKontainer.classList.remove("hidden");
  kontainerSuratUtama.classList.add("hidden");
  divFitur.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

Home.addEventListener("click", (e) => {
  e.preventDefault();
  divFitur.classList.remove("hidden");
  kontainerSuratUtama.classList.add("hidden");
  mainKontainer.classList.remove("hidden");
  hapus.forEach(hapus =>{
    hapus.innerHTML = "";
  })
  
});

const ApiSemuaSurat = async () => {
  const api = await fetch("https://quran-api.santrikoding.com/api/surah");
  const data = await api.json();
  daftarSurah = data;
  const titleDaftar = document.getElementById("title-list");
  data.sort((a, b) => b.nomor - a.nomor);
  data.forEach((item) => {
    titleDaftar.insertAdjacentHTML(
      "afterend",
      `
            <div data-surat="${item.nomor}" class=" div-surat p-4 rounded-3xl shadow-md hover:shadow-lg w-[350px] h-[80px] flex items-center border-1 border-gray-400 ">
                <div class=" surat flex items-center w-full ">
                    <p class="p-4 rounded-full bg-primary/50 h-[40px] w-auto flex items-center text-white font-bold">${item.nomor}</p>
                    <div class=" flex w-full justify-between">
                    <div class="pl-5 flex flex-col justify-center ">
                        <p class="font-medium text-lg">${item.nama_latin}</p>
                        <p class="text-sm">${item.arti}</p>
                    </div>
                    <div class=" flex flex-col text-end">
                        <p class="font-medium text-md text-primary">${item.nama}</p>
                        <p class="text-sm">${item.jumlah_ayat} ayahs</p>
                    </div>
                    </div>
                    
                </div>
            </div>
        `
    );
  });
  const tombolSurat = document.querySelectorAll(".div-surat");

  tombolSurat.forEach((tombolSurat) => {
    tombolSurat.addEventListener("click", (e) => {
      e.preventDefault();
      const nomorSurah = tombolSurat.getAttribute("data-surat");
      currentSurahIndex = parseInt(tombolSurat.getAttribute("data-index"));
      console.log(`Nomor Surah yang diklik: ${nomorSurah}`);
      ApiAyatQuran(nomorSurah);

      kontainerSuratUtama.classList.remove("hidden");
      mainKontainer.classList.add("hidden");

      const selectedSurah = data.find((item) => item.nomor == nomorSurah);
      if (selectedSurah) {
        titleSurat.textContent = selectedSurah.nama_latin; 
        jumlah_ayat.innerHTML = `<p id="jumlah-ayat" class="text-sm pt-1">Total - ${selectedSurah.jumlah_ayat} ayat</p>`;
        namaArab.textContent = selectedSurah.nama;
        arti.textContent = selectedSurah.arti;
      }
    });
  });
};
ApiSemuaSurat();

const playAudio = (ayatNumber) => {
  const audioElement = document.getElementById(`audio-${ayatNumber}`);
  const icon = document
    .querySelector(`#audio-${ayatNumber}`)
    .closest("div")
    .querySelector("i"); 

  if (audioElement) {
  
    const currentAudio = document.querySelector(".playing");
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause(); 
      currentAudio.currentTime = 0; 
      currentAudio.classList.remove("playing"); 

     
      const currentIcon = currentAudio.closest("div").querySelector("i");
      currentIcon.classList.remove("fa-circle-pause");
      currentIcon.classList.add("fa-circle-play");
    }

   
    if (!audioElement.classList.contains("playing")) {
      audioElement.play();
      audioElement.classList.add("playing"); 
      audioElement.onended = () => {
        audioElement.classList.remove("playing"); 
        icon.classList.remove("fa-circle-pause"); 
        icon.classList.add("fa-circle-play");
      };

 
      icon.classList.remove("fa-circle-play");
      icon.classList.add("fa-circle-pause");
    } else {
    
      audioElement.pause();
      audioElement.currentTime = 0; 
      audioElement.classList.remove("playing"); 

      icon.classList.remove("fa-circle-pause");
      icon.classList.add("fa-circle-play");
    }
  }
};

const ApiAyatQuran = async (suratKe) => {
  hapus.innerHTML=""
  const api = await fetch(
    `https://quran-api-id.vercel.app/surahs/${suratKe}/ayahs`
  );
  const data = await api.json();
  hapus.innerHTML=""
  console.log(data);
  data
  kontainerSurat.innerHTML = ""; 
  data.forEach((item, index) => {
    
    console.log(item);
    
    kontainerSurat.insertAdjacentHTML(
      "beforeend",
      `
      <div id="SuratKe${item.number.inQuran}" class="flex gap-3  h-full mt-6 justify-between hapus ">
        <div class="flex gap-3 items-center mr-3">
          <p class="p-5 flex items-center justify-center bg-primary/50 w-[30px] h-[30px] rounded-full font-bold text-white ">${index+1}</p>
         <button onclick="playAudio(${item.number.inQuran})" class="cursor-pointer audio p-[15px] flex items-center justify-center bg-primary/20 w-[10px] h-[10px] rounded-full text-primary text-[17px]">
  <i class="fa-regular fa-circle-play"></i>
</button>

           <audio id ="audio-${item.number.inQuran}" src="${item.audio.alafasy}"></audio>
        </div>
          
        <div class="flex items-center h- full">
          <p class="text-end text-[20px]">${item.arab}</p>
        </div>
        </div>
        <div class="w-full flex " >
        <p class=" text-[13px]   ml-25 lg:text-[14px] my-6 ">${item.translation}.</p>
        </div>
            
      
        
      
     
        
      `
    );
  });
};

const kembali = document.getElementById("kembali");
kembali.addEventListener("click", () => {
  console.log("berhasil");
  mainKontainer.classList.remove("hidden");
  kontainerSuratUtama.classList.add("hidden");
  divFitur.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
