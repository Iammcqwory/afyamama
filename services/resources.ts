
export interface Milestone {
  week: number;
  title: string;
  sizeDesc: string;
  description: string;
  tips: string[];
}

export interface Article {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  category: 'maternal' | 'pediatric' | 'nutrition' | 'safety';
  icon?: string;
}

export const PREGNANCY_MILESTONES: Milestone[] = [
  {
    week: 4,
    title: "The Beginning",
    sizeDesc: "Poppy Seed",
    description: "Implantation has occurred. This is often when a positive pregnancy test is first possible.",
    tips: ["Start taking prenatal vitamins", "Avoid alcohol and smoking", "Stay hydrated"]
  },
  {
    week: 8,
    title: "Major Development",
    sizeDesc: "Raspberry",
    description: "Baby's heartbeat is detectable, and fingers and toes are starting to form.",
    tips: ["Book your first prenatal appointment", "Eat small frequent meals for morning sickness", "Rest as much as you need"]
  },
  {
    week: 12,
    title: "First Trimester Milestone",
    sizeDesc: "Lime",
    description: "Baby is fully formed! Most vital organs and body parts are in place.",
    tips: ["Consider first trimester screening", "Skin changes might start appearing", "Stay active with gentle walks"]
  },
  {
    week: 16,
    title: "The Glow",
    sizeDesc: "Avocado",
    description: "You might feel baby's first movements (quickening) soon. Baby's hearing is developing.",
    tips: ["Look for comfortable maternity clothes", "Monitor your weight gain", "Enjoy the 'second trimester energy'"]
  },
  {
    week: 20,
    title: "Halfway Point",
    sizeDesc: "Banana",
    description: "You are halfway there! Baby can now swallow and has unique fingerprints.",
    tips: ["Schedule your anatomy scan", "Start thinking about the nursery", "Watch for leg cramps"]
  },
  {
    week: 24,
    title: "Viability Milestone",
    sizeDesc: "Corn Cob",
    description: "Baby has a chance of survival if born now. Their lungs are developing branches.",
    tips: ["Check for gestational diabetes", "Moisturize your belly to help with itching", "Keep track of baby's kicks"]
  },
  {
    week: 28,
    title: "Third Trimester Begins",
    sizeDesc: "Eggplant",
    description: "Baby's eyes can see light and blossom. Their brain is processing signals.",
    tips: ["Pack your hospital bag early", "Discuss your birth plan with your doctor", "Eat fiber-rich foods to avoid constipation"]
  },
  {
    week: 32,
    title: "Growing Fast",
    sizeDesc: "Squash",
    description: "Baby is practicing breathing and their bones are fully formed but soft.",
    tips: ["Monitor kick counts twice daily", "Do pelvic floor exercises", "Consider a birthing class"]
  },
  {
    week: 36,
    title: "Almost There",
    sizeDesc: "Muskmelon",
    description: "Baby is putting on weight rapidly and dropping lower into the pelvis.",
    tips: ["Have weekly checkups", "Finalize childcare plans", "Get plenty of sleep"]
  },
  {
    week: 40,
    title: "Due Date",
    sizeDesc: "Watermelon",
    description: "Baby is full term and ready to meet the world!",
    tips: ["Watch for signs of labor", "Stay calm and positive", "Keep your provider's number handy"]
  }
];

export const EXPERT_ARTICLES: Article[] = [
  {
    id: '1',
    title: "Understanding Infant Sleep Cycles",
    author: "Dr. Elena Mutua",
    excerpt: "Newborns don't follow a 24-hour clock. This guide helps fathers and helpers understand how to support a consistent sleep routine.",
    category: 'pediatric'
  },
  {
    id: '2',
    title: "Postpartum Wellness & Recovery",
    author: "Sarah Juma, Nutritionist",
    excerpt: "Essential nutrients for recovery. A guide for caregivers on how to support a mother's nutritional needs after birth.",
    category: 'maternal'
  },
  {
    id: '3',
    title: "The Fourth Trimester Experience",
    author: "Dr. James Kamau",
    excerpt: "Why the first three months are critical for the whole family's bonding and emotional adjustment.",
    category: 'maternal'
  },
  {
    id: '4',
    title: "Emergency Signs: When to Seek Help",
    author: "Dr. Lisa Teresia",
    excerpt: "A universal safety guide for identifying critical symptoms in infants that every guardian must know.",
    category: 'safety'
  },
  {
    id: '5',
    title: "Responsive Feeding Techniques",
    author: "Maria L., Feeding Specialist",
    excerpt: "Techniques for mothers, fathers, and caregivers to ensure baby is well-nourished and emotionally secure.",
    category: 'nutrition'
  },
  {
    id: '6',
    title: "Safe Home Environments",
    author: "John D., Safety Expert",
    excerpt: "How to adapt any home—from apartments to shared family compounds—for a growing infant.",
    category: 'safety'
  }
];

