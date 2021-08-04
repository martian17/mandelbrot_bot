const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
//canvas
const { createCanvas, loadImage } = require('canvas');

let width = 500;
let height = 500;


let MAX_DEPTH = 500;

let getMandelDepth = function(zx,zy,depth){
    for(let i = 0; i < depth; i++){
        let zx1 = x+zx*zx-zy*zy;
        let zy1 = y+2*(zx*zy);
        zx = zx1;
        zy = zy1;
        if(zx*zx+zy*zy > 4){
            return i;
        }
    }
    return -1;//-1 is black
};

//colors
let red = function(j){
    return Math.floor(Math.sin(j/100)*255);
};
let gre = function(j){
    return Math.floor(Math.sin(j/100+1)*255);
};
let blu = function(j){
    return Math.floor(Math.sin(j/100+2)*255);
};
let alp = function(j){
    return 255;
};



//the coordinate is the center coords
let getImage = function(coord,zoom,itr){//could be c
    let canvas = createCanvas(width,height);
    let ctx = canvas.getContext("2d");
    let imageData = ctx.getImageData(0,0,width,height);
    let data = imageData.data;
    console.log(`got the input ${coord} ${zoom} ${itr}`);
    //let stepa = Math.floor(width*height*4/100);
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            let idx = (y*width+x)*4;
            /*if(idx%stepa === 0){
                console.log(`${Math.floor(100*idx/(width*height*4))}% complete`);
            }*/
            //put the value in here
            let rr = (x-width/2)*zoom+coord[0];//real
            let ii = (y-height/2)*zoom+coord[1];//imaginary
            let zr = 0;
            let zi = 0;
            //let zr1,zi1;
            let j = 0;
            for(j = 0; j < itr; j++){
                let zr1 = zr*zr-zi*zi+rr;
                let zi1 = 2*zr*zi+ii;
                if(zr1*zr1+zi1*zi1>4){//absolute value greater than 2 does not belong
                    break;
                }
                zr = zr1;
                zi = zi1;
            }
            //j is the number of iterations
            if(j === itr){
                data[idx+0] = 0;
                data[idx+1] = 0;
                data[idx+2] = 0;
                data[idx+3] = 255;
            }else{
                data[idx+0] = red(j);
                data[idx+1] = gre(j);
                data[idx+2] = blu(j);
                data[idx+3] = alp(j);
            }
        }
    }
    console.log("image generation done");
    ctx.putImageData(imageData,0,0);
    
    //returns a buffer
    return canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE });
};

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


/*
let zoom = 4/500;
*/
//example
/*
/?mandel 0 0 0.008
*/
client.on("message", async msg => {
    let str = msg.content;
    if (str.slice(0,8) === "/?mandel") {
        //logging
        console.log(`author: ${msg.author.username}\n`+
                    `channel: ${msg.channel.name}\n`+
                    `guild: ${msg.channel.guild.name}\n`+
                    `time: ${new Date()}\n`+
                    `contents: ${str}`);
        console.log("");
        let argv = str.split(/\s+/);
        let real = parseFloat(argv[1]) || -0.81;
        let imag = parseFloat(argv[2]) || 0;
        let zoom = parseFloat(argv[3]) || 0.0055;
        //reading the first argument
        let buff = getImage([real,imag],zoom,MAX_DEPTH);
        let controls = await msg.channel.send(`real: ${real}  imaginary: ${imag}  zoom: ${zoom} unit/pizel`);
        let imgmsg = await msg.channel.send("",{files: [buff]});
        await controls.react('⏪');
        await controls.react('⏫');
        await controls.react('◀️');
        await controls.react('🔼');
        await controls.react('🔬');
        await controls.react('🔭');
        await controls.react('🔽');
        await controls.react('▶️');
        await controls.react('⏬');
        await controls.react('⏩');
/*😄 null
⏩ null
⏪ null
⏫ null
⏬ null
▶️ null
◀️ null
🔼 null
🔽 null
⬅️ null
➡️ null
↔️ null
🔍 null
🔎 null
➕ null
➖ null
🔚 null
🌍 null
🌎 null
🌏 null
🔭 null
🔬 null
⬆️ null
⬇️ null*/
        
        const filter = (reaction, user) => {
            console.log(reaction._emoji.name,reaction._emoji.id);
            return true;
        };
        const collector = controls.createReactionCollector(filter, { time: 5*60*1000});//5 minutes
        collector.on('collect', async (reaction,user) => {
            reaction.users.remove(user.id);
            let imgmsg0 = imgmsg;
            switch(reaction._emoji.name){
                case "⏪":
                real -= width*zoom;
                break;
                case "⏫":
                imag -= height*zoom;
                break;
                case "◀️":
                real -= width/4*zoom;
                break;
                case "🔼":
                imag -= height/4*zoom;
                break;
                case "🔬":
                zoom *= 0.2;
                break;
                case "🔭":
                zoom *= 2;
                break;
                case "🔽":
                imag += height/4*zoom;
                break;
                case "▶️":
                real += width/4*zoom;
                break;
                case "⏬":
                imag += height*zoom;
                break;
                case "⏩":
                real += width*zoom;
                break;
            }
            controls.edit(`real: ${real}  imaginary: ${imag}  zoom: ${zoom} unit/pizel`);
            buff = getImage([real,imag],zoom,MAX_DEPTH);
            setTimeout(()=>imgmsg0.delete(),500);
            imgmsg = await msg.channel.send("",{files: [buff]});
            /*msg.channel.send("",{files: [buff]}).then((imgmsg1)=>{
                imgmsg.delete();
                imgmsg = imgmsg1;
            });*/
        });
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
        
        //the alternative, which doesn't work
        /*
        sent.awaitReactions(filter, {max: 1000, time: 6000, errors: ['time'] })
        .then(collected => {
            console.log(collected);
        })
        .catch(collected => {
            console.log(collected);
            sent.reply('You reacted with neither a thumbs up, nor a thumbs down.');
        });
        */
    }
});

client.login(process.env.TOKEN);




