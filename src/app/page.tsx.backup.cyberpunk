"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Copy, RefreshCw, QrCode, Palette, Type, Image as ImageIcon, Sparkles, Zap, Shield, Smartphone, ChevronDown, Check, Building2, Wallet, Globe } from "lucide-react";

interface QRCodeOptions {
  width: number;
  margin: number;
  color: { dark: string; light: string };
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

interface BankTransferData {
  bankId: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  content: string;
}

// Danh sách ngân hàng Việt Nam (BIN theo chuẩn Napas/VietQR)
const BANKS = [
  { id: "970436", name: "Vietcombank", shortName: "VCB", logo: "🏦" },
  { id: "970418", name: "BIDV", shortName: "BIDV", logo: "🏛️" },
  { id: "970405", name: "Agribank", shortName: "AGB", logo: "🌾" },
  { id: "970448", name: "OCB", shortName: "OCB", logo: "🏪" },
  { id: "970422", name: "MB Bank", shortName: "MB", logo: "💳" },
  { id: "970407", name: "Techcombank", shortName: "TCB", logo: "💼" },
  { id: "970416", name: "ACB", shortName: "ACB", logo: "🏢" },
  { id: "970432", name: "VPBank", shortName: "VPB", logo: "🌟" },
  { id: "970423", name: "TPBank", shortName: "TPB", logo: "🚀" },
  { id: "970403", name: "Sacombank", shortName: "STB", logo: "🌴" },
  { id: "970437", name: "HDBank", shortName: "HDB", logo: "💎" },
  { id: "970454", name: "VietCapital Bank", shortName: "VCB", logo: "📈" },
  { id: "970429", name: "SCB", shortName: "SCB", logo: "🌊" },
  { id: "970439", name: "Public Bank", shortName: "PBV", logo: "🤝" },
  { id: "970430", name: "PGBank", shortName: "PGB", logo: "🌅" },
  { id: "970431", name: "Eximbank", shortName: "EIB", logo: "🌍" },
  { id: "970414", name: "OceanBank", shortName: "OJB", logo: "🌊" },
  { id: "970419", name: "Nam A Bank", shortName: "NAB", logo: "⭐" },
  { id: "970400", name: "Saigonbank", shortName: "SGB", logo: "🏙️" },
  { id: "970409", name: "Bac A Bank", shortName: "BAB", logo: "🌲" },
  { id: "970443", name: "SHB", shortName: "SHB", logo: "🔴" },
  { id: "970442", name: "HLV", shortName: "HLBV", logo: "💚" },
  { id: "970440", name: "SeABank", shortName: "SEAB", logo: "🌊" },
  { id: "970438", name: "BVB", shortName: "BVB", logo: "💛" },
  { id: "970441", name: "VIB", shortName: "VIB", logo: "💜" },
  { id: "970446", name: "COOPBANK", shortName: "COOP", logo: "🤝" },
  { id: "970449", name: "LPB", shortName: "LPB", logo: "🌿" },
  { id: "970452", name: "Kienlongbank", shortName: "KLB", logo: "🐉" },
  { id: "970457", name: "VietBank", shortName: "VBB", logo: "🇻🇳" },
  { id: "970458", name: "NCB", shortName: "NCB", logo: "🔵" },
  { id: "970460", name: "GPBank", shortName: "GPB", logo: "💰" },
];

export default function Home() {
  const [text, setText] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "bank" | "design">("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Bank transfer data
  const [bankData, setBankData] = useState<BankTransferData>({
    bankId: "",
    accountNumber: "",
    accountName: "",
    amount: "",
    content: "",
  });

  // QR Generation mode: 'local' = client-side, 'api' = VietQR API
  const [qrMode, setQrMode] = useState<"local" | "api">("api");
  const [vietQRUrl, setVietQRUrl] = useState<string>("");

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

  // Tạo URL VietQR từ API img.vietqr.io
  const buildVietQRUrl = (data: BankTransferData): string => {
    const { bankId, accountNumber, accountName, amount, content } = data;
    
    if (!bankId || !accountNumber) return "";

    const nameParam = accountName ? encodeURIComponent(accountName) : "";
    const amountParam = amount && parseInt(amount) > 0 ? parseInt(amount) : 0;
    const contentParam = content ? encodeURIComponent(content) : "";
    
    // Sử dụng dịch vụ img.vietqr.io để tạo mã QR
    // Có thể chọn: qr_only (chỉ QR), compact (QR + thông tin ngắn), print (QR + đầy đủ thông tin)
    return `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact.png?amount=${amountParam}&accountName=${nameParam}&addInfo=${contentParam}`;
  };

  // Tạo chuỗi QR theo chuẩn VietQR (EMVCo)
  const generateVietQRString = (data: BankTransferData): string => {
    const { bankId, accountNumber, accountName, amount, content } = data;
    
    if (!bankId || !accountNumber) return "";

    // Payload Format Indicator
    let qrString = "000201";
    
    // Point of Initiation Method (11 = Static, 12 = Dynamic)
    qrString += "010212";
    
    // Merchant Account Information
    // GUID for VietQR: A000000727
    const accountInfo = `0010A000000727${bankId.length.toString().padStart(2, "0")}${bankId}01${accountNumber.length.toString().padStart(2, "0")}${accountNumber}`;
    qrString += `38${accountInfo.length.toString().padStart(2, "0")}${accountInfo}`;
    
    // Transaction Currency (VND = 704)
    qrString += "5303704";
    
    // Transaction Amount (nếu có)
    if (amount && parseFloat(amount) > 0) {
      const amountStr = Math.floor(parseFloat(amount)).toString();
      qrString += `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
    }
    
    // Country Code
    qrString += "5802VN";
    
    // Additional Data Field Template (nội dung chuyển khoản)
    if (content) {
      const purposeInfo = `08${content.length.toString().padStart(2, "0")}${content}`;
      qrString += `62${purposeInfo.length.toString().padStart(2, "0")}${purposeInfo}`;
    }
    
    // CRC
    qrString += "6304";
    const crc = calculateCRC(qrString);
    qrString += crc;
    
    return qrString;
  };

  // Tính CRC-16/CCITT-FALSE
  const calculateCRC = (str: string): string => {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  };

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      // Nếu đang ở tab bank và chọn mode API
      if (activeTab === "bank" && qrMode === "api") {
        const apiUrl = buildVietQRUrl(bankData);
        setVietQRUrl(apiUrl);
        setQrDataUrl(""); // Clear local QR
        setIsGenerating(false);
        return;
      }
      
      let qrContent = text;
      
      if (activeTab === "bank") {
        qrContent = generateVietQRString(bankData);
        if (!qrContent) {
          setQrDataUrl("");
          setVietQRUrl("");
          setIsGenerating(false);
          return;
        }
      }
      
      const dataUrl = await QRCode.toDataURL(qrContent, {
        width: options.width,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      setQrDataUrl(dataUrl);
      setVietQRUrl(""); // Clear API QR
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, bankData, options, activeTab, qrMode]);

  const downloadQR = async (format: "png" | "svg") => {
    // Nếu đang dùng VietQR API
    if (activeTab === "bank" && qrMode === "api" && vietQRUrl) {
      // Tải ảnh từ URL
      try {
        const response = await fetch(vietQRUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-chuyen-khoan-${bankData.accountNumber}-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading:", err);
      }
      return;
    }

    const qrContent = activeTab === "bank" ? generateVietQRString(bankData) : text;
    if (!qrContent) return;
    
    if (format === "png") {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `qr-${Date.now()}.png`;
      link.click();
    } else {
      QRCode.toString(qrContent, {
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

  const copyBankInfo = async () => {
    const bank = BANKS.find(b => b.id === bankData.bankId);
    const info = `Ngân hàng: ${bank?.name || ""}\nSố TK: ${bankData.accountNumber}\nChủ TK: ${bankData.accountName}\nSố tiền: ${bankData.amount ? parseInt(bankData.amount).toLocaleString("vi-VN") + " VND" : ""}\nNội dung: ${bankData.content}`;
    await navigator.clipboard.writeText(info);
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

  const selectedBank = BANKS.find(b => b.id === bankData.bankId);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                QR Generator
              </h1>
              <p className="text-[8px] sm:text-[10px] text-slate-400 tracking-wider uppercase hidden sm:block">Next Gen</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="hidden sm:inline">System Online</span>
            <span className="sm:hidden">Online</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center pt-16 sm:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div 
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 sm:mb-8"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm text-slate-300">Powered by Advanced AI</span>
          </div>
          
          <h1 
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Tạo Mã QR
            </span>
            <br />
            <span className="text-slate-100">Tương Lai</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
            Trình tạo mã QR thế hệ mới với giao diện công nghệ hiện đại, 
            hiệu ứng mượt mà và khả năng tùy chỉnh vô hạn.
          </p>

          <a 
            href="#generator"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-medium text-white text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
          >
            Bắt Đầu Tạo QR
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="relative py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-start">
            
            {/* Left Panel */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              {/* Tabs */}
              <div className="flex gap-1.5 sm:gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                    activeTab === "text"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Nội dung</span>
                  <span className="sm:hidden">Text</span>
                </button>
                <button
                  onClick={() => setActiveTab("bank")}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                    activeTab === "bank"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Chuyển khoản</span>
                  <span className="sm:hidden">Bank</span>
                </button>
                <button
                  onClick={() => setActiveTab("design")}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                    activeTab === "design"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Thiết kế</span>
                  <span className="sm:hidden">Design</span>
                </button>
              </div>

              {/* Content Tab */}
              {activeTab === "text" && (
                <div className="p-4 sm:p-8 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-3 sm:mb-4">
                    Nhập nội dung QR Code
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-32 sm:h-48 p-4 sm:p-6 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none text-sm sm:text-base"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl text-sm font-medium transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Đã sao chép" : "Sao chép"}
                    </button>
                    <button
                      onClick={() => setText("")}
                      className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl text-sm font-medium transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              )}

              {/* Bank Transfer Tab */}
              {activeTab === "bank" && (
                <div className="p-4 sm:p-8 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-100">QR Chuyển Khoản</h3>
                      <p className="text-xs sm:text-sm text-slate-400">Theo chuẩn VietQR / NAPAS</p>
                    </div>
                  </div>

                  {/* QR Mode Selection */}
                  <div className="p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl">
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Chọn loại mã QR
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQrMode("api")}
                        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          qrMode === "api"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                            : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">VietQR API</span>
                        <span className="sm:hidden">API</span>
                      </button>
                      <button
                        onClick={() => setQrMode("local")}
                        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          qrMode === "local"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                            : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Tạo Local</span>
                        <span className="sm:hidden">Local</span>
                      </button>
                    </div>
                    <p className="mt-2 text-[10px] sm:text-xs text-slate-500">
                      {qrMode === "api" 
                        ? "✨ Có logo ngân hàng, đẹp hơn, dùng API VietQR" 
                        : "📱 Chuẩn EMVCo, tải được PNG/SVG, tùy chỉnh màu"}
                    </p>
                  </div>

                  {/* Bank Selection */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Chọn ngân hàng
                    </label>
                    <select
                      value={bankData.bankId}
                      onChange={(e) => setBankData(prev => ({ ...prev, bankId: e.target.value }))}
                      className="w-full p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-slate-100 text-sm sm:text-base focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Chọn ngân hàng --</option>
                      {BANKS.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.logo} {bank.name} ({bank.shortName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, "") }))}
                      placeholder="Nhập số tài khoản"
                      className="w-full p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Account Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Tên chủ tài khoản
                    </label>
                    <input
                      type="text"
                      value={bankData.accountName}
                      onChange={(e) => setBankData(prev => ({ ...prev, accountName: e.target.value.toUpperCase() }))}
                      placeholder="NGUYEN VAN A"
                      className="w-full p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Số tiền (VND) <span className="text-slate-500">- Tùy chọn</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={bankData.amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setBankData(prev => ({ ...prev, amount: value }));
                      }}
                      placeholder="0"
                      className="w-full p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm sm:text-base"
                    />
                    {bankData.amount && (
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-cyan-400">
                        {parseInt(bankData.amount).toLocaleString("vi-VN")} VND
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Nội dung chuyển khoản <span className="text-slate-500">- Tùy chọn</span>
                    </label>
                    <input
                      type="text"
                      value={bankData.content}
                      onChange={(e) => setBankData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Chuyen khoan"
                      className="w-full p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={copyBankInfo}
                    className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl text-sm font-medium transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Đã sao chép thông tin" : "Sao chép thông tin TK"}
                  </button>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === "design" && (
                <div className="p-4 sm:p-8 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 space-y-6 sm:space-y-8">
                  {/* Color Presets */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-3 sm:mb-4">
                      Chủ đề màu
                    </label>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setOptions(prev => ({ ...prev, color: { dark: preset.dark, light: preset.light } }))}
                          className={`group p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                            options.color.dark === preset.dark
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-white/10 hover:border-white/20 bg-white/5"
                          }`}
                        >
                          <div 
                            className="w-full h-8 sm:h-10 rounded-lg sm:rounded-xl mb-2 sm:mb-3 shadow-lg"
                            style={{ backgroundColor: preset.dark }}
                          />
                          <span className="text-[10px] sm:text-xs font-medium text-slate-400 group-hover:text-slate-200 truncate block">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">Màu QR</label>
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl">
                        <input
                          type="color"
                          value={options.color.dark}
                          onChange={(e) => setOptions(prev => ({ ...prev, color: { ...prev.color, dark: e.target.value } }))}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-0 cursor-pointer bg-transparent"
                        />
                        <code className="text-xs sm:text-sm text-slate-400 font-mono truncate">{options.color.dark}</code>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">Màu nền</label>
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl">
                        <input
                          type="color"
                          value={options.color.light}
                          onChange={(e) => setOptions(prev => ({ ...prev, color: { ...prev.color, light: e.target.value } }))}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-0 cursor-pointer bg-transparent"
                        />
                        <code className="text-xs sm:text-sm text-slate-400 font-mono truncate">{options.color.light}</code>
                      </div>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <div className="flex justify-between mb-2 sm:mb-3">
                      <label className="text-xs sm:text-sm font-medium text-slate-300">Kích thước</label>
                      <span className="text-xs sm:text-sm text-cyan-400 font-mono">{options.width}px</span>
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
                    <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mt-2">
                      <span>200px</span>
                      <span>800px</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - QR Preview */}
            <div className="lg:sticky lg:top-24 sm:lg:top-32 order-1 lg:order-2">
              <div className="p-4 sm:p-6 lg:p-10 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10">
                <div className="text-center mb-4 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-1 sm:mb-2">Xem Trước</h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {activeTab === "bank" ? "Quét để chuyển khoản" : "Quét mã để kiểm tra"}
                  </p>
                </div>

                {/* Bank Info Card (when in bank tab) */}
                {activeTab === "bank" && selectedBank && bankData.accountNumber && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="text-xl sm:text-2xl">{selectedBank.logo}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-100 text-sm sm:text-base truncate">{selectedBank.name}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400">{selectedBank.shortName}</p>
                      </div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                      <p className="text-slate-300 truncate">
                        <span className="text-slate-500">STK:</span> {bankData.accountNumber}
                      </p>
                      {bankData.accountName && (
                        <p className="text-slate-300 truncate">
                          <span className="text-slate-500">Chủ TK:</span> {bankData.accountName}
                        </p>
                      )}
                      {bankData.amount && (
                        <p className="text-cyan-400 font-medium">
                          <span className="text-slate-500">Số tiền:</span> {parseInt(bankData.amount).toLocaleString("vi-VN")} VND
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* QR Display */}
                <div className="flex justify-center mb-6 sm:mb-10">
                  <div 
                    className="relative p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl transition-all duration-500"
                    style={{ 
                      backgroundColor: activeTab === "bank" && qrMode === "api" && vietQRUrl 
                        ? "#ffffff" 
                        : options.color.light 
                    }}
                  >
                    {isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl z-10">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 sm:border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    
                    {/* VietQR API Image */}
                    {activeTab === "bank" && qrMode === "api" && vietQRUrl ? (
                      <img
                        src={vietQRUrl}
                        alt="VietQR Code"
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxWidth: "280px", width: "100%" }}
                        onError={(e) => {
                          // Fallback nếu ảnh lỗi
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxWidth: "200px", width: "100%" }}
                      />
                    ) : (
                      <div className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 flex items-center justify-center" style={{ color: options.color.dark }}>
                        <QrCode className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-30" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => downloadQR("png")}
                    disabled={activeTab === "bank" && qrMode === "api" ? !vietQRUrl : !qrDataUrl}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-3 sm:px-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl font-medium text-white text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Tải PNG</span>
                    <span className="sm:hidden">PNG</span>
                  </button>
                  <button
                    onClick={() => downloadQR("svg")}
                    disabled={activeTab === "bank" && qrMode === "api" ? !vietQRUrl : !qrDataUrl}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeTab === "bank" && qrMode === "api"
                        ? "bg-white/5 hover:bg-white/10 border border-white/20 text-slate-200"
                        : "bg-white/5 hover:bg-white/10 border border-white/20 text-slate-200"
                    }`}
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{activeTab === "bank" && qrMode === "api" ? "Tải Ảnh" : "Tải SVG"}</span>
                    <span className="sm:hidden">{activeTab === "bank" && qrMode === "api" ? "Ảnh" : "SVG"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Tính Năng Nổi Bật
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto px-4 sm:px-0">
              Trải nghiệm công nghệ tạo mã QR tiên tiến với hiệu suất cao và giao diện tuyệt đẹp
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: Zap, title: "Tạo QR Tức Thì", desc: "Công nghệ xử lý hiện đại cho phép tạo mã QR trong milliseconds" },
              { icon: Palette, title: "Tùy Chỉnh Đa Dạng", desc: "Hàng loạt màu sắc cyberpunk và tùy chọn thiết kế độc đáo" },
              { icon: Shield, title: "Bảo Mật Tuyệt Đối", desc: "Mã QR được tạo 100% trên trình duyệt, không qua server" },
              { icon: Building2, title: "VietQR / NAPAS", desc: "Hỗ trợ tạo mã QR chuyển khoản theo chuẩn VietQR" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-4 sm:p-8 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-400" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-slate-100 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              QR Generator
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            © 2026 QR Generator. Công nghệ tạo mã QR thế hệ mới.
          </p>
        </div>
      </footer>
    </div>
  );
}
