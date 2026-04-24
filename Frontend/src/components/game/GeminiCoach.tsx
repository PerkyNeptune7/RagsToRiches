import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface GeminiCoachProps {
    context: {
        situationId: number;
        choiceIndex: number;
        quality: string;
    } | null;
    onAsked?: () => void;
    autoExplain?: boolean;
}

// HARDCODED HINTS DICTIONARY
// Keys are formatted as "situationId_choiceIndex"
// Example: "1_0" means Situation 1, Choice 0.
const HARDCODED_HINTS: Record<string, string> = {
    // --- Situation 1: textbooks ---

    // --- Situation 2: account ---
    "2_0": "Great choice! A TFSA is a great way to accumulate wealth while also not needing to pay taxes on the amount saved. This is a must have for any Canadian citizen. ",
    "2_1": "Not the best choice for students right now. Although an RRSP is an essential savings account to have, you might find more use from other accounts as a student. An RRSP is a tax-deferred account, which depends on your income bracket. Unless you're earning more than the basic personal amount (BPA), you don't have any taxes to pay on your income at all.",
    "2_2": "This is the best choice! A credit card is great for building your credit score, which in turn allows you to purchase a car and home later on in life. Use it responsibly and it will open many doors for you, even beyond these desires.",
    "2_3": "An RESP is a Registered Education Savings Plan. This is what a parent uses to help fund their child's education. Having this now certainly won't be helpful until way later! ",

    // --- Situation 3: scam ---
    "3_0": "This is a classic example of a pyramid scheme. It relies on people to buy into a proposed product or service that doesn't exist. It often has victims spread the scam to others which allows the initial victim to regain a portion of what was lost.",
    "3_1": "This is a classic example of a pyramid scheme. It relies on people to buy into a proposed product or service that doesn't exist. It often has victims spread the scam to others which allows the initial victim to regain a portion of what was lost.",
    
    // --- Situation 4: food ---
    "4_1": "While it might be tempting to buy a nice mocktail or some other exotic drink, restaurants often make a significant portion of their profit from their beverages. Sticking with something cheap—or better yet, free—is a much more sound option.",
    "4_2": "While it might be tempting to buy a nice mocktail or some other exotic drink, restaurants often make a significant portion of their profit from their beverages. Sticking with something cheap—or better yet, free—is a much more sound option.",

    // --- Situation 5: risk ---
    "5_0": "While it might be tempting to take a risk and expect a similar reward, it's usually better to ensure your hard-earned money grows securely. You can never guarantee an ROI from a high-risk investment. ",
    "5_1": "While it might be tempting to take a risk and expect a similar reward, it's usually better to ensure your hard-earned money grows securely. You can never guarantee an ROI from a high-risk investment. That said, it was a very wise decision to invest a small amount of money to see if you could generate an ROI. Well played!",
    "5_3": "Crypto investment is notorious for being extremely volatile. Many financial advisors would warn you to be cautious of using it for investments. Better to build wealth slowly, and not act rash."

    // --- Situation 6: Stock Market Drop ---
    "6_0": "If you've already bought shares in this stock, you need to be patient and keep yourself informed. The key here is to not make rash decisions, but to seek out help in the face of jargon. Consulting an advisor is very useful as well as they are experts at explaining technical terms to those who are unfamiliar with financial concepts.",
    "6_1": "If you've already bought shares in this stock, you need to be patient and keep yourself informed. The key here is to not make rash decisions, but to seek out help in the face of jargon. Consulting an advisor is very useful as well as they are experts at explaining technical terms to those who are unfamiliar with financial concepts.",
    "6_2": "If you've already bought shares in this stock, you need to be patient and keep yourself informed. The key here is to not make rash decisions, but to seek out help in the face of jargon. Consulting an advisor is very useful as well as they are experts at explaining technical terms to those who are unfamiliar with financial concepts.",
    "6_3": "If you've already bought shares in this stock, you need to be patient and keep yourself informed. The key here is to not make rash decisions, but to seek out help in the face of jargon. Consulting an advisor is very useful as well as they are experts at explaining technical terms to those who are unfamiliar with financial concepts.",

    // --- Situation 7: Coffee Budget ---
    "7_0": "From a pure savings point of view, this might be the best option. However, it often leads to a deprivation effect, in which people end up splurging later on. Good budgeting is control, not restriction.",
    "7_1": "Nice choice! Creating a budget that allows for small purchases allows you to save a greater amount while also making sure you don't overspend.",
    "7_2": "Just because something doesn't feel like a lot doesn't mean that your expenses don't add up. $15/day adds up to $105/week, that's $420/month! A lot more compared to the $100/month from a budget of $25/week.",

    // --- Situation 8: Investment Choices ---
    "8_0": "Though this might seem like a good idea, and sometimes it actually is, investing in a group of companies belonging to the same category is known as “sector concentration”. Limiting your investments to one market sector means a high potential risk if anything happens to this market.",
    "8_1": "Though this might seem like a good idea, and sometimes it even is, investing in one company, even if it is highly successful, is an example of “stock picking”. You would be making a safer investment by diversifying your money, using an ETF or mutual fund.",
    "8_2": "Nice choice! A mutual is a great way to allow for diversification. These funds act like a basket of several investments, reducing the impact of any single poor performance from a stock or bond. They are low-risk, and can be powerful “set-it-and-forget-it” investments.",

    // --- Situation 9: Scholarship Essay / Competition ---
    "9_0": "Though this might be the best choice for your finances, it also takes a toll on your happiness. Keep in mind your mental health is also very important for you as a student.",
    "9_1": "Balance is important for a student, so just trying your best while managing a full plate is also good!",
    "9_2": "AI might be a revolutionary tool, but a human writer who puts in the time making a work that is personal and well-organized will always produce a better final product. Most people have also started to recognize AI-written text, so it doesn’t help you win, it might end up hurting your academic career.",
    "9_3": "Not a bad choice at all. Prioritizing your mental health is a great choice to make, even if you did lose out on potential rewards. Sometimes, you need to put your well-being before your perceived idea of success.",

    // --- Situation 10: Bonus Money ---
    "10_0": "It's certainly tempting to splurge, but spending all $500 from your bonus isn’t a wise decision. You should always treat yourself, but have limits. Attaining wealth means building the right habits, and restraint is one such habit to have.",
    "10_1": "Not a bad choice, but you should also consider treating yourself. Life is no fun when we save every penny and deny ourselves little pleasures.",
    "10_2": "Great choice! Saving most of your bonus allows your wealth to grow while also allowing you to enjoy some well-earned rest. Understanding that balance is important is essential to earning money and being happy!",

     // --- Situation 11: OSAP & Bank Loan ---
    "11_0": "Excellent choice! Paying your mandatory expenses first ensures you stay enrolled, and budgeting the rest carefully minimizes the amount of debt you'll carry forward.",
    "11_1": "This is a dangerous path. Student loans are meant for education and living expenses, not free money. Spending it freely now means taking on unnecessary debt with interest that will haunt you later.",
    "11_2": "Investing borrowed money (leveraged investing) is extremely high risk. If the market dips, you still owe the bank their money plus interest, AND you won't have enough to pay your tuition!",

    // --- Situation 12: Entrance Scholarship ---
    "12_0": "A very responsible choice. Putting it directly into your school account guarantees it goes towards its intended purpose without the temptation to spend it.",
    "12_1": "Good choice! Earning a little bit of interest before tuition is due is a smart way to make your money work for you, as long as you don't spend the principal.",
    "12_2": "While school supplies are necessary, make sure you aren't overspending just because you have the cash. Always budget your scholarships carefully.",
    "12_3": "This is a poor use of scholarship funds. Treating financial aid as 'extra' money can leave you short when tuition or textbook bills finally arrive.",

    // --- Situation 13: Subscription ---
    "13_0": "If it provides significant value for your education, keeping it might be worth it, but you should always review if it fits within your overall budget.",
    "13_1": "Smart move! Shopping around for affordable alternatives allows you to get the same value while freeing up money in your budget for other needs.",
    "13_2": "While applying for awards is always encouraged, relying on them to pay for a subscription isn't a reliable budgeting strategy.",
    "13_3": "Working more hours to pay for a subscription can lead to burnout and negatively impact your academic performance. Evaluate your expenses before sacrificing your time.",

    // --- Situation 14: Transit Charge (PRESTO) ---
    "14_0": "Great choice! Financial mindfulness involves tracking your expenses and questioning discrepancies. You turned 20, meaning you may no longer qualify for a youth discount!",
    "14_1": "Ignoring discrepancies in your expenses leads to 'mindless spending'. These small extra fees add up significantly over time.",
    "14_2": "Taking public transit is generally good for saving money, but you still need to ensure you are being charged the correct fare for your age bracket.",

    // --- Situation 15: Birthday Money ($500) ---
    "15_0": "Investing in REITs (Real Estate Investment Trusts) is a solid way to diversify your portfolio and earn steady dividends over a 3-year horizon.",
    "15_1": "Penny stocks and startups are highly volatile and speculative. You run a massive risk of losing your entire $500 investment.",
    "15_2": "Jewelry and art are difficult to liquidate and often lose value immediately after purchase. They are not reliable wealth-building investments for a student.",
    "15_3": "Leaving it in your checking account for day-to-day expenses is a missed opportunity for growth, but it keeps you out of debt.",

    // --- Situation 16: Budgeting Strategies ---
    "16_0": "Finding a side hustle increases your income, but can severely drain your happiness and study time if you aren't careful with your limits.",
    "16_1": "Allocating money only for wants and needs ignores savings completely. You must always 'Pay Yourself First'.",
    "16_2": "Excellent! The 50/30/20 rule (Needs/Wants/Savings) provides a balanced structure that ensures you enjoy life while still securing your financial future.",
    "16_3": "The 70/20/10 rule is another great streamlined approach, prioritizing a solid 20% for savings and investments while giving flexibility to your living expenses.",

    // --- Situation 17: Budgeting for Fun ---
    "17_0": "Depriving yourself completely of fun will lead to burnout and the 'deprivation effect', where you eventually snap and binge-spend.",
    "17_1": "10% might be a little tight for discretionary spending depending on your overall income, but it enforces strict discipline.",
    "17_2": "Perfect! In the 50/30/20 budget, allocating 30% to 'Wants' gives you enough room to enjoy your university life and manage stress without feeling guilty.",
    "17_3": "Spending 40% on fun is too high for a standard budget. It will likely cut into your essential needs or, worse, your savings.",

    // --- Situation 18: Filing Taxes ---
    "18_0": "Paying $200 for a simple student tax return is a massive waste of money. Student returns are very straightforward.",
    "18_1": "Asking for help is a great way to learn, but doing it yourself ensures you build the actual skill of financial literacy.",
    "18_2": "The best choice! Filing yourself using free software like NETFILE or TurboTax Free saves money, builds your financial knowledge, and ensures you get your refund quickly.",

    // --- Situation 19: Tax Slips ---
    "19_0": "Mistake! By only entering your T4, you are missing out on Tuition Tax Credits from your T2202. These credits can significantly reduce your tax bill or be carried forward to future years.",
    "19_1": "Excellent! Entering both your T4 (income) and your T2202 (tuition) ensures you accurately report your earnings while claiming the valuable tuition credits you are entitled to.",

    // --- Situation 20: Downtown Transit Again ---
    "20_0": "The TTC is by far the most cost-effective option, keeping your daily expenses low.",
    "20_1": "Taking an Uber both ways is a luxury expense that quickly eats away at your budget if done often.",
    "20_2": "A decent compromise between saving money on the way there and getting home safely and quickly later.",
    "20_3": "Carpooling is a great way to save money and hang out with friends at the same time!",

    // --- Situation 22: Closing Credit Cards ---
    "22_0": "Well done! You should never close your first credit card. 15% of your credit score is determined by the length of your credit history. Keeping your first account open will continue to boost your credit score.",
    "22_1": "Not quite! You should never close your first credit card. 15% of your credit score is determined by the length of your credit history. Keeping your first account open will continue to boost your credit score.",
    "22_2": "Not quite! Reducing your costs is always good, but closing a credit card account can impact your credit score significantly. Though a $60 annual fee sounds like a lot, realistically it's only $5/month.",
    "22_3": "This is the best choice! Having more accounts can build a longer credit score and using them responsibly with auto-pay builds good payment history, which accounts for 35% of your payment history.",

    // --- Situation 23: Credit Utilization ---
    "23_0": "While paying the full balance avoids interest, using a high percentage of your limit can actually lower your credit score. Lenders view high utilization as a sign of financial stress, even if you intend to pay it back.",
    "23_1": "Keeping a card at a zero balance avoids debt, but it doesn't provide the data needed to calculate a credit score. To build a history, you need to show active, responsible use over a long period.",
    "23_2": "This is the 'sweet spot' for credit utilization that shows lenders you can use credit without overextending yourself. Keeping your balance in this range is one of the fastest ways to see a positive impact on your score.",
    "23_3": "Crossing the 50% threshold often signals to credit bureaus that you are becoming overly reliant on borrowed money. This level of usage can lead to a dip in your score, as it suggests a higher risk of default.",

    // --- Situation 24: Investment Funds ---
    "24_0": "Often called 'all-in-one' funds, these automatically balance stocks and bonds to match a specific risk level. This is an excellent 'set it and forget it' option that manages your diversification for you while you focus on your studies.",
    "24_1": "Investing in very small companies can lead to high growth, but it often comes with significant price swings and higher risk. For a student with limited capital, the volatility of these funds might be more stress than the potential reward is worth.",
    "24_2": "These advanced tools use debt to amplify daily returns, which can lead to massive losses just as quickly as gains. They require constant monitoring and sophisticated timing, making them a poor fit for someone busy with coursework and exams.",

    // --- Situation 25: Handling Debt ---
    "25_0": "While this eliminates interest charges immediately, it doesn't help you build the independent financial habits needed for life after graduation. Relying on a safety net can sometimes prevent you from learning how to adjust your own budget to handle unexpected shortfalls.",
    "25_1": "This disciplined approach prioritizes high-interest debt and helps you regain control of your finances quickly. By allocating a set percentage of your earnings, you clear the balance while still leaving room for other essential student expenses.",
    "25_2": "This is the most expensive way to handle debt because the remaining balance continues to compound at a high interest rate. It can take years to pay off a small amount this way, potentially costing you hundreds of dollars in extra charges.",

    // --- Situation 26: Emergency Savings Location ---
    "26_0": "While GICs offer guaranteed returns, they typically lock your money away for months or even years at a time. This makes them a risky choice for emergencies, as you might face penalties or be unable to access your cash when an urgent expense actually hits.",
    "26_1": "A High-Interest Savings Account at a traditional bank offers immediate access to your cash and is backed by the CDIC. This is a very secure 'gold standard' for students, though the interest rate might be slightly lower than what digital-only competitors offer.",
    "26_2": "Many fintech apps offer the highest interest rates and great mobile tools, which can help your savings grow faster. However, you must verify that they use 'pass-through' insurance from a partner bank to ensure your money is protected if the company itself fails.",

    // --- Situation 27: Windfall Money ---
    "27_0": "Using a windfall for leisure is tempting, but spending the entire amount can quickly derail the financial progress you’ve recently made. While a small treat is fine, allocating the full $800 to entertainment leaves you without a buffer for upcoming student expenses.",
    "27_1": "This is a practical move that ensures you have liquidity for day-to-day costs like groceries, transit, or textbooks. Maintaining a healthy balance in your chequing account helps you avoid overdraft fees and prevents you from having to dip back into your savings.",
    "27_2": "Reinvesting the money allows you to take advantage of compounding, which can significantly grow your wealth over the next few years. However, make sure you already have enough 'walking around money' in your chequing account so you don't have to sell your investments if a bill comes due.",

    // --- Situation 28: Emergency Expense ---
    "28_0": "This is exactly what an emergency fund is designed for—handling urgent, unplanned expenses without going into debt. Using these savings allows you to replace your laptop immediately and continue your coursework without any financial 'hangover.'",
    "28_1": "Using a credit card for a large purchase you can't pay off right away will trap you back in a cycle of high-interest debt. This choice effectively increases the price of the laptop as interest accumulates each month you carry the balance.",
    "28_2": "Selling investments during an emergency can be costly if the market is down, as it forces you to lock in a loss. Additionally, you miss out on future growth and compound interest that your money would have earned if left untouched.",
    "28_3": "Taking out a loan for a consumer purchase adds a new monthly obligation to your student budget, which is already stretched thin. Between interest rates and potential processing fees, you'll end up paying significantly more than the laptop’s actual sticker price.",

    // --- Situation 29: Credit Card Payment ---
    "29_0": "This is the ideal move because it keeps your utilization low while ensuring you don't pay a cent in interest. Consistently clearing your balance in full demonstrates to lenders that you are a highly responsible borrower.",
    "29_1": "Even though $50 seems like a small amount, leaving any balance past the due date will trigger interest charges on the entire bill. This habit can lead to unnecessary costs and prevents you from maximizing the benefits of your credit card.",
    "29_2": "This is a trap that many fall into, as it protects your 'on-time payment' status but subjects you to expensive interest rates. Over time, paying only the minimum makes even small purchases significantly more expensive than their original price.",

    // --- Situation 30: Boosting Credit for Renting ---
    "30_0": "Overpaying to create a negative balance can help lower your credit utilization, which is a smart way to stay well below your limit. However, it isn't the best strategy for a quick boost, as the most important factor is simply showing a consistent history of on-time, full payments.",
    "30_1": "Opening multiple accounts in a short window triggers 'hard inquiries,' which can actually cause your credit score to drop temporarily. This also lowers the average age of your accounts, making you look less stable to a potential landlord right when you need to look your best.",
    "30_2": "Consistency is the most powerful factor in your credit score, as a perfect payment history accounts for a huge portion of the calculation. By maintaining low utilization and zero late payments, you prove to a landlord that you are a reliable and low-risk tenant.",

    // --- Situation 31: Paycheque Allocation ---
    "31_0": "Splitting your income strictly between wants and needs completely ignores your future. You should always prioritize savings before discretionary spending to ensure long-term stability.",
    "31_1": "Excellent! \"Paying yourself first\" by immediately putting 10% into savings/investments guarantees that you build wealth before you have the chance to accidentally spend it.",

    // --- Situation 32: Roommate Short on Rent ---
    "32_0": "Covering the full amount without questions is dangerous. It drains your own finances and sets a precedent where your roommate might rely on you again, hurting your long-term relationship and savings.",
    "32_1": "While it protects your money, refusing entirely might lead to an eviction or extreme stress if the rent isn't paid. It's a tough situation for your happiness and living arrangement.",
    "32_2": "A good compromise! Helping out partially reduces the immediate financial hit to you while still encouraging your roommate to take responsibility.",
    "32_3": "The smartest choice! If you must lend a large sum, treating it like a formal loan with a written repayment plan protects your money and sets clear boundaries.",

    // --- Situation 33: Vacation Savings ---
    "33_0": "While simple, expecting everyone to save individually often leads to someone falling short when it's time to book. It lacks accountability.",
    "33_1": "Great choice! A dedicated group savings account ensures transparency and forces everyone to stick to the plan through automated, bi-weekly contributions.",
    "33_2": "A Joint Non-Registered investment account is a poor choice for a short-term goal like a vacation. Market volatility could mean you actually lose money right before the trip!",

    // --- Situation 34: Fake Money Scam ---
    "34_0": "Huge mistake! Scammers often create a false sense of urgency to prevent you from checking the bills. You just lost your item and gave away your own real money as change.",
    "34_1": "Rejecting the deal completely keeps you safe, though it means you'll have to find a new buyer, delaying your profit.",
    "34_2": "Perfect! Inspecting large bills is crucial. By demanding an e-transfer, you completely bypassed the counterfeit risk and secured the funds safely.",

    // --- Situation 35: Influencer Marketing ---
    "35_0": "This is a classic marketing trap. Just because something is 'on sale' doesn't mean you need it. Buying things purely because of influencer FOMO drains your vacation savings.",
    "35_1": "Watching more videos will only increase the temptation to buy things you don't need. This is a recipe for mindless consumerism.",
    "35_2": "Excellent! Taking a step back implements 'financial mindfulness'. It gives you time to decide if you actually need the item or if you're just experiencing FOMO.",

    // --- Situation 36: Exam-Season Investing ---
    "36_0": "While index funds are generally safe long-term, they still fluctuate daily. If you need this money soon for a specific goal, stock market volatility might cause unnecessary stress.",
    "36_1": "The best choice! Money Market Funds provide steady, extremely low-risk returns. They are perfect for parking cash you need in the short-term so you can focus on exams without worrying about market crashes.",
    "36_2": "Hedge funds are complex, high-risk, and completely inappropriate for a student's short-term savings. They require high minimums and lock up your money.",
    "36_3": "Leveraged ETFs are incredibly dangerous for short-term holds. They use debt to amplify returns, meaning a bad market day could wipe out your savings completely.",

    // --- Situation 37: Credit Limit Increase ---
    "37_0": "Accepting it is fine, but only if you have the discipline not to change your spending habits.",
    "37_1": "This is the trap! A higher limit is not free money. Spending more just because you can will lead to bad debt.",
    "37_2": "Declining is a safe move if you know you struggle with impulse control, but it doesn't help build your credit utilization ratio.",
    "37_3": "The best move! Accepting a higher limit but keeping your spending the same lowers your 'Credit Utilization Ratio', which boosts your credit score.",

    // --- Situation 38: Post-Grad Bank Accounts ---
    "38_0": "Staying put out of convenience will cost you. Once your student status expires, traditional banks will start charging you high monthly fees.",
    "38_1": "A good option! Shopping around ensures you find a bank that fits your new professional lifestyle without ridiculous fees.",
    "38_2": "A strong choice! Fintech banks often have zero fees and great digital tools, though you should ensure they meet all your specific banking needs (like ATM access).",
    "38_3": "A trap! 'Product bundles' often force you to hold multiple unnecessary products (like a specific credit card or minimum balance) just to waive a fee.",

    // --- Situation 39: Final Pre-Vacation Investing ---
    "39_0": "Sector ETFs concentrate your risk in one industry. If that specific sector drops right before your trip, your vacation fund drops with it.",
    "39_1": "Stock picking is incredibly risky, especially for short-term goals. You could easily lose your money right before you need it.",
    "39_2": "A DRIP automatically buys more shares, which is great for long-term growth, but it ties up your cash when you actually need liquidity for your upcoming trip.",
    "39_3": "Perfect! Since your goal is arriving very soon, shifting to wealth preservation (Cash ETFs and GICs) protects your principal from market crashes while still earning a little interest."

};

