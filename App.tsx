import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Upload, X, Sparkles, ChevronDown, Flame } from 'lucide-react';

// ============ FLOATING FLOWER PETALS (Light Colors) ============
function FloatingFlowers() {
  const flowers = ['🌸', '🌷', '🌺', '💮', '🏵️', '🌼', '🌻'];
  const items = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((i) => (
        <motion.div
          key={i}
          className="absolute select-none"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 14}px`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          initial={{ y: -50, rotate: 0 }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 900) + 60,
            x: [0, Math.random() * 60 - 30, 0],
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 12 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear',
          }}
        >
          {flowers[Math.floor(Math.random() * flowers.length)]}
        </motion.div>
      ))}
    </div>
  );
}

// ============ DECORATIVE FLOWER CORNERS ============
function FlowerBorder() {
  const cornerFlowers = ['🌸', '🌷', '🌺', '🌼'];
  return (
    <>
      {/* Top border flowers */}
      <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none z-10 -mt-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-2xl md:text-3xl"
            animate={{ y: [0, -6, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          >
            {cornerFlowers[i % cornerFlowers.length]}
          </motion.span>
        ))}
      </div>
    </>
  );
}

// ============ LOTUS WITH PHOTO ============
function LotusPhoto() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {/* Rotating glow behind lotus */}
      <motion.div
        className="absolute w-[380px] h-[380px] md:w-[480px] md:h-[480px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,207,232,0.6) 0%, rgba(233,213,255,0.3) 50%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Rotating sparkles ring */}
      <motion.div
        className="absolute w-[340px] h-[340px] md:w-[440px] md:h-[440px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = typeof window !== 'undefined' && window.innerWidth > 768 ? 210 : 160;
          return (
            <span
              key={i}
              className="absolute text-pink-300"
              style={{
                left: `calc(50% + ${Math.cos(angle) * r}px)`,
                top: `calc(50% + ${Math.sin(angle) * r}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Sparkles size={18} />
            </span>
          );
        })}
      </motion.div>

      {/* The Lotus */}
      <div className="relative w-[340px] h-[340px] md:w-[440px] md:h-[440px] flex items-center justify-center">
        <motion.img
          src="/images/lotus.png"
          alt="Lotus"
          className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl pointer-events-none"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Photo in the center of the lotus */}
        <motion.button
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl cursor-pointer group"
          style={{ boxShadow: '0 0 30px rgba(244,114,182,0.5)' }}
        >
          {image ? (
            <>
              <img src={image} alt="Her" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="text-white" size={28} />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center">
              <Upload className="text-pink-400 mb-1" size={28} />
              <span className="text-pink-500 text-xs md:text-sm font-medium px-2 text-center">
                Add her photo 💕
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {image && (
        <button
          onClick={() => setImage('')}
          className="mt-4 flex items-center gap-1 text-pink-400 hover:text-pink-600 text-sm transition-colors"
        >
          <X size={14} /> Change photo
        </button>
      )}
    </div>
  );
}

// ============ EXTRA PHOTO GALLERY ============
interface Photo { id: number; url: string; caption: string; }

function PhotoGallery() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const save = () => {
    if (preview) {
      setPhotos((p) => [...p, { id: Date.now(), url: preview, caption: caption || 'A sweet memory 💕' }]);
      setPreview('');
      setCaption('');
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-5 max-w-sm w-full">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..."
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none mb-3 text-gray-700" />
              <div className="flex gap-2">
                <button onClick={() => setPreview('')} className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold text-gray-600">Cancel</button>
                <button onClick={save} className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl font-semibold">Add 💕</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {photos.map((photo) => (
          <motion.div
            key={photo.id} layout
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="relative group bg-white p-2 pb-8 rounded-lg shadow-xl border border-pink-100"
          >
            <div className="aspect-square rounded overflow-hidden">
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
            </div>
            <p className="absolute bottom-2 left-0 right-0 text-center text-pink-600 text-xs px-1">{photo.caption}</p>
            <button onClick={() => setPhotos((p) => p.filter((x) => x.id !== photo.id))}
              className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={14} className="text-red-400" />
            </button>
            <span className="absolute -top-2 -right-2 text-pink-300"><Heart size={16} fill="currentColor" /></span>
          </motion.div>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-lg border-2 border-dashed border-pink-300 bg-pink-50/60 flex flex-col items-center justify-center gap-2 hover:bg-pink-100/60 transition-colors"
        >
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Upload className="text-pink-400" size={28} />
          </motion.div>
          <span className="text-pink-500 text-sm">Add Memory</span>
        </motion.button>
      </div>
    </>
  );
}

