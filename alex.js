
function buildMap(){
    let fundMap = {}
    let lines = []
    const files = "119506;INF209K01Q55;INF209K01WB9;Aditya Birla Sun Life Dividend Yield Fund - Dividend - Direct Plan;22.04;23-Jul-2019\n101737;INF209K01397;INF209K01CP1;Aditya Birla Sun Life Dividend Yield Fund - Dividend - Regular Plan;12.92;23-Jul-2019\n119507;INF209K01WA1;-;Aditya Birla Sun Life Dividend Yield Fund - Growth - Direc	t Plan;158.8;23-Jul-2019\n101738;INF209K01405;-;Aditya Birla Sun Life Dividend Yield Fund - Growth - Regular Plan;151.02;23-Jul-2019\n129309;INF109KA1UB8;INF109KA1UC6;ICICI Prudential Dividend Yield Equity Fund - Dividend - Direct Plan;11.32;23-Jul-2019\n107745;INF209K01108;-;Aditya Birla Sun Life Tax Relief '96 - Growth - ;29.32;23-Jul-2019\n119241;INF740K01OL9;INF740K01OM7;DSP Tax Saver Fund - Dividend - Direct Plan;35.254;23-Jul-2019\n119242;INF740K01OK1;-;DSP Tax Saver Fund - Growth - Direct Plan;49.383;23-Jul-2019\n100997;INF179K01970;INF179K01988;HDFC Long Term Advantage Fund - Dividend - ;38.645;23-Jul-2019\n119722;INF200K01UK3;-;SBI MAGNUM TAXGAIN SCHEME 1993 - DIVIDEND - DIRECT PLAN;48.1903;23-Jul-2019\n119723;INF200K01UM9;-;SBI MAGNUM TAXGAIN SCHEME 1993 - GROWTH - DIRECT PLAN;143.9207;23-Jul-2019\n103883;INF200K01479;-;SBI MAGNUM TAXGAIN SCHEME 1993 - DIVIDEND - REGULAR PLAN;37.9593;23-Jul-2019\n105628;INF200K01495;-;SBI MAGNUM TAXGAIN SCHEME 1993 - GROWTH - REGULAR PLAN;138.4318;23-Jul-2019\n119563;INF209K01Q71;INF209K01WF0;Aditya Birla Sun Life Focused Equity Fund - Dividend - Direct Plan;35.689;23-Jul-2019\n119219;INF740K01PM4;INF740K01PN2;DSP Equity Opportunities Fund - Dividend - Direct Plan;53.386;23-Jul-2019\n119218;INF740K01PL6;-;DSP Equity Opportunities Fund - Growth - Direct Plan;223.344;23-Jul-2019\n103820;INF740K01078;INF740K01086;DSP Equity Opportunities Fund- Dividend - Regular Plan;24.132;23-Jul-2019\n103819;INF740K01094;-;DSP Equity Opportunities Fund - Growth - Regular Plan;211.837;23-Jul-2019\n120322;INF109K011K3;INF109K010K5;ICICI Prudential Value Discovery Fund - Dividend - Direct Plan;47.17;23-Jul-2019\n120323;INF109K012K1;-;ICICI Prudential Value Discovery Fund - Growth - Direct Plan;151.49;23-Jul-2019\n102595;INF109K01EC7;INF109K01AD3;ICICI Prudential Value Discovery Fund - Dividend - ;25.79;23-Jul-2019\n102594;INF109K01AF8;-;ICICI Prudential Value Discovery Fund - Growth - ;142.40;23-Jul-2019\n119496;INF209K01R96;INF209K01XL6;Aditya Birla Sun Life Short Term Opportunities Fund - Dividend - Direct Plan;17.1849;23-Jul-2019\n101843;INF209K01975;INF209K01DK0;Aditya Birla Sun Life Short Term Opportunities Fund - Dividend - Regular Plan;16.5501;23-Jul-2019\n119498;INF209K01XK8;-;Aditya Birla Sun Life Short Term Opportunities Fund - Growth - Direct Plan;33.1593;23-Jul-2019"
    files.split("\n").forEach(function(line, index, arr) {
        if (index === arr.length - 1 && line === "") { return; }
        lines.push(line);
    });
    lines.forEach(function(word){
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
    return fundMap
}

function suggest(scheme,schemeNavMap){
    let speechText = '';
    Object.keys(schemeNavMap[scheme]['plans']).forEach(function(plan,index){
        if(index === Object.keys(schemeNavMap[scheme]['plans']).length-1 && (Object.keys(schemeNavMap[scheme]['plans']).length !== 1)){
            speechText += 'and for '
        }
        speechText += `${plan} is ${schemeNavMap[scheme]['plans'][plan]["NIL"]["nav"]} rupees `

    })
    return speechText;
}

function valid(scheme,plan,option,schemeNavMap){
        if(!(plan in schemeNavMap[scheme]["plans"] )){
            const planInScheme = Object.keys(schemeNavMap[scheme]["plans"]);
            let speechText = `${plan} does not exist on the ${scheme}.`
            
            planInScheme.forEach(function(plan,index){
                if(index === planInScheme.length-1 && (planInScheme.length !== 1)){
                    speechText += ' and '+plan;
                }else{
                    speechText += ' is '+plan
                }
            });
            return [false,speechText]
        }else{
            if(!(option in schemeNavMap[scheme]["plans"][plan])){
                const optionInScheme = Object.keys(schemeNavMap[scheme]["plans"][plan]);
                let speechText = ''
                if(optionInScheme.includes("NIL")){
                    speechText += `The n.a.v. for ${scheme} `
                    speechText +=  suggest(scheme,schemeNavMap)
                    return [true,speechText]
                }
                speechText = `${option} does not exist on the ${scheme} ${plan}. The N.A.V for scheme ${scheme} ${plan} `
                optionInScheme.forEach(function(option,index){
                const optionDict = schemeNavMap[scheme]["plans"][plan][option];
                speechText += `${option} is ${optionDict["nav"]} dated on ${optionDict["date"]}`;
                })
                return [false,speechText]
            }else{
                return [true,`The nav is ${schemeNavMap[scheme]["plans"][plan][option]["nav"]}`]
            }
        }
    }
const schemeNavMap = buildMap()

const isValidAndResponse = valid("ADITYA BIRLA SUN LIFE SHORT TERM OPPORTUNITIES FUND".toUpperCase(),'BONUS','REGULAR',schemeNavMap)
console.log(isValidAndResponse[1])
