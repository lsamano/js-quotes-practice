// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
loadPage()

function loadPage() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => {
        // console.log("Fetched Quotes", quotes)
        // enumerate over the quotes
        quotes.forEach(quote => addQuoteToList(quote))
        
        // add event listener to quote list
        const quoteList = document.querySelector('#quote-list')
        quoteList.addEventListener('click', event => {
            // console.log(event.target.className);
            const quoteCard = event.target.parentElement.parentElement
            const id = parseInt(quoteCard.dataset.id)
            if (event.target.className === 'btn-danger') {
                console.log(id);
                
                fetch(`http://localhost:3000/quotes/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(() => {
                    // Slap quote off DOM
                    quoteCard.remove()
                })
            } else if (event.target.className === 'btn-success') {
                // let likes = parseInt(event.target.querySelector('span').innerText) + 1
                fetch('http://localhost:3000/likes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteId: id
                    })
                })
                .then(res => res.json())
                .then(likeObject => {
                    const span = event.target.querySelector('span')
                    span.innerText = parseInt(span.innerText) + 1
                })
            }
        })
    })
}

const addQuoteToList =  quote => {
    // for each quote, we place it on the page 
    // as a card in the quoteList
    const quoteList = document.querySelector('#quote-list')
    quoteList.innerHTML += `
            <li class='quote-card' data-id='${quote.id}'>
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger' data-id='${quote.id}'>Delete</button>
            </blockquote>
            </li>
            `

}

const newQuoteForm = document.querySelector('#new-quote-form')
newQuoteForm.addEventListener('submit', (event) => {
    // debugger
    const newQuote = event.target["new-quote"].value
    const newAuthor = event.target["author"].value

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(res => res.json())
    .then(quote => {
        addQuoteToList(quote)
    })
})