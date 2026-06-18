import type { Field, Lang } from "./i18n";

export interface QuizQuestion {
  q: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
  topic: string;
}

export interface RoadmapStep {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  resources: { title: string; url: string }[];
}

export interface Roadmap {
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  steps: RoadmapStep[];
}

// Always available — no external key required.
export function hasGeminiKey(): boolean {
  return true;
}

// Small helper so the UI's "loading" states still flash naturally.
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ---------------- Quiz bank ----------------

type Bank = Record<Field, Record<Lang, QuizQuestion[]>>;

const QUIZ: Bank = {
  ai: {
    en: [
      { topic: "ML basics", q: "Which task is an example of supervised learning?", options: ["Clustering customers by behavior", "Predicting house prices from labeled data", "Finding hidden patterns without labels", "Generating random text"], answerIndex: 1 },
      { topic: "Overfitting", q: "A model performs great on training data but poorly on new data. This is:", options: ["Underfitting", "Overfitting", "Regularization", "Normalization"], answerIndex: 1 },
      { topic: "Neural networks", q: "The activation function most commonly used in hidden layers of modern deep networks is:", options: ["Sigmoid", "Tanh", "ReLU", "Softmax"], answerIndex: 2 },
      { topic: "LLMs", q: "Large Language Models like GPT are primarily based on which architecture?", options: ["CNN", "RNN", "Transformer", "GAN"], answerIndex: 2 },
      { topic: "Evaluation", q: "Which metric is best for an imbalanced binary classification problem?", options: ["Accuracy", "F1-score", "Mean Squared Error", "R²"], answerIndex: 1 },
    ],
    ar: [
      { topic: "ML basics", q: "أيٌّ مما يلي مثال على التعلّم المُوجَّه (Supervised)؟", options: ["تجميع العملاء حسب السلوك", "توقع أسعار المنازل من بيانات معنونة", "اكتشاف أنماط مخفية بدون تسميات", "توليد نص عشوائي"], answerIndex: 1 },
      { topic: "Overfitting", q: "نموذج يعمل بشكل ممتاز على بيانات التدريب وضعيف على بيانات جديدة. هذه الحالة تُسمى:", options: ["نقص التعلم (Underfitting)", "فرط التعلم (Overfitting)", "تنظيم (Regularization)", "تطبيع (Normalization)"], answerIndex: 1 },
      { topic: "Neural networks", q: "دالة التفعيل الأكثر شيوعاً في الطبقات المخفية للشبكات العميقة الحديثة هي:", options: ["Sigmoid", "Tanh", "ReLU", "Softmax"], answerIndex: 2 },
      { topic: "LLMs", q: "نماذج اللغة الكبيرة مثل GPT تعتمد بشكل أساسي على معمارية:", options: ["CNN", "RNN", "Transformer", "GAN"], answerIndex: 2 },
      { topic: "Evaluation", q: "ما المقياس الأنسب لتقييم تصنيف ثنائي غير متوازن؟", options: ["الدقة (Accuracy)", "F1-score", "Mean Squared Error", "R²"], answerIndex: 1 },
    ],
  },
  web: {
    en: [
      { topic: "HTML", q: "Which HTML element is semantically correct for a site's main navigation?", options: ["<div>", "<nav>", "<section>", "<header>"], answerIndex: 1 },
      { topic: "CSS layout", q: "Which CSS technology is best for two-dimensional grid layouts?", options: ["Flexbox", "CSS Grid", "Float", "Inline-block"], answerIndex: 1 },
      { topic: "JavaScript", q: "What does `const` do in JavaScript?", options: ["Declares a block-scoped constant binding", "Declares a function-scoped variable", "Creates a deeply immutable object", "Hoists the variable to the top"], answerIndex: 0 },
      { topic: "React", q: "Which hook is used to perform side effects in a React component?", options: ["useState", "useMemo", "useEffect", "useRef"], answerIndex: 2 },
      { topic: "HTTP", q: "Which HTTP status code means 'Not Found'?", options: ["301", "401", "404", "500"], answerIndex: 2 },
    ],
    ar: [
      { topic: "HTML", q: "أي عنصر HTML هو الصحيح دلالياً للقائمة الرئيسية للموقع؟", options: ["<div>", "<nav>", "<section>", "<header>"], answerIndex: 1 },
      { topic: "CSS layout", q: "أي تقنية CSS أفضل لتخطيطات شبكية ثنائية الأبعاد؟", options: ["Flexbox", "CSS Grid", "Float", "Inline-block"], answerIndex: 1 },
      { topic: "JavaScript", q: "ماذا يفعل `const` في JavaScript؟", options: ["يُعرّف ثابتاً ضمن نطاق الكتلة (block)", "يُعرّف متغيراً ضمن نطاق الدالة", "يُنشئ كائناً غير قابل للتعديل بعمق", "يرفع المتغير لأعلى السكوب"], answerIndex: 0 },
      { topic: "React", q: "أي Hook يُستخدم لتنفيذ التأثيرات الجانبية في مكوّن React؟", options: ["useState", "useMemo", "useEffect", "useRef"], answerIndex: 2 },
      { topic: "HTTP", q: "أي رمز HTTP يعني 'غير موجود'؟", options: ["301", "401", "404", "500"], answerIndex: 2 },
    ],
  },
  cyber: {
    en: [
      { topic: "CIA triad", q: "The CIA triad in cybersecurity stands for:", options: ["Control, Identity, Access", "Confidentiality, Integrity, Availability", "Cipher, Identity, Authentication", "Compliance, Inspection, Audit"], answerIndex: 1 },
      { topic: "Networking", q: "Which port is used by HTTPS by default?", options: ["21", "22", "80", "443"], answerIndex: 3 },
      { topic: "Web security", q: "SQL injection is best prevented by:", options: ["Using a WAF only", "Parameterized queries / prepared statements", "Obfuscating SQL", "Encrypting the database"], answerIndex: 1 },
      { topic: "Cryptography", q: "Which is an asymmetric encryption algorithm?", options: ["AES", "RSA", "DES", "ChaCha20"], answerIndex: 1 },
      { topic: "Attacks", q: "A phishing attack primarily targets:", options: ["Network hardware", "Human users", "Server CPUs", "Encryption keys"], answerIndex: 1 },
    ],
    ar: [
      { topic: "CIA triad", q: "ثلاثية CIA في الأمن السيبراني تعني:", options: ["التحكم والهوية والوصول", "السرية والسلامة والتوفر", "التشفير والهوية والمصادقة", "الامتثال والتفتيش والتدقيق"], answerIndex: 1 },
      { topic: "Networking", q: "ما المنفذ الافتراضي لبروتوكول HTTPS؟", options: ["21", "22", "80", "443"], answerIndex: 3 },
      { topic: "Web security", q: "أفضل طريقة لمنع حقن SQL هي:", options: ["استخدام جدار WAF فقط", "الاستعلامات المُعدّة (Parameterized queries)", "تشويش جمل SQL", "تشفير قاعدة البيانات"], answerIndex: 1 },
      { topic: "Cryptography", q: "أي مما يلي خوارزمية تشفير غير متماثل؟", options: ["AES", "RSA", "DES", "ChaCha20"], answerIndex: 1 },
      { topic: "Attacks", q: "هجمات التصيّد (Phishing) تستهدف بشكل أساسي:", options: ["أجهزة الشبكة", "المستخدمين البشريين", "معالجات الخوادم", "مفاتيح التشفير"], answerIndex: 1 },
    ],
  },
  data: {
    en: [
      { topic: "Statistics", q: "The median of [2, 4, 4, 6, 10] is:", options: ["4", "5", "5.2", "6"], answerIndex: 0 },
      { topic: "Pandas", q: "Which pandas method gives a quick statistical summary of numeric columns?", options: [".info()", ".describe()", ".head()", ".shape"], answerIndex: 1 },
      { topic: "SQL", q: "Which SQL clause filters rows AFTER aggregation?", options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], answerIndex: 2 },
      { topic: "Visualization", q: "Which chart is best to show the distribution of a single numeric variable?", options: ["Pie chart", "Histogram", "Line chart", "Heatmap"], answerIndex: 1 },
      { topic: "ML basics", q: "Train/test split is used to:", options: ["Make training faster", "Estimate how the model generalizes to unseen data", "Reduce memory usage", "Improve data quality"], answerIndex: 1 },
    ],
    ar: [
      { topic: "Statistics", q: "الوسيط للقائمة [2, 4, 4, 6, 10] هو:", options: ["4", "5", "5.2", "6"], answerIndex: 0 },
      { topic: "Pandas", q: "أي دالة في pandas تعطي ملخصاً إحصائياً سريعاً للأعمدة الرقمية؟", options: [".info()", ".describe()", ".head()", ".shape"], answerIndex: 1 },
      { topic: "SQL", q: "أي جملة في SQL تُصفّي الصفوف بعد التجميع (Aggregation)؟", options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], answerIndex: 2 },
      { topic: "Visualization", q: "أي مخطط أنسب لعرض توزيع متغير رقمي واحد؟", options: ["مخطط دائري", "المدرّج التكراري (Histogram)", "مخطط خطي", "خريطة حرارية"], answerIndex: 1 },
      { topic: "ML basics", q: "تقسيم البيانات إلى تدريب/اختبار يُستخدم من أجل:", options: ["تسريع التدريب", "تقدير قدرة النموذج على التعميم على بيانات جديدة", "تقليل استهلاك الذاكرة", "تحسين جودة البيانات"], answerIndex: 1 },
    ],
  },
};

