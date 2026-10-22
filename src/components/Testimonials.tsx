import React from 'react';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-stone-50/70 text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
            <span>Şeflerin & Gurmelerin Tercihi</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Müşteri Deneyimi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
            Ustalara İlham Veren Lezzet
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-stone-200 rounded-xl flex flex-col justify-between space-y-4 hover:border-red-300 hover:shadow-lg transition-all duration-300 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-stone-900">{t.author}</h4>
                  <span className="text-[11px] text-stone-500 block">{t.role}</span>
                  <span className="text-[11px] text-red-700 font-semibold block">{t.restaurant}</span>
                </div>
                <Quote className="w-6 h-6 text-stone-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
