import React, { useState } from 'react';
import { Copy, Check, Building2, AlertCircle } from 'lucide-react';
import { BankAccount } from '../../types';

interface BankTransferInfoProps {
  orderId: string;
  totalAmount: number;
  customAccount?: {
    bankName?: string;
    accountHolder?: string;
    iban?: string;
  };
}

const defaultBankAccounts: BankAccount[] = [
  {
    bankName: 'Garanti BBVA',
    accountHolder: 'Efecioğlu Et ve Gıda Sanayi Tic. Ltd. Şti.',
    iban: 'TR42 0006 2000 1234 5678 9012 34',
    branch: 'Beylikdüzü Ticari Şubesi (Şube Kodu: 1240)',
  },
  {
    bankName: 'Türkiye İş Bankası',
    accountHolder: 'Efecioğlu Et ve Gıda Sanayi Tic. Ltd. Şti.',
    iban: 'TR68 0006 4000 9876 5432 1098 76',
    branch: 'Haramidere Kurumsal Şubesi (Şube Kodu: 1095)',
  },
];

export const BankTransferInfo: React.FC<BankTransferInfoProps> = ({ orderId, totalAmount, customAccount }) => {
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  const activeAccounts: BankAccount[] = customAccount?.iban
    ? [
        {
          bankName: customAccount.bankName || 'Banka Hesabı',
          accountHolder: customAccount.accountHolder || 'Efecioğlu Et',
          iban: customAccount.iban,
          branch: 'Ana Şube',
        },
      ]
    : defaultBankAccounts;

  const handleCopy = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ''));
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1">
        <span className="text-amber-400 font-bold block">Havale / EFT İle Ödeme Adımları:</span>
        <p className="text-neutral-300 leading-relaxed text-[11px]">
          Lütfen sipariş tutarını aşağıdaki banka hesaplarımızdan birine havale ediniz. Açıklama kısmına sipariş takip kodunuzu (<strong className="text-white font-mono">{orderId}</strong>) yazmayı unutmayınız.
        </p>
      </div>

      <div className="space-y-3">
        {activeAccounts.map((bank, index) => {
          const isCopied = copiedIban === bank.iban;
          return (
            <div
              key={index}
              className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">{bank.bankName}</span>
                </div>
                <span className="text-[10px] text-neutral-400">{bank.branch}</span>
              </div>

              <div className="text-[11px] text-neutral-300">
                <span className="text-neutral-500">Alıcı: </span>
                <span className="font-semibold text-white">{bank.accountHolder}</span>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 bg-neutral-900 rounded border border-neutral-800">
                <span className="font-mono text-white text-[11px] font-semibold tracking-wide">
                  {bank.iban}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.iban)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px] font-medium cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded text-neutral-300 text-[11px] flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          Havaleniz onaylandığında frigorifik aracımız siparişinizi hazırlamak üzere otomatik olarak sevkiyat listesine dahil edecektir.
        </p>
      </div>
    </div>
  );
};