export async function generateQuiz(field: Field, lang: Lang): Promise<QuizQuestion[]> {
  await wait(400);
  return QUIZ[field][lang].map((q) => ({ ...q }));
}

// ---------------- Roadmaps ----------------

type LocalizedStep = {
  duration: string;
  en: { title: string; description: string; skills: string[] };
  ar: { title: string; description: string; skills: string[] };
  resources: { title: string; url: string }[];
};

const ROADMAPS: Record<Field, LocalizedStep[]> = {
  ai: [
    {
      duration: "3 weeks",
      en: { title: "Python & Math Foundations", description: "Master Python syntax, NumPy, and the core linear algebra, calculus, and probability used in machine learning.", skills: ["Python", "NumPy", "Linear algebra", "Probability"] },
      ar: { title: "أساسيات بايثون والرياضيات", description: "أتقن صياغة بايثون ومكتبة NumPy والجبر الخطي والاحتمالات والمشتقات التي يقوم عليها تعلم الآلة.", skills: ["Python", "NumPy", "الجبر الخطي", "الاحتمالات"] },
      resources: [
        { title: "Python for Everybody (freeCodeCamp)", url: "https://www.freecodecamp.org/news/python-for-everybody/" },
        { title: "Khan Academy — Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "Classical Machine Learning", description: "Learn supervised and unsupervised algorithms, train/test splits, cross-validation, and model evaluation with scikit-learn.", skills: ["scikit-learn", "Regression", "Classification", "Evaluation metrics"] },
      ar: { title: "تعلم الآلة الكلاسيكي", description: "تعلّم الخوارزميات الموجهة وغير الموجهة، تقسيم التدريب/الاختبار، التحقق المتقاطع، وتقييم النماذج باستخدام scikit-learn.", skills: ["scikit-learn", "الانحدار", "التصنيف", "مقاييس التقييم"] },
      resources: [
        { title: "Andrew Ng — Machine Learning Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
        { title: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
      ],
    },
    {
      duration: "5 weeks",
      en: { title: "Deep Learning Essentials", description: "Build neural networks with PyTorch: CNNs for vision, RNNs and Transformers for sequences. Train, debug, and tune models.", skills: ["PyTorch", "Neural networks", "CNNs", "Transformers"] },
      ar: { title: "أساسيات التعلم العميق", description: "ابنِ شبكات عصبية باستخدام PyTorch: CNNs للرؤية وRNNs وTransformers للتسلسلات. درّب النماذج وحسّنها وصحّح أخطاءها.", skills: ["PyTorch", "الشبكات العصبية", "CNNs", "Transformers"] },
      resources: [
        { title: "fast.ai — Practical Deep Learning", url: "https://course.fast.ai/" },
        { title: "PyTorch Official Tutorials", url: "https://pytorch.org/tutorials/" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "LLMs & Applied AI", description: "Use modern LLMs via APIs, learn prompt engineering, retrieval-augmented generation, and ship an AI-powered app.", skills: ["Prompt engineering", "RAG", "Vector databases", "LangChain"] },
      ar: { title: "نماذج اللغة الكبيرة وتطبيقاتها", description: "استخدم نماذج اللغة الحديثة عبر الـAPI، تعلّم هندسة الأوامر، التوليد المعزّز بالاسترجاع (RAG)، وأطلق تطبيقاً مدعوماً بالذكاء الاصطناعي.", skills: ["هندسة الأوامر", "RAG", "قواعد البيانات المتجهة", "LangChain"] },
      resources: [
        { title: "DeepLearning.AI — Short Courses", url: "https://www.deeplearning.ai/short-courses/" },
        { title: "Hugging Face — LLM Course", url: "https://huggingface.co/learn/llm-course" },
      ],
    },
    {
      duration: "2 weeks",
      en: { title: "Portfolio Project", description: "Build and document one polished end-to-end project: dataset, model, evaluation, and a public demo or write-up.", skills: ["MLOps basics", "Streamlit / Gradio", "GitHub", "Technical writing"] },
      ar: { title: "مشروع المحفظة", description: "ابنِ ووثّق مشروعاً واحداً متكاملاً: مجموعة البيانات، النموذج، التقييم، ونسخة عرض عامة أو مقال تقني.", skills: ["مبادئ MLOps", "Streamlit / Gradio", "GitHub", "الكتابة التقنية"] },
      resources: [
        { title: "Kaggle — Competitions & Datasets", url: "https://www.kaggle.com/" },
        { title: "Streamlit Docs", url: "https://docs.streamlit.io/" },
      ],
    },
  ],
  web: [
    {
      duration: "2 weeks",
      en: { title: "HTML, CSS & Responsive Design", description: "Write semantic HTML, modern CSS with Flexbox/Grid, and build accessible, responsive layouts.", skills: ["Semantic HTML", "Flexbox", "CSS Grid", "Accessibility"] },
      ar: { title: "HTML وCSS والتصميم المتجاوب", description: "اكتب HTML دلالياً، وCSS حديثاً باستخدام Flexbox وGrid، وابنِ تخطيطات متجاوبة ويمكن الوصول إليها.", skills: ["HTML دلالي", "Flexbox", "CSS Grid", "إمكانية الوصول"] },
      resources: [
        { title: "MDN — Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn" },
        { title: "freeCodeCamp — Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "Modern JavaScript & TypeScript", description: "Master ES2020+ features, async/await, modules, and add static types with TypeScript.", skills: ["ES Modules", "Async/Await", "DOM APIs", "TypeScript"] },
      ar: { title: "جافاسكربت الحديثة وTypeScript", description: "أتقن خصائص ES2020+ وdom APIs وasync/await، وأضف الأنواع الثابتة باستخدام TypeScript.", skills: ["ES Modules", "Async/Await", "DOM APIs", "TypeScript"] },
      resources: [
        { title: "JavaScript.info", url: "https://javascript.info/" },
        { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "React & Frontend Engineering", description: "Build component-driven apps with React, state management, routing, forms, and testing.", skills: ["React", "Hooks", "React Router", "Vitest"] },
      ar: { title: "React وهندسة الواجهات", description: "ابنِ تطبيقات بمكوّنات React مع إدارة الحالة، التنقل، النماذج، والاختبارات.", skills: ["React", "Hooks", "React Router", "Vitest"] },
      resources: [
        { title: "React Official Docs", url: "https://react.dev/learn" },
        { title: "Epic React Patterns (Kent C. Dodds)", url: "https://kentcdodds.com/blog" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "Backend & APIs", description: "Design REST and basic GraphQL APIs with Node.js, work with databases, authentication, and deployment.", skills: ["Node.js", "Express", "PostgreSQL", "JWT auth"] },
      ar: { title: "الخوادم وواجهات الـAPI", description: "صمّم واجهات REST وأساسيات GraphQL باستخدام Node.js، وتعامل مع قواعد البيانات والمصادقة والنشر.", skills: ["Node.js", "Express", "PostgreSQL", "مصادقة JWT"] },
      resources: [
        { title: "The Odin Project — Full Stack", url: "https://www.theodinproject.com/paths" },
        { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "Full-Stack Capstone Project", description: "Ship a deployed full-stack app with authentication, a database, tests, and CI.", skills: ["Next.js", "Prisma", "CI/CD", "Vercel"] },
      ar: { title: "مشروع تخرّج Full-Stack", description: "أطلق تطبيقاً متكاملاً منشوراً مع مصادقة وقاعدة بيانات واختبارات وCI.", skills: ["Next.js", "Prisma", "CI/CD", "Vercel"] },
      resources: [
        { title: "Next.js Learn", url: "https://nextjs.org/learn" },
        { title: "Vercel Docs", url: "https://vercel.com/docs" },
      ],
    },
  ],
  cyber: [
    {
      duration: "3 weeks",
      en: { title: "Networking & OS Fundamentals", description: "Understand TCP/IP, DNS, HTTP, Linux command line, and Windows administration basics.", skills: ["TCP/IP", "DNS", "Linux CLI", "Wireshark"] },
      ar: { title: "أساسيات الشبكات وأنظمة التشغيل", description: "افهم TCP/IP وDNS وHTTP وسطر أوامر Linux وأساسيات إدارة Windows.", skills: ["TCP/IP", "DNS", "سطر أوامر Linux", "Wireshark"] },
      resources: [
        { title: "Professor Messer — Network+", url: "https://www.professormesser.com/" },
        { title: "Linux Journey", url: "https://linuxjourney.com/" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "Security Fundamentals & CIA Triad", description: "Learn core security principles, threat modeling, risk, and common control frameworks.", skills: ["CIA triad", "Threat modeling", "Risk management", "Security policy"] },
      ar: { title: "أساسيات الأمن وثلاثية CIA", description: "تعلّم مبادئ الأمن الأساسية ونمذجة التهديدات والمخاطر وأطر الضوابط الشائعة.", skills: ["ثلاثية CIA", "نمذجة التهديدات", "إدارة المخاطر", "سياسات الأمن"] },
      resources: [
        { title: "Cybrary — Intro to IT & Cybersecurity", url: "https://www.cybrary.it/course/intro-to-it-and-cybersecurity/" },
        { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "Offensive Security & Web Hacking", description: "Practice ethical hacking: reconnaissance, exploitation, OWASP Top 10 web vulnerabilities.", skills: ["Burp Suite", "OWASP Top 10", "SQLi & XSS", "Nmap"] },
      ar: { title: "الأمن الهجومي واختراق الويب", description: "تدرّب على القرصنة الأخلاقية: الاستطلاع، الاستغلال، وأهم 10 ثغرات ويب من OWASP.", skills: ["Burp Suite", "OWASP Top 10", "SQLi & XSS", "Nmap"] },
      resources: [
        { title: "TryHackMe — Learning Paths", url: "https://tryhackme.com/paths" },
        { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "Defensive Security & Blue Team", description: "Logs, SIEM, incident response, and basic threat detection on Windows/Linux.", skills: ["SIEM", "Incident response", "Splunk", "Sysmon"] },
      ar: { title: "الأمن الدفاعي والفريق الأزرق", description: "السجلات، أنظمة SIEM، الاستجابة للحوادث، والاكتشاف الأساسي للتهديدات على Windows/Linux.", skills: ["SIEM", "الاستجابة للحوادث", "Splunk", "Sysmon"] },
      resources: [
        { title: "Blue Team Labs Online", url: "https://blueteamlabs.online/" },
        { title: "Splunk Free Training", url: "https://www.splunk.com/en_us/training/free-courses/overview.html" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "Cryptography & Certification Prep", description: "Symmetric/asymmetric crypto, hashing, TLS, and prep for an entry certification like Security+.", skills: ["AES", "RSA", "TLS", "Security+ exam prep"] },
      ar: { title: "التشفير والتحضير للشهادات", description: "التشفير المتماثل وغير المتماثل، الهاش، TLS، والتحضير لشهادة مدخل مثل Security+.", skills: ["AES", "RSA", "TLS", "تحضير Security+"] },
      resources: [
        { title: "Cryptopals Crypto Challenges", url: "https://cryptopals.com/" },
        { title: "Professor Messer — Security+", url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
      ],
    },
  ],
  data: [
    {
      duration: "2 weeks",
      en: { title: "Python & Data Wrangling", description: "Python for data work: NumPy, pandas, cleaning messy datasets, and exploratory analysis.", skills: ["Python", "pandas", "NumPy", "Jupyter"] },
      ar: { title: "بايثون ومعالجة البيانات", description: "بايثون لتحليل البيانات: NumPy وpandas، تنظيف البيانات الفوضوية والتحليل الاستكشافي.", skills: ["Python", "pandas", "NumPy", "Jupyter"] },
      resources: [
        { title: "Kaggle — Pandas Course", url: "https://www.kaggle.com/learn/pandas" },
        { title: "Python Data Science Handbook", url: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "Statistics & Probability", description: "Descriptive and inferential statistics, distributions, hypothesis testing, and A/B testing.", skills: ["Descriptive stats", "Distributions", "Hypothesis testing", "A/B testing"] },
      ar: { title: "الإحصاء والاحتمالات", description: "الإحصاء الوصفي والاستدلالي، التوزيعات، اختبارات الفرضيات، واختبارات A/B.", skills: ["الإحصاء الوصفي", "التوزيعات", "اختبار الفرضيات", "اختبار A/B"] },
      resources: [
        { title: "StatQuest with Josh Starmer", url: "https://www.youtube.com/@statquest" },
        { title: "Think Stats (free book)", url: "https://greenteapress.com/wp/think-stats-2e/" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "SQL & Data Visualization", description: "Write production-quality SQL, design queries for analytics, and build clear charts and dashboards.", skills: ["SQL joins", "Window functions", "Matplotlib", "Tableau / Power BI"] },
      ar: { title: "SQL وعرض البيانات", description: "اكتب SQL باحترافية، صمّم استعلامات تحليلية، وابنِ مخططات ولوحات تحكم واضحة.", skills: ["SQL joins", "Window functions", "Matplotlib", "Tableau / Power BI"] },
      resources: [
        { title: "Mode — SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
        { title: "Tableau Public Free Training", url: "https://public.tableau.com/en-us/s/resources" },
      ],
    },
    {
      duration: "4 weeks",
      en: { title: "Machine Learning for Data Science", description: "Apply regression, classification, clustering, and feature engineering with scikit-learn.", skills: ["scikit-learn", "Feature engineering", "Cross-validation", "Model evaluation"] },
      ar: { title: "تعلم الآلة لعلم البيانات", description: "طبّق الانحدار والتصنيف والتجميع وهندسة الميزات باستخدام scikit-learn.", skills: ["scikit-learn", "هندسة الميزات", "التحقق المتقاطع", "تقييم النماذج"] },
      resources: [
        { title: "Kaggle — Intro to Machine Learning", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
        { title: "scikit-learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html" },
      ],
    },
    {
      duration: "3 weeks",
      en: { title: "End-to-End Analytics Project", description: "Pick a real dataset, run full analysis, model, and present findings to non-technical readers.", skills: ["Storytelling with data", "Dashboards", "GitHub", "Technical writing"] },
      ar: { title: "مشروع تحليلي متكامل", description: "اختر مجموعة بيانات حقيقية، نفّذ تحليلاً ونمذجة كاملين، وقدّم نتائجك لجمهور غير تقني.", skills: ["سرد البيانات", "لوحات التحكم", "GitHub", "الكتابة التقنية"] },
      resources: [
        { title: "Kaggle Datasets", url: "https://www.kaggle.com/datasets" },
        { title: "Google — Data Analytics Certificate", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      ],
    },
  ],
};

const FIELD_EN: Record<Field, string> = {
  ai: "Artificial Intelligence",
  web: "Web Development",
  cyber: "Cybersecurity",
  data: "Data Science",
};
const FIELD_AR: Record<Field, string> = {
  ai: "الذكاء الاصطناعي",
  web: "تطوير الويب",
  cyber: "الأمن السيبراني",
  data: "علم البيانات",
};

function pickLevel(score: number, total: number): Roadmap["level"] {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.8) return "Advanced";
  if (ratio >= 0.5) return "Intermediate";
  return "Beginner";
}

function summaryText(level: Roadmap["level"], field: Field, score: number, total: number, lang: Lang): string {
  const fieldName = lang === "ar" ? FIELD_AR[field] : FIELD_EN[field];
  if (lang === "ar") {
    if (level === "Advanced")
      return `أداء ممتاز! حصلت على ${score}/${total} في ${fieldName}. هذه خارطة طريق متقدمة لتعميق خبرتك وبناء مشاريع احترافية.`;
    if (level === "Intermediate")
      return `أداء جيد! حصلت على ${score}/${total} في ${fieldName}. هذه خارطة طريق متوسطة لسدّ الفجوات والانتقال للمستوى التالي.`;
    return `بداية رائعة! حصلت على ${score}/${total} في ${fieldName}. هذه خارطة طريق مخصصة للمبتدئين لبناء أساس قوي.`;
  }
  if (level === "Advanced")
    return `Excellent work! You scored ${score}/${total} in ${fieldName}. Here is an advanced roadmap to deepen your expertise and ship professional projects.`;
  if (level === "Intermediate")
    return `Solid score of ${score}/${total} in ${fieldName}. Here is an intermediate roadmap to close your gaps and reach the next level.`;
  return `Great start! You scored ${score}/${total} in ${fieldName}. Here is a beginner-friendly roadmap to build a strong foundation.`;
}

export async function generateRoadmap(
  field: Field,
  lang: Lang,
  score: number,
  total: number,
  _wrongTopics: string[],
): Promise<Roadmap> {
  await wait(500);
  const level = pickLevel(score, total);
  // Tailor by trimming early/late steps based on level.
  const all = ROADMAPS[field];
  let chosen: LocalizedStep[];
  if (level === "Advanced") chosen = all.slice(2);
  else if (level === "Intermediate") chosen = all.slice(1);
  else chosen = all;

  const steps: RoadmapStep[] = chosen.map((s) => {
    const loc = lang === "ar" ? s.ar : s.en;
    return {
      title: loc.title,
      duration: s.duration,
      description: loc.description,
      skills: loc.skills,
      resources: s.resources,
    };
  });

  return {
    level,
    summary: summaryText(level, field, score, total, lang),
    steps,
  };
}

// ---------------- Chatbot ----------------

interface RuleSet {
  match: RegExp;
  en: string;
  ar: string;
}

const RULES: RuleSet[] = [
  {
    match: /\b(hello|hi|hey|salam|سلام|مرحبا|أهلا|اهلا)\b/i,
    en: "Hi there! 👋 I'm your TechPath Assistant. Ask me about CS fields, learning roadmaps, or which skills to build next.",
    ar: "أهلاً بك! 👋 أنا مساعد مَساري التقني. اسألني عن مجالات علوم الحاسب أو خرائط التعلّم أو ما هي المهارات التي تبنيها بعد ذلك.",
  },
  {
    match: /\b(ai|ml|machine learning|deep learning|llm|ذكاء|تعلم الآلة|تعلّم الآلة|التعلم العميق)\b/i,
    en: "For AI/ML, start with Python + math (linear algebra, probability), then scikit-learn for classical ML, then PyTorch for deep learning, and finally LLMs and RAG. Take the AI assessment to get a tailored plan.",
    ar: "للذكاء الاصطناعي/تعلم الآلة: ابدأ ببايثون والرياضيات (جبر خطي، احتمالات)، ثم scikit-learn للتعلم الكلاسيكي، ثم PyTorch للتعلم العميق، وأخيراً LLMs وRAG. خذ تقييم الذكاء الاصطناعي للحصول على خطة مخصصة.",
  },
  {
    match: /\b(web|frontend|backend|react|html|css|javascript|node|ويب|واجهة|الواجهات|الخوادم)\b/i,
    en: "For Web Dev: master HTML/CSS, then modern JavaScript + TypeScript, then React on the frontend and Node.js + a SQL database on the backend. Finish with a deployed full-stack project.",
    ar: "لتطوير الويب: أتقن HTML/CSS، ثم JavaScript الحديثة وTypeScript، ثم React في الواجهة، وNode.js مع قاعدة بيانات SQL في الخادم. واختم بمشروع متكامل منشور.",
  },
  {
    match: /\b(cyber|security|hacking|pentest|أمن|أمان|اختراق|سايبر)\b/i,
    en: "For Cybersecurity: learn networking + Linux, then security fundamentals (CIA triad), then practice on TryHackMe (offensive) and Blue Team Labs (defensive). Aim for an entry cert like Security+.",
    ar: "للأمن السيبراني: تعلّم الشبكات وLinux، ثم أساسيات الأمن (ثلاثية CIA)، ثم تدرّب على TryHackMe (هجومي) وBlue Team Labs (دفاعي)، واستهدف شهادة مدخل مثل Security+.",
  },
  {
    match: /\b(data|analytics|sql|pandas|statistics|بيانات|إحصاء|تحليل)\b/i,
    en: "For Data Science: Python + pandas, then statistics, then SQL and visualization, then scikit-learn. Finish with a public end-to-end analytics project on a real dataset.",
    ar: "لعلم البيانات: بايثون وpandas، ثم الإحصاء، ثم SQL والعرض البصري، ثم scikit-learn. واختم بمشروع تحليلي متكامل وعلني على بيانات حقيقية.",
  },
  {
    match: /\b(roadmap|plan|path|خارطة|خريطة|خطة|مسار)\b/i,
    en: "Head to the Assessment page, pick your field, and answer 5 quick questions. I'll instantly generate a personalized step-by-step roadmap tailored to your level.",
    ar: "اذهب إلى صفحة التقييم، اختر مجالك، وأجب على 5 أسئلة سريعة. سأولّد لك على الفور خارطة طريق مخصصة خطوة بخطوة حسب مستواك.",
  },
  {
    match: /\b(beginner|start|where|how do i start|كيف ابدأ|كيف أبدأ|من اين|من أين|مبتدئ)\b/i,
    en: "Start by picking a field that excites you, then take the assessment. Build small projects every week — consistent practice beats long sporadic study sessions.",
    ar: "ابدأ باختيار مجال يحمّسك، ثم خذ التقييم. ابنِ مشاريع صغيرة كل أسبوع — الممارسة المنتظمة أهم بكثير من جلسات الدراسة الطويلة المتباعدة.",
  },
  {
    match: /\b(job|career|interview|cv|resume|وظيفة|عمل|مقابلة|سيرة)\b/i,
    en: "Tech hiring rewards proof of work: a GitHub with 2–3 polished projects, a clear README per project, and contributions or write-ups. Practice interview problems on LeetCode and mock interviews weekly.",
    ar: "التوظيف التقني يكافئ من يثبت عمله: GitHub فيه 2–3 مشاريع متقنة، README واضح لكل مشروع، ومساهمات أو مقالات. تدرّب على أسئلة المقابلات على LeetCode وقابلات تجريبية أسبوعياً.",
  },
  {
    match: /\b(thanks|thank you|شكرا|شكراً|متشكر)\b/i,
    en: "You're welcome! 🙌 Keep going — every small step compounds. Want me to suggest the next thing to learn?",
    ar: "العفو! 🙌 استمر — كل خطوة صغيرة تتراكم. هل تريدني أن أقترح عليك الخطوة التالية للتعلم؟",
  },
];

const FALLBACK = {
  en: "Great question! Try taking the AI assessment to get a tailored roadmap. You can also ask me about AI, Web Development, Cybersecurity, or Data Science.",
  ar: "سؤال جيد! جرّب أخذ التقييم الذكي للحصول على خارطة طريق مخصصة. يمكنك أيضاً سؤالي عن الذكاء الاصطناعي، تطوير الويب، الأمن السيبراني، أو علم البيانات.",
};

export async function chat(
  history: { role: "user" | "model"; text: string }[],
  lang: Lang,
): Promise<string> {
  await wait(400);
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const text = lastUser?.text ?? "";
  for (const rule of RULES) {
    if (rule.match.test(text)) return lang === "ar" ? rule.ar : rule.en;
  }
  return lang === "ar" ? FALLBACK.ar : FALLBACK.en;
}