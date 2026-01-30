import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingDown, 
  PiggyBank, 
  LineChart,
  Target,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const concepts = [
  {
    title: 'Income',
    icon: <DollarSign className="w-8 h-8" />,
    color: 'text-income',
    bgColor: 'bg-income/10',
    borderColor: 'border-income/30',
    description: 'Money you earn from jobs, allowance, or gifts. This is the foundation of your budget!',
    tips: ['Track all income sources', 'Look for ways to increase earnings', 'Save a portion of every paycheck'],
  },
  {
    title: 'Expenses',
    icon: <TrendingDown className="w-8 h-8" />,
    color: 'text-expense',
    bgColor: 'bg-expense/10',
    borderColor: 'border-expense/30',
    description: 'Money you spend on needs and wants. Smart spending means knowing the difference!',
    tips: ['Needs vs wants - know the difference', 'Track every expense', 'Look for discounts and deals'],
  },
  {
    title: 'Savings',
    icon: <PiggyBank className="w-8 h-8" />,
    color: 'text-savings',
    bgColor: 'bg-savings/10',
    borderColor: 'border-savings/30',
    description: 'Money set aside for future goals and emergencies. Pay yourself first!',
    tips: ['Aim to save 20% of income', 'Build an emergency fund', 'Set specific savings goals'],
  },
  {
    title: 'Investments',
    icon: <LineChart className="w-8 h-8" />,
    color: 'text-investment',
    bgColor: 'bg-investment/10',
    borderColor: 'border-investment/30',
    description: 'Make your money work for you! Investments can grow over time through compound interest.',
    tips: ['Start early - time is your friend', 'Diversify your portfolio', 'Learn before you invest'],
  },
];

const budgetRules = [
  { rule: '50/30/20 Rule', description: '50% needs, 30% wants, 20% savings' },
  { rule: 'Pay Yourself First', description: 'Save before you spend' },
  { rule: 'Emergency Fund', description: '3-6 months of expenses saved' },
  { rule: 'Avoid Debt', description: "Don't spend more than you earn" },
];

export const TutorialSection = () => {
  return (
    <div className="min-h-screen bg-background p-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl mb-3 text-gradient-gold">Learn Budgeting</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Master these core concepts to become financially literate and win the game!
        </p>
      </motion.div>

      {/* Concept Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-6 rounded-2xl border-2',
              concept.bgColor,
              concept.borderColor
            )}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={cn('p-3 rounded-xl', concept.bgColor, concept.color)}>
                {concept.icon}
              </div>
              <h3 className={cn('font-display text-2xl', concept.color)}>
                {concept.title}
              </h3>
            </div>
            <p className="text-foreground mb-4">{concept.description}</p>
            <ul className="space-y-2">
              {concept.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className={cn('w-4 h-4 mt-0.5 flex-shrink-0', concept.color)} />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Budget Rules */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="font-display text-2xl text-center">Golden Rules of Budgeting</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {budgetRules.map((item, index) => (
            <motion.div
              key={item.rule}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <h4 className="font-semibold text-primary mb-1">{item.rule}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-2xl mx-auto mt-12"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-investment/10 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h3 className="font-display text-xl">Pro Tip</h3>
          </div>
          <p className="text-muted-foreground">
            In the game, try to maintain a balance between spending and saving. 
            While income cards add to your budget, <span className="text-savings font-semibold">savings</span> and{' '}
            <span className="text-investment font-semibold">investment</span> cards earn you more points! 
            Smart financial decisions lead to higher scores.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
