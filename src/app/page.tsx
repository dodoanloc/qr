"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, RefreshCw, Loader2 } from "lucide-react";

// Caption themes with icons
const THEMES = [
  { id: "thinh", name: "Thả Thính", icon: "💘", color: "from-pink-500 to-rose-500", prompt: "Tạo 1 caption thả thính, flirty, ngọt ngào, dễ thương để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "haihuoc", name: "Hài Hước", icon: "😂", color: "from-yellow-400 to-amber-500", prompt: "Tạo 1 caption hài hước, dí dỏm, meme style để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "chill", name: "Chill Chill", icon: "🌸", color: "from-purple-500 to-indigo-500", prompt: "Tạo 1 caption chill, thư giãn, bình yên để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "dongluc", name: "Động Lực", icon: "🔥", color: "from-orange-500 to-red-500", prompt: "Tạo 1 caption động lực, truyền cảm hứng, tích cực để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "buon", name: "Deep Buồn", icon: "🌧️", color: "from-blue-500 to-cyan-500", prompt: "Tạo 1 caption buồn, deep, cảm xúc để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "anvat", name: "Ăn Vặt", icon: "🍜", color: "from-yellow-400 to-orange-500", prompt: "Tạo 1 caption về đồ ăn, food, ăn uống để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "dulich", name: "Du Lịch", icon: "✈️", color: "from-teal-400 to-emerald-500", prompt: "Tạo 1 caption về du lịch, travel, khám phá để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "tinhban", name: "Tình Bạn", icon: "👯", color: "from-green-400 to-teal-500", prompt: "Tạo 1 caption về tình bạn, friendship để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
  { id: "selflove", name: "Self Love", icon: "💅", color: "from-fuchsia-500 to-pink-500", prompt: "Tạo 1 caption về yêu bản thân, self love, tự tin để đăng mạng xã hội. Kèm emoji phù hợp. Chỉ trả về caption, không giải thích." },
];

// Fallback captions database
const FALLBACK_CAPTIONS: Record<string, string[]> = {
  thinh: ["Em không cần tỏ tình, em chỉ cần tỏ ra dễ thương 😘", "Chỉ cần một nụ cườlà đủ làm tim anh tan chảy 💕"],
  haihuoc: ["Tôi không lườ tôi chỉ đang tiết kiệm năng lượng 😴", "Tôi không béo, tôi chỉ dễ thương theo chiều ngang 🍔"],
  chill: ["Cuộc sống ngắn lắm, đừng quên chill mỗi ngày 🌿", "Không gì là không thể, chỉ là chưa thử thôi ✨"],
  dongluc: ["Hôm nay không cố gắng, ngày mai sẽ hối hận 💪", "Đừng bao giờ từ bỏ ước mơ của mình 🌟"],
  buon: ["Mưa rơi như nỗi buồn không tên... ☔", "Đôi khi im lặng là tiếng nói lớn nhất 🌙"],
  anvat: ["Ăn là niềm vui, vui là phải ăn 🍕", "Không gì là không thể, trừ việc nhịn ăn 😋"],
  dulich: ["Đi để trở về, trở về để đi tiếp 🌍", "Mỗi chuyến đi là một câu chuyện mới 📖"],
  tinhban: ["Bạn thân là ngườibiết hết bí mật nhưng không bán đứng 👯", "Tình bạn đẹp không cần hàng ngày gặp gỡ 💕"],
  selflove: ["Yêu bản thân là khởi đầu của mọi loại tình yêu 💕", "Bạn xứng đáng với những điều tốt đẹp nhất ✨"],
};

// DeepSeek API call
async function generateWithAI(prompt: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-ee16a6cfd34a460d82c69ace22955bc6'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Bạn là một chuyên gia tạo caption cho mạng xã hội. Tạo caption ngắn gọn, catchy, phù hợp GenZ.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.9
      })
    });

    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('AI generation failed:', error);
    return null;
  }
}

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState("thinh");
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usingAI, setUsingAI] = useState(false);

  const generate = async () => {
    setLoading(true);
    setUsingAI(false);
    
    const theme = THEMES.find((t) => t.id === selectedTheme);
    
    // Try AI first
    const aiCaption = await generateWithAI(theme?.prompt || "");
    
    if (aiCaption) {
      setCaption(aiCaption);
      setUsingAI(true);
    } else {
      // Fallback to local
      const list = FALLBACK_CAPTIONS[selectedTheme];
      const random = list[Math.floor(Math.random() * list.length)];
      setCaption(random);
      setUsingAI(false);
    }
    
    setCopied(false);
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = THEMES.find((t) => t.id === selectedTheme);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-200 via-pink-300 to-rose-300">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full animate-float blur-sm">🫧</div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400/40 rounded-full animate-float-slow blur-sm">💗</div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-rose-400/30 rounded-full animate-bounce blur-sm">✨</div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-pink-300/40 rounded-full animate-float blur-sm">🌸</div>
        <div className="absolute bottom-20 right-32 w-14 h-14 bg-rose-300/50 rounded-full animate-float-slow blur-sm">💕</div>
        <div className="absolute top-1/2 right-10 w-10 h-10 bg-pink-200/60 rounded-full animate-bounce blur-sm">⭐</div>
        <div className="absolute top-20 left-1/2 w-8 h-8 bg-rose-200/50 rounded-full animate-float blur-sm">🎀</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-6 py-2 mb-4 animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <span className="text-pink-700 font-bold">✨ AI-Powered ✨</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-neon">
            Caption Gen 🎀
          </h1>
          
          <p className="text-pink-700 text-lg">Tạo caption AI theo trend mới nhất 💕</p>
        </header>

        {/* Theme Selection */}
        <div className="glass-pink rounded-3xl p-6 mb-6">
          <h2 className="text-pink-700 font-bold mb-4 flex items-center gap-2">
            <span>Chọn chủ đề:</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedTheme(t.id); setCaption(""); }}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  selectedTheme === t.id
                    ? `bg-gradient-to-r ${t.color} border-white text-white shadow-lg`
                    : 'bg-white/50 border-pink-300 text-pink-700 hover:bg-white/70'
                }`}
              >
                <div className="text-3xl mb-1">{t.icon}</div>
                <div className="font-bold text-sm">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity animate-shimmer mb-6 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 inline mr-2 animate-spin" /> Đang tạo AI...</>
          ) : (
            <><RefreshCw className="w-5 h-5 inline mr-2" /> Tạo Caption AI</>
          )}
        </button>

        {/* Result */}
        {caption && (
          <div className="glass-pink rounded-3xl p-6 animate-pulse-glow">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{theme?.icon}</span>
              <span className="font-bold text-pink-600">{theme?.name}</span>
              {usingAI && (
                <span className="ml-auto text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                  ✨ AI Generated
                </span>
              )}
            </div>
            
            <div className="bg-white/60 rounded-2xl p-6 mb-4">
              <p className="text-xl text-pink-800 text-center leading-relaxed">{caption}</p>
            </div>
            
            <button
              onClick={copy}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {copied ? <><Check className="w-5 h-5" /> Đã Copy!</> : <><Copy className="w-5 h-5" /> Copy Caption</>}
            </button>          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: "🤖", title: "AI", desc: "DeepSeek API" },
            { icon: "⚡", title: "Trend", desc: "Luôn mới" },
            { icon: "💯", title: "Free", desc: "Miễn phí" },
          ].map((f, i) => (
            <div key={i} className="glass-pink rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="text-pink-700 font-bold">{f.title}</div>
              <div className="text-pink-600 text-sm">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-pink-600">
          <p>Powered by DeepSeek AI 🚀</p>
        </footer>
      </div>
    </div>
  );
}
