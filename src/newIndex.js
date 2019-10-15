// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded', () => {
    loadPage()
})

function loadPage() {
    // fetch all quotes on page load
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(res => res.json())
        .then(quotes => {
            // enumerate over the quotes
            quotes.forEach(quote => addQuoteToList(quote))
        })
}

const addQuoteToList = quote => {
    // for each quote, we place it on the page 
    // as a card in the quoteList
    
    // Make the li
    const newQuoteLi = document.createElement('li')
    newQuoteLi.className = 'quote-card'
    // Add innerHTML to the li
    newQuoteLi.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0 quote-content">${quote.quote}</p>
    <footer class="blockquote-footer quote-author">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='edit-button'>Edit</button>
    </blockquote>
    `
    // Add functionality to the like button
    // To keep the code clean, we defined a new function here
    // and passed in the quote object AND the li related to the quote
    likingQuote(quote, newQuoteLi)
    
    //////////////////////////// EDIT ////////////////////////////////

    // query for the edit button within the li
    const editButton = newQuoteLi.querySelector('.edit-button')

    // add a click event to the button
    editButton.addEventListener('click', event => {
        // Make the edit form
        const form = document.createElement('form')
        form.id = 'edit-form'
        form.innerHTML = `
        <input name='quote' value="${quote.quote}" />
        <input name='author' value="${quote.author}" />
        <input type='submit' />
        `
        // give edit form submit event
        form.addEventListener('submit', event => {
            event.preventDefault()
            // updateQuote(quote, newQuoteLi)
            // debugger
            updatedAuthor = event.target.author.value
            updatedQuoteContent = event.target.quote.value
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    author: updatedAuthor,
                    quote: updatedQuoteContent
                })
            })
            .then(res => res.json())
            .then(updatedQuote => {

                const content = newQuoteLi.querySelector('.quote-content')
                content.innerText = updatedQuote.quote

                const authorBlockQuote = newQuoteLi.querySelector('.quote-author')
                authorBlockQuote.innerText = updatedQuote.author
                editButton.style = 'display: block;'
                form.remove()
                // debugger
            })
        })
        // place edit form in Li
        newQuoteLi.append(form)
        // hide edit button to prevent multiple edit forms
        editButton.style = 'display: none;'
    })
    ////////////////////////////////////////////////////////////

    // Add delete event
    const deleteButton = newQuoteLi.querySelector('.btn-danger')
    deleteButton.addEventListener('click', event => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(() => {
            // Slap quote off DOM
            newQuoteLi.remove()
        })
    })
    
    const quoteList = document.querySelector('#quote-list')
    quoteList.prepend(newQuoteLi)
}

// Adds functionality to the like button
const likingQuote = (quote, newQuoteLi) => {
    // query for like button
    const likeButton = newQuoteLi.querySelector('.btn-success')
    // add click event to the button 
    likeButton.addEventListener('click', event => {
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
            .then(res => res.json())
            .then(likeObject => {
                // query for the span within the given li
                const span = newQuoteLi.querySelector('span')
                // +1 on the number of likes
                span.innerText = parseInt(span.innerText) + 1
            })
    })
}

////////////////////// CREATE /////////////////////////

// query for form
const newQuoteForm = document.querySelector('#new-quote-form')
// add submit event to form
newQuoteForm.addEventListener('submit', (event) => {
    
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
            // reusing the addQuoteToList function
            // which accepts a quote object, turns it into an li,
            // makes the edit, like, and delete buttons work,
            // and then places it on the DOM, within the quote-list ul
            addQuoteToList(quote)
        })
})