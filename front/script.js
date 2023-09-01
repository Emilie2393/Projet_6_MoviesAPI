
async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error (errorMessage + "Code erreur: " + response.status);
    }
    const data = await response.json()
    return data
}
    

function child(valeur1,valeur2){
    valeur1.appendChild(valeur2);
}

function publishBestMovies(bestMovie){
    const img = document.querySelector('#Banner__Img');
    img.src = bestMovie.image_url;
    img.alt = bestMovie.title;
    const title = document.querySelector('#Banner__Wrap__Title')
    title.textContent = bestMovie.title
}

function publishCarrousel(Pictures){
    console.log(Pictures)
    const container = document.querySelector('#Container')
    for(let i = 0; i < 8; i++){
        img=document.createElement("img")
        img.id="img" + i
        img.src = Pictures[i].image_url
        child(container, img)
    }
}

async function launch(){
    const bestMovie = await getData("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score")
    const cat1Pictures =  await getData("http://127.0.0.1:8000/api/v1/titles/?genre_contains=Fantasy&sort_by=-imdb_score")
    publishBestMovies(bestMovie.results[0])
    publishCarrousel(cat1Pictures.results)
}

launch()

