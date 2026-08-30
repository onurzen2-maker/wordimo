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
import { kelimelerB2 } from "./data/kelimelerB2";
import { kelimelerC1 } from "./data/kelimelerC1";

// --- MÜFREDAT VERİLERİ (MAARİF MODELİ GÜNCEL) ---
const okulMufredati: Record<string, string[]> = {
  "2. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Homes & Houses & Neighbourhoods", "Life in the City & the World"],
  "3. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Homes & Houses & Neighbourhoods", "Life in the City & the World"], // 2. Sınıf ile eşitlendi (Maarif)
  "4. Sınıf": ["Classroom Rules", "Nationality", "Cartoon Characters", "Free Time", "My Day", "Fun with Science", "Jobs", "My Clothes", "My Friends", "Food & Drinks"],
  "5. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life in the Neighbourhood & City", "Life in the World 1", "Life in the World 2", "Life in the Universe and Future"],
  "6. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life in the Neighbourhood & City", "Life in the World 1", "Life in the World 2", "Life in the Universe and Future"], // 5. Sınıf ile eşitlendi (Maarif)
  "7. Sınıf": ["Appearance & Personality", "Sports", "Biographies", "Wild Animals", "Television", "Celebrations", "Dreams", "Public Buildings", "Environment", "Planets"],
  "8. Sınıf": ["Friendship", "Teen Life", "In the Kitchen", "On the Phone", "The Internet", "Adventures", "Tourism", "Chores", "Science", "Natural Forces"],
  "9. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life in the House & Neighbourhood", "Life in the City & Country", "Life in the World & Nature", "Life in the Universe and Future"],
  "10. Sınıf": ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life in the House & Neighbourhood", "Life in the City & Country", "Life in the World & Nature", "Life in the Universe and Future"], // 9. Sınıf ile eşitlendi (Maarif)
  "11. Sınıf": ["Future Jobs", "Hobbies & Skills", "Hard Times", "What a Life", "Back to the Past", "Open Your Heart", "Facts about Turkey", "Sports", "My Friends", "Values"],
  "12. Sınıf": ["Music", "Friendship", "Human Rights", "Coming Soon", "Psychology", "Favors", "News Stories", "Alternative Energy", "Technology", "Manners"]
};

// DOĞRU GENEL İNGİLİZCE KONULARI
const genelTemalar = [
  { id: "Unit 1", label: "Aile, İnsanlar ve Meslekler" },
  { id: "Unit 2", label: "Zaman, Günler ve Aylar" },
  { id: "Unit 3", label: "Yiyecek ve İçecekler" },
  { id: "Unit 4", label: "Mekanlar, Seyahat ve Ulaşım" },
  { id: "Unit 5", label: "Doğa, Hayvanlar ve Vücut" },
  { id: "Unit 6", label: "Eşyalar, Kıyafetler ve Teknoloji" },
  { id: "Unit 7", label: "Sıfatlar ve Renkler" },
  { id: "Unit 8", label: "Fiiller (Verbs)" },
  { id: "Unit 9", label: "Sayılar ve Miktar" },
  { id: "Unit 10", label: "Dilbilgisi, Zarf ve Bağlaçlar" }
];