// ============ LAYER 5: PETAL WISHES ============
function PetalWishesPage({ name }: { name: string }) {
  const wishes = [
    'May your smile bloom softer than the first flower of spring, forever lighting up my world. 🌸',
    'May every secret dream you hold in your gentle heart open up and come true, my love. 🌷',
    'May your whole year be as tender, warm, and magical as the way you love me. 💫',
    'May love always find you the way your fragrance finds my soul — sweet and never fading. 🌺',
    'May every storm turn calm in your arms, and every ordinary day feel like poetry with you. 🌼',
    'May you always know you are my most beautiful bloom, and the best lover my heart could dream of. 🪷',
  ];
  const poemLines = [
    'To the one who loves like a garden in bloom,',
    'you turned my grey days into petals and perfume.',
    'You are my sunrise, my rain, and my rose,',
    'the softest place my restless heart knows.',
    '',
    'A lover so gentle, so patient, so true —',
    'every good thing in my life smells of you.',
    'So on your birthday, my flower, my art,',
    'I hand you the whole of my blooming heart. 💕',
  ];
  const [openWish, setOpenWish] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-pink-50 via-fuchsia-50 to-purple-50 overflow-hidden">
      <FlowerBorder />
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl md:text-5xl"
            style={{ left: `${(i * 17) % 100}%`, top: `${(i * 29) % 95}%` }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.16 }}
          >
            🌸
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <p className="text-pink-400 tracking-[0.3em] uppercase text-sm mb-4">A Poem For My Lover</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            My Blooming Valentine
          </span>
        </h2>
        <p className="text-rose-500 text-lg mb-10">
          Dedicated to {name || 'my love'} — the most beautiful lover my heart has ever known. 💕
        </p>

        {/* Romantic dedicated poem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-16 bg-white/70 backdrop-blur-md border border-pink-100 rounded-[2rem] shadow-2xl p-8 md:p-12 relative overflow-hidden"
        >
          <span className="absolute top-4 left-4 text-2xl opacity-60">🌷</span>
          <span className="absolute top-4 right-4 text-2xl opacity-60">🌸</span>
          <span className="absolute bottom-4 left-4 text-2xl opacity-60">🌺</span>
          <span className="absolute bottom-4 right-4 text-2xl opacity-60">🪷</span>
          <div className="relative z-10 space-y-2">
            {poemLines.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-4" />
              ) : (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="text-lg md:text-2xl text-rose-600 italic leading-relaxed"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {line}
                </motion.p>
              )
            )}
          </div>
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Pick A Petal Wish
          </span>
        </h3>
        <p className="text-rose-500 text-lg mb-14">Tap any flower for a loving birthday blessing, just for you. 🌷</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {wishes.map((wish, i) => (
            <motion.button
              key={wish}
              onClick={() => setOpenWish(openWish === i ? null : i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="min-h-44 rounded-[2rem] bg-white/65 backdrop-blur-md border border-pink-100 shadow-xl p-5 flex flex-col items-center justify-center text-center"
            >
              <motion.span
                animate={{ rotate: openWish === i ? [0, 15, -15, 0] : [0, 4, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                {['🌸', '🌷', '🌺', '🌼', '💮', '🪷'][i]}
              </motion.span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={openWish === i ? 'open' : 'closed'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-rose-600 font-medium"
                >
                  {openWish === i ? wish : 'Tap to open'}
                </motion.p>
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============ LAYER 6: LOVE TIMELINE ============
function LoveTimelinePage() {
  const moments = [
    { flower: '🌱', title: 'The First Bloom', text: 'The day you became special to me.' },
    { flower: '🌷', title: 'Little Moments', text: 'Your smile, your voice, your tiny habits.' },
    { flower: '🌸', title: 'Beautiful Memories', text: 'Every laugh became a flower in my heart.' },
    { flower: '🪷', title: 'Forever Garden', text: 'I want many more birthdays beside you.' },
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-purple-50 to-rose-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center mb-16"
      >
        <p className="text-purple-400 tracking-[0.3em] uppercase text-sm mb-4">Layer 6</p>
        <h2 className="text-3xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Our Love Timeline
          </span>
        </h2>
        <p className="text-rose-500 mt-3 text-lg">A small path through our flower garden.</p>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-pink-200 via-purple-200 to-rose-200 rounded-full" />
        {moments.map((moment, i) => (
          <motion.div
            key={moment.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className={`relative mb-12 flex ${i % 2 === 0 ? 'justify-start pr-10' : 'justify-end pl-10'}`}
          >
            <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg border-2 border-pink-100 flex items-center justify-center text-2xl">
              {moment.flower}
            </div>
            <div className="w-[calc(50%-2.5rem)] bg-white/70 backdrop-blur-md border border-pink-100 rounded-[1.5rem] p-6 shadow-xl">
              <h3 className="text-xl font-bold text-rose-500 mb-2">{moment.title}</h3>
              <p className="text-gray-600 leading-relaxed">{moment.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============ LAYER 7: PROMISE GARDEN ============
function PromiseGardenPage({ name }: { name: string }) {
  const promises = [
    'I promise to make you smile whenever I can.',
    'I promise to stand beside you in every season.',
    'I promise to celebrate every little win with you.',
    'I promise to listen to your heart carefully.',
    'I promise to keep choosing you with love.',
  ];

  return (
    <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-100/60 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <p className="text-rose-400 tracking-[0.3em] uppercase text-sm mb-4">Layer 7</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
            Promise Garden
          </span>
        </h2>
        <p className="text-rose-500 mb-16 text-lg">For {name || 'my love'}, these flowers carry my promises.</p>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-5 gap-6 items-end">
        {promises.map((promise, i) => (
          <motion.div
            key={promise}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, type: 'spring' }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ rotate: [0, 3, -3, 0], y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              className="text-6xl mb-3"
            >
              {['🌷', '🌸', '🪷', '🌺', '🌼'][i]}
            </motion.div>
            <div className="w-1 bg-green-300 rounded-full" style={{ height: `${90 + i * 18}px` }} />
            <div className="mt-4 bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-lg min-h-28 flex items-center">
              <p className="text-gray-600 text-sm leading-relaxed">{promise}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============ LAYER 8: INTERACTIVE BIRTHDAY CAKE & CANDLE ============
function BirthdayCakePage({ name }: { name: string }) {
  const [litCandles, setLitCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [wished, setWished] = useState(false);

  const toggleCandle = (index: number) => {
    const updated = [...litCandles];
    updated[index] = !updated[index];
    setLitCandles(updated);

    if (updated.every((c) => !c)) {
      setWished(true);
    }
  };

  const relight = () => {
    setLitCandles([true, true, true, true, true]);
    setWished(false);
  };

  return (
    <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-amber-50 via-rose-50 to-pink-100 overflow-hidden">
      <FlowerBorder />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <p className="text-pink-400 tracking-[0.3em] uppercase text-sm mb-4">Layer 8</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            Blow Out The Birthday Candles 🎂
          </span>
        </h2>
        <p className="text-rose-500 text-lg mb-12">
          Tap each glowing flame to blow them out and make your birthday wish, {name || 'my love'}! ✨
        </p>

        {/* The Birthday Cake Display */}
        <div className="relative mx-auto my-8 w-72 md:w-96 flex flex-col items-center">
          {/* Candles Row */}
          <div className="flex justify-center items-end gap-6 md:gap-8 mb-2 z-20">
            {litCandles.map((isLit, i) => (
              <div key={i} className="flex flex-col items-center cursor-pointer" onClick={() => toggleCandle(i)}>
                {/* Flame */}
                <div className="h-10 flex items-center justify-center">
                  <AnimatePresence>
                    {isLit ? (
                      <motion.div
                        key="flame"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.25, 0.95, 1.1, 1], y: [0, -3, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative"
                      >
                        <Flame className="text-amber-500 fill-amber-400" size={28} />
                        <div className="absolute inset-0 bg-yellow-300 blur-md opacity-70 rounded-full" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="smoke"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0.8, 0], y: -20 }}
                        className="text-gray-400 text-xs font-serif italic"
                      >
                        💨
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Candle stick */}
                <div className="w-4 h-16 md:h-20 bg-gradient-to-b from-pink-200 via-pink-300 to-purple-300 rounded-t-sm shadow-md border border-pink-300 relative">
                  <div className="absolute inset-x-0 top-3 h-1 bg-white/60" />
                  <div className="absolute inset-x-0 top-8 h-1 bg-white/60" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Top Layer */}
          <div className="w-64 md:w-80 h-20 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 rounded-t-3xl shadow-lg border-b-4 border-pink-300 relative flex items-center justify-center">
            {/* Frosting drips */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-around">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-6 h-4 bg-white/80 rounded-b-full shadow-sm" />
              ))}
            </div>
            <span className="text-2xl">🌸 🍓 🌸</span>
          </div>

          {/* Cake Middle Layer */}
          <div className="w-72 md:w-96 h-24 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 rounded-b-3xl shadow-xl border-t-2 border-white/50 relative flex items-center justify-center">
            <span className="text-pink-600 font-bold tracking-wider text-lg md:text-xl font-serif">
              HAPPY BIRTHDAY {name ? name.toUpperCase() : 'MY LOVE'} 💖
            </span>
          </div>

          {/* Cake Stand */}
          <div className="w-80 md:w-[410px] h-6 bg-gradient-to-r from-amber-100 via-white to-amber-100 rounded-full shadow-2xl mt-1 border border-amber-200" />
        </div>

        {/* Wish Revealed Alert */}
        <AnimatePresence>
          {wished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 bg-white/85 backdrop-blur-md rounded-3xl p-8 border-2 border-pink-200 shadow-2xl max-w-lg mx-auto"
            >
              <div className="text-5xl mb-3">✨ 🎉 🪷</div>
              <h3 className="text-2xl font-bold text-rose-600 mb-2 font-serif">Your Wish Is Granted!</h3>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                May every secret wish you blew into these flames travel straight to the universe and blossom into pure joy for you, {name || 'my soulmate'}. 💕
              </p>
              <button
                onClick={relight}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                Relight Candles 🕯️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

// ============ LAYER 9: 10 REASONS WHY YOU ARE MY WORLD ============
function ReasonsGridPage({ name }: { name: string }) {
  const reasons = [
    { flower: '🌸', title: 'Your Soft Heart', text: 'The gentle way you care for everyone around you.' },
    { flower: '🌷', title: 'Your Bright Eyes', text: 'The way they sparkle whenever you talk about things you love.' },
    { flower: '🌺', title: 'Your Cutest Smile', text: 'It literally cures my worst days in a single second.' },
    { flower: '🌼', title: 'Your Sweet Voice', text: 'The most comforting sound in my entire world.' },
    { flower: '🪷', title: 'Your Endless Patience', text: 'How you understand me even when I find no words.' },
    { flower: '💮', title: 'Your Warm Hugs', text: 'Where time stops and all my worries melt away.' },
    { flower: '💐', title: 'Your Silly Laugh', text: 'My absolute favorite melody in the universe.' },
    { flower: '🌻', title: 'Your Kind Soul', text: 'You make the world softer just by existing in it.' },
    { flower: '🌸', title: 'Your Presence', text: 'Home is wherever you are, holding my hand.' },
    { flower: '💖', title: 'Simply YOU', text: 'Because you are my lotus, my partner, and my whole life.' },
  ];

  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-pink-100/60 via-purple-50 to-rose-50 overflow-hidden">
      <FlowerBorder />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <p className="text-purple-400 tracking-[0.3em] uppercase text-sm mb-4">Layer 9</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            10 Reasons Why You Are My World 💖
          </span>
        </h2>
        <p className="text-rose-500 text-lg mb-14">Tap each blooming petal card to read a reason, {name || 'my love'}.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              onClick={() => setFlipped(flipped === i ? null : i)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="min-h-48 rounded-2xl bg-white/75 backdrop-blur-md border border-pink-100 shadow-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group"
            >
              <div className="text-4xl mb-2">{reason.flower}</div>
              <h3 className="font-bold text-rose-500 text-sm md:text-base mb-1">{reason.title}</h3>
              <AnimatePresence mode="wait">
                {flipped === i ? (
                  <motion.p
                    key="back"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-600 text-xs md:text-sm leading-snug font-serif mt-1"
                  >
                    {reason.text}
                  </motion.p>
                ) : (
                  <motion.span
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-pink-400 text-xs italic mt-2 group-hover:text-pink-600"
                  >
                    Tap to read 💕
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============ LAYER 10: INTERACTIVE BIRTHDAY BOUQUET BUILDER ============
interface FlowerOption {
  id: number;
  emoji: string;
  name: string;
  meaning: string;
}

function BouquetBuilderPage({ name }: { name: string }) {
  const availableFlowers: FlowerOption[] = [
    { id: 1, emoji: '🪷', name: 'Sacred Lotus', meaning: 'Pure love & grace' },
    { id: 2, emoji: '🌸', name: 'Cherry Blossom', meaning: 'Sweet new beginnings' },
    { id: 3, emoji: '🌷', name: 'Pink Tulip', meaning: 'Eternal tenderness' },
    { id: 4, emoji: '🌹', name: 'Royal Rose', meaning: 'Deep passion' },
    { id: 5, emoji: '🌻', name: 'Golden Sunflower', meaning: 'Warmth & happiness' },
    { id: 6, emoji: '🌺', name: 'Tropical Hibiscus', meaning: 'Delicate beauty' },
    { id: 7, emoji: '🌼', name: 'White Daisy', meaning: 'Pure laughter' },
  ];

  const [selectedFlowers, setSelectedFlowers] = useState<FlowerOption[]>([]);
  const MAX_FLOWERS = 5;

  const addFlower = (flower: FlowerOption) => {
    if (selectedFlowers.length < MAX_FLOWERS) {
      setSelectedFlowers((prev) => [...prev, flower]);
    }
  };

  const removeFlower = (index: number) => {
    setSelectedFlowers((prev) => prev.filter((_, i) => i !== index));
  };

  const resetBouquet = () => {
    setSelectedFlowers([]);
  };

  const isComplete = selectedFlowers.length === MAX_FLOWERS;

  return (
    <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-rose-50 via-purple-50 to-pink-100 overflow-hidden">
      <FlowerBorder />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <p className="text-purple-400 tracking-[0.3em] uppercase text-sm mb-4">Layer 10</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Build Your Birthday Bouquet 💐
          </span>
        </h2>
        <p className="text-rose-500 text-lg mb-10">
          Pick {MAX_FLOWERS} flowers from the garden below to tie a custom bouquet for yourself, {name || 'my love'}! ✨
        </p>

        {/* Bouquet Holder Display */}
        <div className="relative mx-auto mb-12 max-w-md bg-white/75 backdrop-blur-md rounded-[2.5rem] border-2 border-pink-100 shadow-2xl p-8 flex flex-col items-center">
          {/* Ribbon indicator tag */}
          <div className="mb-4 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-semibold text-sm">
            {selectedFlowers.length} / {MAX_FLOWERS} Flowers Picked
          </div>

          {/* Flower Vase Wrapper */}
          <div className="relative w-64 h-56 flex flex-col items-center justify-end mb-4">
            {/* Glowing background aura */}
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-200/50 blur-2xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Flowers in bouquet arrangement */}
            <div className="relative z-10 flex items-center justify-center gap-1 min-h-[100px] mb-2">
              <AnimatePresence>
                {selectedFlowers.map((f, index) => (
                  <motion.div
                    key={`${f.id}-${index}`}
                    initial={{ scale: 0, y: -40, rotate: -20 }}
                    animate={{ scale: 1, y: 0, rotate: (index - 2) * 12 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    onClick={() => removeFlower(index)}
                    className="cursor-pointer hover:scale-125 transition-transform group relative"
                  >
                    <span className="text-5xl md:text-6xl drop-shadow-md block">{f.emoji}</span>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Click to remove
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedFlowers.length === 0 && (
                <p className="text-pink-300 italic text-sm">Tap flowers below to add them here ✨</p>
              )}
            </div>

            {/* Paper Wrap & Silk Ribbon 🎀 */}
            <div className="relative z-10 w-44 h-24 bg-gradient-to-b from-rose-200 via-pink-200 to-rose-300 rounded-b-[2rem] border-t-4 border-pink-300 shadow-lg flex flex-col items-center justify-center">
              <span className="text-4xl text-rose-500 animate-pulse">🎀</span>
              <span className="text-xs font-serif font-bold text-rose-600 uppercase tracking-wider mt-1">
                {name ? `${name}'s Bouquet` : 'My Love Bouquet'}
              </span>
            </div>
          </div>

          {/* Completed Bouquet Card Popup */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200 text-center shadow-md w-full"
              >
                <div className="text-3xl mb-2">💐 ✨ 💝</div>
                <h3 className="font-bold text-rose-600 text-lg mb-2 font-serif">Your Birthday Bouquet Is Ready!</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  May your year blossom with as much fragrance, sweetness, and warmth as these flowers bring to my heart. Happy Birthday, {name || 'my love'}! 💕
                </p>
                <button
                  onClick={resetBouquet}
                  className="px-5 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full text-xs font-semibold hover:scale-105 transition-transform shadow"
                >
                  Tie Another Bouquet 💐
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Flower Selection Tray */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 max-w-4xl mx-auto">
          {availableFlowers.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => addFlower(f)}
              disabled={isComplete}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-md flex flex-col items-center text-center transition-all ${
                isComplete ? 'opacity-50 cursor-not-allowed' : 'hover:border-pink-300 hover:shadow-xl cursor-pointer'
              }`}
            >
              <span className="text-4xl mb-2">{f.emoji}</span>
              <span className="font-bold text-rose-600 text-xs">{f.name}</span>
              <span className="text-[10px] text-gray-500 mt-1 italic">{f.meaning}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============ LAYER 11: RAIN OF ROSES SURPRISE ============
interface FallingRose {
  id: number;
  left: number;
  emoji: string;
  size: number;
  duration: number;
}

function RoseRainPage({ name }: { name: string }) {
  const [raining, setRaining] = useState(false);
  const [roses, setRoses] = useState<FallingRose[]>([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!raining) return;
    const emojis = ['🌹', '🌸', '💖', '🌷', '💕', '🌺', '✨'];
    const interval = setInterval(() => {
      setRoses((prev) => [
        ...prev.slice(-40),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: Math.random() * 20 + 18,
          duration: Math.random() * 2 + 3,
        },
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, [raining]);

  const startSurprise = () => {
    setRaining(true);
    setTimeout(() => setRevealed(true), 1800);
  };

  return (
    <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-pink-100 via-rose-100 to-purple-100 overflow-hidden">
      {/* Falling roses */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {roses.map((rose) => (
            <motion.span
              key={rose.id}
              className="absolute select-none"
              style={{ left: `${rose.left}%`, fontSize: rose.size }}
              initial={{ y: -60, rotate: 0, opacity: 1 }}
              animate={{ y: '110vh', rotate: 360, x: [0, 30, -30, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: rose.duration, ease: 'linear' }}
              onAnimationComplete={() => setRoses((prev) => prev.filter((r) => r.id !== rose.id))}
            >
              {rose.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center"
      >
        <p className="text-rose-400 tracking-[0.3em] uppercase text-sm mb-4">Layer 11</p>

        {!revealed ? (
          <>
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                One Last Surprise 🌹
              </span>
            </h2>
            <p className="text-rose-500 text-lg mb-14">
              {name || 'My love'}, press the magic rose and watch what happens... 🤫
            </p>

            <motion.button
              onClick={startSurprise}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              className="relative cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-400/40 blur-2xl"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-rose-300 via-pink-300 to-rose-400 shadow-2xl border-4 border-white flex items-center justify-center text-7xl md:text-8xl"
              >
                🌹
              </motion.div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-rose-500 font-semibold text-lg"
              >
                Press me 💕
              </motion.p>
            </motion.button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 blur-3xl bg-gradient-to-r from-rose-300/50 via-pink-300/50 to-purple-300/50 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-7xl md:text-8xl mb-6"
              >
                💖
              </motion.div>
              <h2
                className="text-5xl md:text-7xl font-bold mb-6"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                  I Love You, {name || 'My Love'}!
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-rose-500 italic mb-4">
                Today, tomorrow, and every bloom after. ∞
              </p>
              <div className="flex justify-center gap-3 text-3xl mt-6">
                {['🌹', '💕', '🌹', '💕', '🌹'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -12, 0], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
              <button
                onClick={() => {
                  setRevealed(false);
                  setRaining(false);
                  setRoses([]);
                }}
                className="mt-10 px-6 py-2.5 bg-white/70 backdrop-blur-sm text-rose-500 rounded-full font-semibold border border-rose-200 shadow-lg hover:scale-105 transition-transform text-sm"
              >
                Replay the surprise 🔄
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

// ============ LAYER 8: FINAL LETTER PAGE ============
function FinalLetterPage({ name }: { name: string }) {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-amber-50 via-pink-50 to-purple-100 overflow-hidden">
      <FlowerBorder />
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-14 shadow-2xl border border-pink-100 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-pink-200/40 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-purple-200/40 blur-2xl" />
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🪷
            </motion.div>
            <p className="text-pink-400 tracking-[0.3em] uppercase text-sm mb-4">Final Layer</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                One Last Bloom
              </span>
            </h2>
            <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
              <p>Dear {name || 'my beautiful one'},</p>
              <p>
                If this website is a garden, then every flower here is a small piece of my heart.
                I made it layered because my love for you is not one simple thing. It is memories,
                promises, wishes, laughter, care, and the quiet feeling of wanting you happy.
              </p>
              <p>
                On your birthday, I hope you feel loved like a flower feels sunlight. Softly,
                warmly, and completely.
              </p>
              <p className="text-2xl font-bold text-rose-500 pt-4">Happy Birthday, my lotus. 💕</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ============ MAIN APP ============
export default function App() {
  const { scrollY } = useScroll();
  const layer1 = useTransform(scrollY, [0, 800], [0, -100]);
  const layer2 = useTransform(scrollY, [0, 800], [0, -220]);
  const layer3 = useTransform(scrollY, [0, 800], [0, -350]);

  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState(0);
  const greetings = [
    'To the most beautiful soul 🌸',
    'You bloom brighter than any flower 🌷',
    'My favorite person in the world 💕',
    'Forever grateful for you 🌺',
  ];

  useEffect(() => {
    const t = setInterval(() => setGreeting((g) => (g + 1) % greetings.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden relative bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      <FloatingFlowers />

      {/* ===== LAYER 1: HERO WITH PARALLAX ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <FlowerBorder />

        {/* Parallax decorative layers */}
        <motion.div style={{ y: layer3 }} className="absolute top-32 left-8 text-6xl opacity-40 pointer-events-none">🌸</motion.div>
        <motion.div style={{ y: layer2 }} className="absolute top-52 right-12 text-7xl opacity-40 pointer-events-none">🌷</motion.div>
        <motion.div style={{ y: layer1 }} className="absolute bottom-40 left-16 text-6xl opacity-40 pointer-events-none">🌺</motion.div>
        <motion.div style={{ y: layer2 }} className="absolute bottom-52 right-20 text-5xl opacity-40 pointer-events-none">🌼</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-20 relative"
        >
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-pink-400 tracking-[0.3em] uppercase text-sm md:text-base mb-4"
          >
            ✿ Happy Birthday ✿
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              A Blooming Wish<br />Just For You
            </span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={greeting}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              className="text-lg md:text-xl text-rose-500 italic h-8"
            >
              {greetings[greeting]}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-14"
          >
            <ChevronDown className="mx-auto text-pink-400 animate-bounce" size={36} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== LAYER 2: THE LOTUS PHOTO CENTERPIECE ===== */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Dreamy pond-like background */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-100/70 via-pink-100/60 to-purple-100/70" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/70 to-transparent" />

        {/* Magical glowing orbs behind lotus */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251,207,232,0.6) 0%, rgba(232,121,249,0.25) 35%, rgba(192,132,252,0.15) 55%, transparent 75%)',
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Water ripple rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-300/40"
              initial={{ width: 200, height: 200, opacity: 0 }}
              animate={{ width: [200, 600], height: [200, 600], opacity: [0.6, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Floating magical petals around lotus */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const radius = 260 + (i % 3) * 60;
            return (
              <motion.div
                key={i}
                className="absolute text-2xl md:text-3xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [Math.cos(angle) * radius, Math.cos(angle + 0.5) * radius, Math.cos(angle) * radius],
                  y: [Math.sin(angle) * radius, Math.sin(angle + 0.5) * radius, Math.sin(angle) * radius],
                  rotate: [0, 360],
                }}
                transition={{ duration: 8 + (i % 4), repeat: Infinity, ease: 'linear' }}
              >
                {['🌸', '🌷', '🌺', '💮', '🪷'][i % 5]}
              </motion.div>
            );
          })}
        </div>

        {/* Glowing fireflies/sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-200"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 12px 4px rgba(253, 224, 71, 0.7)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.3, 0.5],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Subtle lily pad hints */}
        <motion.div
          className="absolute bottom-8 left-10 text-4xl opacity-30 pointer-events-none"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🪷
        </motion.div>
        <motion.div
          className="absolute bottom-16 right-14 text-5xl opacity-25 pointer-events-none"
          animate={{ rotate: [0, -5, 0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        >
          🪷
        </motion.div>
        <motion.div
          className="absolute top-20 left-16 text-3xl opacity-30 pointer-events-none"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌿
        </motion.div>
        <motion.div
          className="absolute top-24 right-20 text-3xl opacity-30 pointer-events-none"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          🌿
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              You Are My Lotus 🪷
            </span>
          </h2>
          <p className="text-rose-500 mb-16 text-lg italic">Pure, beautiful, and rising above it all</p>

          <div className="flex justify-center my-8">
            <LotusPhoto />
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-gray-600 mt-16 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Just like a lotus blooms in the most gentle way, you bring beauty and grace 
            into every moment of my life. Tap the center to place your favorite photo of her. 💐
          </motion.p>
        </motion.div>
      </section>

      {/* ===== LAYER 3: PERSONAL MESSAGE ===== */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-rose-50 to-pink-100/60">
        <FlowerBorder />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border-2 border-pink-100 relative overflow-hidden">
            {/* Corner flowers */}
            <span className="absolute top-4 left-4 text-3xl opacity-60">🌸</span>
            <span className="absolute top-4 right-4 text-3xl opacity-60">🌷</span>
            <span className="absolute bottom-4 left-4 text-3xl opacity-60">🌺</span>
            <span className="absolute bottom-4 right-4 text-3xl opacity-60">🌼</span>

            <div className="text-center relative z-10">
              <div className="text-5xl mb-6">💌</div>

              <div className="mb-6">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type her name..."
                  className="text-center text-2xl font-bold text-rose-500 bg-transparent border-b-2 border-pink-200 focus:border-pink-400 focus:outline-none pb-1 placeholder-pink-300"
                />
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                On your special day, I want you to know how deeply loved you are. 
                You are the flower that makes my whole garden worth tending. 🌷
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                May this year bloom with joy, laughter, and endless happiness. 
                Every petal of my heart belongs to you. 💕
              </p>
              <p className="text-2xl font-bold text-pink-500 mt-8">
                Happy Birthday, {name || 'my love'}! 🎂🌸
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== LAYER 4: MEMORIES GALLERY ===== */}
      <section className="relative py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="text-4xl mb-3">🌻</div>
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Our Garden of Memories
            </span>
          </h2>
          <p className="text-rose-500 mt-3 text-lg">Add all the beautiful moments together 📸</p>
        </motion.div>

        <PhotoGallery />
      </section>

      {/* ===== LAYER 5: PETAL WISHES PAGE ===== */}
      <PetalWishesPage name={name} />

      {/* ===== LAYER 6: LOVE TIMELINE PAGE ===== */}
      <LoveTimelinePage />

      {/* ===== LAYER 7: PROMISE GARDEN PAGE ===== */}
      <PromiseGardenPage name={name} />

      {/* ===== LAYER 8: INTERACTIVE BIRTHDAY CAKE & CANDLE ===== */}
      <BirthdayCakePage name={name} />

      {/* ===== LAYER 9: 10 REASONS WHY YOU ARE MY WORLD ===== */}
      <ReasonsGridPage name={name} />

      {/* ===== LAYER 10: BIRTHDAY BOUQUET BUILDER ===== */}
      <BouquetBuilderPage name={name} />

      {/* ===== LAYER 11: RAIN OF ROSES SURPRISE ===== */}
      <RoseRainPage name={name} />

      {/* ===== LAYER 12: FINAL LETTER PAGE ===== */}
      <FinalLetterPage name={name} />

      {/* ===== FOOTER ===== */}
      <footer className="relative py-16 px-4 bg-gradient-to-t from-purple-100 to-pink-50 text-center overflow-hidden">
        <div className="flex justify-center gap-3 text-3xl mb-6">
          {['🌸', '🌷', '🌺', '🌼', '🌻'].map((f, i) => (
            <motion.span key={i}
              animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}>
              {f}
            </motion.span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-xl text-gray-600 mb-2">
          Made with
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <Heart className="text-rose-400" fill="currentColor" size={24} />
          </motion.span>
          just for you
        </div>
        <p className="text-pink-500 text-lg">You will always be my favorite bloom 🪷💕</p>
      </footer>
    </div>
  );
}