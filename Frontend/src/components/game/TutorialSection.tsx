import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, ExternalLink, ChevronLeft, CheckCircle2,
  LineChart, Target, PieChart, TrendingDown, Landmark,
  ShieldAlert, PiggyBank, FileText, CreditCard,
  DollarSign, ArrowUp, Wallet, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { learnContent, type LearnCategory } from '@/data/learnContent';

// Helper component for dynamic icon mapping
const IconMap: Record<string, React.ElementType> = {
  Target: Target,
  LineChart: LineChart,
  PieChart: PieChart,
  TrendingDown: TrendingDown,
  Landmark: Landmark,
  ShieldAlert: ShieldAlert,
  PiggyBank: PiggyBank,
  FileText: FileText,
  CreditCard: CreditCard,
};

export const TutorialSection = () => {
  const [activeCategory, setActiveCategory] = useState<LearnCategory | null>(null);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans pb-32">
      {/* ========================================= */}
      {/* 1. BACKGROUND DECORATION (Matches Home)   */}
      {/* ========================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

        <FloatingElement className="absolute top-[10%] left-[5%] text-emerald-500/10" delay={0} duration={8}><TrendingUp className="w-16 h-16 rotate-[-12deg]" /></FloatingElement>
        <FloatingElement className="absolute top-[28%] left-[18%] text-emerald-300/10" delay={1} duration={9}><PieChart className="w-12 h-12" /></FloatingElement>
        <FloatingElement className="absolute bottom-[20%] left-[8%] text-emerald-400/10" delay={1.5} duration={7}><PiggyBank className="w-14 h-14 rotate-[12deg]" /></FloatingElement>
        <FloatingElement className="absolute top-[15%] right-[8%] text-gold/10" delay={2} duration={8}><Target className="w-12 h-12" /></FloatingElement>
        <FloatingElement className="absolute bottom-[25%] right-[10%] text-blue-400/10" delay={0.5} duration={7}><Wallet className="w-16 h-16 rotate-[-6deg]" /></FloatingElement>

        <RisingSymbol symbol={<DollarSign />} left="10%" delay={0} size={18} />
        <RisingSymbol symbol={<ArrowUp />} left="90%" delay={2} size={14} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            /* ========================================= */
            /* GRID VIEW                                 */
            /* ========================================= */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-16 pt-8">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-900/50 rounded-2xl mb-4 border border-white/10 backdrop-blur-md shadow-lg">
                  <Lightbulb className="w-8 h-8 text-gold" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl mb-4 text-white font-black tracking-tight drop-shadow-md">
                  Learn Finance
                </h2>
                <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto font-medium">
                  Master these core concepts to become financially literate and win the game!
                </p>
              </div>

              {/* Concept Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {learnContent.map((category, index) => {
                  const IconComponent = IconMap[category.cardInfo.iconName] || Target;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        'group relative p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 cursor-pointer',
                        'bg-emerald-950/60 hover:bg-emerald-900/80 shadow-xl flex flex-col',
                        category.cardInfo.borderColor,
                        category.cardInfo.hoverBorder
                      )}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn('p-3 rounded-2xl shadow-inner', category.cardInfo.bgColor, category.cardInfo.color)}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className={cn('font-display text-2xl font-bold', category.cardInfo.color)}>
                          {category.title}
                        </h3>
                      </div>

                      <p className="text-emerald-100/80 mb-6 text-sm leading-relaxed flex-grow">
                        {category.cardInfo.description}
                      </p>

                      <ul className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5 mt-auto">
                        {category.cardInfo.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs font-medium text-emerald-200/70">
                            <CheckCircle2 className={cn('w-4 h-4 mt-0.5 flex-shrink-0', category.cardInfo.color)} />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pro Tips Footer */}
              <div className="max-w-3xl mx-auto">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-emerald-900/50 border border-primary/20 backdrop-blur-md shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="bg-gold/20 p-2 rounded-lg">
                      <Lightbulb className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">Pro Tip</h3>
                  </div>
                  <p className="text-emerald-100/80 text-lg leading-relaxed relative z-10">
                    In the game, try to maintain a balance between spending and saving.
                    While income cards add to your budget, <span className="text-sky-400 font-bold">savings</span> and{' '}
                    <span className="text-violet-400 font-bold">investment</span> cards earn you more points!
                    Smart financial decisions lead to higher scores.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================= */
            /* DETAILED VIEW                             */
            /* ========================================= */
            <motion.div
              key="detailed-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto pt-8"
            >
              <button
                onClick={() => setActiveCategory(null)}
                className="mb-8 flex items-center gap-2 text-emerald-300 hover:text-emerald-100 transition-colors font-medium bg-emerald-900/40 py-2 px-4 rounded-xl border border-emerald-500/20"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Topics
              </button>

              <div className="space-y-8">
                {/* Category Header */}
                <div>
                  <h1 className={cn("font-display text-4xl md:text-5xl mb-4 font-black tracking-tight drop-shadow-md", activeCategory.cardInfo.color)}>
                    {activeCategory.title}
                  </h1>
                  {activeCategory.intro && (
                    <p className="text-xl text-emerald-100/80 font-medium leading-relaxed bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/10 shadow-inner">
                      {activeCategory.intro}
                    </p>
                  )}
                </div>

                {/* Sections */}
                <div className="space-y-6">
                  {activeCategory.sections.map((section, idx) => (
                    <div key={idx} className={cn("bg-emerald-950/60 p-6 md:p-8 rounded-3xl border backdrop-blur-md shadow-xl", activeCategory.cardInfo.borderColor)}>
                      <h3 className={cn("font-display text-2xl font-bold mb-6 pb-2 border-b border-emerald-500/20", activeCategory.cardInfo.color)}>
                        {section.heading}
                      </h3>
                      <div className="space-y-4">
                        {section.content.map((paragraph, pIdx) => (
                          <p 
                            key={pIdx} 
                            className="text-emerald-100/80 text-lg leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong className="text-emerald-100 font-bold">$1</strong>')
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table rendering if exists */}
                {activeCategory.table && (
                  <div className={cn("bg-emerald-950/60 rounded-3xl border backdrop-blur-md shadow-xl overflow-hidden mt-8", activeCategory.cardInfo.borderColor)}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={cn("bg-opacity-20", activeCategory.cardInfo.bgColor)}>
                            {activeCategory.table.headers.map((header, i) => (
                              <th key={i} className={cn("p-4 border-b border-emerald-500/20 font-bold", activeCategory.cardInfo.color)}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeCategory.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-emerald-800/30 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-4 border-b border-emerald-500/10 text-emerald-100/80">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Resources / Links */}
                {activeCategory.links && activeCategory.links.length > 0 && (
                  <div className="mt-12 bg-emerald-900/40 p-6 md:p-8 rounded-3xl border border-emerald-500/20">
                    <h4 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <ExternalLink className={cn("w-5 h-5", activeCategory.cardInfo.color)} />
                      Additional Resources
                    </h4>
                    <ul className="space-y-3">
                      {activeCategory.links.map((link, lIdx) => {
                        let displayUrl = link;
                        try {
                          const urlObj = new URL(link);
                          displayUrl = urlObj.hostname + (urlObj.pathname.length > 1 ? '/...' : '');
                        } catch(e) {}
                        
                        return (
                          <li key={lIdx}>
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={cn("hover:underline break-all transition-colors inline-flex items-center gap-1 group", activeCategory.cardInfo.color)}
                            >
                              <span>{displayUrl}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS (Background Animations) ---

const FloatingElement = ({ children, className, delay, duration = 6 }: { children: ReactNode, className?: string, delay: number, duration?: number }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

const RisingSymbol = ({ symbol, left, delay, size }: { symbol: ReactNode, left: string, delay: number, size: number }) => (
  <motion.div
    className="absolute bottom-[-50px] text-emerald-500/20"
    style={{ left, fontSize: size }}
    animate={{
      y: [-50, -800],
      opacity: [0, 0.5, 0],
      x: [0, Math.random() * 50 - 25]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
      delay: delay
    }}
  >
    {symbol}
  </motion.div>
);
