const cards = document.querySelector(".cards article")

const get = async (query) => {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const data = await response.json();

    return data
}

const use = async (query) => {
    const data = await get(query)
    const {results} = data
    
    for(let item of results){
        const card = document.createElement("div")
        const {
            id,
            thumbnail,
            title,
            price,
            permalink
        } = item

        card.classList.add("card")
        card.id = id

        card.innerHTML = `
            <a href="${permalink}" target="_blank" rel="noopener noreferrer">
                <img src="${thumbnail.replace(/\w\.jpg/gi, "W.jpg")}" alt="imagem produto">
            </a>
            <a href="${permalink}" target="_blank" rel="noopener noreferrer" class="price">
                <strong><p>R$ ${price}</p></strong>
                <p class="description">${title}</p>
            </a>
            <div class="add-carrinho">
                <button>
                    <ion-icon name="heart"></ion-icon>
                </button>
            </div>
        `
        cards.appendChild(card)
    }

    addCarrinho()

}

use("iphone")

const searchProduct = () => {
    const inp = document.querySelector("input")
    inp.addEventListener("change", buscar)

    function buscar(context){
        const value = context.target.value
        const cards = document.querySelectorAll("main article .card")

        if(cards) cards.forEach(card => card.remove())
        
        use(value)
        context.target.value = ""
    }
}

searchProduct()

const carrinho = []

function addCarrinho(){
    const products = document.querySelectorAll("main .cards article .card button")
    const count = document.querySelector(".count")
    
    for(let product of products){
        product.addEventListener("click", () => {
            const img = product.offsetParent.offsetParent.children[0].children[0].src
            const price = product.offsetParent.offsetParent.children[1].children[0].textContent
            const description_product = product.offsetParent.offsetParent.children[1].children[1].textContent
            
            const produto = {
                img_product : img,
                price_product : price,
                description_product : description_product
            }

            carrinho.push(produto)
            count.textContent = carrinho.length
    
            const cardsCarrinho = document.querySelectorAll("aside article .card")

            if(cardsCarrinho) cardsCarrinho.forEach(cardCarrinho => cardCarrinho.remove())

            addProduct()
            realizarComprar()
        })
    }

    function addProduct(){ 
        carrinho.forEach((data) => {
            const {
                img_product,
                price_product,
                description_product
            } = data
            
            const cardsDom = document.querySelector("aside article")
            const card = document.createElement("a")
            card.classList.add("card")
            card.innerHTML = `
                <img src="${img_product}" alt="imagem produto">
                <div class="price">
                    <strong><p>${price_product}</p></strong>
                    <p class="description">${description_product}</p>
                </div>
            `
            
            cardsDom.appendChild(card)
        })
        calcularPrice()
        removeCardSelecionado()
    }
}

addCarrinho()

function openCarrinho(){
    const btnOpen = document.querySelector(".carrinho button")
    const btnClose = document.querySelector(".btn-close button")
    const carrinhoDOM = document.querySelector("header aside")
    
    btnOpen.addEventListener("click", open)
    btnClose.addEventListener("click", close)

    function open(){
        if(carrinhoDOM.className === "active"){
            carrinhoDOM.classList.remove("active")
        }
    }
    function close(){
        carrinhoDOM.classList.add("active")
    }
}

openCarrinho()

function calcularPrice(){
    const priceDom = document.querySelector("aside .comprar p")
    const price = document.querySelector("aside .comprar p").textContent
    const valueDom = parseInt(price)

    carrinho.forEach(value => {
        const {price_product} = value
        const formated_price = price_product.split("R$")
        const price = formated_price.join("")
        const calc = parseInt(price)

        priceDom.innerHTML = valueDom + calc
    })
}

calcularPrice()

function removeCardSelecionado(){
    const cards = document.querySelectorAll("aside article .card")
    const priceDom = document.querySelector("aside .comprar p")
    const price = document.querySelector("aside .comprar p").textContent
    const valueDom = parseInt(price)
    const count = document.querySelector(".count")
    
    cards.forEach((cardAside, index) => {
        cardAside.addEventListener("click", () => {
            const {textContent} = cardAside.children[1].children[0]
            
            const formated_price = textContent.split("R$")
            const price = formated_price.join("")
            const calc = parseInt(price)
            
            priceDom.innerHTML = valueDom - calc
            count.textContent = carrinho.length
            
            carrinho.splice(index, 1);
            cardAside.remove()
        })
    })
}

removeCardSelecionado()

function realizarComprar(){
    const comprar = document.querySelector("header aside .comprar button")
    const cards = document.querySelectorAll("aside article .card")
    const priceDom = document.querySelector("aside .comprar p")
    const count = document.querySelector(".count")

    comprar.addEventListener("click", () => {
        priceDom.innerHTML = 0
        count.textContent = carrinho.length === 0 && ""

        carrinho.splice(0, carrinho.length)
        cards.forEach(card => card.remove())
    })
}

realizarComprar()
