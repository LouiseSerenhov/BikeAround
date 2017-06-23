var mongoose = require("mongoose");
var Biketrip = require("./models/biketrip");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Norge", 
        image: "https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/13873070_10154346418704948_7099457400095711283_n.jpg?oh=fa0b78c346fe1d9dc3969e9e0d54e95c&oe=59A05627",
        description: "Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke."
    },
    {
        name: "Skåne - Stockholm", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke. blah blah"
    },
    {
        name: "Camino de Santiago", 
        image: "https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/13669845_10157523568265157_9056390201896748371_n.jpg?oh=8308acc2f15b065f680ded9c8f9f221f&oe=59D2D448",
        description: "Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke. blah blah"
    }
]

function seedDB(){
    Biketrip.remove({}, function(err){
    if(err){
        console.log(err);
    } else {
  console.log("Biketrips are removed!"); 
    }
    data.forEach(function(seed){
    Biketrip.create(seed, function(err,biketrip){
        if(err){
            console.log(err);
        } else {
            console.log("added a data");
            Comment.create(
                {
                text: "Looks like a great trip guys!",
                author: "Mad-dog"
            }, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    biketrip.comments.push(comment);
                    biketrip.save();
                    console.log("Created new comment");
                }
            });
        }

});
});
});
};

module.exports = seedDB;

