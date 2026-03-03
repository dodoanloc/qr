"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Copy, RefreshCw, QrCode, Palette, Type, Image as ImageIcon, Settings } from "lucide-react";

interface QRCodeOptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

export default function Home() {
  const [text, setText] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"text" | "design">("text");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [options, setOptions] = useState<QRCodeOptions>({
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });

  const generateQR = async () => {
    if (!text) return;
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: options.width,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
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
      link.download = `qr-code-${Date.now()}.png`;
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
        link.download = `qr-code-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const presetColors = [
    { dark: "#000000", light: "#FFFFFF", name: "Classic" },
    { dark: "#2563EB", light: "#FFFFFF", name: "Blue" },
    { dark: "#DC2626", light: "#FFFFFF", name: "Red" },
    { dark: "#16A34A", light: "#FFFFFF", name: "Green" },
    { dark: "#7C3AED", light: "#FFFFFF", name: "Purple" },
    { dark: "#EA580C", light: "#FFFFFF", name: "Orange" },
    { dark: "#0891B2", light: "#FFFFFF", name: "Cyan" },
    { dark: "#BE185D", light: "#FFFFFF", name: "Pink" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QR Generator
              </h1>
              <p className="text-xs text-gray-500">Tạo mã QR miễn phí</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input & Settings */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === "text"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Nội dung
                </button>
                <button
                  onClick={() => setActiveTab("design")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === "design"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  Thiết kế
                </button>
              </div>
            </div>

            {/* Content Tab */}
            {activeTab === "text" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nhập nội dung QR Code
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nhập URL, văn bản, hoặc bất kỳ nội dung nào..."
                  className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Sao chép
                  </button>
                  <button
                    onClick={() => setText("")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === "design" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Color Presets */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Màu sắc nhanh
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetColors.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() =>
                          setOptions((prev) => ({
                            ...prev,
                            color: { dark: preset.dark, light: preset.light },
                          }))
                        }
                        className={`p-3 rounded-xl border-2 transition-all ${
                          options.color.dark === preset.dark
                            ? "border-indigo-600 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-2"
                          style={{ backgroundColor: preset.dark }}
                        />
                        <span className="text-xs font-medium text-gray-600">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Màu QR
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={options.color.dark}
                        onChange={(e) =>
                          setOptions((prev) => ({
                            ...prev,
                            color: { ...prev.color, dark: e.target.value },
                          }))
                        }
                        className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 font-mono">
                        {options.color.dark}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Màu nền
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={options.color.light}
                        onChange={(e) =>
                          setOptions((prev) => ({
                            ...prev,
                            color: { ...prev.color, light: e.target.value },
                          }))
                        }
                        className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 font-mono">
                        {options.color.light}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kích thước: {options.width}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={options.width}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        width: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100px</span>
                    <span>1000px</span>
                  </div>
                </div>

                {/* Error Correction */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mức độ sửa lỗi
                  </label>
                  <select
                    value={options.errorCorrectionLevel}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        errorCorrectionLevel: e.target.value as QRCodeOptions["errorCorrectionLevel"],
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="L">Thấp (~7%)</option>
                    <option value="M">Trung bình (~15%)</option>
                    <option value="Q">Cao (~25%)</option>
                    <option value="H">Rất cao (~30%)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - QR Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Xem trước QR Code
                </h2>
                <p className="text-sm text-gray-500">
                  Quét mã để kiểm tra
                </p>
              </div>

              {/* QR Display */}
              <div className="flex justify-center mb-8">
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="max-w-full h-auto"
                      style={{ maxWidth: "300px" }}
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-gray-400">
                      <QrCode className="w-24 h-24" />
                    </div>
                  )}
                </div>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => downloadQR("png")}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <ImageIcon className="w-5 h-5" />
                  Tải PNG
                </button>
                <button
                  onClick={() => downloadQR("svg")}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-indigo-600 font-medium rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Tải SVG
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">
                      Thông tin mã QR
                    </p>
                    <p>Kích thước: {options.width}px</p>
                    <p>Mức sửa lỗi: {options.errorCorrectionLevel}</p>
                    <p className="truncate">
                      Nội dung: {text.length > 50 ? text.substring(0, 50) + "..." : text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 QR Generator - Tạo mã QR miễn phí</p>
        </div>
      </footer>
    </div>
  );
}
