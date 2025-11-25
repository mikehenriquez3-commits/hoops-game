import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Users, ShoppingBag, Hammer, Settings, Menu, 
  ChevronRight, Shield, Swords, Brain, Activity, MoveVertical,
  Plus, ArrowUpCircle, Lock, Star, Zap, X, Filter, Flame, Save, User,
  LayoutGrid, Dna
} from 'lucide-react';

// --- CONSTANTS & CONFIG ---

const RARITIES = {
  SILVER: { id: 0, name: 'Silver', color: 'bg-gradient-to-br from-gray-300 to-gray-400', border: 'border-gray-400', baseStat: 40, statVar: 10, xpReq: 50, xpGive: 20 },
  GOLD: { id: 1, name: 'Gold', color: 'bg-gradient-to-br from-yellow-300 to-yellow-500', border: 'border-yellow-600', baseStat: 55, statVar: 15, xpReq: 100, xpGive: 50 },
  EMERALD: { id: 2, name: 'Emerald', color: 'bg-gradient-to-br from-emerald-400 to-emerald-600', border: 'border-emerald-700', baseStat: 75, statVar: 20, xpReq: 200, xpGive: 120 },
  SAPPHIRE: { id: 3, name: 'Sapphire', color: 'bg-gradient-to-br from-blue-400 to-blue-600', border: 'border-blue-700', baseStat: 100, statVar: 25, xpReq: 400, xpGive: 300 },
  RUBY: { id: 4, name: 'Ruby', color: 'bg-gradient-to-br from-red-500 to-red-700', border: 'border-red-800', baseStat: 130, statVar: 30, xpReq: 700, xpGive: 600 },
  DIAMOND: { id: 5, name: 'Diamond', color: 'bg-gradient-to-br from-cyan-300 to-cyan-500', border: 'border-cyan-400', baseStat: 170, statVar: 35, xpReq: 1200, xpGive: 1000 },
  BLACK_DIAMOND: { id: 6, name: 'Black Diamond', color: 'bg-gradient-to-br from-gray-800 to-black', border: 'border-gray-600', baseStat: 220, statVar: 40, xpReq: 2000, xpGive: 2500, text: 'text-white' },
  ULTRA: { id: 7, name: 'Ultra', color: 'bg-gradient-to-br from-pink-400 to-pink-600', border: 'border-pink-500', baseStat: 280, statVar: 50, xpReq: 3500, xpGive: 5000 },
  LEGENDARY_ULTRA: { id: 8, name: 'Legendary Ultra', color: 'bg-gradient-to-br from-pink-300 via-pink-500 to-white', border: 'border-pink-300', baseStat: 350, statVar: 60, xpReq: 6000, xpGive: 10000 },
  SUPERSTAR: { id: 9, name: 'Superstar', color: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-black', border: 'border-yellow-400', baseStat: 450, statVar: 80, xpReq: 10000, xpGive: 25000 }
};

const STAT_TYPES = ['OFF', 'DEF', 'REB', 'IQ', 'PHY'];
const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

const SPECIALTY_COLORS = {
    OFF: 'bg-red-500',
    DEF: 'bg-blue-500',
    REB: 'bg-green-500',
    IQ: 'bg-purple-500',
    PHY: 'bg-yellow-500'
};

const SUPPORT_TIERS = {
    COMMON: { boost: 10, name: 'Common', color: 'bg-gray-500' },
    RARE: { boost: 25, name: 'Rare', color: 'bg-blue-500' },
    EPIC: { boost: 50, name: 'Epic', color: 'bg-purple-500' },
    LEGENDARY: { boost: 100, name: 'Legendary', color: 'bg-orange-500' }
};

const FIRST_NAMES = ["Le", "Ko", "Mi", "Sha", "Ste", "Ke", "Ti", "Ka", "Ky", "Ja", "Lu", "Gian", "Jo", "Chris", "Ant", "Dwi", "Dir", "Ha", "Wil", "Bil", "Mag", "Lar", "Kar", "Osc", "Jer", "Dav", "Pat", "Al", "Reg", "Den", "Sco", "Bar", "Vin", "Tra", "Zio", "De", "Jay", "Ty"];
const LAST_NAMES = ["Bron", "Bry", "Jor", "One", "Cur", "Dur", "Dun", "Mal", "Irv", "Mor", "Don", "Nis", "Embi", "Pau", "Dav", "How", "Now", "Keem", "Cham", "Rus", "Joh", "Bir", "Jab", "Rob", "Wes", "Rob", "Ew", "Iv", "Mil", "Rod", "Pip", "Key", "Car", "You", "Wil", "Mar", "Roz", "Fox"];

const PLAYER_IMAGES = [
  "https://api.dicebear.com/9.x/pixel-art/svg?seed=Hoops1&backgroundColor=b6e3f4,c0aede,d1d4f9",
  "https://api.dicebear.com/9.x/pixel-art/svg?seed=Hoops2&backgroundColor=ffdfbf,ffd5dc,d1d4f9"
];

const FALLBACK_IMAGE = "https://cdn-icons-png.flaticon.com/512/10709/10709766.png"; 

// Helper for consistent identity
const getPlayerIdentity = (index) => {
  const f = FIRST_NAMES[index % FIRST_NAMES.length];
  const l = LAST_NAMES[index % LAST_NAMES.length];
  const seed = `${f}${l}${index}`; 
  return { name: `${f}${l.toLowerCase()}`, seed };
};

const DRAFT_BOARD_SIZE = 30;
const MAX_LEVEL = 100;
const TOTAL_PLAYERS_PER_TIER = 35;

// --- UTILITY FUNCTIONS ---

const getPlayerImage = (seed) => `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
const getGMImage = (seed) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=transparent`;

const generateCard = (rarityKey, forcedIndex = null) => {
  const rarity = RARITIES[rarityKey];
  const index = forcedIndex !== null ? forcedIndex : Math.floor(Math.random() * TOTAL_PLAYERS_PER_TIER);
  const identity = getPlayerIdentity(index);
  const specialty = STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)];
  const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  
  const stats = {};
  STAT_TYPES.forEach(stat => {
    stats[stat] = Math.floor(rarity.baseStat + (Math.random() * rarity.statVar));
  });

  return {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    playerId: index,
    name: identity.name,
    seed: identity.seed,
    rarity: rarityKey,
    specialty,
    position,
    level: 0,
    xp: 0,
    stats,
    maxStats: { ...stats },
    isLocked: false,
    proStatus: null 
  };
};

