// Importando Depedências 
import express from "express";
import type { Request, Response } from "express";
import axios from "axios"; 
import cors from "cors"; // permitindo acesso por todas as rotas.
import { JSDOM } from "jsdom";

// Criando o servidor e o armazenar a referência dele em uma variável
const app = express();

// porta do servidor
const PORT = 3000; 

// Permitindo que outros dominios/portas acessem o back
const allowedOrigins = [
  "http://localhost:5173",
  "https://amazon-scraper-front.vercel.app",
  "https://amazon-scraper-hdl7ga0h2-reginaldo-alves-projects.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}));

// Definindo Rota do tipo get, para mandar infomações para o front.
app.get("/api/scrape", async (req: Request, res: Response) => {

  // debugs auxiliares para orientar em que momento ocorreu uma falha
  console.log("\n=== Verificando se a key é válida..."); 
  
  // pegando keyword da url
  const keyword = req.query.keyword as string; 
  
  // se não existir uma keyword, retornar 400 -> requisição inválida.
  if (!keyword) return res.status(400).json({ error: "Keyword is required" });
 
  console.log("=== é válida!");

  try {
    
    console.log("\n=== Acessando Amazon...");

    // botando a keyword na url, e deixando-a no padrão web. espaço == %20
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`; 

    // tentando pegar informações dos produtos da amazon com base na keyword.
    const response = await axios.get(url, {
      headers: {
        // disfaça o back como um navegador, para evitar que a amazon bloqueie o acesso
        'User-Agent': 'Mozilla/5.0', 
      },
    });
    console.log("=== Amazon Acessada!\n");

    console.log("\n=== Transformando os dados da amazon em DOM...");

    // Carregando o html retornado pelo axios, para usá-lo como no front.
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    console.log("=== Dados transformados!");
    
    // Tipo para o produto
    type Product = {
      title:string,
      stars?:string,
      reviews?:number,
      image:string
    }
    
    // Criando array do tipo produto para armazenar os produtos da amazon retornados.
    const products: Product[] = []; 

    console.log("\n=== Filtrando items...");

    

    // Busca apenas os itens que vinheram do resultado pela keyword.
      // ignorando os itens que são patrocinados.
    document.querySelectorAll(".s-result-item").forEach((item) => {

      // Pegando informações necessárias do item
      const title   = item.querySelector("a > h2 > span")?.textContent?.trim();
      const stars   = item.querySelector(".a-icon-alt")?.textContent?.trim();
      const reviewsText = item.querySelector('[data-cy="reviews-block"] .a-link-normal .a-size-base.s-underline-text')?.textContent?.trim();
      const reviews = reviewsText ? parseInt(reviewsText) : undefined;
      const image   = item.querySelector("img")?.src;
      

      // Verificando se nenhum das inforações do item é falsy - null, undefined, '', false, 0
      if (!title || !image) return; // pula para o próximo item.
      
      
      // vendo se o product já existe dentro do array.
      const repeated = products.find((obj:any) => 
        obj.title === title &&
        obj.stars === stars &&
        obj.reviews === reviews &&
        obj.image === image
      );
      
      // verificando
      if (repeated) return; // pula para o próximo item
      
      // Verificação de tipo final... 
      let objTyped:Product = {title, stars, reviews, image};

      // Adicionando o item em questão no array de produtos
      products.push(objTyped);

    });
    
    console.log("=== Itens filtrados!");

    console.log("\n=== Enviando dados...");

    // Mandando os produtos encontrados para o front.
    res.json(products);

    console.log("=== Dados enviados!");

  } 
  catch (err:any) { // Roda se não conseguir pegar os produtos da amazon
    console.error("Error Code: "+err.code);  
    console.error("Error Message: "+err.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }

});

// Inicia o servidor na porta definida, e o mantém ativo.
app.listen(PORT, () => {
  console.log(`Server running on https://amazon-scraper-jsps.onrender.com`);
});
