import type { Locale } from "./LocaleProvider";

type WaqfCopy = {
  navigation: string;
  eyebrow: string;
  title: string;
  description: string;
  guideTitle: string;
  guideText: string;
  example: string;
  sourceNote: string;
  signs: readonly [string, string, string, string, string];
};

export const waqfTranslations: Record<Locale, WaqfCopy> = {
  ar: { navigation: "علامات الوقف", eyebrow: "دليل التلاوة", title: "علامات الوقف في المصحف", description: "تعرّف إلى أشهر علامات الوقف، ومتى يكون الوقف أو الوصل أولى أثناء التلاوة.", guideTitle: "كيف تستخدم هذا الدليل؟", guideText: "ابحث عن الرمز داخل الآية، ثم اقرأ حكمه. المثال القرآني يبقى بالعربية بينما يتغير الشرح حسب لغة الموقع.", example: "مثال قرآني", sourceNote: "هذا الدليل تعليمي مختصر ولا يغني عن التلقي على معلّم متقن لأحكام التجويد.", signs: ["الوقف اللازم", "الوقف أولى", "الوقف والوصل سواء", "الوصل أولى", "تعانق الوقف"] },
  en: { navigation: "Waqf signs", eyebrow: "Recitation guide", title: "Quranic pause signs", description: "Learn the common pause signs and when stopping or continuing is preferred during recitation.", guideTitle: "How to use this guide", guideText: "Find the symbol in an ayah, then read its ruling. The Quranic example remains Arabic while the explanation follows the site language.", example: "Quranic example", sourceNote: "This is a concise learning guide and does not replace studying tajwid with a qualified teacher.", signs: ["Mandatory stop", "Stopping preferred", "Stop or continue", "Continuing preferred", "Paired stop"] },
  tr: { navigation: "Vakıf işaretleri", eyebrow: "Tilavet rehberi", title: "Kur’an’daki vakıf işaretleri", description: "Yaygın vakıf işaretlerini ve tilavet sırasında durmanın veya devam etmenin ne zaman tercih edildiğini öğrenin.", guideTitle: "Bu rehber nasıl kullanılır?", guideText: "Ayetteki işareti bulun ve hükmünü okuyun. Kur’an örneği Arapça kalırken açıklama site diline göre değişir.", example: "Kur’an’dan örnek", sourceNote: "Bu kısa bir eğitim rehberidir; tecvidi ehil bir hocadan öğrenmenin yerini tutmaz.", signs: ["Zorunlu durak", "Durmak daha uygun", "Durmak veya geçmek eşit", "Geçmek daha uygun", "İkili durak"] },
  hi: { navigation: "वक़्फ़ चिह्न", eyebrow: "तिलावत मार्गदर्शिका", title: "क़ुरआन में वक़्फ़ के चिह्न", description: "प्रमुख वक़्फ़ चिह्नों और तिलावत में रुकने या जारी रखने की प्राथमिकता को समझें।", guideTitle: "इस मार्गदर्शिका का उपयोग", guideText: "आयत में चिह्न पहचानें और उसका नियम पढ़ें। क़ुरआनी उदाहरण अरबी में रहता है, जबकि व्याख्या साइट की भाषा में बदलती है।", example: "क़ुरआनी उदाहरण", sourceNote: "यह संक्षिप्त शैक्षिक मार्गदर्शिका है और योग्य शिक्षक से तजवीद सीखने का विकल्प नहीं है।", signs: ["अनिवार्य विराम", "रुकना बेहतर", "रुकना या जारी रखना समान", "जारी रखना बेहतर", "युग्मित विराम"] },
  ur: { navigation: "علاماتِ وقف", eyebrow: "رہنمائے تلاوت", title: "قرآن میں وقف کی علامات", description: "وقف کی معروف علامات اور تلاوت میں رکنے یا جاری رکھنے کی ترجیح جانیے۔", guideTitle: "اس رہنما کو کیسے استعمال کریں؟", guideText: "آیت میں علامت تلاش کریں اور اس کا حکم پڑھیں۔ قرآنی مثال عربی میں رہتی ہے جبکہ وضاحت ویب سائٹ کی زبان کے مطابق بدلتی ہے۔", example: "قرآنی مثال", sourceNote: "یہ مختصر تعلیمی رہنما ہے اور کسی ماہر استاد سے تجوید سیکھنے کا متبادل نہیں۔", signs: ["وقف لازم", "رکنا بہتر", "وقف و وصل برابر", "جاری رکھنا بہتر", "وقف معانقہ"] },
  ru: { navigation: "Знаки вакфа", eyebrow: "Руководство по чтению", title: "Знаки остановки в Коране", description: "Узнайте основные знаки остановки и когда при чтении предпочтительнее остановиться или продолжить.", guideTitle: "Как пользоваться руководством", guideText: "Найдите знак в аяте и прочитайте его правило. Коранческий пример остаётся на арабском, а пояснение следует языку сайта.", example: "Пример из Корана", sourceNote: "Это краткое учебное руководство не заменяет изучение таджвида с квалифицированным учителем.", signs: ["Обязательная остановка", "Остановка предпочтительна", "Остановка или продолжение", "Продолжение предпочтительно", "Парная остановка"] },
  es: { navigation: "Signos de pausa", eyebrow: "Guía de recitación", title: "Signos de pausa en el Corán", description: "Conoce los signos de pausa más comunes y cuándo es preferible detenerse o continuar la recitación.", guideTitle: "Cómo usar esta guía", guideText: "Localiza el signo en la aleya y lee su regla. El ejemplo coránico permanece en árabe y la explicación sigue el idioma del sitio.", example: "Ejemplo coránico", sourceNote: "Esta guía breve no sustituye el aprendizaje del tajwid con un docente cualificado.", signs: ["Pausa obligatoria", "Mejor detenerse", "Pausa o continuación", "Mejor continuar", "Pausa emparejada"] },
  fr: { navigation: "Signes de pause", eyebrow: "Guide de récitation", title: "Les signes de pause dans le Coran", description: "Découvrez les signes de pause courants et quand il vaut mieux s’arrêter ou poursuivre la récitation.", guideTitle: "Comment utiliser ce guide", guideText: "Repérez le signe dans le verset puis lisez sa règle. L’exemple coranique reste en arabe et l’explication suit la langue du site.", example: "Exemple coranique", sourceNote: "Ce guide concis ne remplace pas l’apprentissage du tajwid auprès d’un enseignant qualifié.", signs: ["Arrêt obligatoire", "Arrêt préférable", "Arrêt ou continuation", "Continuation préférable", "Arrêt apparié"] },
  de: { navigation: "Pausenzeichen", eyebrow: "Rezitationshilfe", title: "Pausenzeichen im Koran", description: "Lerne die gebräuchlichen Pausenzeichen kennen und wann Anhalten oder Weiterlesen vorzuziehen ist.", guideTitle: "So nutzt du diesen Leitfaden", guideText: "Finde das Zeichen im Vers und lies seine Regel. Das Koranbeispiel bleibt Arabisch, die Erklärung folgt der Sprache der Website.", example: "Koranbeispiel", sourceNote: "Dieser kurze Lernleitfaden ersetzt keinen Tadschwīd-Unterricht bei einer qualifizierten Lehrkraft.", signs: ["Verbindlicher Halt", "Halt vorzuziehen", "Halt oder Weiterlesen", "Weiterlesen vorzuziehen", "Gekoppelter Halt"] },
  it: { navigation: "Segni di pausa", eyebrow: "Guida alla recitazione", title: "I segni di pausa nel Corano", description: "Scopri i segni di pausa più comuni e quando è preferibile fermarsi o proseguire nella recitazione.", guideTitle: "Come usare questa guida", guideText: "Individua il segno nel versetto e leggine la regola. L’esempio coranico resta in arabo, mentre la spiegazione segue la lingua del sito.", example: "Esempio coranico", sourceNote: "Questa guida sintetica non sostituisce lo studio del tajwid con un insegnante qualificato.", signs: ["Pausa obbligatoria", "Meglio fermarsi", "Pausa o continuazione", "Meglio continuare", "Pausa abbinata"] },
  pt: { navigation: "Sinais de pausa", eyebrow: "Guia de recitação", title: "Sinais de pausa no Alcorão", description: "Conheça os sinais de pausa mais comuns e quando é preferível parar ou continuar a recitação.", guideTitle: "Como usar este guia", guideText: "Localize o sinal no versículo e leia sua regra. O exemplo corânico permanece em árabe e a explicação acompanha o idioma do site.", example: "Exemplo corânico", sourceNote: "Este guia breve não substitui o estudo do tajwid com um professor qualificado.", signs: ["Pausa obrigatória", "Parar é preferível", "Parar ou continuar", "Continuar é preferível", "Pausa emparelhada"] },
  zh: { navigation: "停顿符号", eyebrow: "诵读指南", title: "《古兰经》中的停顿符号", description: "了解常见的停顿符号，以及诵读时何时宜停、何时宜续。", guideTitle: "如何使用本指南", guideText: "在经文中找到符号并阅读其规则。经文示例保留阿拉伯语，说明则随网站语言切换。", example: "经文示例", sourceNote: "本页仅为简明学习指南，不能替代向合格教师学习诵读规则。", signs: ["必须停顿", "停顿较佳", "停续皆可", "连读较佳", "成对停顿"] },
  ja: { navigation: "ワクフ記号", eyebrow: "朗誦ガイド", title: "クルアーンの停止記号", description: "代表的な停止記号と、朗誦中に止まるか続けるかの優先を学びます。", guideTitle: "このガイドの使い方", guideText: "節の中の記号を見つけ、その規則を読みます。クルアーンの例はアラビア語のまま、説明はサイトの言語に切り替わります。", example: "クルアーンの例", sourceNote: "これは簡潔な学習ガイドであり、資格ある教師からタジュウィードを学ぶ代わりにはなりません。", signs: ["必ず停止", "停止が望ましい", "停止・継続どちらも可", "継続が望ましい", "対になる停止"] },
  ko: { navigation: "와끄프 기호", eyebrow: "낭송 안내", title: "꾸란의 멈춤 기호", description: "주요 멈춤 기호와 낭송 중 멈추거나 이어 읽는 것이 더 좋은 경우를 알아봅니다.", guideTitle: "이 안내서 사용법", guideText: "아야에서 기호를 찾고 규칙을 읽으세요. 꾸란 예문은 아랍어로 유지되며 설명은 사이트 언어에 맞춰 바뀝니다.", example: "꾸란 예문", sourceNote: "이 짧은 안내서는 자격 있는 교사에게 타즈위드를 배우는 것을 대신하지 않습니다.", signs: ["반드시 멈춤", "멈춤이 권장됨", "멈춤·계속 모두 가능", "계속 읽기가 권장됨", "짝을 이루는 멈춤"] },
  id: { navigation: "Tanda waqaf", eyebrow: "Panduan tilawah", title: "Tanda waqaf dalam Al-Qur’an", description: "Kenali tanda waqaf yang umum dan kapan berhenti atau melanjutkan bacaan lebih diutamakan.", guideTitle: "Cara menggunakan panduan", guideText: "Temukan tandanya di dalam ayat, lalu baca hukumnya. Contoh Al-Qur’an tetap berbahasa Arab, sedangkan penjelasan mengikuti bahasa situs.", example: "Contoh Al-Qur’an", sourceNote: "Panduan ringkas ini tidak menggantikan belajar tajwid bersama guru yang kompeten.", signs: ["Waqaf wajib", "Berhenti lebih utama", "Berhenti atau lanjut setara", "Melanjutkan lebih utama", "Waqaf berpasangan"] },
};

