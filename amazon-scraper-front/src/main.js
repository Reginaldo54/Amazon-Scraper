// === Importando elementos HTML
const scraperBtn = document.getElementById("scraperBtn");
const scraperInput = document.querySelector(".user-interact > input");
const resultsDiv = document.getElementById("product-results");
const scraperHeader = document.querySelector(".main-header-container");

// Estados do botão search
const buttonSearchStates = {
  default: 'Search',
  loading: 'Searching...',
  ok: 'OK!',
  error: 'Error',
  tryAgain:'Try Again!',
  searchAgain:'Search Again'
}

// Função para mudar os estados do botão -> feedback visual simples
function changeButtonState(state) {

  let idTimeout;

  // Alterando o texto do botão.
  scraperBtn.textContent = state;

  // duração do timeout
  const duration = 2000; 
  
  // Closure
  return () => {

    // Resetar o timeout caso ele já existir
    if (idTimeout) clearTimeout(idTimeout); 

    // Caso o estado for OK
    if (state === buttonSearchStates.ok) {

        idTimeout = setTimeout(() => {
          scraperBtn.textContent = buttonSearchStates.searchAgain; // texto padrão do botão.
          idTimeout = null;
        }, duration);
    }

    // Caso o state for ERROR
    if (state === buttonSearchStates.error) {
      idTimeout = setTimeout(() => {
        
        alert("Error fetching data, check console for more details");
        
        // usado quando deu error na requisição.
        scraperBtn.textContent = buttonSearchStates.tryAgain; 
        idTimeout = null;
      }, duration);
    }
    
  };
}

// Função que inicia o scraper
async function getProducts() {
   
   // Mudando o texto do botão de search
   changeButtonState(buttonSearchStates.loading)();

   // pegando e verificando a keyword
   const keyword = document.getElementById("keyword").value;
   if (!keyword) return alert("Please enter a keyword"); // inválido? ent encerre a função e peça uma nova keyword.
  
  // Animação dos produtos sumirem é ativada quando já existem produtos na tela.
  if (resultsDiv.dataset.animationState === 'produtos_apareceram') 
    resultsDiv.style.animation = "produtos-somem 3s ease-in-out both";
    
  // testa o código interno, em caso de error ele o envia para o catch. e não trava o programa por causa dele.
  try { 

    // Passando a keyword dada no front, para o back, e esperando um retorno com os produtos relacionados...
    const response = await fetch(`https://amazon-scraper-jsps.onrender.com/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    // Resposta do back: produtos ou error
    const productData = await response.json();
    
    // Mudar texto do botão para OK
    changeButtonState(buttonSearchStates.ok)();

    // Rodando a animação do "header" subindo após input, apenas uma vez.
    if (resultsDiv.dataset.animationState === 'default') 
      scraperHeader.style.animation = "header-sobe 2.5s ease-in-out forwards";
    

    // resetando os produtos presentes na tela (Se existirem)
    resultsDiv.innerHTML = "";

    // Atualizando os produtos.
    productData.forEach((item) => {

      resultsDiv.innerHTML += `
        <div class="product-container">
          <div class="product-img-container">
            <img class="product-img"   src="${item.image}" alt="${item.title}"/>
          </div>
          <h3 class="product-title" title="${item.title}">${item.title}</h3>
          <p class="product-stars">${item.stars || "No rating"}</p>
          <p class="product-reviews">${item.reviews || "0"} reviews</p>
        </div>
      `;

    });

    // Atualizando o estado padrão, para evitar que o estado default ative a animação do header.
    if (resultsDiv.dataset.animationState !== 'produtos_apareceram') 
      resultsDiv.dataset.animationState = 'produtos_apareceram'; 
    
    // Ativando a animação do item aparecer. -> substitue a animação de saida (se foi usada.)
    resultsDiv.style.animation = 'produtos-aparecem 3s ease-in-out both';
   
  } 
  // pegando o error o mostra: Feedback visual...
  catch (err) {

    // Mudando o texto do botão  para Error
    changeButtonState(buttonSearchStates.error)();

    // Mostrar error no console
    console.error(err);
  }
}

// ===- Formas de iniciar o Scraper:, 

//  clicaando no botão 'Search'
scraperBtn.addEventListener("click", getProducts); 

// Dando enter quando escrever algo no input.
scraperInput.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    getProducts();
    scraperInput.blur(); // tirando o focus do input.
  }
});
