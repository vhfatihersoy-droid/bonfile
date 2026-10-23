import { mediaUrl } from '../cms/config';
export type CategoryId = 'steak' | 'beef' | 'lamb' | 'meatball' | 'charcuterie' | 'doner' | 'horeca';
export interface CatalogProduct {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  summary: string;
  description: string;
  cut: string;
  methods: string[];
  weights: string[];
}
export const catalogCategories: {id: CategoryId; name: string; shortName: string; image: string; description: string}[] = [
  { id: 'steak', name: 'Steak & Özel Kesimler', shortName: 'Steak', image: 'steak', description: 'Izgaranın başrolü, karakterli kesimler.' },
  { id: 'beef', name: 'Dana Eti', shortName: 'Dana Eti', image: 'bonfile', description: 'Günlük tariflerden özel sofralara.' },
  { id: 'lamb', name: 'Kuzu Eti', shortName: 'Kuzu Eti', image: 'kuzu', description: 'Fırında, tencerede ve ızgarada.' },
  { id: 'meatball', name: 'Köfte & Burger', shortName: 'Köfte & Burger', image: 'kofte', description: 'Birlikte kurulan sofraların favorisi.' },
  { id: 'charcuterie', name: 'Şarküteri', shortName: 'Şarküteri', image: 'sarkuteri', description: 'Kahvaltıdan paylaşımlık tabaklara.' },
  { id: 'doner', name: 'Döner', shortName: 'Döner', image: 'doner', description: 'Pratik tabaklar için tanıdık lezzet.' },
  { id: 'horeca', name: 'Profesyonel Mutfak', shortName: 'Profesyonel', image: 'kemikli', description: 'Restoran ve toplu tüketim seçkisi.' },
];
export const catalogProducts: CatalogProduct[] = [
  {id:'dana-bonfile-lokum',name:'Dana Bonfile',category:'steak',image:'bonfile',summary:'Yumuşak dokusu, sade lezzeti.',description:'Dana sırtının iç kısmından elde edilen bonfile, ince lifli yapısıyla öne çıkar. Dilimlenerek tavada veya ızgarada hazırlanan tariflere uygundur.',cut:'Dana sırt içi',methods:['Tava','Izgara'],weights:['500 g','1 kg','2,5 kg']},
  {id:'dallas-steak',name:'Dallas Steak',category:'steak',image:'izgara',summary:'Kemikli kesimin güçlü karakteri.',description:'Kaburga bölgesinden elde edilen kemikli antrikot kesimi. Kalın dilimi ve yağ dokusuyla ızgara sofralarında yerini alır.',cut:'Dana sırt / kaburga',methods:['Izgara','Tava'],weights:['500 g','1 kg']},
  {id:'t-bone-steak',name:'T-Bone Steak',category:'steak',image:'kemikli',summary:'Tek kesimde iki farklı doku.',description:'T biçimindeki kemiğin iki yanında bonfile ve kontrfile bulunur. Her iki kesimin dokusunu aynı tabakta keşfetmek isteyenler için.',cut:'Dana bel / sırt',methods:['Izgara','Tava'],weights:['500 g','1 kg']},
  {id:'dana-antrikot',name:'Dana Antrikot',category:'beef',image:'steak',summary:'Mermerimsi dokusuyla öne çıkar.',description:'Dana sırtından elde edilen antrikot, etin içine dağılan yağ dokusuyla bilinir. Tavada ve ızgarada dilim olarak hazırlanabilir.',cut:'Dana sırt',methods:['Tava','Izgara'],weights:['500 g','1 kg','2,5 kg']},
  {id:'kuzu-pirzola',name:'Kuzu Pirzola',category:'lamb',image:'kuzu',summary:'Izgara sofralarının klasiği.',description:'Kuzu kaburgasından elde edilen kemikli kesim. Izgarada veya fırında hazırlanabilir; taze otlar ve mevsim sebzeleriyle eşleşir.',cut:'Kuzu sırt / kaburga',methods:['Izgara','Fırın'],weights:['500 g','1 kg']},
  {id:'dana-kusbasi-marine',name:'Dana Kuşbaşı',category:'beef',image:'bonfile',summary:'Tencere yemeklerine lezzet katar.',description:'Lokmalık parçalar halinde hazırlanan dana eti. Sote, güveç ve tencere yemeklerinde sebzelerle birlikte kullanılabilir.',cut:'Dana but',methods:['Tencere','Tava'],weights:['500 g','1 kg']},
  {id:'kuzu-incik-osso-buco',name:'Kuzu İncik',category:'lamb',image:'kuzu',summary:'Ağır ateşte hazırlanan sofralara.',description:'Kuzu bacağından elde edilen kemikli kesim. Fırında veya kapaklı tencerede, yavaş pişirilen tarifler için tercih edilir.',cut:'Kuzu incik',methods:['Fırın','Tencere'],weights:['750 g','1,5 kg']},
  {id:'efecioglu-kasap-kofte',name:'Kasap Köfte',category:'meatball',image:'kofte',summary:'Sofranın tanıdık lezzeti.',description:'Tavada veya ızgarada hazırlanabilen köfte seçeneği. Mevsim salatası, közlenmiş sebzeler ve sevdiğiniz garnitürlerle servis edebilirsiniz.',cut:'Dana eti',methods:['Tava','Izgara'],weights:['500 g','1 kg','3 kg']},
  {id:'gurme-smash-burger-koftesi',name:'Burger Köftesi',category:'meatball',image:'burger',summary:'Kendi burgerinizi hazırlayın.',description:'Burger tarifleri için porsiyonlanmış köfte. Ekmek, peynir, sebze ve sos seçimleriyle kendi tabağınızı oluşturabilirsiniz.',cut:'Dana eti',methods:['Tava','Izgara'],weights:['480 g','960 g']},
  {id:'kayseri-evlik-sucuk',name:'Evlik Sucuk',category:'charcuterie',image:'sarkuteri',summary:'Kahvaltının ve mangalın eşlikçisi.',description:'Dilimlenerek tavada veya ızgarada hazırlanabilen şarküteri ürünü. Kahvaltı tabaklarında, tostlarda ve sıcak tariflerde kullanılabilir.',cut:'Dana eti',methods:['Tava','Izgara'],weights:['450 g','900 g']},
  {id:'dana-antrikot-pastirma',name:'Çemenli Pastırma',category:'charcuterie',image:'pastirma',summary:'İnce dilimlerde yoğun lezzet.',description:'İnce dilimlenerek servis edilen çemenli şarküteri ürünü. Kahvaltı ve paylaşımlık tabakların yanında sıcak tariflere de eşlik eder.',cut:'Dana eti',methods:['Servis','Tava'],weights:['200 g','500 g']},
  {id:'yaprak-et-doner-pismis',name:'Yaprak Döner',category:'doner',image:'doner',summary:'Sevilen lezzet, farklı tabaklar.',description:'Döner tabakları, dürüm ve ekmek arası tariflerinde kullanılabilen yaprak et seçeneği. Hazırlama ve saklama için ürün ambalajındaki talimatları izleyin.',cut:'Dana ve kuzu eti',methods:['Tava'],weights:['500 g','1 kg']},
  {id:'horeca-b2b-steakhouse-koli',name:'Profesyonel Mutfak Seçkisi',category:'horeca',image:'kemikli',summary:'Menünüze uygun ürünleri keşfedin.',description:'Restoran, otel ve toplu tüketim mutfakları için katalogdaki dana eti, köfte ve döner seçeneklerini birlikte inceleyin.',cut:'Ürüne göre değişir',methods:['Izgara','Tava','Fırın'],weights:['10 kg','25 kg']},
];
export const featuredProductIds = ['dana-bonfile-lokum','dana-antrikot','kuzu-pirzola','efecioglu-kasap-kofte'];
export const categoryById = (id: string) => catalogCategories.find(category => category.id === id);
export const imagePath = (name: string) => name.startsWith('media:') ? mediaUrl(name.slice(6)) : `${import.meta.env.BASE_URL}images/${name}.jpg`;
