import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, Clock, X, Smartphone } from 'lucide-react';

interface ThreeDSecureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  cardNumber: string;
  cardHolder: string;
}

export const ThreeDSecureModal: React.FC<ThreeDSecureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  cardNumber,
  cardHolder,
}) => {
  if (!isOpen) return null;

  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(180);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(180);
    setErrorMsg('');
    setOtpCode('');

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '1905';

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMsg('Lütfen cep telefonunuza iletilen 6 haneli onay kodunu giriniz.');
      return;
    }

    // Accepts 1905, 123456 or any 4-6 digit test code
    if (otpCode === '1905' || otpCode === '123456' || otpCode.length >= 4) {
      setIsProcessing(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 900);
    } else {
      setErrorMsg('Doğrulama kodu hatalı. Lütfen kontrol edip tekrar deneyiniz.');
    }
  };

  const fillTestOtp = () => {
    setOtpCode('1905');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white text-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bank & 3D Secure Header */}
        <div className="bg-neutral-100 border-b border-neutral-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white font-bold text-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-neutral-900 uppercase">3D SECURE</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">Güvenli Ödeme</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">Banka Onay ve Doğrulama Sistemi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Transaction Metadata Table */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>İşyeri Adı:</span>
              <span className="font-bold text-neutral-900">Özlemce Et ve Et Ürünleri Entegre San. Tic. A.Ş.</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>İşlem Tutarı:</span>
              <span className="font-mono font-black text-red-700 text-sm tabular-nums">
                {amount.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Kart Numarası:</span>
              <span className="font-mono font-semibold text-neutral-800 tabular-nums">
                **** **** **** {last4}
              </span>
            </div>
          </div>

          {/* SMS Notification Banner */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
            <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Banka sisteminde kayıtlı cep telefonunuza tek kullanımlık 3D Secure onay şifresi gönderilmiştir.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-neutral-800">
                  Tek Kullanımlık SMS Onay Kodu
                </label>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{formatCountdown(countdown)}</span>
                </div>
              </div>

              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Örn: 1905"
                className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-neutral-300 rounded-lg text-center font-mono font-bold text-lg tracking-widest text-neutral-900 focus:outline-none focus:border-red-600 focus:bg-white"
              />
            </div>

            {/* Quick Demo Autofill Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={fillTestOtp}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
              >
                Hızlı Test Kodu Doldur (1905)
              </button>
              <button
                type="button"
                onClick={() => setCountdown(180)}
                className="text-[11px] text-neutral-500 hover:text-neutral-700 cursor-pointer"
              >
                Yeni Kod Gönder
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                İptal Et
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-2/3 py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                {isProcessing ? (
                  <span>Doğrulanıyor...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Onayla ve Öde</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Trust Badges Footer */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-center gap-4 text-[10px] text-neutral-400 font-medium">
            <span>256-Bit SSL</span>
            <span>·</span>
            <span>Mastercard Identity Check</span>
            <span>·</span>
            <span>Visa Secure</span>
            <span>·</span>
            <span>TROY 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
};
