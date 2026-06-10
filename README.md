# Codveda Data Analysis Project

An interactive portfolio website showcasing data analytics work completed during the **Codveda Technologies Data Analytics Internship**. The site presents projects, live Chart.js visualisations, and key findings from real datasets — from EDA and cleaning through machine learning, clustering, NLP, and dashboard design.

**Author:** Dihini Nihinsa

---

## Live Demo

Deploy the site using  https://dihini.ninsa.github.io/Codveda_DataAnalysis_Project/

## Features

- **Single-page application** with four sections: Home, Projects, Explore Data, and About
- **Interactive charts** powered by Chart.js (iris EDA, regression, K-Means, churn, stock, NLP)
- **Project filtering** by level (Foundations, Intermediate, Advanced)
- **Dark / light theme** toggle with saved preference
- **Responsive layout** with mobile navigation
- **Deep linking** via URL parameters (`?page=projects`, `?page=explorer&tab=churn`)

---

## Project Structure

```text
Codveda_Portfolio_Website/
├── index.html          # Main SPA — all pages and content
├── style.css           # Styling, themes, responsive layout
├── script.js           # Navigation, charts, filters, theme toggle
├── projects.html       # Redirect → index.html?page=projects
├── datasets.html       # Redirect → index.html?page=explorer
├── skills.html         # Redirect → index.html?page=about
├── contact.html        # Redirect → index.html?page=about
└── notebooks/          # Jupyter notebooks (analysis source work)
    ├── Level2_DataAnalytics.ipynb
    ├── Level3_Task1_Classification_ipynb.ipynb
    └── Level3_Task2.ipynb
```

---

## Tasks & Projects Covered

| Task | Focus | Highlights |
|------|--------|------------|
| **Task 1** | EDA & foundations | Iris data cleaning, correlation (0.96 petal correlation), visualisation |
| **Task 2** | Intermediate ML | K-Means clustering, elbow method (k=3), house price regression |
| **Task 3** | Advanced analytics | Churn classification, stock dashboard, NLP sentiment analysis |

### Datasets

- Iris Dataset
- Boston / House Prediction Dataset
- Telecom Customer Churn
- Stock Prices (2017)
- Social Media Sentiment

### Tools & Libraries

`Python` · `pandas` · `NumPy` · `matplotlib` · `seaborn` · `scikit-learn` · `NLTK` · `TextBlob` · `Power BI` · `Chart.js`

---

## Getting Started

No build step or package install is required. This is a static HTML/CSS/JavaScript site.

### Option 1 — Open directly

1. Clone or download this repository.
2. Double-click `index.html` to open it in your browser.

### Option 2 — Local server (recommended)

**Python**

```powershell
cd Codveda_Portfolio_Website
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000)

**Node.js**

```powershell
cd Codveda_Portfolio_Website
npx serve .
```

### Option 3 — Live Server (VS Code / Cursor)

Right-click `index.html` → **Open with Live Server**.

---

## Pages & Routes

| Page | URL |
|------|-----|
| Home | `index.html` |
| Projects | `index.html?page=projects` |
| Explore Data | `index.html?page=explorer` |
| About | `index.html?page=about` |
| Specific chart | `index.html?page=explorer&tab=iris` |

Supported explorer tabs: `iris`, `regression`, `kmeans`, `churn`, `stock`, `nlp`

---

## Deploy for Others to Use

### Deploy with GitHub Pages

1. Create a public repository on GitHub and push this project:

```powershell
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Codveda_DataAnalysis_Project.git
git push -u origin main
```

2. On GitHub: **Settings** → **Pages** → Source: **main** branch, **/ (root)** folder.
3. Your site will be live at:

```text
https://YOUR_USERNAME.github.io/Codveda_DataAnalysis_Project/
```

### Deploy with Netlify

1. Sign up at [netlify.com](https://www.netlify.com).
2. Drag the project folder onto the Netlify dashboard.
3. Share the generated `.netlify.app` URL.

---

## Notebooks

Analysis notebooks are included in the `notebooks/` folder:

- **Level2_DataAnalytics.ipynb** — Regression (house prices) and K-Means clustering (iris)
- **Level3_Task1_Classification_ipynb.ipynb** — Customer churn classification with Grid Search
- **Level3_Task2.ipynb** — Stock prices feature engineering and Power BI dashboard

---

## Contact

- **GitHub:** [dihini-ninsa](https://github.com/dihini-ninsa)
- **LinkedIn:** [dihini-nihinsa](https://linkedin.com/in/dihini-nihinsa-7a794a312)
- **Email:** dgalappaththi.20@gmail.com

---

## License

This project was created as part of the Codveda Technologies Data Analytics Internship portfolio. Feel free to use it as a reference for your own learning.