const DEFAULT_HINT = "Remember to always weigh the cost versus the long-term benefit. Avoid unnecessary debt!";

export const GeminiCoach: React.FC<GeminiCoachProps> = ({ context, onAsked, autoExplain }) => {
    const [explanation, setExplanation] = useState<string | null>(null);

    const requestExplanation = () => {
        if (!context) return;

        // notify parent that the coach was invoked (for continue-button logic)
        onAsked?.();

        const key = `${context.situationId}_${context.choiceIndex}`;
        const hint = HARDCODED_HINTS[key] || DEFAULT_HINT;
        
        setExplanation(hint);
    };

    // Reset explanation if the context changes (new card)
    useEffect(() => {
        setExplanation(null);
    }, [context]);

    // Automatically trigger explanation on worst choices when requested
    useEffect(() => {
        if (autoExplain && context && !explanation) {
            requestExplanation();
        }
    }, [autoExplain, context, explanation]);

    if (!context) return null;

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-6 px-4">
            <AnimatePresence mode="wait">
                {!explanation ? (
                    <motion.button
                        key="ask-button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={requestExplanation}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-full shadow-lg transition-all active:scale-95"
                    >
                        <Lightbulb className="w-5 h-5" />
                        Ask Coach Why?
                    </motion.button>
                ) : (
                    <motion.div
                        key="explanation-box"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-slate-800/80 backdrop-blur-sm border-2 border-amber-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-amber-500">Coach&apos;s Insight</span>
                        </div>

                        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                            &quot;{explanation}&quot;
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
