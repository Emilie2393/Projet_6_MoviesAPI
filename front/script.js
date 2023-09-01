
async function getBestMovie(url) {
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

async function launch(){
    const bestMovie = await getBestMovie("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score")
    publishBestMovies(bestMovie.results[0])
}

launch()

