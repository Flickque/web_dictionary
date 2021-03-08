const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {    
    res.send('Глоссарий употребляемых терминов ВКР.<br><b>Автор</b>: Пословский Захар<br><a href="/dictionary">Словарь</a><br><a href="/mindmap">Карта</a><br><a href="/Киберспорт">Пример понятия</a><br>')    
})

app.get('/dictionary', (req, res) => {
    const data = fs.readFileSync('map_dictionary.json')
    const dictionary = JSON.parse(data)
    let dict_string = ""
    dictionary.nodeDataArray.forEach(function (val, idx) {
        dict_string += `<a href='/${val.text}'><strong>${val.text}</strong></a> — ${val.defenition}<br>`
    })
    res.send(dict_string)
})

app.get('/mindmap', (req, res) => {
    res.sendfile('index.html');
})

app.get('/:key', (req, res) => {
    try {
        const data = fs.readFileSync('map_dictionary.json')
        const dictionary = JSON.parse(data)
        let array = {};
        let key = req.params.key.replace(/_/g, ' ')       
        dictionary.nodeDataArray.forEach(function (val, idx) {
            array[val.text.replace(/\n/g, '')] = val;
        })
        if (key in array) {
            res.send(`<strong>${key}</strong> — ${array[key].defenition}`)
        } else {
            res.send('Такое понятие отсутствует ')
        }
    } catch(e) {
        console.error(e)
    }
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})