export const missingWaqfDescriptions: Partial<Record<Locale, readonly [string, string, string, string, string]>> = {
  hi: [
    "अनिवार्य विराम का चिह्न, जैसे:",
    "जायज़ विराम जहाँ रुकना बेहतर है, जैसे:",
    "जायज़ विराम जहाँ रुकना और जारी रखना दोनों समान हैं, जैसे:",
    "जायज़ विराम जहाँ जारी रखना बेहतर है, जैसे:",
    "युग्मित विराम: एक स्थान पर रुकने के बाद दूसरे पर रुकना सही नहीं, जैसे:",
  ],
  fr: [
    "Signe d’arrêt obligatoire, comme :",
    "Arrêt permis où il est préférable de s’arrêter, comme :",
    "Arrêt permis où s’arrêter et continuer sont équivalents, comme :",
    "Arrêt permis où il est préférable de continuer, comme :",
    "Arrêt apparié : s’arrêter au premier emplacement exclut l’arrêt au second, comme :",
  ],
  de: [
    "Zeichen für einen verbindlichen Halt, zum Beispiel:",
    "Erlaubter Halt, bei dem das Anhalten vorzuziehen ist, zum Beispiel:",
    "Erlaubter Halt, bei dem Anhalten und Weiterlesen gleichwertig sind, zum Beispiel:",
    "Erlaubter Halt, bei dem das Weiterlesen vorzuziehen ist, zum Beispiel:",
    "Gekoppelter Halt: Wer an einer Stelle anhält, soll nicht auch an der anderen anhalten, zum Beispiel:",
  ],
  it: [
    "Segno di pausa obbligatoria, come:",
    "Pausa consentita in cui fermarsi è preferibile, come:",
    "Pausa consentita in cui fermarsi e proseguire sono equivalenti, come:",
    "Pausa consentita in cui proseguire è preferibile, come:",
    "Pausa abbinata: fermarsi in un punto esclude la pausa nell’altro, come:",
  ],
  pt: [
    "Sinal de pausa obrigatória, como:",
    "Pausa permitida em que parar é preferível, como:",
    "Pausa permitida em que parar e continuar são equivalentes, como:",
    "Pausa permitida em que continuar é preferível, como:",
    "Pausa emparelhada: parar em um ponto impede parar no outro, como:",
  ],
  zh: [
    "必须停顿的符号，例如：",
    "允许停顿且停下更合适的符号，例如：",
    "允许停顿，停下与继续同样合适的符号，例如：",
    "允许停顿但继续诵读更合适的符号，例如：",
    "成对停顿符号：若在一处停下，就不应在另一处再停，例如：",
  ],
  ja: [
    "必ず停止する記号。例：",
    "停止が許され、止まる方が望ましい記号。例：",
    "停止と継続が同等に認められる記号。例：",
    "停止は許されるものの、続ける方が望ましい記号。例：",
    "対になる停止記号。一方で止まった場合、もう一方では止まりません。例：",
  ],
  ko: [
    "반드시 멈추어야 하는 기호. 예:",
    "멈출 수 있으며 멈추는 편이 더 좋은 기호. 예:",
    "멈추거나 이어 읽는 것이 똑같이 허용되는 기호. 예:",
    "멈출 수 있지만 이어 읽는 편이 더 좋은 기호. 예:",
    "짝을 이루는 멈춤 기호로, 한 곳에서 멈추면 다른 곳에서는 멈추지 않습니다. 예:",
  ],
};
