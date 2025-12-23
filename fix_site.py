import os

ROOT_DIR = "my-math-site"

# 1. קובץ התעלמות - מונע העלאת תיקיות מערכת מיותרות
gitignore_content = """
node_modules/
_site/
.DS_Store
*.pyc
__pycache__/
"""

# 2. קובץ הוראות לקריאה
readme_content = """
# מתמטיקה בצעד בטוח

אתר סטטי שנבנה באמצעות Eleventy ו-Tailwind CSS.
מנוהל באמצעות Decap CMS.

## הרצה מקומית
1. npm install
2. npm start
"""

def prepare():
    print("Preparing files for deployment...")
    
    # יצירת .gitignore
    with open(f"{ROOT_DIR}/.gitignore", "w", encoding="utf-8") as f:
        f.write(gitignore_content)
    print("✓ Created .gitignore")
    
    # יצירת README
    with open(f"{ROOT_DIR}/README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)
    print("✓ Created README.md")

    print("\n------------------------------------------------")
    print("מוכן להעלאה ל-GitHub!")
    print("עבור לשלב הבא בהודעה של הג'ימני.")
    print("------------------------------------------------")

if __name__ == "__main__":
    prepare()