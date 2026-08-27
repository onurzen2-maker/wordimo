"use client";
import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; 

// --- KELİME DOSYALARININ İTHAL EDİLMESİ ---
import { kelimeler2 } from "./data/kelimeler2";
import { kelimeler3 } from "./data/kelimeler3";
import { kelimeler4 } from "./data/kelimeler4";
import { kelimeler5 } from "./data/kelimeler5";
import { kelimeler6 } from "./data/kelimeler6";
import { kelimeler7 } from "./data/kelimeler7";
import { kelimeler8 } from "./data/kelimeler8";
import { kelimeler9 } from "./data/kelimeler9";
import { kelimeler10 } from "./data/kelimeler10";
import { kelimeler11 } from "./data/kelimeler11";
import { kelimeler12 } from "./data/kelimeler12";
import { kelimelerA1 } from "./data/kelimelerA1";
import { kelimelerA2 } from "./data/kelimelerA2";
import { kelimelerB1 } from "./data/kelimelerB1";

// --- MÜFREDAT VERİLERİ (MAARİF MODELİ GÜNCEL) ---
const okulMufredati: Record<string, string[]> = {
  "2. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Homes & Houses & Neighbourhoods", "Life in the City & the World"],
  "3. Sınıf": ["Greeting", "My Family", "People I Love", "Feelings", "Toys and Games", "My House", "In My City", "Transportation", "Weather", "Nature"],
  "4. Sınıf": ["Classroom Rules", "Nationality", "Cartoon Characters", "Free Time", "My Day", "Fun with Science", "Jobs", "My Clothes", "My Friends", "Food & Drinks"],
  "5. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life in the Neighbourhood & City", "Life in the World 1", "Life in the World 2", "Life in the Universe and Future"],
  "6. Sınıf": ["Life", "Yummy Breakfast", "Downtown", "Weather and Emotions", "At the Fair", "Occupations", "Holidays", "Bookworms", "Saving the Planet", "Democracy"],
  "7. Sınıf": ["Appearance & Personality", "Sports", "Biographies", "Wild Animals", "Television", "Celebrations", "Dreams", "Public Buildings", "Environment", "Planets"],
  "8. Sınıf": ["Friendship", "Teen Life", "In the Kitchen", "On the Phone", "The Internet", "Adventures", "Tourism", "Chores", "Science", "Natural Forces"],
  "9. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life in the House & Neighbourhood", "Life in the City & Country", "Life in the World & Nature", "Life in the Universe and Future"],
  "10. Sınıf": ["School Life", "Plans", "Legendary Figure", "Traditions", "Travel", "Helpful Tips", "Food & Festivals", "Digital Era", "Modern Heroes", "Shopping"],
  "11. Sınıf": ["Future Jobs", "Hobbies & Skills", "Hard Times", "What a Life", "Back to the Past", "Open Your Heart", "Facts about Turkey", "Sports", "My Friends", "Values"],
  "12. Sınıf": ["Music", "Friendship", "Human Rights", "Coming Soon", "Psychology", "Favors", "News Stories", "Alternative Energy", "Technology", "Manners"]
};

const genelTemalar = [
  { id: "Unit 1", label: "Tanışma ve Selamlaşma" },
  { id: "Unit 2", label: "Aile ve Çevre" },
  { id: "Unit 3", label: "Hayvanlar ve Doğa" },
  { id: "Unit 4", label: "Renkler ve Sayılar" },
  { id: "Unit 5", label: "Yiyecek ve İçecekler" },
  { id: "Unit 6", label: "Günlük Rutinler" },
  { id: "Unit 7", label: "Meslekler ve İş" },
  { id: "Unit 8", label: "Yerler ve Yönler" },
  { id: "Unit 9", label: "Hava Durumu ve Zaman" },
  { id: "Unit 10", label: "Hobiler ve Sporlar" }
];

const avatarListesi = [
  { id: "baykus", emoji: "🦉", ad: "Bilge Baykuş", gerekenPuan: 0 },
  { id: "kedi", emoji: "🐱", ad: "Meraklı Kedi", gerekenPuan: 500 },
  { id: "kopek", emoji: "🐶", ad: "Çalışkan Köpek", gerekenPuan: 1500 },
  { id: "panda", emoji: "🐼", ad: "Sevimli Panda", gerekenPuan: 3500 },
  { id: "tilki", emoji: "🦊", ad: "Kurnaz Tilki", gerekenPuan: 7500 },
  { id: "aslan", emoji: "🦁", ad: "Cesur Aslan", gerekenPuan: 15000 },
  { id: "tiger", emoji: "🐯", ad: "Kaplan", gerekenPuan: 30000 },
  { id: "robot", emoji: "🤖", ad: "Zeki Robot", gerekenPuan: 60000 },
  { id: "uzayli", emoji: "👽", ad: "Uzaylı", gerekenPuan: 120000 },
  { id: "astronot", emoji: "👨‍🚀", ad: "Astronot", gerekenPuan: 250000 },
  { id: "ninja", emoji: "🥷", ad: "Ninja", gerekenPuan: 500000 },
  { id: "superkahraman", emoji: "🦸‍♂️", ad: "Süper Kahraman", gerekenPuan: 1000000 },
  { id: "sihirbaz", emoji: "🧙‍♂️", ad: "Sihirbaz", gerekenPuan: 2500000 },
  { id: "korsan", emoji: "🏴‍☠️", ad: "Korsan", gerekenPuan: 6000000 },
  { id: "ejderha", emoji: "🐉", ad: "Ejderha", gerekenPuan: 15000000 },
  { id: "kral", emoji: "👑", ad: "Kelime Kralı", gerekenPuan: 40000000 },
  { id: "unicorn", emoji: "🦄", ad: "Efsanevi Unicorn", gerekenPuan: 100000000 },
  { id: "anka", emoji: "🔥", ad: "Anka Kuşu", gerekenPuan: 300000000 },
];

