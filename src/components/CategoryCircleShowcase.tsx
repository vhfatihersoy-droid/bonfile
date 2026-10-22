import React from 'react';
import { MeatCategory } from '../types';

interface CategoryCircleShowcaseProps {
  selectedCategory: MeatCategory;
  onSelectCategory: (category: MeatCategory) => void;
}

interface CircleItem {
  id: MeatCategory;
  name: string;
  image: string;
  itemCount: string;
}

const circleCategories: CircleItem[] = [
  {
    id: 'steak',
    name: 'Steakhouse',
    image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=400&auto=format&fit=crop&q=80',
    itemCount: '3 Çeşit',
  },
  {
    id: 'beef',
    name: 'Dana Eti',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80',
    itemCount: '2 Çeşit',
  },
  {
    id: 'lamb',
    name: 'Kuzu Eti',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    itemCount: '2 Çeşit',
  },
  {
    id: 'meatball',
    name: 'Köfte & Burger',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&auto=format&fit=crop&q=80',
    itemCount: '2 Çeşit',
  },
  {
    id: 'charcuterie',
    name: 'Şarküteri',
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&auto=format&fit=crop&q=80',
    itemCount: '2 Çeşit',
  },
  {
    id: 'doner',
    name: 'Yaprak Döner',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=80',
    itemCount: '1 Çeşit',
  },
  {
    id: 'horeca',
    name: 'Horeca B2B',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&auto=format&fit=crop&q=80',
    itemCount: 'Kurumsal',
  },
];

export const CategoryCircleShowcase: React.FC<CategoryCircleShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const handleClick = (catId: MeatCategory) => {
    onSelectCategory(catId);
    const catalogElem = document.getElementById('urunler');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
          {circleCategories.map((item) => {
            const isSelected = selectedCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="group flex flex-col items-center shrink-0 p-2 rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                {/* Circular image with double ring on hover/select */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                    isSelected
                      ? 'ring-3 ring-red-700 shadow-md scale-105 bg-red-50'
                      : 'ring-1 ring-stone-200 group-hover:ring-2 group-hover:ring-red-600 group-hover:scale-105'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                <span
                  className={`mt-2.5 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                    isSelected ? 'text-red-700 font-extrabold' : 'text-stone-800 group-hover:text-red-700'
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  {item.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
