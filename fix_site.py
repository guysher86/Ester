import os
import shutil

ROOT_DIR = "my-math-site"

# 1. יצירת תיקיות תוכן מסודרות
dirs = [
    f"{ROOT_DIR}/src/content/articles",
    f"{ROOT_DIR}/src/content/games"
]
for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"✓ Created directory: {d}")

# 2. CMS Config - הגדרות ניהול מתקדמות
config_yml = """backend:
  name: git-gateway
  branch: main

media_folder: "src/assets/images"
public_folder: "/assets/images"
locale: "he"

collections:
  # --- עריכת דף הבית ---
  - name: "pages"
    label: "דפים כלליים"
    files:
      - file: "src/index.njk"
        label: "דף הבית"
        name: "home"
        fields:
          - {label: "כותרת דפדפן (SEO)", name: "title", widget: "string"}
          - {label: "כותרת ראשית (Hero)", name: "heroTitle", widget: "string"}
          - {label: "כותרת משנה", name: "heroSubtitle", widget: "text"}
          - {label: "טקסט כפתור ראשי", name: "heroCtaText", widget: "string"}
          - {label: "טקסט כפתור משני", name: "heroSecText", widget: "string"}
          
          - label: "כרטיסיות השיטה (3 כרטיסים)"
            name: "features"
            widget: "list"
            fields:
              - {label: "כותרת", name: "title", widget: "string"}
              - {label: "טקסט", name: "text", widget: "text"}
              - {label: "אייקון (FontAwesome)", name: "icon", widget: "string"}
              - {label: "צבע (bg-pastel-name)", name: "color", widget: "string"}

          - label: "שאלות נפוצות"
            name: "faq"
            widget: "list"
            fields:
              - {label: "שאלה", name: "question", widget: "string"}
              - {label: "תשובה", name: "answer", widget: "text"}
              - {label: "צבע רקע", name: "color", widget: "select", options: ["bg-purple-50", "bg-blue-50", "bg-orange-50"]}

  # --- ניהול משחקים ---
  - name: "games"
    label: "משחקים להדפסה"
    folder: "src/content/games"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "שם המשחק", name: "title", widget: "string"}
      - {label: "תיאור קצר", name: "excerpt", widget: "text"}
      - {label: "קטגוריה", name: "category", widget: "select", options: ["כיתות א'-ג'", "כיתות ד'-ו'", "הכנה לחטיבה"]}
      - {label: "קובץ PDF להורדה", name: "pdfFile", widget: "file", required: false}
      - {label: "אייקון ראשי", name: "image", widget: "string", default: "fas fa-puzzle-piece"}
      - {label: "צבע רקע", name: "color", widget: "select", options: ["bg-pastel-blue", "bg-pastel-peach", "bg-pastel-lilac", "bg-pastel-mint"]}
      - {label: "תוכן הדף (הוראות)", name: "body", widget: "markdown"}

  # --- ניהול מאמרים ---
  - name: "articles"
    label: "מאמרים להורים"
    folder: "src/content/articles"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "כותרת המאמר", name: "title", widget: "string"}
      - {label: "תאריך", name: "date", widget: "datetime"}
      - {label: "תקציר (מופיע בכרטיסייה)", name: "excerpt", widget: "text"}
      - {label: "אייקון", name: "image", widget: "string", default: "fas fa-star"}
      - {label: "צבע כרטיסייה", name: "color", widget: "select", options: ["bg-pastel-lilac", "bg-pastel-blue", "bg-pastel-peach"]}
      - {label: "תוכן המאמר", name: "body", widget: "markdown"}
"""

