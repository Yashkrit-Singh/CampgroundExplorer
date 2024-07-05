const mongoose = require('mongoose')
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');
const Campground = require('../models/campgrounds')
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp_Campground')
    .then(() => {
        console.log("Connection Open");
    }).catch((e) => {
        console.log("ERROR!!!!!!!!!");
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// const arr = [{
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140919/YelpCamp/awjbkhvsnyge8fkh2m8y.jpg',
//     filename: 'YelpCamp/awjbkhvsnyge8fkh2m8y',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140922/YelpCamp/zs4u3kqndwqjmmvoamaq.jpg',
//     filename: 'YelpCamp/zs4u3kqndwqjmmvoamaq',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140921/YelpCamp/weu9ulellcwps7f86dxn.jpg',
//     filename: 'YelpCamp/weu9ulellcwps7f86dxn',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140920/YelpCamp/kdm5g4qkotpooynagxeb.jpg',
//     filename: 'YelpCamp/kdm5g4qkotpooynagxeb',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140922/YelpCamp/xdbgysryt6vhmgdk6hju.jpg',
//     filename: 'YelpCamp/xdbgysryt6vhmgdk6hju',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140921/YelpCamp/wmtcpy1j1n1faaofqp1r.jpg',
//     filename: 'YelpCamp/wmtcpy1j1n1faaofqp1r',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140922/YelpCamp/bfz22xknouey2mnuwe93.jpg',
//     filename: 'YelpCamp/bfz22xknouey2mnuwe93',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720140922/YelpCamp/mpr9stjnydxmq50wotlq.jpg',
//     filename: 'YelpCamp/mpr9stjnydxmq50wotlq',
//     crossorigin: 'anonymous'
// },
// {
//     url: 'https://res.cloudinary.com/dhlrmalxt/image/upload/v1720142093/YelpCamp/ic1xhffwe3iklaqzc5lc.jpg',
//     filename: 'YelpCamp/ic1xhffwe3iklaqzc5lc',
//     crossorigin: 'anonymous'
// }]


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random = Math.floor(Math.random() * 37);
        const price = Math.floor(Math.random() * 30) + 1;
        const camp = new Campground({
            author: '66822c9ab2fece4029147bae',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus dolorum porro inventore odio quo dolore mollitia ut accusantium, tempora temporibus, tenetur, fuga aspernatur quam minus perferendis! Ducimus molestias est impedit! Error beatae veniam ducimus officiis, quo molestiae quos commodi dolor aspernatur repudiandae reiciendis fugit minus sint nam hic. Consequuntur maiores autem tempore accusamus repellat earum laborum nam beatae quibusdam porro.',
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'           // This is colts url link for testing not rendering of images
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [cities[random].lng , cities[random].lat]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
