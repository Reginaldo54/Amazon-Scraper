# Amazon Scraper Com Bun & Vite

##   Deploys
- Deploy do front: https://amazon-scraper-front.vercel.app
- Deploy do  back: https://amazon-scraper-jsps.onrender.com

## 🧪 Como usar
- Acesse o frontend via navegador -> pelo deploy ou localmente.
- Insira uma palavra-chave (ex: laptop) na entrada de texto
- Clique em "Search" para ver os produtos extraídos da primeira página da Amazon

---
## ⚠️ Observação:
- Como a Amazon bloqueia scrapers facilmente, esse script pode falhar se a requisição for detectada como bot (acontece muito com deploys...).
- Caso os script nos deploys não funcionarem como devido, tente localmente! O script funciona melhor localmente.
---

## Quer usar localmente? Siga o passo a passo!

## 📦 Backend

### Entre na pasta do Back-end
```bash
cd amazon-scraper-back
```

### Instale as dependências do projeto
```bash
bun install
```

### Rode a API
```bash
bun run index.ts
```
**⚠️Observação:**
- endpoint do back: /api/scrape?keyword=
- exemplo de uso: https://amazon-scraper-jsps.onrender.com/api/scrape?keyword=laptop

## 💻 Front

### Entre na pasta do Front-end
```bash
cd amazon-scraper-front
```

### Instale as dependências do projeto Vite
```bash
npm install
```

### Rode o projeto
```bash
npm run dev
```

**⚠️Observação:** Para acessar o back localmente, se deve alterar a url da requisição presente em: amazon-scraper-front/src/main.js e por http://localhost:3000/ no lugar do deploy do back: https://amazon-scraper-jsps.onrender.com

![Screenshot_6](https://github.com/user-attachments/assets/57506fe7-451b-445c-8854-c70e50612b02)

![Screenshot_5](https://github.com/user-attachments/assets/77eefe85-daa4-44e2-ad68-74666437efd2)

