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

function slider(category, number){
    const button = document.querySelectorAll(`.Category${number}__button`)
    const firstCard = document.getElementsByTagName("li")[0].offsetWidth;
    const carouselCards = [...category.children]
    // move carousel left or right by the size of one card
    button.forEach(btn => {
        btn.addEventListener("click", () => {
            category.scrollLeft += btn.id === "left" ? -firstCard : firstCard
        })
    })
    // count numbers of cards who fits into carousel
    let card = Math.round(category.offsetWidth / firstCard)
    // add 3 cards before start of the 7 movie tags 
    carouselCards.slice(-card).reverse().forEach(card => {
        category.insertAdjacentHTML("afterbegin", card.outerHTML);
    })
    // add 3 cards after the end of the 7 movie tags 
    carouselCards.slice(0, card).forEach(card => {
        category.insertAdjacentHTML("beforeend", card.outerHTML);
    })
    // go to position needed if scroll is at beginning or end of carousel
    const infiniteScroll = () => {
        category.classList.add("no-transition");
        if (category.scrollLeft === 0) {
            category.scrollLeft = category.scrollWidth - (2 * category.offsetWidth);   
        } else if (Math.ceil(category.scrollLeft) === category.scrollWidth - category.offsetWidth){
            category.scrollLeft = category.offsetWidth;
        }
        category.classList.remove("no-transition")
    }
    category.addEventListener("scroll", infiniteScroll)
}

function modal(page, page2){
    selected = document.querySelectorAll("img")
    for (let i = 1; i < selected.length; i++) {
        // if selected movie.id match api movie.id then create modal 
        // for this movie with api infos
        const openModal = () => {
            for (let e=0; e < page.length; e++){
                if (selected[i].id == page[e].id){
                    createModal(page[e])
                }
            }
            for (let e=0; e < page2.length; e++){
                if (selected[i].id == page2[e].id){
                    createModal(page2[e])
                }
            }
        }
        selected[i].addEventListener("click", openModal)
    }
}

async function createModal(movie){
    let page = document.querySelector('.Page')
    let section = document.createElement("div")
    child(page, section)
    section.className = "Modal"
    let divFlex = document.createElement("div")
    divFlex.className = "Modal__flex"
    child(section, divFlex)
    let button = document.createElement("button")
    button.className = "Modal__flex__button"
    button.textContent = "X"
    button.addEventListener('click', function(){
        section.style.display = "none"
    })
    child(divFlex, button)
    let inner = document.createElement("div")
    child(divFlex, inner)
    let modalImg = document.createElement("img")
    modalImg.src = movie.image_url
    child(inner, modalImg)
    let h4 = document.createElement("h4")
    h4.innerHTML = movie.title
    child(inner, h4)
    const getInfos = await fetch(movie.url)
    const newInfos = await getInfos.json()
    let infos = document.createElement("p")
    infos.innerHTML = `Realisateur: ${movie.directors} <br>Description: ${newInfos.description} <br>Genres: ${movie.genres} <br>Année: ${movie.year}
                    <br>Note: ${newInfos.rated} <br>Score imdb: ${movie.imdb_score} <br>Acteurs: ${movie.actors}
                    <br>Durée: ${newInfos.duration} <br>Pays: ${newInfos.countries} <br>Résultats box-office: ${newInfos.worldwide_gross_income}`
    child(inner, infos)
}

async function checkImg(url) {
    try {
        response = await fetch(url)
    } catch(erreur) {
        console.log("Lien mort sur l'API:", erreur)
        return false
    }
    return response
}

async function publishCarrousel(pictures, nextPictures, number) {
    newPage = 0
    nb = 7
    const page = document.querySelector(".Page")
    const container = document.querySelector(`.Category${number}__carousel`)
    for (let i = 0; i < nb; i++) {
        let li = document.createElement("li")
        li.className = "card"
        child(container, li)
        let div = document.createElement("div")
        div.className = "img"
        child(li, div)
        let img = document.createElement("img")
        child(div, img)
        if (pictures[i] == undefined) {
            let url = nextPictures[newPage].image_url
            img.src = url
            img.id = nextPictures[newPage].id
            test = await checkImg(url)
            if (test.status === 404 || !test){
                url = nextPictures[newPage + 1].image_url
                img.src = url
                img.id = nextPictures[newPage + 1].id
            }
            newPage += 1
        }
        else {
            let url = pictures[i].image_url
            img.src = url
            img.id = pictures[i].id
            test = await checkImg(url)
            if (test.status === 404 || !test){
                url = pictures[i + 1].image_url
                img.src = url
                img.id = pictures[i + 1].id
                i += 1
                nb += 1
            }
        }
    }
    page.style.display = "flex"
    slider(container, number)
}


async function launch() {
    const bestMovie = await getData("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score")
    const bestMovieNextPage = await getData("http://127.0.0.1:8000/api/v1/titles/?page=2&sort_by=-imdb_score")
    const cat1Pictures = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=crime&sort_by=-imdb_score")
    const cat1NextPage = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=crime&page=2&sort_by=-imdb_score")
    const cat2Pictures = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=adventure&sort_by=-imdb_score")
    const cat2NextPage = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=adventure&page=2&sort_by=-imdb_score")
    const cat3Pictures = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=Fantasy&sort_by=-imdb_score")
    const cat3NextPage = await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=Fantasy&page=2&sort_by=-imdb_score")
    publishBestMovies(bestMovie.results[0])
    await publishCarrousel(bestMovie.results, bestMovieNextPage.results, 0)
    await publishCarrousel(cat1Pictures.results, cat1NextPage.results, 1)
    await publishCarrousel(cat2Pictures.results, cat2NextPage.results, 2)
    await publishCarrousel(cat3Pictures.results, cat3NextPage.results, 3)
    modal(bestMovie.results, bestMovieNextPage.results)
    modal(cat1Pictures.results, cat1NextPage.results)
    modal(cat2Pictures.results, cat2NextPage.results)
    modal(cat3Pictures.results, cat3NextPage.results)
}

launch()


