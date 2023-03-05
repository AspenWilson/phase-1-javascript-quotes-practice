//Declaring consts

const quoteList = document.querySelector('#quote-list')
const addForm = document.querySelector('#new-quote-form')

function fetchQuotes() {
    fetch (`http://localhost:3000/quotes?_embed=likes`)
    .then (resp => resp.json())
    .then (quotes => quotes.forEach(quote => renderQuote(quote)))
}

//Displaying quotes and caling fn
function renderQuote (quote){
    let quoteLi= document.createElement('li')
    quoteLi.className= 'quote-card'
    quoteLi.id=`${quote.id}`
    quoteLi.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span id='likes'>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>`
    quoteList.appendChild(quoteLi)

    quoteLi.querySelector('.btn-danger').addEventListener('click', () => {
        quoteLi.remove()
        deleteQuote(quote.id)
    })
    
    quoteLi.querySelector('.btn-success').addEventListener('click', (e)=> {
        e.preventDefault()
        let quoteId= parseInt(`${quoteLi.id}`)
        let likes= quoteLi.querySelector('#likes')
        likes.textContent++
        let likeCount = likes.textContent
        fetch(`http://localhost:3000/likes/`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'accepts' : 'application/json'
            },
            body: JSON.stringify({
                quoteId:quoteId
            })
        })
        .then(resp=>resp.json())
    })
}




//Adding a new quote and calling fn
function addQuote() {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const newQuote = addForm.quote.value
        const newAuthor = addForm.author.value
        fetch (`http://localhost:3000/quotes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accepts' : 'application/json'
            },
            body: JSON.stringify ({
                quote : newQuote,
                author : newAuthor,
            })
        })
        .then(resp => resp.json())
        .then(data => {
            let quoteLi= document.createElement('li')
            quoteLi.className= 'quote-card'
            quoteLi.id=`${data.id}`
            quoteLi.innerHTML = `
                <blockquote class="blockquote">
                  <p class="mb-0">${data.quote}</p>
                  <footer class="blockquote-footer">${data.author}</footer>
                  <br>
                  <button class='btn-success'>Likes: <span id='likes'>0</span></button>
                  <button class='btn-danger'>Delete</button>
                </blockquote>`
            quoteList.appendChild(quoteLi)
        
            quoteLi.querySelector('.btn-danger').addEventListener('click', () => {
                quoteLi.remove()
                deleteQuote(data.id)
            })
            
            quoteLi.querySelector('.btn-success').addEventListener('click', (e)=> {
                e.preventDefault()
                let likes= quoteLi.querySelector('#likes')
                likes.textContent++
                fetch(`http://localhost:3000/likes`, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                        'accepts' : 'application/json'
                    },
                    body: JSON.stringify({
                        quoteId: parseInt(quote.id),
                        id: parseInt(likes.textContent)
                    })
                })
                .then(resp=>resp.json())
                })
            })
        })
    }

addQuote()

//handling the delete btn

function deleteQuote (id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        }
    })
    .then(resp=> resp.json())
    .then(quote=> console.log(quote) )
}



fetchQuotes()