const generateSupportCard = (tierKey) => {
    const stat = STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)];
    const tier = SUPPORT_TIERS[tierKey];
    return {
        id: `supp-${Date.now()}-${Math.random()}`,
        type: 'SUPPORT',
        name: `${tier.name} ${stat} Boost`,
        stat: stat,
        boost: tier.boost,
        tier: tierKey,
        color: tier.color
    };
};

const generateMockCard = (rarityKey, index) => {
    const rarity = RARITIES[rarityKey];
    const identity = getPlayerIdentity(index);
    const specialty = STAT_TYPES[index % STAT_TYPES.length];
    const position = POSITIONS[index % POSITIONS.length];
    
    const stats = {};
    STAT_TYPES.forEach(stat => {
        stats[stat] = Math.floor(rarity.baseStat + (rarity.statVar / 2));
    });

    return {
        id: `mock-${rarityKey}-${index}`,
        playerId: index,
        name: identity.name,
        seed: identity.seed,
        rarity: rarityKey,
        specialty,
        position,
        level: 0,
        xp: 0,
        stats,
        maxStats: { ...stats },
        isLocked: true,
        proStatus: null
    };
};

const getLevelUpReq = (rarityKey, currentLevel) => {
  return Math.floor(RARITIES[rarityKey].xpReq * (1 + (currentLevel * 0.1)));
};

const calculateCurrentStats = (card, activeSupports = []) => {
  const baseMultiplier = 1 + (card.level * 0.05); 
  const specialtyMultiplier = 1 + (card.level * 0.10); 

  let proMultiplier = 1;
  if (card.proStatus === 'silver') proMultiplier = 2;
  if (card.proStatus === 'gold') proMultiplier = 2.36; 

  const current = {};
  STAT_TYPES.forEach(stat => {
    let val = card.maxStats[stat] * (stat === card.specialty ? specialtyMultiplier : baseMultiplier);
    val = val * proMultiplier;
    
    if (activeSupports && activeSupports.length > 0) {
        activeSupports.forEach(supp => {
            if (supp && supp.stat === stat) {
                val += supp.boost;
            }
        });
    }

    current[stat] = Math.floor(val);
  });
  return current;
};

const calculatePlayerTier = (deck, inventory) => {
    if (!deck || deck.length === 0) return { name: 'Rookie', progress: 0, next: 'Silver' };

    const deckCards = deck.map(id => inventory.find(c => c.id === id)).filter(Boolean);
    if (deckCards.length === 0) return { name: 'Rookie', progress: 0, next: 'Silver' };

    const totalScore = deckCards.reduce((acc, card) => {
        const rVal = RARITIES[card.rarity].id;
        let score = (rVal * 100) + card.level;
        if (card.proStatus === 'silver') score += 200; 
        if (card.proStatus === 'gold') score += 450;
        return acc + score;
    }, 0);

    const avgScore = totalScore / 5;

    const TIERS = [
        { name: 'Silver', score: 0 },
        { name: 'Silver +', score: 100 },
        { name: 'Silver ++', score: 175 },
        { name: 'Gold', score: 250 },
        { name: 'Gold +', score: 350 },
        { name: 'Emerald', score: 450 },
        { name: 'Emerald +', score: 550 },
        { name: 'Sapphire', score: 650 },
        { name: 'Sapphire +', score: 750 },
        { name: 'Ruby', score: 850 },
        { name: 'Ruby +', score: 1000 },
        { name: 'Diamond', score: 1200 },
        { name: 'Diamond +', score: 1400 },
        { name: 'Legendary', score: 2000 },
    ];

    let currentTier = TIERS[0];
    let nextTier = TIERS[1];

    for (let i = 0; i < TIERS.length - 1; i++) {
        if (avgScore >= TIERS[i].score) {
            currentTier = TIERS[i];
            nextTier = TIERS[i+1];
        }
    }

    const range = nextTier.score - currentTier.score;
    const progress = Math.min(100, Math.max(0, ((avgScore - currentTier.score) / range) * 100));

    return { name: currentTier.name, progress, next: nextTier.name, tierId: RARITIES[currentTier.name.split(' ')[0].toUpperCase()]?.id || 0 };
};

// --- COMPONENTS ---

