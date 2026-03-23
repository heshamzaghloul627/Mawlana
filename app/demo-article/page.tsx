import Reader from "@/components/article/Reader";

export default function DemoArticlePage() {
  return (
    <Reader
      title="العلم اللدني: علم الأسرار"
      author="الشيخ محمد الغزالي"
      category="quran"
      lang="ar"
      content={
        <div className="space-y-8">
          <p className="text-justify-arabic">
            العلم اللدني هو العلم الذي يُلقى في القلب من غير واسطة كتاب ولا معلم، بل هو من الله
            تعالى إلى قلب العبد مباشرة، كما قال سبحانه:
          </p>

          <div className="relative group my-12">
            <div className="absolute inset-0 bg-accent-gold/5 rounded-2xl -z-10 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
            <div className="bg-bg-light border border-accent-gold/20 rounded-2xl p-10 shadow-verse relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <p className="font-amiri text-3xl text-center text-slate-800 font-bold mb-6 leading-loose relative z-10" dir="rtl">
                ﴿ وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا ﴾
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-accent-gold/30" />
                <p className="text-center text-sm text-accent-gold font-medium tracking-wide">سورة الكهف - الآية ٦٥</p>
                <div className="h-px w-12 bg-accent-gold/30" />
              </div>
            </div>
          </div>

          <p className="text-justify-arabic">
            وهذا العلم لا يُنال بالتعلم والدراسة فقط، بل يُنال بالتزكية والمجاهدة والإخلاص. فإذا
            صفت النفس وتطهرت من الأكدار والشواغل، أشرق فيها نور العلم الإلهي.
          </p>

          <h2 className="text-2xl font-amiri font-bold text-primary mt-8 mb-4">شروط العلم اللدني</h2>

          <p>
            ولهذا العلم شروط لا يُنال إلا بها:
          </p>

          <ul className="space-y-4 mr-8">
            <li className="text-lg leading-relaxed">
              <strong className="text-primary">الإخلاص التام:</strong> أن يكون طلبك للعلم لوجه
              الله تعالى لا لعرض من أعراض الدنيا.
            </li>
            <li className="text-lg leading-relaxed">
              <strong className="text-primary">تزكية النفس:</strong> بالصيام والقيام والذكر
              والتفكر.
            </li>
            <li className="text-lg leading-relaxed">
              <strong className="text-primary">المجاهدة المستمرة:</strong> في ترك الشهوات
              والشبهات.
            </li>
            <li className="text-lg leading-relaxed">
              <strong className="text-primary">صحبة الصالحين:</strong> الذين ذاقوا هذا العلم
              وعاشوا به.
            </li>
          </ul>

          <p className="text-justify-arabic">
            فإذا توفرت هذه الشروط، فتح الله على قلبك من علمه ما لم يكن في حسبانك، وأراك من آياته
            ما تعجز الأقلام عن وصفه.
          </p>

          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-accent-gold to-transparent my-12" />

          <p className="text-center text-lg italic text-slate-500">
            &ldquo;اللهم إنا نسألك علماً نافعاً، وقلباً خاشعاً، ولساناً ذاكراً، وعملاً صالحاً متقبلاً&rdquo;
          </p>
        </div>
      }
    />
  );
}
