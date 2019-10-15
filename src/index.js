// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded', () => {
    const fetchQuotes = () => {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(res => res.json())
            .then(quotes => quotes.forEach(addQuote))
    }

    const addQuote = quote => {
        newQuoteLi = document.createElement('li')
        newQuoteLi.className = 'quote-card'
        newQuoteLi.innerHTML = `
              <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${ (quote.likes && quote.likes.length) || 0 }</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        `

        const quoteList = document.getElementById("quote-list")
        quoteList.prepend(newQuoteLi)
    }

    // query for Form
    const newQuoteForm = document.getElementById('new-quote-form')
    // Add submit event listener
    newQuoteForm.addEventListener('submit', event => {
        event.preventDefault()
        // onSubmit, compile data
        const author = event.target['author'].value
        const quote = event.target['new-quote'].value
        const data = {
            author,
            quote
        }
        
        // clear form
        newQuoteForm.reset()

        // send POST fetch
        fetch('http://localhost:3000/quotes', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(addQuote)
    })
    // when it comes back, add to quote-list

    fetchQuotes()
    // End of DOMContentLoaded
}) 