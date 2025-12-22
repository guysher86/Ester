# מתמטיקה בביטחון — אתר One‑Pager ל‑GitHub Pages

זהו אתר סטטי בעברית (RTL) שמטרתו לפתוח שיחת WhatsApp חדשה עם הפרטים שההורה הזין:
- שם פרטי
- שם משפחה
- שם הילד/ה

## מה חשוב
- האתר **לא שומר** פרטים באתר.
- אין מחיר וזמינות באתר — הכול נעשה ב‑WhatsApp.
- מספר היעד המוגדר כעת: `972546969509`

## קבצים
- `index.html`
- `styles.css`
- `script.js`
- `.nojekyll` (מונע עיבוד Jekyll)

## שינוי מספר WhatsApp
פתחי את `index.html` וחפשי:
`window.__WHATSAPP_PHONE__ = "..."`

ושני את המספר בפורמט בינלאומי (לישראל 972… ללא 0 בתחילת המספר).

## פרסום ב‑GitHub Pages (Project Pages)
1. צרי Repository חדש ב‑GitHub (למשל `matematika-bebitachon`).
2. העלי את כל הקבצים לתיקיית השורש (Root) של הריפו.
3. לכי ל‑Settings → Pages.
4. תחת “Build and deployment”, בחרי Deploy from a branch, ובחרי branch `main` ו‑folder `/ (root)`.
5. שמרי — ואז GitHub ייתן לך URL.

GitHub מחפש `index.html` בתיקיית המקור שנבחרה.  

בהצלחה!
