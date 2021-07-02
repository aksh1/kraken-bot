const Discord = require("discord.js");

let pointer = 0;
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

                    msg.send("Enter retail price").then(() => {
                      msg
                        .awaitMessages(filter, {
                          max: 1,
                          errors: ["time"],
                        })
                        .then((message4) => {
                            map.set('retail', message4.first().content)
                          msg.send("Enter resell price").then(() => {
                            msg
                              .awaitMessages(filter, {
                                max: 1,
                                errors: ["time"],
                              })
                              .then((message5) => {
                                map.set('resell', message5.first().content)
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

                                            mongoClient.db("mobile_app").collection("releases").insertOne({map});

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
  name: "release",
  aliases: [],
  usage: "<shoe> <image> <date> <retail> <resell>",
  description: "Create a raffle",
  accessibleby: "Staff",
};
