import React from 'react';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-900/50 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <span>Şeflerin & Gurmelerin Tercihi</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Müşteri Deneyimi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Ustalara İlham Veren Lezzet
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-neutral-900 pt-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{t.author}</h4>
                  <span className="text-[11px] text-neutral-400 block">{t.role}</span>
                  <span className="text-[11px] text-amber-500 block">{t.restaurant}</span>
                </div>
                <Quote className="w-6 h-6 text-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
