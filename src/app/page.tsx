"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Copy, Sparkles, Heart, Star, Zap } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQR();
  }, [text]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: "#ff1493", light: "#ffffff" },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-pink-400/30 rounded-full animate-float-slow blur-sm">💖</div>
        <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-rose-300/40 rounded-full animate-bounce blur-sm">💫</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-6 py-2 mb-4 animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <span className="text-pink-700 font-bold">✨ GenZ Edition ✨</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-neon">
            QR Generator 🎀
          </h1>
          
          <p className="text-pink-700 text-lg">Tạo mã QR cute xịn xò 💕</p>
        </header>

        {/* Input Card */}
        <div className="glass-pink rounded-3xl p-6 mb-6 animate-float">
          <label className="block text-pink-700 font-bold mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Nhập nội dung QR
          </label>
          
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-pink-300 bg-white/80 text-pink-700 placeholder-pink-400 focus:outline-none focus:border-pink-500 transition-colors"
            placeholder="https://example.com"
          />
        </div>

        {/* QR Display */}
        {qrDataUrl && (
          <div className="glass-pink rounded-3xl p-6 mb-6 text-center animate-pulse-glow">
            <div className="bg-white rounded-2xl p-4 inline-block mb-4">
              <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            
            <div className="flex gap-3 justify-center">
              <a
                href={qrDataUrl}
                download="qr-code.png"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white font-bold flex items-center gap-2 hover:opacity-90 transition-opacity animate-shimmer"
              >
                <Download className="w-5 h-5" />
                Tải xuống 💾
              </a>
              
              <button
                onClick={copy}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/50 text-pink-700 hover:bg-white/70'
                }`}
              >
                {copied ? <>✅ Đã copy!</> : <><Copy className="w-5 h-5" /> Copy 📋</>}
              </button>
            </div>          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "⚡", title: "Nhanh", desc: "Tạo tức thì" },
            { icon: "🎨", title: "Cute", desc: "Màu hồng xinh" },
            { icon: "💯", title: "Free", desc: "Miễn phí 100%" },
          ].map((f, i) => (
            <div key={i} className="glass-pink rounded-2xl p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="text-pink-700 font-bold">{f.title}</div>
              <div className="text-pink-600 text-sm">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-pink-600">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-rose-500 animate-bounce" /> for GenZ
          </p>
        </footer>
      </div>
    </div>
  );
}
