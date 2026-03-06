"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, RefreshCw } from "lucide-react";

// Caption themes with icons
const THEMES = [
  { id: "thinh", name: "Thả Thính", icon: "💘", color: "from-pink-500 to-rose-500" },
  { id: "chill", name: "Chill Chill", icon: "🌸", color: "from-purple-500 to-indigo-500" },
  { id: "dongluc", name: "Động Lực", icon: "🔥", color: "from-orange-500 to-red-500" },
  { id: "buon", name: "Deep Buồn", icon: "🌧️", color: "from-blue-500 to-cyan-500" },
  { id: "anvat", name: "Ăn Vặt", icon: "🍜", color: "from-yellow-400 to-orange-500" },
  { id: "dulich", name: "Du Lịch", icon: "✈️", color: "from-teal-400 to-emerald-500" },
  { id: "tinhban", name: "Tình Bạn", icon: "👯", color: "from-green-400 to-teal-500" },
  { id: "selflove", name: "Self Love", icon: "💅", color: "from-fuchsia-500 to-pink-500" },
];

// Caption database
const CAPTIONS: Record<string, string[]> = {
  thinh: [
    "Em không cần tỏ tình, em chỉ cần tỏ ra dễ thương 😘",
    "Chỉ cần một nụ cườlà đủ làm tim anh tan chảy 💕",
    "Em không phải cà phê nhưng làm anh mất ngủ ☕",
    "Nếu yêu em là sai, anh nguyện không bao giờ đúng 😌",
    "Tim em nhỏ thôi nhưng đủ chỗ cho anh ở đó 💗",
    "Anh không cần tìm kiếm nữa, vì em đã ở đây rồi ✨",
    "Yêu em không khó, khó là không yêu em được 😝",
    "Em là lý do anh mỉm cườmỗi ngày 🥰",
    "Anh có thể không phải chàng trai đầu tiên, nhưng sẽ là ngườiyêu em nhất 💝",
    "Em không cần hoàng tử, em chỉ cần ngườithương em thật lòng 👑",
    "Nếu thích là đổ, thì anh đã đổ em từ lâu rồi 💘",
    "Em đẹp nhất khi không thuộc về ai, nhưng thuộc về anh thì càng đẹp hơn 😍",
  ],
  chill: [
    "Cuộc sống ngắn lắm, đừng quên chill mỗi ngày 🌿",
    "Không gì là không thể, chỉ là chưa thử thôi ✨",
    "Sống chậm lại, yêu thương nhiều hơn 💫",
    "Hôm nay không vội vàng, chỉ cần bình yên 🍃",
    "Chill thôi, đừng stress quá nha 🌊",
    "Cuộc sống như một ly trà, ngọt ngào khi biết thưởng thức 🍵",
    "Đừng quên yêu thương bản thân mình nhé 💕",
    "Mỗi ngày là một món quà 🎁",
    "Take it easy, everything will be okay 🌈",
    "Sống vui, sống khỏe, sống có ích 🌻",
    "Đôi khi không làm gì cũng là một nghệ thuật 🎨",
    "Bình yên nội tâm là điều quý giá nhất 🧘‍♀️",
  ],
  dongluc: [
    "Hôm nay không cố gắng, ngày mai sẽ hối hận 💪",
    "Đừng bao giờ từ bỏ ước mơ của mình 🌟",
    "Thành công không đến từ may mắn, mà từ nỗ lực 🎯",
    "Mỗi ngày là một cơ hội để trở nên tốt hơn 📈",
    "Hãy là phiên bản tốt nhất của chính mình 🏆",
    "Khó khăn chỉ là thử thách để bạn mạnh mẽ hơn 💯",
    "Ngày mai sẽ tốt hơn nếu hôm nay bạn không bỏ cuộc 🌅",
    "Tin vào bản thân, bạn làm được! 💪",
    "Dream big, work hard, make it happen ✨",
    "Không có gì là không thể nếu bạn tin vào bản thân 🚀",
    "Hãy cứ tiến về phía trước, dù chậm nhưng chắc 🐢",
    "Thất bại là mẹ thành công, đừng sợ thất bại 🎓",
  ],
  buon: [
    "Mưa rơi như nỗi buồn không tên... ☔",
    "Đôi khi im lặng là tiếng nói lớn nhất 🌙",
    "Nỗi buồn cũng như cơn mưa, rồi sẽ tạnh thôi 🌈",
    "Mệt thì nghỉ, buồn thì khóc, không sao đâu 💙",
    "Thế giới này rộng lớn nhưng nỗi buồn thì riêng mình 🌃",
    "Rồi mọi thứ sẽ qua, như chưa từng tồn tại 🌫️",
    "Đêm dài lắm những kẻ mất ngủ 🌌",
    "Không cần vui, chỉ cần bình yên 🤍",
    "It's okay not to be okay 🥀",
    "Đôi khi ta cần một khoảng lặng để thấu hiểu bản thân 🍂",
    "Nỗi buồn sẽ qua, nhưng kỷ niệm thì ở lại 📸",
    "Khóc xong rồi lau nước mắt, ngày mai lại là một ngày mới 🌤️",
  ],
  anvat: [
    "Ăn là niềm vui, vui là phải ăn 🍕",
    "Không gì là không thể, trừ việc nhịn ăn 😋",
    "Bụng đói thì không thể nghĩ được gì cả 🥘",
    "Ăn một mình buồn, nhưng ăn ngon thì không 🍱",
    "Cuộc đờng ngắn lắm, đừng bỏ lỡ món ngon nào 🥢",
    "Ăn ngon mỗi ngày, sống vui mỗi giờ 🍰",
    "Food is my love language 🍜💕",
    "Calories don't count on weekends 🍔",
    "Life is short, eat dessert first 🍨",
    "Good food = Good mood 🌮",
    "Ăn đi rồi tính, đừng tính rồi mới ăn 🍖",
    "Món ngon nhất là món ăn cùng ngườithân 🍲",
  ],
  dulich: [
    "Đi để trở về, trở về để đi tiếp 🌍",
    "Mỗi chuyến đi là một câu chuyện mới 📖",
    "Thế giới rộng lớn, hãy đi khám phá 🗺️",
    "Chân đi nhiều, tâm mở rộng 🦶",
    "Du lịch là liều thuốc tốt nhất cho tâm hồn 💊",
    "Mỗi nơi đến là một mảnh ghép của cuộc đờ 🧩",
    "Hộ chiếu đầy dấu, tâm hồn đầy kỷ niệm 🛂",
    "Wanderlust never ends ✈️",
    "Collect moments, not things 📸",
    "Travel is the only thing you buy that makes you richer 💰",
    "Not all those who wander are lost 🗺️",
    "The world is a book and those who do not travel read only one page 📚",
  ],
  tinhban: [
    "Bạn thân là ngườibiết hết bí mật nhưng không bán đứng 👯",
    "Tình bạn đẹp không cần hàng ngày gặp gỡ 💕",
    "Cảm ơn vì đã là bạn của tôi 🤗",
    "Bạn thân: ngườibiết bạn xấu xí vẫn ở lại 😂",
    "True friends are never apart 👯‍♀️",
    "Bạn là gia đình tôi chọn 💜",
    "Cùng nhau từ thuở hạt mưa ☔",
    "Besties forever 🌟",
    "A true friend is the greatest of all blessings 🙏",
    "Side by side or miles apart, real friends are always close to the heart 💝",
    "Cườlên với nhau, khóc cùng nhau, đó là tình bạn 🤝",
    "Bạn tốt là ngườibiết bạn sai nhưng vẫn đứng về phía bạn 🛡️",
  ],
  selflove: [
    "Yêu bản thân là khởi đầu của mọi loại tình yêu 💕",
    "Bạn xứng đáng với những điều tốt đẹp nhất ✨",
    "Đừng quên chăm sóc bản thân mình nhé 🌸",
    "Self love is the best love 💅",
    "Be your own kind of beautiful 🦋",
    "You are enough, just as you are 💎",
    "Đừng so sánh mình với ngườikhác, bạn là duy nhất 🦄",
    "Hãy yêu thương bản thân như cách bạn yêu thương ngườikhác 💗",
    "Your vibe attracts your tribe ✨",
    "Invest in yourself, it pays the best interest 📈",
    "Bạn đẹp nhất khi là chính mình 💄",
    "Love yourself first and everything else falls into line 💫",
  ],
};

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState("thinh");
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const list = CAPTIONS[selectedTheme];
    const random = list[Math.floor(Math.random() * list.length)];
    setCaption(random);
    setCopied(false);
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
        {/* Floating Bubbles */}
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
            <span className="text-pink-700 font-bold">✨ GenZ Edition ✨</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-neon">
            Caption Gen 🎀
          </h1>
          
          <p className="text-pink-700 text-lg">Tạo caption xịn xò đăng mạng xã hội 💕</p>
        </header>

        {/* Theme Selection */}
        <div className="glass-pink rounded-3xl p-6 mb-6">
          <h2 className="text-pink-700 font-bold mb-4 flex items-center gap-2">
            <span>Chọn chủ đề:</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity animate-shimmer mb-6"
        >
          <RefreshCw className="w-5 h-5 inline mr-2" />
          Tạo Caption Ngẫu Nhiên
        </button>

        {/* Result */}
        {caption && (
          <div className="glass-pink rounded-3xl p-6 animate-pulse-glow">
            <div className="flex items-center gap-2 mb-4 text-pink-600">
              <span className="text-2xl">{theme?.icon}</span>
              <span className="font-bold">{theme?.name}</span>
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
            { icon: "⚡", title: "Nhanh", desc: "Tạo tức thì" },
            { icon: "🎨", title: "Đa dạng", desc: "8 chủ đề" },
            { icon: "💯", title: "Free", desc: "Miễn phí 100%" },
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
          <p>Made with 💕 for GenZ</p>
        </footer>
      </div>
    </div>
  );
}
