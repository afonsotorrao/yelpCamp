const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
    db.on('error', console.error.bind(console, "connection error:"))
    db.once('open', () => {console.log('Database connected')})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<175; i++){
        let random1000 = Math.floor(Math.random() * 1000)
        let randomPrice =  Math.floor(Math.random() * 25 + 10)
        const camp = new Campground({
            author: '659d3d96821fbed48bc36ba0',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: randomPrice,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude ] },
            images: [
                {
                  url: 'https://res.cloudinary.com/dbibmixtr/image/upload/v1704638447/YelpCamp/n1h96pvkwsnwhqdayjgu.jpg',
                  filename: 'YelpCamp/n1h96pvkwsnwhqdayjgu',
                },
                {
                  url: 'https://res.cloudinary.com/dbibmixtr/image/upload/v1704638447/YelpCamp/kdmmwn5uxlx09trvijmd.jpg',
                  filename: 'YelpCamp/kdmmwn5uxlx09trvijmd',
                }
              ],
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, velit nam facilis neque corporis quaerat provident ratione sint possimus id saepe dolores eius earum alias, fugiat voluptate atque minus nesciunt!"
        })
        await camp.save()
    }

    console.log(Campground)
}

seedDB().then(() => {
    mongoose.connection.close()
})