# 3. עדכון דף הבית שיהיה דינמי (מושך נתונים מה-CMS)
index_njk_dynamic = """---
layout: base.njk
title: מתמטיקה בצעד בטוח | מהבסיס ועד להצלחה
heroTitle: למצות את הפוטנציאל.
heroSubtitle: להפוך קושי להצלחה בעזרת הוראה פרטנית מתקדמת המשלבת אסטרטגיות למידה, יצירת רצף הצלחות ובניית יסודות חזקים.
heroCtaText: תיאום שיעור
heroSecText: למאמר להורים
features:
  - title: יסודי וחטיבה
    text: ליווי מדויק לכיתות א'–ט', כולל הכנה אסטרטגית למבחני מיון לכיתה ז'.
    icon: fas fa-layer-group
    color: border-t-pastel-blue
  - title: בניית בסיס חזק
    text: איתור נקודות הקושי וחיזוק היסודות כדי לאפשר התקדמות חלקה בחומר השוטף.
    icon: fas fa-arrow-up-right-dots
    color: border-t-pastel-peach
  - title: רצף הצלחות
    text: תרגול מובנה שנועד לייצר הצלחות קטנות ועקביות, כך שהתלמיד רואה תוצאות.
    icon: fas fa-trophy
    color: border-t-pastel-lilac
  - title: אסטרטגיות למידה
    text: לא רק "לפתור את התרגיל", אלא ללמוד איך ללמוד, איך לגשת לבעיה ואיך לנהל זמן.
    icon: fas fa-pen-ruler
    color: border-t-pastel-mint
faq:
  - question: האם יש הכנה למבחני כניסה לכיתה ז'?
    answer: כן. התהליך כולל חיזוק נושאים מתמטיים מתקדמים ובניית ביטחון ומיומנויות מבחן ספציפיות למיונים.
    color: bg-purple-50
  - question: האם זה מתאים לילדים עם לקויות למידה?
    answer: בהחלט. בזכות ההכשרה בהוראה מותאמת, אני יודעת לזהות את הדרך בה הילד קולט מידע ולהתאים את ההסבר אליו.
    color: bg-blue-50
---
    <header class="hero-section min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative pt-20">
        <i class="fas fa-cube text-9xl floating-shape text-pastel-lilac" style="top: 10%; left: 10%; animation-duration: 25s;"></i>
        <i class="fas fa-heart text-8xl floating-shape text-pastel-peach" style="bottom: 15%; right: 10%; animation-duration: 30s; animation-delay: -5s;"></i>
        <i class="fas fa-star text-7xl floating-shape text-pastel-blue" style="top: 20%; right: 20%; animation-duration: 22s; animation-delay: -10s;"></i>

        <div class="max-w-4xl relative z-10 flex flex-col items-center reveal active">
            <div class="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold mb-8 border border-white text-slate-600 shadow-sm">
                <i class="fas fa-check-circle text-pastel-coral"></i> שיטה עוטפת ומקדמת להצלחה
            </div>
            <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-slate-900 drop-shadow-sm">
                {{ heroTitle }}<br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">בביטחון מלא.</span>
            </h1>
            <p class="text-xl md:text-2xl mb-10 font-medium text-slate-600 max-w-2xl leading-relaxed">
                {{ heroSubtitle }}
            </p>
            <div class="flex justify-center gap-4">
                <a href="https://wa.me/972546969509" target="_blank" class="bg-pastel-coral hover:bg-pastel-coral_hover text-white text-lg px-10 py-4 rounded-full font-bold shadow-lg shadow-orange-100 transition transform hover:-translate-y-1 flex items-center justify-center gap-3">
                    <i class="fab fa-whatsapp text-2xl"></i> {{ heroCtaText }}
                </a>
                <a href="/articles/" class="bg-white/70 hover:bg-white text-slate-800 text-lg px-10 py-4 rounded-full font-bold shadow-sm transition border border-white">
                    {{ heroSecText }}
                </a>
            </div>
        </div>
    </header>

    <section class="py-20 px-4 max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-6">
            {% for feature in features %}
            <div class="glass-card p-8 rounded-3xl text-center flex flex-col items-center reveal delay-100 border-t-4 {{ feature.color }}">
                <div class="w-16 h-16 bg-white text-slate-700 rounded-full flex items-center justify-center mb-6 text-2xl shadow-sm">
                    <i class="{{ feature.icon }}"></i>
                </div>
                <h3 class="font-bold text-xl mb-3 text-slate-800">{{ feature.title }}</h3>
                <p class="text-slate-600 text-sm leading-relaxed">{{ feature.text }}</p>
            </div>
            {% endfor %}
        </div>
    </section>
    
    <section class="py-20 px-4 max-w-6xl mx-auto reveal">
        <div class="glass-card rounded-[40px] overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch border-0">
            <div class="w-full md:w-1/2 tech-visual-container min-h-[450px] relative bg-pastel-blue flex items-center justify-center">
                 <i class="fas fa-play-circle text-6xl opacity-50 text-white"></i>
            </div>
            <div class="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white/60">
                <h2 class="text-3xl font-bold text-slate-800 mb-6">הידע שמאחורי ההצלחה</h2>
                <p class="text-lg text-slate-600 mb-8 leading-relaxed font-medium">כשיש לך ניסיון של 13 שנים, תואר שני בהוראת המתמטיקה והסמכה להוראה מותאמת, את לא מלמדת "טריקים". את מלמדת חשיבה.</p>
            </div>
        </div>
    </section>

    <section class="py-16 px-4 max-w-3xl mx-auto reveal">
        <h2 class="text-3xl font-bold text-center text-slate-800 mb-10">שאלות נפוצות</h2>
        <div class="space-y-4">
            {% for item in faq %}
            <details class="glass-card rounded-2xl p-5 cursor-pointer group transition-all duration-300 open:bg-white">
                <summary class="font-bold flex justify-between items-center list-none text-slate-800 text-lg">
                    <span>{{ item.question }}</span>
                    <span class="text-purple-400 transition-transform group-open:rotate-180 bg-pastel-lilac w-8 h-8 flex items-center justify-center rounded-full"><i class="fas fa-chevron-down"></i></span>
                </summary>
                <p class="mt-4 text-slate-600 leading-relaxed pl-4 border-r-4 border-pastel-lilac mr-2 {{ item.color }} p-4 rounded-lg">
                    {{ item.answer }}
                </p>
            </details>
            {% endfor %}
        </div>
    </section>

    <section class="py-24 px-4 text-center relative overflow-hidden reveal">
        <div class="max-w-3xl mx-auto relative z-10">
            <h2 class="text-4xl font-black text-slate-800 mb-6">השינוי מתחיל בהודעה</h2>
            <p class="text-xl text-slate-600 mb-12 font-medium">בואו נבדוק התאמה ונבנה תוכנית עבודה להצלחה.</p>
            <a href="https://wa.me/972546969509" target="_blank" class="group inline-flex items-center justify-center gap-4 bg-pastel-coral hover:bg-pastel-coral_hover text-white font-bold text-xl py-5 px-12 rounded-full shadow-2xl shadow-orange-100 transition transform hover:scale-105 hover:-translate-y-1">
                <span>שליחת הודעה בוואטסאפ</span>
                <i class="fab fa-whatsapp text-3xl transition group-hover:rotate-12"></i>
            </a>
        </div>
    </section>
"""