const stages = [
  { id: "İLKOKUL", levels: ["2. Sınıf", "3. Sınıf", "4. Sınıf"] },
  { id: "ORTAOKUL", levels: ["5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf"] },
  { id: "LİSE", levels: ["9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"] },
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

// --- RENK PALETLERİ (Kartlar İçin) ---
const cardColors = [
  { bg: "bg-blue-50", border: "border-blue-200", borderBottom: "border-b-blue-300", text: "text-blue-700", iconBg: "bg-blue-200", iconText: "text-blue-700" },
  { bg: "bg-emerald-50", border: "border-emerald-200", borderBottom: "border-b-emerald-300", text: "text-emerald-700", iconBg: "bg-emerald-200", iconText: "text-emerald-700" },
  { bg: "bg-purple-50", border: "border-purple-200", borderBottom: "border-b-purple-300", text: "text-purple-700", iconBg: "bg-purple-200", iconText: "text-purple-700" },
  { bg: "bg-pink-50", border: "border-pink-200", borderBottom: "border-b-pink-300", text: "text-pink-700", iconBg: "bg-pink-200", iconText: "text-pink-700" },
  { bg: "bg-orange-50", border: "border-orange-200", borderBottom: "border-b-orange-300", text: "text-orange-700", iconBg: "bg-orange-200", iconText: "text-orange-700" },
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
  if (!isGlobalSoundOn) return; 
  try {
    const audio = new Audio(type === "correct" ? "/correct.mp3" : "/wrong.mp3");
    audio.play().catch(() => {});
  } catch (error) {}
};

const playClickSound = () => {
  if (!isGlobalSoundOn) return; 
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
  const [screen, setScreen] = useState<"home" | "loading" | "game" | "result" | "gameover" | "leaderboard" | "avatars">("loading");
  const [user, setUser] = useState<{ username: string; isGuest: boolean; dbId?: string; data?: any } | null>(null);
  
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"İLKOKUL" | "ORTAOKUL" | "LİSE" | "GENEL">("ORTAOKUL");
  
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const [regNickname, setRegNickname] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regKademe, setRegKademe] = useState<"İLKOKUL" | "ORTAOKUL" | "LİSE">("ORTAOKUL");

  const [mainCategory, setMainCategory] = useState<"okul" | "genel" | "siralama">("okul");
  const [openStage, setOpenStage] = useState<string | null>("ORTAOKUL");
  const [selectedLevel, setSelectedLevel] = useState<string>("5. Sınıf");
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

  const [soundOn, setSoundOn] = useState(true);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    isGlobalSoundOn = newState; 
  };

  const handleGuestLogin = (isAuto = false) => {
    if (!isAuto) playClickSound();
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

  useEffect(() => {
    const savedUser = localStorage.getItem("wordimo_user");
    if (savedUser) {
      try {
        let parsedUser = JSON.parse(savedUser);
        
        if (!parsedUser.dbId && parsedUser.data && parsedUser.data.dbId) {
          parsedUser.dbId = parsedUser.data.dbId;
        }
        
        if (!parsedUser.dbId && parsedUser.username) {
          parsedUser.dbId = parsedUser.username.toLowerCase().trim();
        }

        setUser(parsedUser);
        localStorage.setItem("wordimo_user", JSON.stringify(parsedUser));
        setScreen("home");
      } catch (e) {
        localStorage.removeItem("wordimo_user");
        handleGuestLogin(true); // Otomatik misafir girişi
      }
    } else {
      handleGuestLogin(true); // Veri yoksa otomatik misafir girişi
    }
  }, []);

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem("wordimo_user");
    setIsAvatarMenuOpen(false);
    handleGuestLogin(false); // Çıkış yapınca tekrar misafir moduna düş
  };

  const speakWord = (text: string) => {
    if (!isGlobalSoundOn) return; 
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
        sezonPuanlari: { İLKOKUL: 0, ORTAOKUL: 0, LİSE: 0, GENEL: 0 },
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
      
      setIsLoginModalOpen(false); // Modal'ı kapat
      setScreen("home");
    } catch (error) {
      alert("Giriş başarısız.");
    }
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
      setIsAvatarMenuOpen(false);
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
      console.log("Sıralama yüklenemedi!", error);
    }
  };

  const openLeaderboard = async () => {
    playClickSound();
    const defaultTab = activeTab || "ORTAOKUL";
    await fetchLeaderboard(defaultTab);
    setMainCategory("siralama");
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
      else if (selectedLevel === "B2") sourceData = kelimelerB2;
      else if (selectedLevel === "C1") sourceData = kelimelerC1;
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
    
    // --- 3. VE 10. SINIF İÇİN KORUMA KALKANI ---
    if (mainCategory === "okul" && (selectedLevel === "3. Sınıf" || selectedLevel === "10. Sınıf")) {
        alert("⏳ Bu sınıfın kelimeleri yeni Maarif Modeline göre güncelleniyor. Çok yakında eklenecek!");
        return; // Fonksiyonu durdur, oyuna geçme
    }

    setSelectedTopic(topic);
    setScore(0);
    setScreen("loading"); 
  };

  useEffect(() => {
    if (screen === "loading") {
      setRandomTip(oyunIpuclari[Math.floor(Math.random() * oyunIpuclari.length)]);
      if (user) {
         setTimeout(() => loadQuestionsForGame(), 500);
      }
    }
  }, [screen, user]);

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
    if (currentIndex < currentQuestions.length - 1) setCurrentIndex((prev) => prev + 1);
    else setScreen("result");
  };

  useEffect(() => {
    if ((screen === "result" || screen === "gameover") && user && !user.isGuest && user.dbId) {
      const kaydet = async () => {
        try {
          const docRef = doc(db, "users", user.dbId!);
          const mevcutData = user.data || {};
          
          const guncelToplamPuan = Number(mevcutData.toplamPuan) || 0;
          const yeniToplamPuan = guncelToplamPuan + Number(score); 

          let hedefKategori: "İLKOKUL" | "ORTAOKUL" | "LİSE" | "GENEL" = "ORTAOKUL";
          if (mainCategory === "genel") {
            hedefKategori = "GENEL";
          } else if (mainCategory === "okul" && openStage) {
            hedefKategori = openStage as "İLKOKUL" | "ORTAOKUL" | "LİSE"; 
          }

          const varsayilanSezonPuanlari = { İLKOKUL: 0, ORTAOKUL: 0, LİSE: 0, GENEL: 0 };
          let sezonPuanlari = { ...varsayilanSezonPuanlari, ...(mevcutData.sezonPuanlari || {}) };
          sezonPuanlari[hedefKategori] = Number(sezonPuanlari[hedefKategori] || 0) + Number(score);

          const unitKey = `${mainCategory}_${selectedLevel}_${selectedTopic}`;
          let yeniUnitePuanlari = { ...(mevcutData.unitePuanlari || {}) };
          const mevcutUnitePuani = Number(yeniUnitePuanlari[unitKey] || 0);
          if (Number(score) > mevcutUnitePuani) {
              yeniUnitePuanlari[unitKey] = Number(score);
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

        } catch (error) {
           console.error("Puan kaydetme hatası:", error);
        }
      };
      
      if (score > 0) kaydet();
    }
  }, [screen]);

  const restartGame = () => setScreen("loading");

  const goHome = () => {
    playClickSound();
    setScreen("home"); 
  };

  const getAktifAvatarEmoji = () => {
    const avatarId = user?.data?.secilenAvatar || "baykus";
    const bulunan = avatarListesi.find(a => a.id === avatarId);
    return bulunan ? bulunan.emoji : "🦉";
  };

  const getCurrentUnits = () => {
    if (mainCategory === "okul") return okulMufredati[selectedLevel] || [];
    if (mainCategory === "genel") return genelTemalar;
    return [];
  };

  const toggleStage = (stageId: string) => {
    playClickSound();
    if (openStage === stageId) setOpenStage(null);
    else setOpenStage(stageId);
  };

  // Oyun ve Yükleme Ekranları
  if (screen === "loading" || screen === "game" || screen === "result" || screen === "gameover") {
    return (
      <div className="min-h-screen relative overflow-x-hidden font-sans flex flex-col items-center justify-center p-6 bg-slate-100">
        <button onClick={toggleSound} className="fixed top-4 right-4 z-50 bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm text-2xl hover:bg-white transition-all cursor-pointer border border-slate-200" title={soundOn ? "Sesi Kapat" : "Sesi Aç"}>
          {soundOn ? "🔊" : "🔇"}
        </button>

        {screen === "loading" && (
          <main className="min-h-screen w-full bg-[#18181b] flex flex-col items-center justify-center p-8 z-50 fixed inset-0">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mb-8"></div>
            <p className="text-gray-400 text-sm mb-12 uppercase tracking-widest font-bold">Oyun Hazırlanıyor...</p>
            <div className="bg-[#27272a] border border-gray-600 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <p className="text-white text-lg"><span className="mr-2">⏳</span> İPUCU: {randomTip}</p>
            </div>
          </main>
        )}

        {screen === "game" && (() => {
          const q = currentQuestions[currentIndex];
          if (!q) return null; 
          return (
            <main className="w-full max-w-md flex flex-col items-center mt-8">
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
                  <h2 className="text-5xl font-black text-slate-800 tracking-tight text-center">{q.english}</h2>
                  <button onClick={() => { playClickSound(); speakWord(q.english); }} className="bg-blue-50 text-blue-500 p-3 rounded-2xl text-2xl shadow-sm hover:bg-blue-100 active:scale-95 transition-all cursor-pointer shrink-0">🔊</button>
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

        {screen === "result" && (
          <main className="w-full flex flex-col items-center justify-center relative min-h-[60vh]">
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

        {screen === "gameover" && (
          <main className="w-full flex flex-col items-center justify-center min-h-[60vh]">
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
      </div>
    );
  }

  // --- DASHBOARD (MASAÜSTÜ & YENİ UI) GÖRÜNÜMÜ ---
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      
      {/* MODALLAR (GİRİŞ VE KAYIT EKRANLARI) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col relative shadow-2xl border border-white">
            <button onClick={() => { playClickSound(); setIsLoginModalOpen(false); }} className="absolute top-5 right-6 text-slate-400 hover:text-red-500 font-black text-xl transition-colors cursor-pointer">✖</button>
            <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">Giriş Yap</h3>
            <p className="text-slate-500 font-bold text-sm text-center mb-6">Hesabına girerek kaldığın yerden devam et.</p>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="w-full flex flex-col items-center">
              <input type="text" placeholder="Kullanıcı Adı" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors" />
              <input type="password" placeholder="Şifre" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-6 border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors" />
              <button type="submit" className="w-full bg-blue-500 text-white rounded-2xl py-4 text-xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all cursor-pointer">GİRİŞ YAP</button>
            </form>
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col relative shadow-2xl border border-white">
            <button onClick={() => { playClickSound(); setIsRegisterModalOpen(false); }} className="absolute top-5 right-6 text-slate-400 hover:text-red-500 font-black text-xl transition-colors cursor-pointer">✖</button>
            <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">Yeni Hesap</h3>
            <p className="text-slate-500 font-bold text-sm text-center mb-6">Okul kademeni seçerek aramıza katıl!</p>
            <input type="text" placeholder="Oyundaki Adın (Örn: Ali123)" value={regNickname} onChange={(e) => setRegNickname(e.target.value)} className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-green-400 transition-colors" />
            <input type="text" placeholder="Kullanıcı Adı" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-green-400 transition-colors" />
            <input type="password" placeholder="Şifre" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-2xl mb-3 border-2 border-slate-200 outline-none focus:border-green-400 transition-colors" />
            <div className="flex gap-2 mb-6">
              {(["İLKOKUL", "ORTAOKUL", "LİSE"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setRegKademe(k)} className={`flex-1 py-2 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${regKademe === k ? "bg-green-500 text-white border-green-500 shadow-sm" : "bg-slate-50 text-slate-500 border-slate-200"}`}>{k}</button>
              ))}
            </div>
            <button onClick={handleRegister} className="w-full bg-green-500 text-white rounded-2xl py-4 text-xl font-bold shadow-lg shadow-green-500/30 active:scale-95 transition-all cursor-pointer">KAYDINI TAMAMLA</button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#93c5fd] via-[#e0f2fe] to-[#fbcfe8] animate-pulse duration-10000 pointer-events-none"></div>
      
      {/* SOL MENÜ */}
      <aside className="w-80 bg-white/95 backdrop-blur-sm border-r border-slate-200 flex flex-col shadow-lg z-20">
        <div className="h-24 flex items-center justify-center border-b border-slate-100 shrink-0">
          <h1 onClick={() => { setMainCategory("okul"); setScreen("home"); }} className="text-4xl font-black tracking-tight cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-105 transition-transform">
            Wordimo
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col custom-scrollbar">
          <div className="space-y-6">
            
            {/* OKUL İNGİLİZCESİ */}
            <div>
              <button 
                onClick={() => { playClickSound(); setMainCategory("okul"); setScreen("home"); }}
                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  mainCategory === "okul" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className="text-2xl">🏫</span> <span>Okul İngilizcesi</span>
              </button>

              {mainCategory === "okul" && (
                <div className="mt-2 ml-4 pl-4 border-l-2 border-slate-100 space-y-2">
                  {stages.map((stage) => (
                    <div key={stage.id}>
                      <button 
                        onClick={() => toggleStage(stage.id)}
                        className="cursor-pointer w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {stage.id} <span className="text-xs text-slate-400">{openStage === stage.id ? "▼" : "▶"}</span>
                      </button>

                      {openStage === stage.id && (
                        <div className="mt-1 flex flex-col gap-1">
                          {stage.levels.map((level) => {
                            const isYeni = ["2. Sınıf", "3. Sınıf", "5. Sınıf", "6. Sınıf", "9. Sınıf", "10. Sınıf"].includes(level);
                            return (
                              <button
                                key={level}
                                onClick={() => { playClickSound(); setSelectedLevel(level); setScreen("home"); }}
                                className={`cursor-pointer w-full flex items-center justify-between px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                                  selectedLevel === level ? "bg-blue-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                <span>{level}</span>
                                {isYeni && (
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${selectedLevel === level ? "bg-white text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                                    YENİ
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GENEL İNGİLİZCE */}
            <div>
              <button 
                onClick={() => { playClickSound(); setMainCategory("genel"); setScreen("home"); }}
                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  mainCategory === "genel" ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className="text-2xl">🌍</span> <span>Genel İngilizce</span>
              </button>

              {mainCategory === "genel" && (
                <div className="mt-2 ml-4 pl-4 border-l-2 border-slate-100 flex flex-col gap-1">
                  {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { playClickSound(); setSelectedLevel(lvl); setScreen("home"); }}
                      className={`cursor-pointer w-full text-left px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                        selectedLevel === lvl ? "bg-teal-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {lvl} Seviyesi
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SIRALAMALAR */}
            <div>
              <button 
                onClick={openLeaderboard}
                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  mainCategory === "siralama" ? "bg-amber-50 text-amber-600" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className="text-2xl">🏆</span> <span>Sıralamalar</span>
              </button>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Keşfet</h3>
            <div className="space-y-1">
              <a href="https://www.youtube.com/@wordimo" target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all group shadow-sm decoration-none">
                <span className="text-2xl group-hover:scale-110 transition-transform">🎧</span> <span>Dinleme Pratiği</span>
              </a>
              <a href="https://www.instagram.com/wordimo2026?igsi=eHgwc3ljbDZnanJu" target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-pink-50 hover:text-pink-600 transition-all group decoration-none">
                <span className="text-2xl group-hover:scale-110 transition-transform">📸</span> <span>Instagram'da Takip Et</span>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.onurozen.besincisinif" target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-green-50 hover:text-green-600 transition-all group decoration-none">
                <span className="text-2xl group-hover:scale-110 transition-transform">📱</span> <span>Uygulamayı İndir</span>
              </a>
              <button onClick={handleShare} className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🎁</span> <span>Arkadaşınla Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* SAĞ ANA ALAN */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 cursor-default">
              {mainCategory === "okul" && selectedLevel}
              {mainCategory === "genel" && `Genel İngilizce - ${selectedLevel}`}
              {mainCategory === "siralama" && "Liderlik Tablosu"}
            </h2>
            <p className="text-sm font-semibold text-slate-500 cursor-default">
              {mainCategory === "siralama" ? "Kategorini seç ve rekabete katıl!" : "Çalışmak istediğin üniteyi seç"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleSound} className="bg-slate-100 p-2.5 rounded-xl shadow-sm hover:bg-white transition-all cursor-pointer border border-slate-200" title={soundOn ? "Sesi Kapat" : "Sesi Aç"}>
              {soundOn ? "🔊" : "🔇"}
            </button>

            {user?.isGuest ? (
              <div className="flex gap-2">
                <button onClick={() => { playClickSound(); setIsLoginModalOpen(true); }} className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm cursor-pointer hover:bg-blue-50 active:scale-95 transition-all">
                  Giriş Yap
                </button>
                <button onClick={() => { playClickSound(); setIsRegisterModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-sm cursor-pointer hover:bg-blue-700 active:scale-95 transition-all">
                  Kayıt Ol
                </button>
              </div>
            ) : (
              <div className="cursor-default flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-2xl">
                <span className="text-xl">🔥</span>
                <span className="font-black text-orange-600 text-sm">{user?.data?.gunlukSeri || 1} Gün</span>
              </div>
            )}
            
            <div className="relative">
              <div onClick={() => { playClickSound(); setIsAvatarMenuOpen(!isAvatarMenuOpen); }} className="cursor-pointer flex items-center gap-3 bg-white border border-slate-200 px-3 py-2 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-inner text-white">
                  {getAktifAvatarEmoji()}
                </div>
                <div className="pr-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">XP: {user?.data?.toplamPuan || 0}</p>
                  <p className="text-sm font-black text-slate-700 leading-tight">{user?.username || "Öğrenci"}</p>
                </div>
              </div>

              {isAvatarMenuOpen && (
                <div className="absolute right-0 mt-3 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 w-80 max-h-[70vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-700 cursor-default">Avatar Seçimi</h4>
                    <button onClick={() => setIsAvatarMenuOpen(false)} className="cursor-pointer text-slate-400 hover:text-red-500 font-bold">✕</button>
                  </div>
                  
                  {user?.isGuest ? (
                    <div className="text-center p-4 bg-amber-50 rounded-xl mb-4 border border-amber-200">
                      <p className="text-xs font-bold text-amber-700 mb-2">Avatarları açmak için üye olmalısın!</p>
                      <button onClick={() => { setIsAvatarMenuOpen(false); setIsRegisterModalOpen(true); }} className="w-full bg-amber-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">Hemen Üye Ol</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {avatarListesi.map((avatar) => {
                        const toplamPuan = user?.data?.toplamPuan || 0;
                        const kilitli = toplamPuan < avatar.gerekenPuan;
                        const aktif = (user?.data?.secilenAvatar || "baykus") === avatar.id;
                        return (
                          <button key={avatar.id} onClick={() => selectAvatar(avatar)} className={`cursor-pointer p-2 rounded-xl flex flex-col items-center justify-center transition-all ${aktif ? "bg-green-100 border-2 border-green-500" : kilitli ? "bg-slate-50 opacity-60" : "bg-slate-50 hover:bg-slate-100"}`}>
                            <span className="text-2xl mb-1">{avatar.emoji}</span>
                            <span className="text-[9px] font-bold leading-tight">{kilitli ? `🔒 ${avatar.gerekenPuan}` : "Açık"}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {!user?.isGuest && (
                    <div className="mt-4 border-t pt-4">
                      <button onClick={handleLogout} className="w-full text-center text-red-500 font-bold text-sm hover:underline cursor-pointer">Çıkış Yap / Hesap Değiştir</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-0">
          
          {/* ÜNİTELER (Okul veya Genel) */}
          {mainCategory !== "siralama" && (
            <div className="max-w-6xl mx-auto pb-10">
              <button onClick={() => startTopic("KARIŞIK")} className="cursor-pointer w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-3xl p-6 mb-8 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1 border-b-4 border-orange-600 transition-all duration-300">
                <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center font-black text-3xl mr-6 shrink-0">⭐</div>
                <div className="text-left flex-1">
                  {mainCategory === "genel" ? (
                    <h3 className="font-black text-2xl mb-1">⭐ {selectedLevel} - TÜM KELİMELERİ ÇALIŞ (KARIŞIK) ⭐</h3>
                  ) : (
                    <h3 className="font-black text-2xl mb-1">Tüm Üniteleri Karışık Çalış</h3>
                  )}
                  <p className="font-semibold text-white/80">Kendini test et ve daha fazla XP kazan!</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">▶</div>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getCurrentUnits().map((unite, index) => {
                  const style = cardColors[index % cardColors.length];
                  const isGenel = mainCategory === "genel";
                  const uniteBasligi = isGenel ? (unite as any).label : unite;
                  const uniteHedefi = isGenel ? (unite as any).id : `Unit ${index + 1}`;
                  
                  return (
                    <button key={index} onClick={() => startTopic(uniteHedefi)} className={`cursor-pointer group rounded-3xl p-6 border-2 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48 text-left ${style.bg} ${style.border} border-b-[6px] ${style.borderBottom}`}>
                      <div className="flex justify-between items-start w-full">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-colors group-hover:bg-white ${style.iconBg} ${style.iconText}`}>
                          {index + 1}
                        </div>
                        <div className="text-xs font-bold text-slate-500 bg-white/60 px-3 py-1 rounded-full">
                          {isGenel ? "Topic" : "Unit"} {index + 1}
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className={`font-black text-xl transition-colors leading-tight line-clamp-2 ${style.text}`}>
                          {uniteBasligi as string}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* LİDERLİK TABLOSU EKRANI */}
          {mainCategory === "siralama" && (
            <div className="max-w-4xl mx-auto pb-10">
              <div className="flex justify-center mb-10">
                <div className="bg-white/60 p-1 rounded-2xl flex gap-1 shadow-sm border border-slate-200">
                  {(["İLKOKUL", "ORTAOKUL", "LİSE", "GENEL"] as const).map((kategori) => (
                    <button key={kategori} onClick={() => fetchLeaderboard(kategori)} className={`cursor-pointer px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-200 ${activeTab === kategori ? "bg-amber-500 text-white shadow-md scale-105" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}>
                      {kategori}
                    </button>
                  ))}
                </div>
              </div>

              {leaderboardData.length > 0 ? (
                <>
                  <div className="flex justify-center items-end gap-6 mb-12">
                    {leaderboardData[1] && (
                      <div className="flex flex-col items-center cursor-default">
                        <div className="text-4xl mb-2">{avatarListesi.find(a => a.id === leaderboardData[1].secilenAvatar)?.emoji || "🦉"}</div>
                        <div className="w-28 h-32 bg-slate-200 rounded-t-xl flex flex-col items-center justify-start pt-4 border-t-4 border-slate-400 shadow-inner">
                          <span className="text-2xl font-black text-slate-500">2</span>
                          <span className="text-xs font-bold mt-2 text-slate-600 truncate w-full px-2 text-center">{leaderboardData[1].oyunAdi}</span>
                        </div>
                      </div>
                    )}
                    {leaderboardData[0] && (
                      <div className="flex flex-col items-center cursor-default">
                        <div className="text-6xl mb-2 animate-bounce">{avatarListesi.find(a => a.id === leaderboardData[0].secilenAvatar)?.emoji || "🦉"}</div>
                        <div className="w-32 h-40 bg-amber-100 rounded-t-xl flex flex-col items-center justify-start pt-4 border-t-4 border-amber-400 shadow-lg z-10">
                          <span className="text-4xl font-black text-amber-500">1</span>
                          <span className="text-sm font-bold mt-2 text-amber-700 truncate w-full px-2 text-center">{leaderboardData[0].oyunAdi}</span>
                        </div>
                      </div>
                    )}
                    {leaderboardData[2] && (
                      <div className="flex flex-col items-center cursor-default">
                        <div className="text-4xl mb-2">{avatarListesi.find(a => a.id === leaderboardData[2].secilenAvatar)?.emoji || "🦉"}</div>
                        <div className="w-28 h-28 bg-orange-50 rounded-t-xl flex flex-col items-center justify-start pt-4 border-t-4 border-orange-400 shadow-inner">
                          <span className="text-2xl font-black text-orange-400">3</span>
                          <span className="text-xs font-bold mt-2 text-orange-700 truncate w-full px-2 text-center">{leaderboardData[2].oyunAdi}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    {leaderboardData.map((kisi, idx) => {
                      const isMe = user?.dbId === kisi.kullaniciAdi;
                      return (
                        <div key={idx} className={`flex items-center justify-between p-4 px-8 border-b border-slate-100 transition-colors ${isMe ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                          <div className="flex items-center gap-6 cursor-default">
                            <span className={`text-xl font-black w-6 text-center ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-orange-400" : "text-slate-300"}`}>{idx + 1}</span>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                              {avatarListesi.find(a => a.id === kisi.secilenAvatar)?.emoji || "🦉"}
                            </div>
                            <span className={`font-bold text-lg ${isMe ? "text-blue-700" : "text-slate-700"}`}>
                              {kisi.oyunAdi} {isMe && "(Sen)"}
                            </span>
                          </div>
                          <div className="font-black text-slate-500 tracking-wide cursor-default">
                            {kisi.gosterilecekSezonPuani || 0} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500 font-bold mt-10">Bu kategoride henüz sıralama yok.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}