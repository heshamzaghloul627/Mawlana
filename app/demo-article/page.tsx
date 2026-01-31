import Reader from "@/components/article/Reader";

export default function DemoArticlePage() {
  return (
    <Reader
      title="العلم اللدني: علم الأسرار"
      author="الشيخ محمد الغزالي"
      pillar="spirit"
      lang="ar"
      telegramLink="https://t.me/mihrab_al_ruh"
      content={
        <div className="space-y-8">
          <p>
            العلم اللدني هو العلم الذي يُلقى في القلب من غير واسطة كتاب ولا معلم، بل هو من الله
            تعالى إلى قلب العبد مباشرة، كما قال سبحانه:
          </p>

          <blockquote className="border-r-4 border-gold pr-6 py-4 my-8 bg-gold-light/30 rounded-r-lg">
            <p className="text-2xl leading-loose text-emerald-dark">
              ﴿وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا﴾
            </p>
            <footer className="text-sm text-charcoal-light mt-3">[سورة الكهف: 65]</footer>
          </blockquote>

          <p>
            وهذا العلم لا يُنال بالتعلم والدراسة فقط، بل يُنال بالتزكية والمجاهدة والإخلاص. فإذا
            صفت النفس وتطهرت من الأكدار والشواغل، أشرق فيها نور العلم الإلهي.
          </p>

          <h2 className="text-2xl font-bold text-gold mt-12 mb-6">شروط العلم اللدني</h2>

          <p>
            ولهذا العلم شروط لا يُنال إلا بها:
          </p>

          <ul className="space-y-4 mr-8">
            <li className="text-lg leading-relaxed">
              <strong className="text-gold">الإخلاص التام:</strong> أن يكون طلبك للعلم لوجه
              الله تعالى لا لعرض من أعراض الدنيا.
            </li>
            <li className="text-lg leading-relaxed">
              <strong className="text-gold">تزكية النفس:</strong> بالصيام والقيام والذكر
              والتفكر.
            </li>
            <li className="text-lg leading-relaxed">
              <strong className="text-gold">المجاهدة المستمرة:</strong> في ترك الشهوات
              والشبهات.
            </li>
            <li className="text-lg leading-relaxed">
              <strong className="text-gold">صحبة الصالحين:</strong> الذين ذاقوا هذا العلم
              وعاشوا به.
            </li>
          </ul>

          <p>
            فإذا توفرت هذه الشروط، فتح الله على قلبك من علمه ما لم يكن في حسبانك، وأراك من آياته
            ما تعجز الأقلام عن وصفه.
          </p>

          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-12" />

          <p className="text-center text-lg italic text-charcoal-light">
            "اللهم إنا نسألك علماً نافعاً، وقلباً خاشعاً، ولساناً ذاكراً، وعملاً صالحاً متقبلاً"
          </p>
        </div>
      }
    />
  );
}