# 4. המרת המאמר והמשחק הקיימים לפורמט של תיקיות
def migrate_content():
    print("Upgrading CMS configuration...")
    
    # עדכון config.yml
    with open(f"{ROOT_DIR}/src/admin/config.yml", "w", encoding="utf-8") as f:
        f.write(config_yml)
    print("✓ Updated src/admin/config.yml")

    # עדכון index.njk
    with open(f"{ROOT_DIR}/src/index.njk", "w", encoding="utf-8") as f:
        f.write(index_njk_dynamic)
    print("✓ Updated src/index.njk to be dynamic")

    # העברת המאמר הקיים
    old_article = f"{ROOT_DIR}/src/hizuk-article.njk"
    new_article = f"{ROOT_DIR}/src/content/articles/hizuk.njk"
    if os.path.exists(old_article):
        # קוראים את התוכן ומוסיפים לו permalink כדי שהקישור לא ישבר
        with open(old_article, "r", encoding="utf-8") as f:
            content = f.read()
        if "permalink:" not in content:
            content = content.replace("---", "---\npermalink: /hizuk-article/", 1)
        
        with open(new_article, "w", encoding="utf-8") as f:
            f.write(content)
        os.remove(old_article)
        print("✓ Moved article to content folder")

    # העברת המשחק הקיים
    old_game = f"{ROOT_DIR}/src/bingo-game.njk"
    new_game = f"{ROOT_DIR}/src/content/games/bingo.njk"
    if os.path.exists(old_game):
        with open(old_game, "r", encoding="utf-8") as f:
            content = f.read()
        if "permalink:" not in content:
            content = content.replace("---", "---\npermalink: /bingo-game/", 1)
            # הוספת שדה pdfFile אם חסר
            content = content.replace('excerpt: "', 'pdfFile: "/assets/bingo-a-g.pdf"\nexcerpt: "')

        with open(new_game, "w", encoding="utf-8") as f:
            f.write(content)
        os.remove(old_game)
        print("✓ Moved game to content folder")

    print("\n------------------------------------------------")
    print("✅ UPGRADE COMPLETE!")
    print("------------------------------------------------")
    print("Now perform these commands to push changes:")
    print("1. git add .")
    print('2. git commit -m "Upgrade CMS structure"')
    print("3. git push")
    print("------------------------------------------------")

if __name__ == "__main__":
    migrate_content()