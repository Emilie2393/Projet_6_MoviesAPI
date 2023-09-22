async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(errorMessage + "Code erreur: " + response.status);
    }
    const data = await response.json()
    return data
}


function child(valeur1, valeur2) {
    valeur1.appendChild(valeur2);
}

function publishBestMovies(bestMovie) {
    const img = document.querySelector('#Banner__Img');
    img.src = bestMovie.image_url;
    img.alt = bestMovie.title;
    const title = document.querySelector('#Banner__Wrap__Title')
    title.textContent = bestMovie.title
}

function Slider(category, number){
    const button = document.querySelectorAll(`.Category${number}__button`)
    const firstCard = document.getElementsByTagName("li")[0].offsetWidth;
    const carouselCards = [...category.children]
    button.forEach(btn => {
        btn.addEventListener("click", () => {
            category.scrollLeft += btn.id === "left" ? -firstCard : firstCard
        })
    })
    let card = Math.round(category.offsetWidth / firstCard)
    carouselCards.slice(-card).reverse().forEach(card => {
        category.insertAdjacentHTML("afterbegin", card.outerHTML);
    })
    carouselCards.slice(0, -card).forEach(card => {
        category.insertAdjacentHTML("beforeend", card.outerHTML);
    })
    const infiniteScroll = () => {
        if (category.scrollLeft === 0) {
            category.classList.add("no-transition");
            category.scrollLeft = category.scrollWidth - (2.5 * category.offsetWidth);   
            category.classList.remove("no-transition")
        } else if (Math.ceil(category.scrollLeft) === category.scrollWidth - category.offsetWidth){
            category.classList.add("no-transition")
            category.scrollLeft = category.offsetWidth * 1.5;
            category.classList.remove("no-transition")
        }
        
    }
    category.addEventListener("scroll", infiniteScroll)
    
}

async function checkImg(url) {
    try {
        response = await fetch(url)
        console.log(response)
    } catch(erreur) {
        console.log(erreur)
        return false
    }
    return response
}

async function publishCarrousel(pictures, nextPictures, number) {
    newPage = 0
    const container = document.querySelector(`.Category${number}__carousel`)
    for (let i = 0; i < 7; i++) {
        let li = document.createElement("li")
        li.className = "card"
        child(container, li)
        let div = document.createElement("div")
        div.className = "img"
        child(li, div)
        let img = document.createElement("img")
        img.id = "img" + i
        child(div, img)
        console.log("1",img)
        if (pictures[i] == undefined) {
            let url = nextPictures[newPage].image_url
            test = await checkImg(url)
            console.log("yo",test)
            if (test.status === 404 || !test){
                url = nextPictures[newPage + 1].image_url
                img.src = url
                console.log("dhud", url)
            }
            img.src = url
            newPage += 1
        }
        else {
            img.src = pictures[i].image_url
        }
    }
    Slider(container, number)
}

async function launch() {
    const bestMovie = await getData("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score")
    const cat1Pictures = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=Fantasy&sort_by=-imdb_score")
    const cat2Pictures = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=thriller&sort_by=-imdb_score")
    const cat1NextPage = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=Fantasy&page=2&sort_by=-imdb_score")
    const cat2NextPage = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=thriller&page=2&sort_by=-imdb_score")
    publishBestMovies(bestMovie.results[0])
    await publishCarrousel(cat1Pictures.results, cat1NextPage.results, 1)
    await publishCarrousel(cat2Pictures.results, cat2NextPage.results, 2)
}

launch()

