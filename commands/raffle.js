const Discord = require("discord.js");

const map = new Map();

module.exports.run = async (bot, message, args, extras) => {
  let filter = (m) => m.author.id === message.author.id;
  const msg = message.channel
  msg.send("Enter shoe name").then(() => {
    msg
      .awaitMessages(filter, {
        max: 1,
        errors: ["time"],
      })
      .then((message) => {
        map.set('shoeName', message.first().content)

        msg.send("Enter image url").then(() => {
          msg
            .awaitMessages(filter, {
              max: 1,
              errors: ["time"],
            })
            .then((message2) => {
                map.set('imageUrl', message2.first().content)
              msg.send("Enter date").then(() => {
                msg
                  .awaitMessages(filter, {
                    max: 1,
                    errors: ["time"],
                  })
                  .then((message3) => {
                    map.set('date', message3.first().content)

                    msg.send("Pickup or delivery?").then(() => {
                      msg
                        .awaitMessages(filter, {
                          max: 1,
                          errors: ["time"],
                        })
                        .then((message4) => {
                            map.set('pickupOrDelivery', message4.first().content)
                          msg.send("Online or instore?").then(() => {
                            msg
                              .awaitMessages(filter, {
                                max: 1,
                                errors: ["time"],
                              })
                              .then((message5) => {
                                map.set('location', message5.first().content)
                                console.log(args)
                                msg.send("Confirm Y/N: " + JSON.stringify(mapToObj(map))).then(() => {
                                    msg.awaitMessages(filter, {
                                        max: 1,
                                        errors: ["time"],
                                    })
                                    .then((message6) => {
                                        let answer = message6.first().content;
                                        if(answer == "Y") {
                                            let mongoClient = extras.client;

                                            mongoClient.db("mobile_app").collection("raffles").insertOne({map});

                                            return msg.send("Success");
                                        }
                                        else {
                                            return msg.send("Cancelled.")
                                        }
                                    })
                                })
                                
                              })
                          });
                        })
                    });
                  })
              });
            })
        });
      })
  });

  function mapToObj(map){
    const obj = {}
    for (let [k,v] of map)
      obj[k] = v
    return obj
  }


};
module.exports.config = {
    name: "raffle",
    aliases: [],
    usage: "<shoe> <image> <date> <pickup/delivery> <instore/online>",
    description: "Create a raffle",
    accessibleby: "Staff"
}