const Card = ({ card, size = "md", onClick, isSelected, showStats = true, dim = false, isLocked = false, activeSupports }) => {
  if (!card || (card && card.type === 'SUPPORT')) return null; 
  const rarity = RARITIES[card.rarity];
  if (!rarity) return null;

  const currentStats = calculateCurrentStats(card, activeSupports);
  const totalStats = Object.values(currentStats).reduce((a, b) => a + b, 0);
  
  const sizeClasses = {
    sm: "w-[18%] min-w-[60px] h-32 text-[8px]",
    md: "w-32 h-48 text-xs",
    lg: "w-64 h-96 text-sm"
  };

  const isMaxed = card.level >= MAX_LEVEL;
  const imageSrc = getPlayerImage(card.seed);

  return (
    <div 
      onClick={() => onClick && onClick(card)}
      className={`
        relative ${sizeClasses[size]} ${rarity.color} ${rarity.border} border-[3px] rounded-md shadow-lg 
        flex flex-col overflow-hidden transition-transform transform select-none cursor-pointer
        ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}
        ${dim ? 'opacity-40 grayscale' : ''}
        ${isLocked ? 'grayscale brightness-50' : ''}
      `}
    >
      <div className="bg-black/60 p-0.5 flex justify-between items-center z-10 backdrop-blur-sm">
        <span className={`font-bold text-white truncate w-2/3 leading-none`}>{card.name}</span>
        {!isLocked && <span className="text-white font-mono text-[7px] leading-none">{totalStats}</span>}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
         <img 
            src={imageSrc} 
            alt={card.name}
            className={`w-full h-full object-cover ${size === 'sm' ? 'scale-110' : ''}`}
            loading="lazy"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
      </div>

      {!isLocked && card.proStatus && (
          <div className="absolute top-10 left-1 z-20 drop-shadow-lg">
              {card.proStatus === 'silver' && <div className="text-gray-300"><Star size={16} fill="silver" stroke="white" /></div>}
              {card.proStatus === 'gold' && <div className="text-yellow-400 animate-pulse"><Star size={18} fill="gold" stroke="white" /></div>}
          </div>
      )}

      {!isLocked && card.specialty && (
         <div className={`absolute top-5 left-0.5 z-20 w-4 h-4 rounded-full ${SPECIALTY_COLORS[card.specialty]} border border-white flex items-center justify-center shadow-md`}>
             <span className="text-[6px] font-bold text-white uppercase">{card.specialty.substring(0,1)}</span>
         </div>
      )}

      {!isLocked && card.position && (
         <div className={`absolute top-5 right-0.5 z-20 bg-black/80 text-white px-1 rounded text-[6px] font-bold border border-white/30`}>
             {card.position}
         </div>
      )}

      {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40">
              <Lock className="text-gray-400 mb-1 w-4 h-4" />
          </div>
      )}

      {!isLocked && (
        <div className="absolute top-8 right-0.5 z-10 bg-black/70 text-white px-1 rounded text-[6px] font-mono border border-white/20">
            L{card.level}
        </div>
      )}
      
      {isMaxed && !isLocked && (
        <div className="absolute top-10 left-1 z-10 text-yellow-300 drop-shadow-md">
           <Star size={10} fill="currentColor" />
        </div>
      )}

      <div className="bg-black/80 text-center py-0.5 z-10 mt-auto">
         <span className={`block font-bold leading-none ${rarity.text || 'text-' + rarity.color.split('-')[2] + '-300'}`}>{rarity.name.toUpperCase()}</span>
      </div>

      {showStats && !isLocked && (
        <div className="bg-white/95 p-0.5 grid grid-cols-2 gap-x-0.5 gap-y-0 text-black font-bold text-[7px] leading-none z-10">
          {Object.entries(currentStats).map(([k,v]) => (
              <div key={k} className="flex justify-between">
                <span className={card.specialty === k ? 'text-red-600' : 'text-gray-500'}>{k}</span>
                <span className={card.specialty === k ? 'text-red-600' : ''}>{v}</span>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SupportCardDisplay = ({ card, onClick, isSelected }) => {
    return (
        <div 
            onClick={() => onClick && onClick(card)}
            className={`w-[18%] min-w-[60px] h-24 rounded-md shadow-lg flex flex-col items-center justify-center p-1 text-center border-2 ${card.color} border-white/20 cursor-pointer ${isSelected ? 'ring-2 ring-white' : ''}`}
        >
            <Dna size={20} className="text-white mb-1" />
            <div className="text-white font-bold text-[8px] leading-tight">{card.name}</div>
            <div className="text-white/80 text-[8px]">+{card.boost} {card.stat}</div>
        </div>
    )
};

const Button = ({ children, onClick, disabled, variant = 'primary', className = '', size = 'md' }) => {
  const base = "rounded-lg font-bold uppercase tracking-wider transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2";
  const sizes = { sm: "px-2 py-1 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-lg" };
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-400 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    success: "bg-green-600 hover:bg-green-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    gold: "bg-yellow-500 hover:bg-yellow-400 text-black",
    outline: "bg-transparent border-2 border-slate-600 text-slate-300 hover:bg-slate-800"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const PackOpenModal = ({ cards, onClose }) => {
    if (!cards || cards.length === 0) return null;

    return (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
            <h2 className="text-3xl font-black text-white italic mb-8 animate-bounce">
                {cards.length > 1 ? "STARTER PACK" : "PACK OPENED!"}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8 max-h-[60vh] overflow-y-auto p-4 w-full">
                {cards.map((card, i) => (
                    <div key={card.id || i} className="animate-in zoom-in slide-in-from-bottom-10 duration-500" style={{animationDelay: `${i * 100}ms`}}>
                        <div className="transform scale-125 m-2">
                             {card.type === 'SUPPORT' ? 
                                <SupportCardDisplay card={card} /> : 
                                <Card card={card} size="sm" showStats={true} />
                             }
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={onClose} variant="primary" className="w-40 py-3 text-lg">
                COLLECT
            </Button>
        </div>
    );
};

// --- EXTRACTED VIEW COMPONENTS ---

const CatalogueView = ({ player, selectedCard, setSelectedCard, trainCard, combineCard }) => {
    const [mode, setMode] = useState('VIEW'); 
    const [fodderSelection, setFodderSelection] = useState([]);
    const [rarityFilter, setRarityFilter] = useState('ALL');

    const catalogueCards = useMemo(() => {
        const rarityKeys = Object.keys(RARITIES);
        let cardsToShow = [];
        const targetRarities = rarityFilter === 'ALL' ? rarityKeys : [rarityFilter];

        targetRarities.forEach(rKey => {
            for (let i = 0; i < TOTAL_PLAYERS_PER_TIER; i++) {
                const owned = player.inventory.filter(c => c.rarity === rKey && c.playerId === i);
                if (owned.length > 0) {
                    const best = owned.sort((a,b) => b.level - a.level)[0];
                    cardsToShow.push({ ...best, _status: 'OWNED', _count: owned.length });
                } else {
                    cardsToShow.push({ ...generateMockCard(rKey, i), _status: 'LOCKED' });
                }
            }
        });
        return cardsToShow;
    }, [player.inventory, rarityFilter]);

    if (selectedCard && !selectedCard.maxStats && selectedCard.type !== 'SUPPORT') {
        return (
            <div className="flex flex-col h-full p-4 text-white text-center">
                Loading Card Data...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <header className="bg-slate-800 p-4 border-b border-slate-700 flex flex-col gap-2 shrink-0">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users /> Catalogue</h2>
                    <div className="text-orange-400 font-mono text-sm">{player.inventory.length} Cards</div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button onClick={() => setRarityFilter('ALL')} className={`px-3 py-1 rounded-full text-xs font-bold border ${rarityFilter === 'ALL' ? 'bg-white text-black' : 'bg-slate-900 text-gray-400'}`}>ALL</button>
                    {Object.keys(RARITIES).map(rKey => (
                        <button key={rKey} onClick={() => setRarityFilter(rKey)} className={`px-3 py-1 rounded-full text-xs font-bold border ${rarityFilter === rKey ? 'bg-orange-500 text-white' : 'bg-slate-900 text-gray-400'}`}>{RARITIES[rKey].name}</button>
                    ))}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-2 grid grid-cols-5 gap-1 pb-32 place-items-center">
               {catalogueCards.map(card => {
                   const isLocked = card._status === 'LOCKED';
                   return (
                       <div key={card.id || `${card.rarity}-${card.playerId}`} className="relative w-full flex justify-center">
                           <Card card={card} size="sm" showStats={true} onClick={() => !isLocked && setSelectedCard(card)} isLocked={isLocked} />
                           {!isLocked && card._count > 1 && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold px-1 rounded-bl shadow">x{card._count}</div>}
                       </div>
                   )
               })}
            </div>

            {selectedCard && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col p-4 overflow-y-auto">
                    <div className="flex justify-end"><button onClick={() => {setSelectedCard(null); setMode('VIEW')}}><X className="text-white"/></button></div>
                    <div className="flex flex-col items-center gap-4 mt-4">
                        <Card card={selectedCard} size="lg" />
                        
                        <div className="w-full bg-slate-800 p-4 rounded-xl">
                            <h3 className="text-white font-bold text-lg mb-2">{selectedCard.name}</h3>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {Object.entries(calculateCurrentStats(selectedCard)).map(([k,v]) => (
                                    <div key={k} className="flex justify-between bg-slate-700 p-2 rounded text-sm text-white"><span>{k}</span><span className="font-bold">{v}</span></div>
                                ))}
                            </div>
                            
                            {mode === 'VIEW' && (
                                <div className="space-y-2">
                                    {selectedCard.level < MAX_LEVEL ? 
                                        <Button className="w-full" onClick={() => setMode('TRAIN')}>TRAIN</Button> 
                                        : <Button className="w-full bg-gray-600" disabled>MAX LEVEL</Button>
                                    }
                                    
                                    {player.inventory.filter(c => c.rarity === selectedCard.rarity && c.playerId === selectedCard.playerId).length > 1 && (
                                        <Button className="w-full" variant="gold" onClick={() => combineCard(selectedCard)}>
                                            COMBINE (PRO)
                                        </Button>
                                    )}
                                </div>
                            )}

                            {mode === 'TRAIN' && (
                                <div className="bg-slate-900 p-4 rounded">
                                    <p className="text-white text-xs mb-2">Select fodder from list below (Not Implemented in this view for brevity, assuming selecting from catalogue list in main view)</p>
                                    <Button variant="secondary" onClick={() => setMode('VIEW')}>Cancel</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ForgeView = ({ player, forgeCards }) => {
    const [selectedForForge, setSelectedForForge] = useState([]);
    
    const forgeableCards = player.inventory.filter(c => 
        c.level === MAX_LEVEL && !player.deck.includes(c.id) && RARITIES[c.rarity].id < 9
    );

    const handleSelect = (id) => {
        const card = player.inventory.find(c => c.id === id);
        if (selectedForForge.length > 0) {
            const first = player.inventory.find(c => c.id === selectedForForge[0]);
            if (first.rarity !== card.rarity) {
                alert("Must select cards of the same rarity!");
                return;
            }
        }

        if (selectedForForge.includes(id)) {
            setSelectedForForge(prev => prev.filter(x => x !== id));
        } else {
            if (selectedForForge.length < 5) {
                setSelectedForForge(prev => [...prev, id]);
            }
        }
    };

    const doForge = () => {
        const newCard = forgeCards(selectedForForge);
        if (newCard) {
            setSelectedForForge([]);
        }
    };

    return (
        <div className="h-full bg-slate-900 flex flex-col">
            <header className="p-4 bg-slate-800 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Hammer /> The Forge</h2>
                <p className="text-xs text-gray-400">Combine 5 Max Level cards of the same rarity to get 1 Higher Rarity card.</p>
            </header>

            <div className="p-6 flex justify-center gap-1 min-h-[160px] items-center bg-slate-800/50 overflow-x-auto">
                {Array.from({length: 5}).map((_, i) => {
                    const id = selectedForForge[i];
                    const card = id ? player.inventory.find(c => c.id === id) : null;
                    return (
                        <div key={i} className="w-[18%] min-w-[60px] h-32 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-slate-800 shrink-0">
                            {card ? <Card card={card} size="sm" showStats={true} onClick={() => handleSelect(id)} /> : <span className="text-gray-600 text-[8px]">Slot {i+1}</span>}
                        </div>
                    )
                })}
            </div>

            <div className="p-4 flex justify-center">
                <Button 
                    disabled={selectedForForge.length !== 5} 
                    className="w-full max-w-md py-4"
                    onClick={doForge}
                >
                    FORGE {selectedForForge.length}/5
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-white text-sm font-bold mb-2">Available Maxed Cards</h3>
                <div className="grid grid-cols-5 gap-1 pb-24 place-items-center">
                    {forgeableCards.map(card => (
                        <div key={card.id} className="w-full flex justify-center">
                            <Card 
                                card={card} 
                                size="sm" 
                                showStats={true}
                                isSelected={selectedForForge.includes(card.id)}
                                onClick={() => handleSelect(card.id)}
                            />
                        </div>
                    ))}
                    {forgeableCards.length === 0 && <p className="text-gray-500 text-sm col-span-5 text-center py-4">No max level cards available.</p>}
                </div>
            </div>
        </div>
    )
};

// --- MAIN APP ---

export default function HoopsLegends() {
  const [gameState, setGameState] = useState('LOADING'); 
  const [player, setPlayer] = useState({ 
      name: '', coins: 0, inventory: [], deck: [], 
      supportInventory: [], activeSupport: [], 
      tutorialStep: 0, record: { wins: 0, losses: 0 } 
  });
  const [battleState, setBattleState] = useState(null); 
  const [selectedCard, setSelectedCard] = useState(null); 
  const [packResult, setPackResult] = useState(null); 
  const [opponents, setOpponents] = useState([]); 
  const [draftBoard, setDraftBoard] = useState(null); 

  useEffect(() => {
    const saved = localStorage.getItem('hoopsLegendsSave');
    if (saved) {
      try {
          const loaded = JSON.parse(saved);
          if (!loaded.record) loaded.record = { wins: 0, losses: 0 };
          if (!loaded.supportInventory) loaded.supportInventory = [];
          if (!loaded.activeSupport) loaded.activeSupport = [];
          loaded.inventory = loaded.inventory.map(c => ({
              ...c,
              proStatus: c.proStatus || null, 
              specialty: c.specialty || 'OFF', 
              position: c.position || 'PG' 
          }));
          setPlayer(loaded);
          setGameState('MENU');
      } catch (e) {
          console.error("Save file corrupted", e);
          setGameState('START');
      }
    } else {
      setGameState('START');
    }
  }, []);

  useEffect(() => { if (player.name) localStorage.setItem('hoopsLegendsSave', JSON.stringify(player)); }, [player]);

  useEffect(() => {
      setSelectedCard(null);
  }, [gameState]);

  const tierInfo = useMemo(() => calculatePlayerTier(player.deck, player.inventory), [player.deck, player.inventory]);

  const handleClosePack = () => {
    setPackResult(null);
    if (player.tutorialStep === 1 && gameState !== 'MENU') {
        setGameState('TUTORIAL');
    }
  };

  const createStarterPack = () => {
    const newCards = Array.from({ length: 12 }).map(() => generateCard('SILVER'));
    const newSupport = [generateSupportCard('COMMON'), generateSupportCard('COMMON')];
    const deckIds = newCards.slice(0, 5).map(c => c.id);
    
    setPlayer({
      name: '', coins: 200, inventory: newCards, deck: deckIds,
      supportInventory: newSupport, activeSupport: [],
      tutorialStep: 1, record: { wins: 0, losses: 0 }
    });
    setPackResult([...newCards, ...newSupport]);
  };

  const completeTutorial = (name) => {
    setPlayer(prev => ({ ...prev, name, tutorialStep: 999 }));
    setGameState('MENU');
  };

  const buyPack = (type) => {
    let cost = 0;
    let odds = []; 
    let guaranteedTier = -1;

    if (type === 'NORMAL') { cost = 100; odds = [0.90, 0.09, 0.01, 0, 0, 0, 0, 0, 0, 0]; }
    else if (type === 'SUPER') { cost = 600; odds = [0.60, 0.30, 0.08, 0.02, 0, 0, 0, 0, 0, 0]; }
    else if (type === 'ULTRA') { cost = 1500; odds = [0, 0.50, 0.35, 0.10, 0.04, 0.01, 0, 0, 0, 0]; }
    else if (type === 'GOD') { cost = 5000; odds = [0, 0, 0, 0, 0.70, 0.20, 0.08, 0.02, 0, 0]; guaranteedTier = 4; } 

    if (player.coins < cost) { alert("Not enough coins!"); return; }

    const roll = Math.random();
    let cumulative = 0;
    let selectedRarity = 'SILVER';
    const rarityKeys = Object.keys(RARITIES);

    for (let i = 0; i < odds.length; i++) {
      cumulative += odds[i];
      if (roll <= cumulative) { selectedRarity = rarityKeys[i]; break; }
    }
    
    let newItem;
    if (type !== 'GOD' && Math.random() < 0.1) {
        newItem = generateSupportCard(Math.random() > 0.8 ? 'RARE' : 'COMMON');
        setPlayer(prev => ({ ...prev, coins: prev.coins - cost, supportInventory: [...prev.supportInventory, newItem] }));
    } else {
        newItem = generateCard(selectedRarity);
        setPlayer(prev => ({ ...prev, coins: prev.coins - cost, inventory: [...prev.inventory, newItem] }));
    }
    setPackResult([newItem]);
  };

  const combineCard = (targetCard) => {
      const dupe = player.inventory.find(c => c.id !== targetCard.id && c.rarity === targetCard.rarity && c.playerId === targetCard.playerId);
      if (!dupe) return;

      const isBothMax = targetCard.level === MAX_LEVEL && dupe.level === MAX_LEVEL;
      const newProStatus = isBothMax ? 'gold' : 'silver';

      const updatedCard = { ...targetCard, proStatus: newProStatus };
      
      setPlayer(prev => ({
          ...prev,
          inventory: prev.inventory.filter(c => c.id !== dupe.id).map(c => c.id === targetCard.id ? updatedCard : c)
      }));
      
      alert(isBothMax ? "PERFECT PRO! Gold Star Acquired!" : "Pro Combined! Silver Star Acquired!");
      setSelectedCard(updatedCard);
  };

  const trainCard = (targetId, fodderIds) => {
    const targetCard = player.inventory.find(c => c.id === targetId);
    let totalXp = 0;
    
    fodderIds.forEach(fid => {
      const fodder = player.inventory.find(c => c.id === fid);
      const r = RARITIES[fodder.rarity];
      totalXp += Math.floor(r.xpGive * (1 + (fodder.level * 0.5)));
    });

    let currentXp = targetCard.xp + totalXp;
    let currentLevel = targetCard.level;
    
    while (currentLevel < MAX_LEVEL) {
      const req = getLevelUpReq(targetCard.rarity, currentLevel);
      if (currentXp >= req) {
        currentXp -= req;
        currentLevel++;
      } else {
        break;
      }
    }

    if (currentLevel === MAX_LEVEL) currentXp = 0;

    const updatedCard = { ...targetCard, level: currentLevel, xp: currentXp };
    
    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory
        .filter(c => !fodderIds.includes(c.id)) 
        .map(c => c.id === targetId ? updatedCard : c) 
    }));
    
    setSelectedCard(updatedCard); 
  };

  const forgeCards = (cardIds) => {
    const cards = cardIds.map(id => player.inventory.find(c => c.id === id));
    const rarityKey = cards[0].rarity;
    const rarityIndex = RARITIES[rarityKey].id;
    
    if (rarityIndex >= 9) return null; 

    const nextRarityKey = Object.keys(RARITIES)[rarityIndex + 1];
    const newCard = generateCard(nextRarityKey);

    setPlayer(prev => ({
      ...prev,
      inventory: [
        ...prev.inventory.filter(c => !cardIds.includes(c.id)), 
        newCard
      ]
    }));

    setPackResult([newCard]);
    return newCard;
  };

  const enterBattleSelection = () => {
      const playerPower = tierInfo.score || 100; 
      
      const newOpponents = Array.from({length: 3}).map((_, i) => {
          const name = `GM ${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]}`;
          return {
              id: i, name, avatar: getGMImage(name+i),
              record: { wins: Math.floor(Math.random()*50), losses: Math.floor(Math.random()*50) },
              deck: Array.from({length: 5}).map(() => {
                  const card = generateCard(Object.keys(RARITIES)[Math.min(9, Math.floor(tierInfo.progress/100))]); 
                  const deckAvgLvl = player.deck.reduce((a,b)=> a + (player.inventory.find(c=>c.id===b)?.level||0), 0) / 5;
                  card.level = Math.max(0, Math.floor(deckAvgLvl * 0.85)); 
                  return card;
              })
          };
      });
      setOpponents(newOpponents);
      setGameState('BATTLE_SELECT');
  };

  const generateDraftBoard = (isWin) => {
      const picks = isWin ? 4 : 1;
      const items = Array.from({length: DRAFT_BOARD_SIZE}).map((_, i) => {
          const rRand = Math.random();
          if (rRand < 0.2) return generateSupportCard('COMMON');
          if (rRand < 0.25) return generateSupportCard('RARE');
          return generateCard(Object.keys(RARITIES)[Math.min(9, Math.floor(Math.random() * 3))]); 
      });
      
      setDraftBoard({ items, picksRemaining: picks, revealed: [], collected: [] });
      setGameState('DRAFT_BOARD');
  };

  const handleDraftPick = (index) => {
      if (draftBoard.revealed.includes(index) || draftBoard.picksRemaining <= 0) return;
      
      const newItem = draftBoard.items[index];
      const newRevealed = [...draftBoard.revealed, index];
      const newCollected = [...draftBoard.collected, newItem];
      
      setDraftBoard(prev => ({ ...prev, revealed: newRevealed, collected: newCollected, picksRemaining: prev.picksRemaining - 1 }));

      if (newItem.type === 'SUPPORT') {
          setPlayer(p => ({ ...p, supportInventory: [...p.supportInventory, newItem] }));
      } else {
          setPlayer(p => ({ ...p, inventory: [...p.inventory, newItem] }));
      }
  };

  const renderStore = () => {
      return (
          <div className="h-full bg-slate-900 p-4 overflow-y-auto pb-32">
              <header className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2"><ShoppingBag /> Store</h2>
                  <div className="bg-slate-800 px-3 py-1 rounded-full text-yellow-400 font-bold border border-yellow-600">
                      🪙 {player.coins}
                  </div>
              </header>

              <div className="space-y-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                      <div className="w-24 h-32 bg-gray-400 rounded-lg flex items-center justify-center shadow-lg border-2 border-gray-300">
                          <span className="font-bold text-gray-800">NORMAL</span>
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">Normal Pack</h3>
                          <p className="text-xs text-gray-400 mb-2">Mostly Silver. Slight chance of Gold/Emerald.</p>
                          <Button onClick={() => buyPack('NORMAL')} variant="secondary" className="w-full">
                             Buy (100 🪙)
                          </Button>
                      </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                      <div className="w-24 h-32 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-yellow-300">
                          <span className="font-bold text-yellow-900">SUPER</span>
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">Super Pack</h3>
                          <p className="text-xs text-gray-400 mb-2">Better odds! High chance of Gold.</p>
                          <Button onClick={() => buyPack('SUPER')} variant="primary" className="w-full">
                             Buy (600 🪙)
                          </Button>
                      </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                      <div className="w-24 h-32 bg-pink-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-pink-300">
                          <span className="font-bold text-white">ULTRA</span>
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">Ultra Pack</h3>
                          <p className="text-xs text-gray-400 mb-2">Guaranteed Gold+. Best chance for top tiers.</p>
                          <Button onClick={() => buyPack('ULTRA')} variant="gold" className="w-full">
                             Buy (1500 🪙)
                          </Button>
                      </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 animate-pulse"></div>
                      <div className="w-24 h-32 bg-gradient-to-br from-red-600 to-purple-900 rounded-lg flex items-center justify-center shadow-lg border-2 border-red-400 z-10">
                          <span className="font-black text-white italic text-xl">GOD</span>
                      </div>
                      <div className="flex-1 z-10">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">God Pack <Flame size={16} className="text-orange-500"/></h3>
                          <p className="text-xs text-gray-400 mb-2">Guaranteed <span className="text-red-400 font-bold">Ruby+</span>. High chance of God Tier.</p>
                          <Button onClick={() => buyPack('GOD')} variant="danger" className="w-full">
                             Buy (5000 🪙)
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      )
  };

  const renderDraftBoard = () => (
      <div className="h-full bg-slate-900 p-4 flex flex-col">
          <h2 className="text-2xl text-white font-black text-center mb-2">DRAFT BOARD</h2>
          <p className="text-center text-orange-400 mb-4">{draftBoard.picksRemaining} Picks Remaining</p>
          
          <div className="grid grid-cols-5 gap-2 overflow-y-auto pb-20">
              {draftBoard.items.map((item, i) => {
                  const isRevealed = draftBoard.revealed.includes(i);
                  return (
                      <div key={i} onClick={() => handleDraftPick(i)} className={`aspect-[2/3] rounded bg-slate-700 border border-slate-500 flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${isRevealed ? '' : 'hover:bg-slate-600'}`}>
                          {isRevealed ? (
                              item.type === 'SUPPORT' ? 
                              <div className={`text-[8px] text-center font-bold p-1 ${item.color} text-white w-full h-full flex items-center justify-center`}>{item.name}</div> :
                              <Card card={item} size="sm" showStats={false} />
                          ) : (
                              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50"></div>
                          )}
                      </div>
                  )
              })}
          </div>
          {draftBoard.picksRemaining === 0 && (
              <div className="absolute bottom-20 left-0 w-full flex justify-center">
                  <Button onClick={() => setGameState('MENU')}>FINISH</Button>
              </div>
          )}
      </div>
  );

  const renderMenu = () => (
    <div className="h-full flex flex-col bg-slate-900 text-white pb-32 relative">
        <header className="p-4 bg-slate-800 border-b border-slate-700 shadow-lg z-10">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="font-black italic text-xl">HOOPS <span className="text-orange-500">LEGENDS</span></h1>
                    <div className="text-xs text-gray-400">GM: {player.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">
                        Record: <span className="text-green-400">{player.record?.wins || 0}W</span> - <span className="text-red-400">{player.record?.losses || 0}L</span>
                    </div>
                </div>
                <div className="bg-slate-900 px-3 py-1 rounded border border-slate-600 font-mono text-yellow-400">
                    🪙 {player.coins}
                </div>
            </div>
            
            <div className="w-full bg-slate-900 rounded-full h-4 relative border border-slate-600">
                <div className="bg-gradient-to-r from-orange-600 to-yellow-500 h-full rounded-full transition-all duration-1000" style={{width: `${tierInfo.progress}%`}}></div>
                <div className="absolute inset-0 flex justify-between items-center px-2 text-[9px] font-bold uppercase tracking-wider">
                    <span>{tierInfo.name}</span>
                    <span>{tierInfo.next}</span>
                </div>
            </div>
        </header>

        <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto">
            <button onClick={enterBattleSelection} className="col-span-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 shadow-lg flex items-center justify-between group active:scale-95 transition-transform">
                <div><h2 className="text-3xl font-black italic">BATTLE</h2><p className="text-orange-200 text-sm">Challenge Rivals</p></div><Swords size={48} />
            </button>
            <button onClick={() => setGameState('DECK')} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 active:bg-slate-700"><Users size={32} className="text-blue-400" /><span className="font-bold">DECK</span></button>
            <button onClick={() => setGameState('CATALOGUE')} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 active:bg-slate-700"><Menu size={32} className="text-green-400" /><span className="font-bold">CARDS</span></button>
            <button onClick={() => setGameState('FORGE')} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 active:bg-slate-700"><Hammer size={32} className="text-purple-400" /><span className="font-bold">FORGE</span></button>
            <button onClick={() => setGameState('STORE')} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 active:bg-slate-700"><ShoppingBag size={32} className="text-yellow-400" /><span className="font-bold">STORE</span></button>
            <button onClick={() => setGameState('SETTINGS')} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 active:bg-slate-700"><Settings size={32} className="text-gray-400" /><span className="font-bold">SETTINGS</span></button>
        </div>
    </div>
  );

  const renderBattleSelection = () => {
      return (
          <div className="h-full bg-slate-900 flex flex-col p-6 overflow-y-auto">
              <h2 className="text-3xl font-black italic text-white mb-2">CHALLENGE</h2>
              <div className="space-y-4 pb-32">
                  {opponents.map(opp => (
                      <div key={opp.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4 shadow-lg">
                          <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden"><img src={opp.avatar} alt="GM" /></div>
                          <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{opp.name}</h3>
                              <div className="text-xs text-gray-400 mb-2">{opp.record.wins}W - {opp.record.losses}L</div>
                              <Button onClick={() => startBattle(opp)} size="sm" className="w-full">BATTLE</Button>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="absolute bottom-24 left-0 w-full flex justify-center"><Button onClick={() => setGameState('MENU')} variant="secondary" className="w-40">Back</Button></div>
          </div>
      );
  };

  const startBattle = (opponent) => {
    const playerDeckCards = player.deck.map(id => player.inventory.find(c => c.id === id));
    const activeSupports = player.activeSupport.map(id => player.supportInventory.find(s => s.id === id)).filter(Boolean);

    setBattleState({
      round: 0, playerScore: 0, aiScore: 0,
      playerDeck: playerDeckCards, aiDeck: opponent.deck,
      playerSupports: activeSupports,
      opponent, usedPlayerIds: [], usedAiIds: [], log: [],
      phase: 'SELECT_CARD', currentStat: null, isDuo: false
    });
    setGameState('BATTLE');
    nextRoundInit({ round: 0, playerScore: 0, aiScore: 0 });
  };

  const nextRoundInit = (state) => {
    const roundIdx = (state ? state.round : 0) + 1;
    let isDuo = roundIdx === 2;
    let stat = roundIdx === 4 ? 'ALL' : STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)];
    setBattleState(prev => ({ ...prev, round: roundIdx, phase: 'SELECT_CARD', currentStat: stat, isDuo, selection: [] }));
  };

  const playRound = (selectedIds) => {
      const { aiDeck, usedAiIds, currentStat, isDuo, playerSupports, playerDeck } = battleState;
      const availableAi = aiDeck.filter(c => !usedAiIds.includes(c.id));
      const aiPicks = availableAi.sort(() => 0.5 - Math.random()).slice(0, isDuo ? 2 : 1);
      const playerPicks = selectedIds.map(id => playerDeck.find(c => c.id === id));

      const getScore = (cards, supports) => cards.reduce((acc, c) => {
          const stats = calculateCurrentStats(c, supports);
          if (currentStat === 'ALL') return acc + Object.values(stats).reduce((a,b)=>a+b,0);
          return acc + stats[currentStat];
      }, 0);

      const pVal = getScore(playerPicks, playerSupports);
      const aVal = getScore(aiPicks, []); 

      let winner = 'DRAW';
      if (pVal > aVal) winner = 'PLAYER';
      if (aVal > pVal) winner = 'AI';
      const pts = isDuo ? 2 : 1;

      setBattleState(prev => ({
          ...prev, phase: 'RESULT',
          lastResult: { pCards: playerPicks, aCards: aiPicks, pVal, aVal, winner },
          playerScore: prev.playerScore + (winner === 'PLAYER' ? pts : 0),
          aiScore: prev.aiScore + (winner === 'AI' ? pts : 0),
          usedPlayerIds: [...prev.usedPlayerIds, ...selectedIds],
          usedAiIds: [...prev.usedAiIds, ...aiPicks.map(c=>c.id)]
      }));
  };

  const resolveRound = () => {
      const { playerScore, aiScore, round } = battleState;
      let isOver = false, winner = null;
      
      if (playerScore >= 3) { isOver = true; winner = 'PLAYER'; }
      else if (aiScore >= 3) { isOver = true; winner = 'AI'; }
      else if (round === 3 && playerScore !== aiScore) { isOver = true; winner = playerScore > aiScore ? 'PLAYER' : 'AI'; }
      else if (round === 4) { isOver = true; winner = playerScore > aiScore ? 'PLAYER' : (aiScore > playerScore ? 'AI' : 'DRAW'); }

      if (isOver) {
          const win = winner === 'PLAYER';
          setPlayer(prev => ({
              ...prev,
              coins: prev.coins + (win ? 50 : 15), 
              record: { wins: prev.record.wins + (win?1:0), losses: prev.record.losses + (win?0:1) }
          }));
          generateDraftBoard(win);
      } else {
          nextRoundInit({ round: battleState.round, playerScore: battleState.playerScore, aiScore: battleState.aiScore });
      }
  };

  const renderBattle = () => {
      if (!battleState) return null;
      
      return (
        <div className="h-full bg-slate-900 flex flex-col relative overflow-hidden">
             <div className="bg-black/50 p-2 flex justify-between items-center text-white border-b border-slate-700">
                 <div className="flex flex-col"><span className="text-xs text-gray-400">YOU</span><span className="text-2xl font-bold text-orange-500">{battleState.playerScore}</span></div>
                 <div className="text-center"><div className="text-xs text-gray-400">Quarter {battleState.round}</div><div className="font-black text-xl text-blue-400">{battleState.currentStat}</div></div>
                 <div className="flex flex-col items-end"><span className="text-xs text-gray-400">CPU</span><span className="text-2xl font-bold text-red-500">{battleState.aiScore}</span></div>
             </div>
             <div className="flex-1 relative flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                 {battleState.phase === 'RESULT' ? (
                     <div className="animate-in zoom-in duration-300 flex flex-col items-center gap-4">
                         <div className="flex gap-8 items-center">
                            <div className="text-3xl font-black text-white">{battleState.lastResult.pVal}</div>
                            <div className="text-4xl font-bold text-gray-500">VS</div>
                            <div className="text-3xl font-black text-white">{battleState.lastResult.aVal}</div>
                         </div>
                         <div className={`text-2xl font-bold uppercase mt-4 ${battleState.lastResult.winner === 'PLAYER' ? 'text-green-500' : 'text-red-500'}`}>{battleState.lastResult.winner} WINS</div>
                         <Button onClick={resolveRound} className="mt-4 w-40">NEXT</Button>
                     </div>
                 ) : (
                     <div className="w-full h-full flex flex-col justify-end pb-32">
                         <div className="absolute top-0 left-0 w-full p-2 flex justify-center items-center gap-2 opacity-80">
                             <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden border border-gray-400">
                                 <img src={battleState.opponent.avatar} alt="OPP" />
                             </div>
                             <span className="text-xs text-gray-300 font-bold">{battleState.opponent.name}</span>
                         </div>

                         <div className="absolute top-12 left-0 w-full flex justify-center gap-2 opacity-70">
                             {battleState.aiDeck.filter(c => !battleState.usedAiIds.includes(c.id)).map((c, i) => (
                                 <div key={i} className="w-16 h-24 bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 rounded-lg shadow-lg"></div>
                             ))}
                         </div>
                         
                         <div className="text-center mb-4 text-white text-sm animate-pulse mt-auto">
                             Select {battleState.isDuo ? '2 Players' : '1 Player'} for {battleState.currentStat}
                         </div>

                         <div className="flex justify-center gap-2 flex-wrap">
                             {battleState.playerDeck.map(card => {
                                 if (battleState.usedPlayerIds.includes(card.id)) return null;
                                 const isSel = battleState.selection.includes(card.id);
                                 return <div key={card.id} className="transition-all hover:-translate-y-2"><Card card={card} size="md" isSelected={isSel} onClick={() => {
                                     const limit = battleState.isDuo ? 2 : 1;
                                     let newSel = [...battleState.selection];
                                     if (newSel.includes(card.id)) newSel = newSel.filter(id => id !== card.id);
                                     else if (newSel.length < limit) newSel.push(card.id);
                                     setBattleState(prev => ({...prev, selection: newSel}));
                                 }} activeSupports={battleState.playerSupports} /></div>
                             })}
                         </div>
                         <div className="flex justify-center mt-6"><Button disabled={battleState.selection.length !== (battleState.isDuo ? 2 : 1)} onClick={() => playRound(battleState.selection)} className="w-48 py-3 shadow-xl">LOCK IN</Button></div>
                     </div>
                 )}
             </div>
        </div>
      );
  };
  
  return (
    <div className="w-full h-[100dvh] bg-slate-950 font-sans select-none overflow-hidden flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-800 relative sm:max-w-full sm:border-none sm:shadow-none">
      <div className="flex-1 overflow-hidden relative">
          {gameState === 'START' && (
              <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
                <Trophy size={64} className="text-orange-500 mb-4" />
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">HOOPS <span className="text-orange-500">LEGENDS</span></h1>
                <Button onClick={createStarterPack} className="w-full max-w-xs py-4 text-xl shadow-orange-500/20 shadow-lg animate-pulse">START GAME</Button>
              </div>
          )}
          {gameState === 'TUTORIAL' && (
              <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
                  <h2 className="text-2xl font-bold text-orange-400 mb-4">Welcome GM!</h2>
                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white mb-6" placeholder="Coach Name..." value={player.name} onChange={(e) => setPlayer({...player, name: e.target.value})} />
                  <Button disabled={!player.name} onClick={() => completeTutorial(player.name)} className="w-full">Enter League</Button>
              </div>
          )}
          {gameState === 'MENU' && renderMenu()}
          {gameState === 'BATTLE_SELECT' && renderBattleSelection()}
          {gameState === 'BATTLE' && renderBattle()}
          {gameState === 'DRAFT_BOARD' && renderDraftBoard()}
          {gameState === 'DECK' && renderDeckEdit()}
          {gameState === 'CATALOGUE' && <CatalogueView player={player} selectedCard={selectedCard} setSelectedCard={setSelectedCard} trainCard={trainCard} combineCard={combineCard} />}
          {gameState === 'FORGE' && <ForgeView player={player} forgeCards={forgeCards} />}
          {gameState === 'STORE' && renderStore()}
          {gameState === 'SETTINGS' && (
              <div className="h-full bg-slate-900 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-6">Settings</h2>
                  <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center"><span>Manual Save</span><Button onClick={() => { localStorage.setItem('hoopsLegendsSave', JSON.stringify(player)); alert("Saved!"); }} variant="success" className="w-32"><Save size={16}/> Save</Button></div>
                  <Button onClick={() => setGameState('MENU')} variant="secondary" className="w-full mt-8">Back</Button>
              </div>
          )}
      </div>
      {['MENU', 'DECK', 'CATALOGUE', 'STORE'].includes(gameState) && (
          <div className="absolute bottom-0 w-full bg-slate-900 border-t border-slate-800 p-4 flex justify-center gap-8 text-xs text-gray-400 z-50">
              <button onClick={() => setGameState('MENU')} className={`flex flex-col items-center gap-1 ${gameState === 'MENU' ? 'text-orange-500' : ''}`}><Menu size={20} /> Home</button>
              <button onClick={() => setGameState('DECK')} className={`flex flex-col items-center gap-1 ${gameState === 'DECK' ? 'text-orange-500' : ''}`}><Users size={20} /> Deck</button>
              <button onClick={() => setGameState('CATALOGUE')} className={`flex flex-col items-center gap-1 ${gameState === 'CATALOGUE' ? 'text-orange-500' : ''}`}><Zap size={20} /> Cards</button>
              <button onClick={() => setGameState('STORE')} className={`flex flex-col items-center gap-1 ${gameState === 'STORE' ? 'text-orange-500' : ''}`}><ShoppingBag size={20} /> Shop</button>
          </div>
      )}
      {packResult && <PackOpenModal cards={packResult} onClose={handleClosePack} />}
    </div>
  );
}
