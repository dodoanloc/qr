"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Copy, RefreshCw, QrCode, Palette, Type, Image as ImageIcon, Sparkles, Zap, Shield, Smartphone, ChevronDown, Check } from "lucide-react";

interface QRCodeOptions {
  width: number;
  margin: number;
  color: { dark: string; light: string };
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

export default function Home() {
  const [text, setText] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "design">("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [options, setOptions] = useState<QRCodeOptions>({
    width: 400,
    margin: 2,
    color: { dark: "#0EA5E9", light: "#0F172A" },
    errorCorrectionLevel: "M",
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateQR = async () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: options.width,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, options]);

  const downloadQR = (format: "png" | "svg") => {
    if (!text) return;
    if (format === "png") {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `qr-${Date.now()}.png`;
      link.click();
    } else {
      QRCode.toString(text, {
        type: "svg",
        width: options.width,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel,
      }).then((svg) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = [
    { dark: "#0EA5E9", light: "#0F172A", name: "Cyber Blue" },
    { dark: "#8B5CF6", light: "#1E1B4B", name: "Neon Purple" },
    { dark: "#10B981", light: "#064E3B", name: "Matrix Green" },
    { dark: "#F59E0B", light: "#451A03", name: "Amber Glow" },
    { dark: "#EC4899", light: "#500724", name: "Hot Pink" },
    { dark: "#06B6D4", light: "#083344", name: "Cyan Tech" },
    { dark: "#FFFFFF", light: "#000000", name: "Monochrome" },
    { dark: "#EF4444", light: "#450A0A", name: "Red Alert" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] transition-all duration-1000"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[120px] transition-all duration-1000"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px]"
        />
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                QR Generator
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase">Next Gen</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            System Online
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Powered by Advanced AI Technology</span>
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Tạo Mã QR
            </span>
            <br />
            <span className="text-slate-100">Tương Lai</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
            Trình tạo mã QR thế hệ mới với giao diện công nghệ hiện đại, 
            hiệu ứng mượt mà và khả năng tùy chỉnh vô hạn.
          </p>

          <a 
            href="#generator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-medium text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
          >
            Bắt Đầu Tạo QR
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Panel */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "text"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Nội dung
                </button>
                <button
                  onClick={() => setActiveTab("design")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "design"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  Thiết kế
                </button>
              </div>

              {/* Content Tab */}
              {activeTab === "text" && (
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-4">
                    Nhập nội dung QR Code
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-48 p-6 bg-slate-900/50 border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Đã sao chép" : "Sao chép"}
                    </button>
                    <button
                      onClick={() => setText("")}
                      className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === "design" && (
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 space-y-8">
                  {/* Color Presets */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">
                      Chủ đề màu
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setOptions(prev => ({ ...prev, color: { dark: preset.dark, light: preset.light } }))}
                          className={`group p-4 rounded-2xl border-2 transition-all duration-300 ${
                            options.color.dark === preset.dark
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-white/10 hover:border-white/20 bg-white/5"
                          }`}
                        >
                          <div 
                            className="w-full h-10 rounded-xl mb-3 shadow-lg"
                            style={{ backgroundColor: preset.dark }}
                          />
                          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Màu QR</label>
                      <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-white/10 rounded-2xl">
                        <input
                          type="color"
                          value={options.color.dark}
                          onChange={(e) => setOptions(prev => ({ ...prev, color: { ...prev.color, dark: e.target.value } }))}
                          className="w-12 h-12 rounded-xl border-0 cursor-pointer bg-transparent"
                        />
                        <code className="text-sm text-slate-400 font-mono">{options.color.dark}</code>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Màu nền</label>
                      <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-white/10 rounded-2xl">
                        <input
                          type="color"
                          value={options.color.light}
                          onChange={(e) => setOptions(prev => ({ ...prev, color: { ...prev.color, light: e.target.value } }))}
                          className="w-12 h-12 rounded-xl border-0 cursor-pointer bg-transparent"
                        />
                        <code className="text-sm text-slate-400 font-mono">{options.color.light}</code>
                      </div>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-sm font-medium text-slate-300">Kích thước</label>
                      <span className="text-sm text-cyan-400 font-mono">{options.width}px</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="800"
                      step="50"
                      value={options.width}
                      onChange={(e) => setOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>200px</span>
                      <span>800px</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - QR Preview */}
            <div className="lg:sticky lg:top-32">
              <div className="p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Xem Trước</h3>
                  <p className="text-sm text-slate-400">Quét mã để kiểm tra</p>
                </div>

                {/* QR Display */}
                <div className="flex justify-center mb-10">
                  <div 
                    className="relative p-10 rounded-3xl transition-all duration-500"
                    style={{ backgroundColor: options.color.light }}
                  >
                    {isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-3xl z-10">
                        <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxWidth: "280px" }}
                      />
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center" style={{ color: options.color.dark }}>
                        <QrCode className="w-32 h-32 opacity-30" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => downloadQR("png")}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-medium text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Tải PNG
                  </button>
                  <button
                    onClick={() => downloadQR("svg")}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl font-medium text-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    Tải SVG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Tính Năng Nổi Bật
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Trải nghiệm công nghệ tạo mã QR tiên tiến với hiệu suất cao và giao diện tuyệt đẹp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Tạo QR Tức Thì", desc: "Công nghệ xử lý hiện đại cho phép tạo mã QR trong milliseconds" },
              { icon: Palette, title: "Tùy Chỉnh Đa Dạng", desc: "Hàng loạt màu sắc cyberpunk và tùy chọn thiết kế độc đáo" },
              { icon: Shield, title: "Bảo Mật Tuyệt Đối", desc: "Mã QR được tạo 100% trên trình duyệt, không qua server" },
              { icon: Smartphone, title: "Tương Thích Cao", desc: "Hoạt động hoàn hảo trên mọi thiết bị và ứng dụng quét" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              QR Generator
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 QR Generator. Công nghệ tạo mã QR thế hệ mới.
          </p>
        </div>
      </footer>
    </div>
  );
}
