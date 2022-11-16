const PORT = process.env.PORT || 4000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspage = [
    {
        name: 'wired',
        address: 'https://www.wired.com/category/security/',
        base: 'https://www.wired.com'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/technology/data-computer-security',
        base: ''
    },
    {
        name: 'hackernews',
        address: 'https://thehackernews.com/',
        base: ''       
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/',
        base: ''
    },
    {
        name: 'washingtonpost',
        address: 'https://www.washingtonpost.com/',
        base: ''
    }
]

const articleArray = []

newspage.forEach(newspage => {
    axios.get(newspage.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("cyber")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articleArray.push({
                    title,
                    url: newspage.base + url,
                    source: newspage.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('cybersecurity news api')
})

app.get('/news', (req, res) => {
    res.json(articleArray)
})

app.get('/news/:newspageId', (req, res) => {
    const newspageId = req.params.newspageId
    const newspageAddress = newspage.filter(newspage => newspage.name == newspageId)[0].address
    const newspageBase = newspage.filter(newspage => newspage.name == newspageId)[0].base

    axios.get(newspageAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const article = []

            $('a:contains("cyber")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                article.push({
                    title,
                    url: newspageBase + url,
                    source: newspageId
                })
            })
            res.json(article)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('server running on port 4000'))