var fs = require('fs')
let fundMap = {}
let lines = []
fs.readFileSync("./mf_list").toString().split("\n").forEach(function(line, index, arr) {
    if (index === arr.length - 1 && line === "") { return; }
    lines.push(line);
});
lines.forEach(function(word,index){
    let fullSchemeName = word.split(';')[3]
    let nav = word.split(';')[4]
    let date = word.split(';')[5]
    let tempScheme = fullSchemeName.split("-");
    let fundName = tempScheme[0].toUpperCase().trim()
    let tempPlan = tempScheme[1].toUpperCase().trim()
    let option = (tempScheme[2] === ' ')? "NIL" : tempScheme[2].split(" ")[1].toUpperCase();
    if(fundName in fundMap){
        if(tempPlan in fundMap[fundName]["plans"]){
            if(!(option in fundMap[fundName]["plans"][tempPlan])){
                fundMap[fundName]["plans"][tempPlan][option] = {
                    "nav" : nav,
                    "date" :date
                    }
            }
        }else{
        fundMap[fundName]["plans"][tempPlan] = {
                [option] :{
                    "nav": nav,
                    "date" :date
                }
            }
        }   
    }else{
        fundMap[fundName] = {
            "plans" : {
                [tempPlan] : {
                    [option] : {
                        "nav" : nav,
                        "date" :date
                    }
                }
            }
        }
    }
    });
console.log(Object.keys(fundMap))