const oyunIpuclari = [
  "Hızlı cevaplarsan artan süre puanına eklenir.",
  "Art arda doğru cevaplar vererek COMBO ateşini yak!",
  "Kelimenin telaffuzunu duymak için hoparlör ikonuna tıkla.",
  "Yanlış cevap verdiğinde canın azalır ve combo sıfırlanır!"
];

const buttonColors = [
  "bg-[#10b981]", "bg-[#3b82f6]", "bg-[#f97316]", "bg-[#ef4444]", "bg-[#0d9488]", "bg-[#4338ca]",
];

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- GLOBAL SES DEĞİŞKENİ (SINIF MODU İÇİN) ---
let isGlobalSoundOn = true;

const playSoundEffect = (type: "correct" | "wrong") => {
  if (!isGlobalSoundOn) return; // Sınıf modu açıksa ses çalmaz
  try {
    const audio = new Audio(type === "correct" ? "/correct.mp3" : "/wrong.mp3");
    audio.play().catch(() => {});
  } catch (error) {}
};

const playClickSound = () => {
  if (!isGlobalSoundOn) return; // Sınıf modu açıksa ses çalmaz
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
};

export default function Home() {
  const [screen, setScreen] = useState<"auth" | "home" | "loading" | "game" | "result" | "gameover" | "leaderboard" | "avatars">("auth");
  const [user, setUser] = useState<{ username: string; isGuest: boolean; dbId?: string; data?: any } | null>(null);
  
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"İLKOKUL" | "ORTAOKUL" | "LİSE" | "GENEL">("ORTAOKUL");
  
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regNickname, setRegNickname] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regKademe, setRegKademe] = useState<"İLKOKUL" | "ORTAOKUL" | "LİSE">("ORTAOKUL");

  const [mainCategory, setMainCategory] = useState<"okul" | "genel" | null>(null);
  const [selectedStage, setSelectedStage] = useState<"İLKOKUL" | "ORTAOKUL" | "LİSE" | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [comboCount, setComboCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [randomTip, setRandomTip] = useState("");

  // SES AÇ/KAPA STATE'İ
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    isGlobalSoundOn = newState; // Global değişkeni de güncelliyoruz
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("wordimo_user");
    if (savedUser) {
      try {
        let parsedUser = JSON.parse(savedUser);
        
        // GÜVENLİK ÖNLEMİ: Eğer dbId doğrudan dışarıda yoksa ama data içinde varsa kurtaralım!
        if (!parsedUser.dbId && parsedUser.data && parsedUser.data.dbId) {
          parsedUser.dbId = parsedUser.data.dbId;
        }
        
        // EĞER HALA dbId YOKSA AMA username (kullaniciAdi) VARSA KULLANICI ADINI dbId YAPALIM!
        if (!parsedUser.dbId && parsedUser.username) {
          // Eğer username büyük harfli veya Türkçe karakterliyse küçük harfe çevirip dbId yapalım
          parsedUser.dbId = parsedUser.username.toLowerCase().trim();
        }

        setUser(parsedUser);
        // Güncellenmiş ve dbId garantili objeyi tekrar hafızaya yazalım
        localStorage.setItem("wordimo_user", JSON.stringify(parsedUser));
        
        setScreen("home");
      } catch (e) {
        localStorage.removeItem("wordimo_user");
      }
    }
  }, []);

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem("wordimo_user");
    setUser(null);
    setScreen("auth");
    setIsRegisterModalOpen(false);
  };

  const speakWord = (text: string) => {
    if (!isGlobalSoundOn) return; // Öğretmen sesi kapattıysa telaffuz da susar
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = () => {
    playClickSound();
    if (navigator.share) {
      navigator.share({
        title: 'Wordimo',
        text: 'Eğlenerek İngilizce kelime öğren!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Oyun linki panoya kopyalandı! Arkadaşlarınla paylaşabilirsin.");
    }
  };

  const handleRegister = async () => {
    playClickSound();
    if (!regNickname || !regUsername || !regPassword) return alert("Lütfen tüm alanları doldurun.");
    
    try {
      const docRef = doc(db, "users", regUsername.toLowerCase());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        alert("Bu Kullanıcı Adı zaten alınmış!");
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const newUser = {
        kullaniciAdi: regUsername.toLowerCase(),
        oyunAdi: regNickname,
        sifre: regPassword,
        kademe: regKademe,
        toplamPuan: 0,
        sezonPuanlari: {
          İLKOKUL: 0,
          ORTAOKUL: 0,
          LİSE: 0,
          GENEL: 0
        },
        gunlukSeri: 1,
        sonGirisTarihi: today,
        sonSifirlamaTarihi: today,
        unitePuanlari: {},
        secilenAvatar: "baykus"
      };

      await setDoc(docRef, newUser);
      
      const newUserObj = { username: regNickname, isGuest: false, dbId: regUsername.toLowerCase(), data: newUser };
      setUser(newUserObj);
      localStorage.setItem("wordimo_user", JSON.stringify(newUserObj));
      
      setIsRegisterModalOpen(false);
      setScreen("home");
    } catch (error) {
      alert("Kayıt olurken bir hata oluştu.");
    }
  };

  const handleLogin = async () => {
    playClickSound();
    if (!usernameInput || !passwordInput) return alert("Kullanıcı adı ve şifre giriniz.");
    
    try {
      const docRef = doc(db, "users", usernameInput.toLowerCase());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return alert("Böyle bir kullanıcı bulunamadı!");
      
      const data = docSnap.data();
      if (data.sifre !== passwordInput) return alert("Hatalı şifre girdiniz!");

      const todayStr = new Date().toISOString().split('T')[0];
      const todayDate = new Date();
      let newSeri = data.gunlukSeri || 0;
      
      let sezonPuanlari = data.sezonPuanlari || { 
        İLKOKUL: data.sezonPuani || 0, 
        ORTAOKUL: data.sezonPuani || 0, 
        LİSE: data.sezonPuani || 0, 
        GENEL: 0 
      };
      let yeniSifirlamaTarihi = data.sonSifirlamaTarihi || todayStr;

      if (data.sonGirisTarihi !== todayStr) {
        const lastDate = new Date(data.sonGirisTarihi);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) newSeri += 1;
        else newSeri = 1;
      }

      const isMonday = todayDate.getDay() === 1;
      if (isMonday && yeniSifirlamaTarihi !== todayStr) {
        sezonPuanlari = { İLKOKUL: 0, ORTAOKUL: 0, LİSE: 0, GENEL: 0 };
        yeniSifirlamaTarihi = todayStr;
      }

      await updateDoc(docRef, { 
        sonGirisTarihi: todayStr, 
        gunlukSeri: newSeri, 
        sezonPuanlari: sezonPuanlari,
        sonSifirlamaTarihi: yeniSifirlamaTarihi
      });

      data.gunlukSeri = newSeri;
      data.sezonPuanlari = sezonPuanlari;

      const loginUserObj = { username: data.oyunAdi, isGuest: false, dbId: usernameInput.toLowerCase(), data };
      setUser(loginUserObj);
      localStorage.setItem("wordimo_user", JSON.stringify(loginUserObj));
      
      setScreen("home");
    } catch (error) {
      alert("Giriş başarısız.");
    }
  };

  const handleGuestLogin = () => {
    playClickSound();
    const guestDataObj = { 
      username: "Misafir Öğrenci", 
      isGuest: true, 
      data: { 
        secilenAvatar: "baykus", 
        toplamPuan: 0, 
        sezonPuanlari: { İLKOKUL: 0, ORTAOKUL: 0, LİSE: 0, GENEL: 0 }, 
        kademe: "ORTAOKUL" 
      } 
    };
    setUser(guestDataObj);
    localStorage.setItem("wordimo_user", JSON.stringify(guestDataObj));
    setScreen("home");
  };

  const selectAvatar = async (avatar: typeof avatarListesi[0]) => {
    playClickSound();
    const toplamPuan = user?.data?.toplamPuan || 0;
    
    if (toplamPuan >= avatar.gerekenPuan) {
      let updatedUser = { ...user, data: { ...user!.data, secilenAvatar: avatar.id } } as any;

      if (user && !user.isGuest && user.dbId) {
        const docRef = doc(db, "users", user.dbId);
        await updateDoc(docRef, { secilenAvatar: avatar.id });
      }
      
      setUser(updatedUser);
      localStorage.setItem("wordimo_user", JSON.stringify(updatedUser));
      
      alert(`Harika! Avatarın "${avatar.ad}" olarak değiştirildi.`);
      setScreen("home");
    } else {
      alert(`🔒 Bu avatar kilitli! Açmak için toplam puanını ${avatar.gerekenPuan}'e ulaştırmalısın.`);
    }
  };

  const fetchLeaderboard = async (tab: "İLKOKUL" | "ORTAOKUL" | "LİSE" | "GENEL") => {
    setActiveTab(tab);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let lb: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        const puanlar = d.sezonPuanlari || { İLKOKUL: 0, ORTAOKUL: 0, LİSE: 0, GENEL: 0 };
        const ilgiliPuan = puanlar[tab] || 0;

        lb.push({
          ...d,
          gosterilecekSezonPuani: ilgiliPuan
        });
      });

      lb.sort((a, b) => b.gosterilecekSezonPuani - a.gosterilecekSezonPuani);
      setLeaderboardData(lb.slice(0, 10));
    } catch (error) {
      alert("Sıralama yüklenemedi!");
    }
  };

  const openLeaderboard = async () => {
    playClickSound();
    setScreen("loading");
    const defaultTab = user?.data?.kademe || "ORTAOKUL";
    await fetchLeaderboard(defaultTab);
    setScreen("leaderboard");
  };

  const loadQuestionsForGame = () => {
    let sourceData: Record<string, { english: string; correctTr: string; wrongTr: string }[]> = {};

    if (mainCategory === "okul" && selectedLevel) {
      if (selectedLevel === "2. Sınıf") sourceData = kelimeler2;
      else if (selectedLevel === "3. Sınıf") sourceData = kelimeler3;
      else if (selectedLevel === "4. Sınıf") sourceData = kelimeler4;
      else if (selectedLevel === "5. Sınıf") sourceData = kelimeler5;
      else if (selectedLevel === "6. Sınıf") sourceData = kelimeler6;
      else if (selectedLevel === "7. Sınıf") sourceData = kelimeler7;
      else if (selectedLevel === "8. Sınıf") sourceData = kelimeler8;
      else if (selectedLevel === "9. Sınıf") sourceData = kelimeler9;
      else if (selectedLevel === "10. Sınıf") sourceData = kelimeler10;
      else if (selectedLevel === "11. Sınıf") sourceData = kelimeler11;
      else if (selectedLevel === "12. Sınıf") sourceData = kelimeler12;
    } else if (mainCategory === "genel" && selectedLevel) {
      if (selectedLevel === "A1") sourceData = kelimelerA1;
      else if (selectedLevel === "A2") sourceData = kelimelerA2;
      else if (selectedLevel === "B1") sourceData = kelimelerB1;
    }

    let questionsPool: any[] = [];

    if (selectedTopic === "KARIŞIK") {
      Object.values(sourceData).forEach((unitArray) => {
        if (Array.isArray(unitArray)) {
          questionsPool.push(...unitArray);
        }
      });
    } else if (selectedTopic && sourceData[selectedTopic]) {
      questionsPool = sourceData[selectedTopic];
    }

    if (questionsPool.length === 0) {
      questionsPool = [
        { english: "prefer", correctTr: "tercih etmek", wrongTr: "nefret etmek" },
        { english: "big", correctTr: "büyük", wrongTr: "iyi" },
        { english: "school", correctTr: "okul", wrongTr: "kantin" },
        { english: "teacher", correctTr: "öğretmen", wrongTr: "öğrenci" },
      ];
    }

    setCurrentQuestions(shuffleArray(questionsPool));
    setCurrentIndex(0);
    setComboCount(0);
    setLives(3);
    setScreen("game");
  };

  const startTopic = (topic: string) => {
    playClickSound();
    setSelectedTopic(topic);
    setScore(0);
    setScreen("loading"); 
  };

  

  useEffect(() => {
    if (screen === "loading") {
      setRandomTip(oyunIpuclari[Math.floor(Math.random() * oyunIpuclari.length)]);
      loadQuestionsForGame();
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "game" && currentQuestions.length > 0 && currentIndex < currentQuestions.length) {
      const q = currentQuestions[currentIndex];
      setOptions([q.correctTr, q.wrongTr].sort(() => Math.random() - 0.5));
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(10);
      speakWord(q.english);
    }
  }, [currentIndex, screen, currentQuestions]);

  useEffect(() => {
    if (screen === "game" && !isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (screen === "game" && timeLeft === 0 && !isAnswered) {
      handleTimeout(); 
    }
  }, [timeLeft, screen, isAnswered]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setComboCount(0);
    playSoundEffect("wrong"); 
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) setTimeout(() => setScreen("gameover"), 1000);
      return newLives;
    });
    setTimeout(() => { if (lives > 1) moveToNextQuestion(); }, 1200);
  };

  const handleAnswer = (option: string, correctTr: string) => {
    if (isAnswered) return;
    playClickSound();
    setIsAnswered(true);
    setSelectedOption(option);

    if (option === correctTr) {
      playSoundEffect("correct"); 
      const totalPoints = Math.floor((50 + timeLeft * 10) * (1.0 + (comboCount * 0.2)));
      setScore((prev) => prev + totalPoints);
      setComboCount((prev) => prev + 1);
      setTimeout(() => moveToNextQuestion(), 1200);
    } else {
      playSoundEffect("wrong"); 
      setComboCount(0);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) setTimeout(() => setScreen("gameover"), 1200);
        return newLives;
      });
      setTimeout(() => { if (lives > 1) moveToNextQuestion(); }, 1200);
    }
  };

  const moveToNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // OYUN BİTTİ! Doğrudan burada Firebase'e kaydediyoruz:
      const finalScore = score;
      setScreen("result");

      if (user && !user.isGuest && user.dbId) {
        const kaydet = async () => {
          try {
            const docRef = doc(db, "users", user.dbId!);
            const mevcutData = user.data || {};
            
            const guncelToplamPuan = Number(mevcutData.toplamPuan) || 0;
            const yeniToplamPuan = guncelToplamPuan + Number(finalScore); 

            let hedefKategori: "İLKOKUL" | "ORTAOKUL" | "LİSE" | "GENEL" = "ORTAOKUL";
            if (mainCategory === "genel") {
              hedefKategori = "GENEL";
            } else if (mainCategory === "okul" && selectedStage) {
              hedefKategori = selectedStage as "İLKOKUL" | "ORTAOKUL" | "LİSE"; 
            }

            const varsayilanSezonPuanlari = { İLKOKUL: 0, ORTAOKUL: 0, LİSE: 0, GENEL: 0 };
            let sezonPuanlari = { ...varsayilanSezonPuanlari, ...(mevcutData.sezonPuanlari || {}) };
            sezonPuanlari[hedefKategori] = Number(sezonPuanlari[hedefKategori] || 0) + Number(finalScore);

            const unitKey = `${mainCategory}_${selectedLevel}_${selectedTopic}`;
            let yeniUnitePuanlari = { ...(mevcutData.unitePuanlari || {}) };
            const mevcutUnitePuani = Number(yeniUnitePuanlari[unitKey] || 0);
            if (Number(finalScore) > mevcutUnitePuani) {
                yeniUnitePuanlari[unitKey] = Number(finalScore);
            }

            await updateDoc(docRef, {
              toplamPuan: yeniToplamPuan,
              sezonPuanlari: sezonPuanlari,
              unitePuanlari: yeniUnitePuanlari
            });
            
            let updatedUser = { 
                ...user, 
                data: { 
                    ...mevcutData, 
                    toplamPuan: yeniToplamPuan, 
                    sezonPuanlari: sezonPuanlari,
                    unitePuanlari: yeniUnitePuanlari
                } 
            } as any;
            setUser(updatedUser);
            localStorage.setItem("wordimo_user", JSON.stringify(updatedUser));
            console.log("Puanlar başarıyla kaydedildi!");

          } catch (error) {
             console.error("Puan kaydetme hatası:", error);
          }
        };
        kaydet();
      }
    }
  };

  const restartGame = () => setScreen("loading");

  const goHome = () => {
    playClickSound();
    setMainCategory(null);
    setSelectedStage(null);
    setSelectedLevel(null);
    setSelectedTopic(null);
    setScreen("home"); 
  };

  const goBack = () => {
    playClickSound();
    if (screen === "leaderboard" || screen === "avatars") setScreen("home");
    else if (selectedLevel) setSelectedLevel(null); 
    else if (selectedStage) setSelectedStage(null);
    else if (mainCategory) setMainCategory(null);
  };

  const getClassesForStage = () => {
    if (selectedStage === "İLKOKUL") return ["2. Sınıf", "3. Sınıf", "4. Sınıf"];
    if (selectedStage === "ORTAOKUL") return ["5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf"];
    if (selectedStage === "LİSE") return ["9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"];
    return [];
  };

  const getAktifAvatarEmoji = () => {
    const avatarId = user?.data?.secilenAvatar || "baykus";
    const bulunan = avatarListesi.find(a => a.id === avatarId);
    return bulunan ? bulunan.emoji : "🦉";
  };

  const TopBar = ({ title }: { title: string }) => (
    <div className="w-full max-w-sm flex items-center justify-center mb-6 relative z-10">
      <button onClick={goBack} className="absolute left-0 flex flex-col items-center justify-center bg-white/85 hover:bg-white border-2 border-white/60 rounded-2xl w-[60px] h-[52px] shadow-md active:scale-95 transition-all text-slate-600 z-10 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-[9px] font-black tracking-widest leading-none">BACK</span>
      </button>
      {title && <h2 className="text-2xl font-black text-slate-800 text-center px-16 drop-shadow-sm">{title}</h2>}
    </div>
  );

    return (
      <div className="min-h-screen relative overflow-x-hidden font-sans flex flex-col items-center justify-between p-6">
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18413784528"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18413784528');
          `,
        }}
      />
      {/* HAREKETLİ ARKA PLAN */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#93c5fd] via-[#e0f2fe] to-[#fbcfe8] animate-pulse duration-10000"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-300/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-300/30 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- SES AÇ/KAPA BUTONU (SINIF MODU) --- */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm text-2xl hover:bg-white transition-all cursor-pointer border border-slate-200"
        title={soundOn ? "Sesi Kapat" : "Sesi Aç"}
      >
        {soundOn ? "🔊" : "🔇"}
      </button>

      {/* --- GİRİŞ EKRANI VE KAYIT MODAL'I --- */}
      {screen === "auth" && (
        <>
          <main className="w-full flex-1 flex flex-col items-center justify-center z-10 my-4">
            <div className="w-full max-w-sm flex flex-col items-center bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white">
              <h1 className="text-6xl text-[#e11d48] mb-2 drop-shadow-md font-extrabold tracking-tight" style={{ fontFamily: 'cursive, "Comic Sans MS"' }}>Wordimo</h1>
              <p className="text-slate-500 font-bold mb-4">Eğlenerek İngilizce Öğren!</p>
              
              <div className="bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold p-3 rounded-2xl mb-6 text-center shadow-sm">
                ✨ Kazandığın puanlar arttıkça 18 farklı özel avatarın kilidini açabilirsin!
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="w-full flex flex-col items-center"
              >
                <input 
                  type="text" 
                  placeholder="Kullanıcı Adı" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-white text-slate-700 font-bold px-6 py-4 rounded-2xl mb-4 border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors shadow-sm"
                />
                <input 
                  type="password" 
                  placeholder="Şifre" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white text-slate-700 font-bold px-6 py-4 rounded-2xl mb-6 border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors shadow-sm"
                />
                
                <button type="submit" className="w-full bg-blue-500 text-white rounded-2xl py-4 text-xl font-bold mb-3 shadow-lg shadow-blue-500/30 active:scale-95 transition-all cursor-pointer">
                  GİRİŞ YAP
                </button>
              </form>

              <button type="button" onClick={() => { playClickSound(); setIsRegisterModalOpen(true); }} className="w-full bg-green-500 text-white rounded-2xl py-4 text-xl font-bold mb-3 shadow-lg shadow-green-500/30 active:scale-95 transition-all cursor-pointer">
                KAYIT OL
              </button>
              
              <div className="w-full flex items-center gap-4 my-4">
                <div className="h-px bg-slate-300 flex-1"></div>
                <span className="text-slate-400 font-bold text-sm">VEYA</span>
                <div className="h-px bg-slate-300 flex-1"></div>
              </div>

              <button type="button" onClick={handleGuestLogin} className="w-full bg-slate-700 text-white rounded-2xl py-4 text-lg font-bold shadow-lg shadow-slate-700/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>🏫</span> Kayıt Olmadan Devam Et
              </button>
            </div>
          </main>

          {isRegisterModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col relative shadow-2xl border border-white">
                <button 
                  onClick={() => { playClickSound(); setIsRegisterModalOpen(false); }} 
                  className="absolute top-5 right-6 text-slate-400 hover:text-red-500 font-black text-xl transition-colors cursor-pointer"
                >✖</button>
                <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">Yeni Hesap</h3>
                <p className="text-slate-500 font-bold text-sm text-center mb-6">Okul kademeni seçerek aramıza katıl!</p>
                
                <input 
                  type="text" 
                  placeholder="Oyundaki Adın (Örn: Ali123)" 
                  value={regNickname}
                  onChange={(e) => setRegNickname(e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-green-400 transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Kullanıcı Adı" 
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-green-400 transition-colors"
                />
                <input 
                  type="password" 
                  placeholder="Şifre" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-green-400 transition-colors"
                />

                <div className="flex gap-2 mb-6">
                  {(["İLKOKUL", "ORTAOKUL", "LİSE"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setRegKademe(k)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${regKademe === k ? "bg-green-500 text-white border-green-500 shadow-sm" : "bg-slate-50 text-slate-500 border-slate-200"}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                <button onClick={handleRegister} className="w-full bg-green-500 text-white rounded-2xl py-4 text-xl font-bold shadow-lg shadow-green-500/30 active:scale-95 transition-all cursor-pointer">
                  KAYDINI TAMAMLA
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- ÜST BİLGİ KARTI --- */}
      {screen !== "auth" && screen !== "loading" && screen !== "gameover" && screen !== "result" && screen !== "game" && (
        <header className="w-full max-w-sm bg-white/85 backdrop-blur-md rounded-3xl p-4 shadow-md border border-white flex justify-between items-center z-10 mb-2 mt-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { playClickSound(); setScreen("avatars"); }} title="Avatarını Değiştir">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-white relative">
              {getAktifAvatarEmoji()}
              <span className="absolute -bottom-1 -right-1 bg-white text-[10px] px-1 rounded-full font-black border">⚙️</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP: {user?.data?.toplamPuan || 0}</p>
              <h3 className="text-base font-black text-slate-800">{user?.username || "Öğrenci"}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user?.isGuest ? (
              <button onClick={() => { handleLogout(); setIsRegisterModalOpen(true); }} className="bg-green-500 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm cursor-pointer hover:bg-green-600 active:scale-95 transition-all">
                Kayıt Ol
              </button>
            ) : (
              <button onClick={handleLogout} className="bg-slate-300 text-slate-700 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm cursor-pointer hover:bg-red-500 hover:text-white active:scale-95 transition-all">
                Çıkış
              </button>
            )}

            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-2xl shadow-sm">
              <span className="text-xl">🔥</span>
              <span className="font-black text-orange-600 text-base">{user?.isGuest ? "0" : (user?.data?.gunlukSeri || 1)} Gün</span>
            </div>
          </div>
        </header>
      )}

      {/* --- AVATAR SEÇİM EKRANI --- */}
      {screen === "avatars" && (
        <main className="w-full max-w-sm flex-1 flex flex-col items-center z-10 my-4">
          <TopBar title="Avatar Koleksiyonu" />
          <div className="w-full bg-white/85 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl border border-white flex flex-col max-h-[75vh] overflow-y-auto">
            <p className="text-slate-500 font-bold text-xs text-center mb-4">Kalıcı XP puanlarınla avatarları aç!</p>
            <div className="grid grid-cols-3 gap-3 w-full">
              {avatarListesi.map((avatar) => {
                const toplamPuan = user?.data?.toplamPuan || 0;
                const kilitli = toplamPuan < avatar.gerekenPuan;
                const aktif = (user?.data?.secilenAvatar || "baykus") === avatar.id;

                return (
                  <div 
                    key={avatar.id} 
                    onClick={() => selectAvatar(avatar)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                      aktif ? "bg-green-100 border-green-500 shadow-md scale-105" :
                      kilitli ? "bg-slate-100 border-slate-200 opacity-60" : "bg-white border-slate-200 hover:border-blue-400 shadow-sm"
                    }`}
                  >
                    <span className="text-4xl mb-1">{avatar.emoji}</span>
                    <span className="text-[11px] font-black text-slate-700 text-center leading-tight">{avatar.ad}</span>
                    {kilitli ? (
                      <span className="text-[9px] font-bold text-red-500 mt-1">🔒 {avatar.gerekenPuan} XP</span>
                    ) : (
                      <span className="text-[9px] font-bold text-green-600 mt-1">Açık ✅</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* --- KADEMELİ HAFTALIK SIRALAMA --- */}
      {screen === "leaderboard" && (
        <main className="w-full max-w-sm flex-1 flex flex-col items-center z-10 my-4">
          <TopBar title="Haftalık Sıralama" />
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl border border-white flex flex-col">
            
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl mb-4">
              {(["İLKOKUL", "ORTAOKUL", "LİSE", "GENEL"] as const).map((tab) => {
                const tabKeyShort = tab === "İLKOKUL" ? "İLKOKUL" : tab === "ORTAOKUL" ? "ORTAOKUL" : tab === "LİSE" ? "LİSE" : "GENEL";
                return (
                  <button
                    key={tab}
                    onClick={() => { playClickSound(); fetchLeaderboard(tabKeyShort); }}
                    className={`py-2 text-[10px] font-black rounded-xl transition-all cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {tab === "İLKOKUL" ? "İlkokul" : tab === "ORTAOKUL" ? "Ortaokul" : tab === "LİSE" ? "Lise" : "Genel"}
                  </button>
                );
              })}
            </div>

            <div className="w-full flex flex-col gap-2 max-h-[45vh] overflow-y-auto">
              {leaderboardData.map((kisi, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-2xl ${index === 0 ? "bg-yellow-100 border border-yellow-300" : index === 1 ? "bg-slate-100 border border-slate-300" : index === 2 ? "bg-orange-100 border border-orange-200" : "bg-white border border-slate-100 shadow-sm"}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-400 w-4 text-sm">{index + 1}.</span>
                    <span className="font-bold text-slate-700 text-sm">{kisi.oyunAdi}</span>
                  </div>
                  <span className="font-black text-blue-600 text-sm">{kisi.gosterilecekSezonPuani || 0} P</span>
                </div>
              ))}
              {leaderboardData.length === 0 && <p className="text-center text-slate-500 font-bold text-sm py-6">Bu kategoride henüz kayıt yok.</p>}
            </div>
          </div>
        </main>
      )}

      {/* --- ORTA ALAN: MENÜLER --- */}
      <div className="w-full flex-1 flex flex-col items-center justify-center z-10 my-4">
        {screen === "home" && (
          <main className="w-full flex flex-col items-center">
            {!mainCategory && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <h1 className="text-5xl text-[#e11d48] mb-6 drop-shadow-md font-extrabold tracking-tight" style={{ fontFamily: 'cursive, "Comic Sans MS"' }}>Wordimo</h1>
                
                <button onClick={() => { playClickSound(); setMainCategory("okul"); }} className="w-full bg-[#3b82f6] text-white rounded-[2rem] py-4 text-xl font-bold mb-3 shadow-lg shadow-blue-500/20 active:scale-95 transition-all tracking-wide cursor-pointer">
                  OKUL İNGİLİZCESİ
                </button>
                <button onClick={() => { playClickSound(); setMainCategory("genel"); }} className="w-full bg-[#0d9488] text-white rounded-[2rem] py-4 text-xl font-bold mb-3 shadow-lg shadow-teal-500/20 active:scale-95 transition-all tracking-wide cursor-pointer">
                  GENEL İNGİLİZCE
                </button>

                <div className="w-full grid grid-cols-2 gap-3 mb-3">
                  <button onClick={() => { playClickSound(); setScreen("avatars"); }} className="bg-[#8b5cf6] text-white rounded-[2rem] py-4 text-base font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <span className="text-2xl">😎</span> Avatarlar
                  </button>
                  <button onClick={openLeaderboard} className="bg-indigo-600 text-white rounded-[2rem] py-4 text-base font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <span className="text-2xl">🏆</span> Sıralama
                  </button>
                </div>

                <div className="w-full grid grid-cols-3 gap-2 mb-3">
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.onurozen.besincisinif" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="bg-emerald-600 text-white rounded-2xl py-3 text-xs font-bold shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <span className="text-lg">📥</span> Android İndir
                  </a>
                  <a 
                    href="https://www.instagram.com/wordimo2026?igsi=eHgwc3ljbDZnanJu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-2xl py-3 text-xs font-bold shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <span className="text-lg">📸</span> Instagram
                  </a>
                  <button 
                    onClick={handleShare}
                    className="bg-sky-500 text-white rounded-2xl py-3 text-xs font-bold shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <span className="text-lg">🔗</span> Paylaş
                  </button>
                </div>
                
                <a 
                  href="https://www.youtube.com/@wordimo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="relative w-full bg-[#ff0000] text-white rounded-[2rem] py-3 flex flex-col items-center justify-center shadow-lg shadow-red-500/30 active:scale-95 transition-all decoration-none overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-[2rem]"></div>
                  <div className="relative z-10 flex items-center gap-2 text-lg font-black tracking-wide">
                    🎧 DİNLEME AKTİVİTELERİ
                  </div>
                </a>
              </div>
            )}

            {/* OKUL KADEME SEÇİMİ */}
            {mainCategory === "okul" && !selectedStage && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <TopBar title="Okul İngilizcesi" />
                <div className="w-full flex flex-col gap-4">
                  <button onClick={() => { playClickSound(); setSelectedStage("İLKOKUL"); }} className="w-full bg-[#8bc34a] text-white rounded-[2rem] py-7 text-2xl font-bold shadow-md active:scale-95 transition-all tracking-wide cursor-pointer">İLKOKUL</button>
                  <button onClick={() => { playClickSound(); setSelectedStage("ORTAOKUL"); }} className="w-full bg-[#2196f3] text-white rounded-[2rem] py-7 text-2xl font-bold shadow-md active:scale-95 transition-all tracking-wide cursor-pointer">ORTAOKUL</button>
                  <button onClick={() => { playClickSound(); setSelectedStage("LİSE"); }} className="w-full bg-[#673ab7] text-white rounded-[2rem] py-7 text-2xl font-bold shadow-md active:scale-95 transition-all tracking-wide cursor-pointer">LİSE</button>
                </div>
              </div>
            )}

            {/* SINIF SEÇİMİ */}
            {mainCategory === "okul" && selectedStage && !selectedLevel && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <TopBar title="Sınıf Seçimi" />
                <div className="w-full flex flex-col gap-4">
                  {getClassesForStage().map((sinif, index) => (
                    <button key={sinif} onClick={() => { playClickSound(); setSelectedLevel(sinif); }} className={`w-full ${buttonColors[index % buttonColors.length]} text-white rounded-3xl py-6 text-2xl font-bold shadow-md active:scale-95 transition-all cursor-pointer`}>{sinif}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ÜNİTE SEÇİMİ (GERÇEK TEMA İSİMLERİ İLE) */}
            {mainCategory === "okul" && selectedLevel && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <TopBar title="Ünite Seçimi" />
                <div className="w-full flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                  <button onClick={() => startTopic("KARIŞIK")} className="w-full bg-[#f59e0b] text-white rounded-3xl p-4 flex items-center shadow-md active:scale-95 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-white/25 rounded-2xl flex items-center justify-center font-black text-xl mr-4 shrink-0">0</div>
                    <div className="text-left font-bold text-lg leading-tight flex-1">⭐ KARIŞIK ÇALIŞ ⭐</div>
                    <div className="text-white/80 font-bold">▶</div>
                  </button>
                  {okulMufredati[selectedLevel]?.map((uniteIsmi, index) => (
                    <button key={index} onClick={() => startTopic(`Unit ${index + 1}`)} className="w-full bg-[#f97316] text-white rounded-3xl p-4 flex items-center shadow-md active:scale-95 transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-white/25 rounded-2xl flex items-center justify-center font-black text-xl mr-4 shrink-0">{index + 1}</div>
                      <div className="text-left font-bold text-lg leading-tight flex-1 pr-2">{uniteIsmi}</div>
                      <div className="text-white/80 font-bold">▶</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GENEL SEVİYE SEÇİMİ */}
            {mainCategory === "genel" && !selectedLevel && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <TopBar title="" />
                <h2 className="text-4xl font-extrabold text-slate-800 mb-1">Genel İngilizce</h2>
                <p className="text-slate-600 mb-6 font-semibold">Seviye Seçimi</p>
                <div className="w-full flex flex-col gap-4">
                  {["A1 - Beginner", "A2 - Elementary", "B1 - Intermediate"].map((seviye, index) => (
                    <button key={seviye} onClick={() => { playClickSound(); setSelectedLevel(seviye.split(" ")[0]); }} className={`w-full ${buttonColors[index % buttonColors.length]} text-white rounded-[2rem] py-6 text-2xl font-bold shadow-md active:scale-95 transition-all cursor-pointer`}>{seviye}</button>
                  ))}
                </div>
              </div>
            )}

            {/* GENEL TEMA SEÇİMİ (GERÇEK İSİMLERLE) */}
            {mainCategory === "genel" && selectedLevel && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <TopBar title="Tema Seçimi" />
                <div className="w-full flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                  <button onClick={() => startTopic("KARIŞIK")} className="w-full bg-[#f59e0b] text-white rounded-3xl p-4 flex items-center shadow-md active:scale-95 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-white/25 rounded-2xl flex items-center justify-center font-black text-xl mr-4 shrink-0">0</div>
                    <div className="text-left font-bold text-lg flex-1">⭐ TÜM KELİMELERİ ÇALIŞ ⭐</div>
                    <div className="text-white/80 font-bold">▶</div>
                  </button>
                  {genelTemalar.map((tema, index) => (
                    <button key={tema.id} onClick={() => startTopic(tema.id)} className="w-full bg-[#f97316] text-white rounded-3xl p-4 flex items-center shadow-md active:scale-95 transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-white/25 rounded-2xl flex items-center justify-center font-black text-xl mr-4 shrink-0">{index + 1}</div>
                      <div className="text-left font-bold text-lg leading-tight flex-1 pr-2">{tema.label}</div>
                      <div className="text-white/80 font-bold">▶</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

        {/* YÜKLEME EKRANI */}
        {screen === "loading" && (
          <main className="min-h-screen w-full bg-[#18181b] flex flex-col items-center justify-center p-8 z-50 fixed inset-0">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mb-8"></div>
            <p className="text-gray-400 text-sm mb-12 uppercase tracking-widest font-bold">Oyun Hazırlanıyor...</p>
            <div className="bg-[#27272a] border border-gray-600 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <p className="text-white text-lg"><span className="mr-2">⏳</span> İPUCU: {randomTip}</p>
            </div>
          </main>
        )}

        {/* SONUÇ EKRANI */}
        {screen === "result" && (
          <main className="w-full flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden">
              <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute w-4 h-4 bg-yellow-400 rounded-square animate-bounce"></div>
              <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute w-5 h-5 bg-blue-500 rounded-square animate-ping"></div>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-10 flex flex-col items-center text-center max-w-sm w-full shadow-2xl border border-white z-10">
              <span className="text-7xl mb-6 animate-bounce">🏆</span>
              <h2 className="text-3xl font-black text-blue-600 mb-2">Harika!</h2>
              <p className="text-slate-600 mb-6 font-bold">{selectedTopic === "KARIŞIK" ? "Karışık Mod" : selectedTopic} bitti.</p>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Bu Oyunun Puanı</p>
              <p className="text-6xl font-black text-orange-500 mb-10">{score}</p>
              <button onClick={() => { playClickSound(); restartGame(); }} className="w-full bg-green-500 text-white font-bold text-xl py-5 rounded-full mb-3 shadow-lg shadow-green-500/20 active:scale-95 transition-all cursor-pointer">Tekrar Oyna</button>
              <button onClick={goHome} className="w-full bg-slate-200 text-slate-700 font-bold text-xl py-5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer">Menüye Dön</button>
            </div>
          </main>
        )}

        {/* GAME OVER EKRANI (PUAN İLAVESİ) */}
        {screen === "gameover" && (
          <main className="w-full flex flex-col items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-10 flex flex-col items-center text-center max-w-sm w-full shadow-2xl border border-white z-10">
              <span className="text-7xl mb-6">💔</span>
              <h2 className="text-3xl font-black text-red-600 mb-2">SÜRE / CAN BİTTİ!</h2>
              <p className="text-slate-600 mb-2 font-bold">Üzgünüm, tüm canların tükendi.</p>
              
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1 mt-4">Toplanan Puan</p>
              <p className="text-5xl font-black text-orange-500 mb-6">{score}</p>

              <button onClick={() => { playClickSound(); restartGame(); }} className="w-full bg-blue-500 text-white font-bold text-xl py-5 rounded-full mb-3 shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer">🔄 Yeniden Dene</button>
              <button onClick={goHome} className="w-full bg-slate-200 text-slate-700 font-bold text-xl py-5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer">Menüye Dön</button>
            </div>
          </main>
        )}

        {/* OYUN EKRANI */}
        {screen === "game" && (() => {
          const q = currentQuestions[currentIndex];
          if (!q) return null; 
          return (
            <main className="w-full max-w-md flex flex-col items-center">
              <div className="w-full flex justify-end mb-2">
                 <button onClick={goHome} className="text-slate-600 font-bold text-sm bg-white/80 px-4 py-2 rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer">✖ ÇIKIŞ</button>
              </div>
              <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-4 flex justify-between items-center mb-3 shadow-md border border-white">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Puan</span>
                  <span className="text-2xl font-black text-blue-600 leading-none">{score}</span>
                </div>
                <div className="flex gap-1 text-xl">
                  {lives >= 1 ? "❤️" : "🖤"}
                  {lives >= 2 ? "❤️" : "🖤"}
                  {lives >= 3 ? "❤️" : "🖤"}
                </div>
              </div>
              <div className="w-full h-2.5 bg-white/50 rounded-full mb-6 overflow-hidden shadow-inner">
                <div className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear shadow-sm" style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
              </div>
              <div className="w-full bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center py-20 px-4 mb-6 border border-white">
                <p className="text-slate-400 font-semibold text-sm mb-6 uppercase tracking-wide">Kelimenin anlamı nedir?</p>
                <div className="flex items-center gap-4">
                  <h2 className="text-5xl font-black text-slate-800 tracking-tight">{q.english}</h2>
                  <button onClick={() => { playClickSound(); speakWord(q.english); }} className="bg-blue-50 text-blue-500 p-3 rounded-2xl text-2xl shadow-sm hover:bg-blue-100 active:scale-95 transition-all cursor-pointer">🔊</button>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4">
                {options.map((option, index) => {
                  let btnClass = "bg-[#f97316] text-white shadow-lg shadow-orange-500/20";
                  if (isAnswered) {
                    if (option === q.correctTr) btnClass = "bg-[#10b981] text-white shadow-lg shadow-emerald-500/20"; 
                    else if (option === selectedOption) btnClass = "bg-[#ef4444] text-white shadow-lg shadow-red-500/20"; 
                  }
                  return (
                    <button key={index} onClick={() => handleAnswer(option, q.correctTr)} disabled={isAnswered} className={`w-full py-5 text-2xl font-bold rounded-[2rem] active:scale-95 transition-all cursor-pointer ${btnClass}`}>
                      {option}
                    </button>
                  );
                })}
              </div>
            </main>
          );
        })()}
      </div>

      {/* ALT MOTİVASYON BANDI */}
      {screen !== "auth" && screen !== "loading" && screen !== "gameover" && screen !== "result" && screen !== "game" && (
        <footer className="w-full max-w-sm text-center z-10 mt-2">
          <p className="text-xs font-bold text-slate-500 drop-shadow-sm">
            💡 Wordimo • Eğlenerek İngilizce Öğren!
          </p>
        </footer>
      )}

    </div>
  );
}