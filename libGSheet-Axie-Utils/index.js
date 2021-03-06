/************************************************************
This script as been compressed in a one-pager for easy copy.
It contain tree files:
 - core-sheet-utils
 - libG-axie-api-wrapper
 - anons function
 - templates

Instructions:
- copy paste it in your project.
     
Credits:
  - @27aume, Author.

References to AxieInfinity.com api and development:
  -Unofficial API documentation:
  https://pacxiu.github.io/AxieInfinityAPI
  -Introdution to build mini-game and tools:
  https://medium.com/@kreatywnikreatywnym/axie-infinity-tutorial-paint-my-axies-vanilla-js-cd70cf8c6adb

GAS (googleAppScript) facts:
  - A script that uses a library does not run as quickly as
    single script project. Recommend to copy this code to
    a script file in your project.
  - Can't call anonym functions contained in an object from
    spreadsheet. The Variable.functionName() structure is
    reserved for library reference name in googleAppScript.
  - Can't send an object as function parametter from
    spreadsheet,params must be hard coded.
  - Get method doesn't handle payloads using UrlFetchApp,
    concat query_param_string to url.
************************************************************/
/************************************************************
License
MIT License

Copyright (c) December 2019 Guillaume MD, @27aume

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to
whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall
be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
************************************************************/
/*
 @customfunction
*/

/////////////////////////////////////core-sheet-utils/////////////////////////////////////
/*
 @customfunction
*/
/** Notes
- built as a "Two pager" script. Copy this file and "utils/anons-script".
*/
/////////////////////////////////////Globals/////////////////////////////////////

//display prices properly. adjust decimals
var div = 1000000000000000000;

//Set all functions to display header. to disable change it for false.
var showHead = true;





/////////////////////////////////////Axies/////////////////////////////////////

/**
 * Get Simgle Axie.
 *  Provide data about a defined axie.
 *
 * @param {number} axie the ID of the axie that you want data for.
 * @customfunction
 */
function axieSearchSingle(axie) {
  
  var axStats = axieTemp_(Ai.getSingleAxie(axie)),
      result = [axStats];
  
  
  addHeader_(showHead, result, axieHeadTemp_());
  
  Logger.log(result)
  return result;
}



/**
 * Get Multiple Axies.
 * Provide data about a defined list of axies.
 *
 * @param {number} axies This parametter is a restParam, just add more parametters separated by comas holding the different axie ids.
 * @customfunction
 */
function axieSearchMultiple(axies) {
  
  var axieIds = new Array(),
      result = new Array();
  
  if(arguments.length > 1) restParam_(1, arguments, axieIds);
  else if (Array.isArray(axies)) axieIds = axies.join().split(",");     
  
  showHead = false;
  
  
  axieIds.forEach(function(id) {
    if(id) result.push(getSingleAxie(Number(id))[0]);
    else result.push("");
  });
  
  
  Logger.log(result);
  return result;
}



/**
 * Search trough all axies:
 * Provide data about all axies.
 *   To skip a parametter add empty string.
 *   It is not recommended to use this function to load all axies. 
 *   Will exceed google max execution time limit. Try to make resonably precise searches like; 
 *   add the stage and the class, search for 2 parts at a time not one.
 *
 * @param {number} offset The number of axies to skip.
 * @param {number} display The number of axies to display.
 * @param {trigger} sale A trigger to indicate if you want only axies on sale or not. can be a number like 0 or 1, string like "yes" or true.
 * @param {string} sorting The sorting rule you want, can be latest_auction, lowest_price, highest_price, lowest_id, highest_id.
 * @param {number} stage The stage number. 1 egg, 2 larva, 3 petite or 4 adult
 * @param {string} class Filter by a certain class.
 * @param {number} pureness Filter by number of parts of the same class on axie.
 * @param {string} region Filter by region of origine like japan or international(standard).
 * @param {string} title Filter by title like origin, meo%20corp.
 * @param {trigger} mystic Filter only mystic axies
 * @param {number} num_mystic Filter by number of mystic parts on axies
 * @param {string} part Filter by parts. Add more inputs with the different parts the axie must have.
 *                 e.g.:Skip params. Then add multiple parts separated by semicolon.
 *                 =axieSearchEncyclopedia(""; ""; ""; ""; ""; ""; ""; ""; ""; ""; ""; ""; "horn-imp"; "back-snail-shell";...)
 * @customfunction
 */
function axieSearchEncyclopedia(offset, display, sale, sorting, stage, class, pureness, region, title, mystic, num_mystic, part) {
  
  var argNum = 12,//number of parametters in thsi function. for custom rest param.
      partAr = restParam_(argNum, arguments, []),
      axies = new Array();
  
  
  //Build parametter object
  offset = offset ? offset: 0; //offset default to zero.
  
  var p = argsToObj_(argNum, axieSearchParams, arguments);
  
  
  //axie infinity return json off 12 axies at a time so i defaulted the pagination at 12.
  Logger.log("Starting pagination");
  
  axies = pagination_(Ai.getAllAxies, p, "axies", "totalAxies", 12, axieTemp_, display);
  
  
  addHeader_(showHead, axies, axieHeadTemp_());
  
  return symmetric2DArray_(axies);
};



/**
 * Get axies By Address.
 * Provide data about all axies for given ethereum address. All option are OPTIONAL
 *
 * @param {string} ethAddress ethereum address
 * @param {number} offset The number of axies to skip.
 * @param {number} display Indicate how many axie to display.
 * @param {trigger} sale A trigger to indicate if you want only axies on sale or not. e.g: a number like 0 or 1.
 * @param {string} sorting The sorting rule you want, can be latest_auction, lowest_price, highest_price, lowest_id, highest_id.
 * @param {number} stage The stage number. 1 egg, 2 larva, 3 petite or 4 adult
 * @param {string} class Filter by a certain class.
 * @param {number} pureness Filter by number of parts of the same class on axie.
 * @param {string} region Filter by region of origine like japan or international(standard).
 * @param {string} title Filter by title like origin, meo%20corp.
 * @param {trigger} mystic Filter only mystic axies
 * @param {number} num_mystic Filter by number of mystic parts on axies
 * @param {string} part Filter by parts. Add more inputs with the different parts the axie must have.
 *                 e.g.:Skip params. Then add multiple parts separated by semicolon.
 *                 =axieSearchEncyclopedia(""; ""; ""; ""; ""; ""; ""; ""; ""; ""; ""; ""; "horn-imp"; "back-snail-shell";...)
 * @customfunction
 */
function axieSearchAddress(address, offset, display, sale, sorting, stage, class, pureness, region, title, mystic, num_mystic, part) {
  
  var argNum = 13,//number of parametters in thsi function. for custom rest param.
      partAr = restParam_(argNum, arguments, []),
      axies = new Array();

  
  //Build parametter object
  offset = offset ? offset: 0; //offset default to zero.
  
  axieSearchParams.unshift("address");
  
  var p = argsToObj_(argNum, axieSearchParams, arguments);
  
  //axie infinity return json off 12 axies at a time so i defaulted the pagination at 12.
  Logger.log("starting pagination");
  axies = pagination_(Ai.getMyAxies, p, "axies", "totalAxies", 12, axieTemp_, display);
  
  addHeader_(showHead, axies, axieHeadTemp_());
  return symmetric2DArray_(axies);
};



/**
 * Search axies by name.
 *   Look trough your axies names for a defined piece of text, can be a part of the name or the full name.
 *
 * @param {string} nameSearch The string to search for in your axies name.
 * @param {string} ethAddress Address to import the axies from.
 * @param {array} Src2axieList Use in script to input an array of axie objects.
 * 
 * @return A array of axies.
 * @customfunction
 */
function axieSearchName(nameSearch, Src1ethAddr, Src2axieList, template, headTemplate) {
  var searchResult = [];
  
  if(Src1ethAddr) {
    Logger.log("searching through account.");
    
    var p = { address: Src1ethAddr, offset: 0},
        axies = pagination_(Ai.getMyAxies, p, "axies", "totalAxies", 12);
    
  } else if (axieList) {
    
    Logger.log("searching through axie list.");
    if (!Array.isArray(axieList)) {
      
      Logger.log("Wrong axieList type, should provide an array of axie object"); 
      return new Error("Wrong axieList type, should provide an array of axie object");
    }
    
    if (typeof(axieList[0]) !== "object") {
      
      Logger.log("Wrong item type, should provide an array of axie object"); 
      return new Error("Wrong item type, should provide an array of axie object"); 
    }
    
    var axies = axieList;
  } else {
  
    logger.log("something went wrong with axie source input.");
    return new Error("something went wrong with axie source input.");
  }  
  
  // Default template.
  if (!template) {
    
    template = axieTemp_;
    
    headTemplate = axieHeadTemp_();
  } else { //defined template
    
    if(!headTemplate) { //headerless template.
      
      headTemplate = "";
      
      showHead = false;
    }
  }
  
  Logger.log("axie list aquired, template defined, starting filter");

  //Format data.
  axies.forEach(function(axie) {
    if(axie.name.indexOf(nameSearch) >= 0) searchResult.push(template(axie));
  });
  
  
  addHeader_(showHead, searchResult, headTemplate);

  Logger.log("Name search completed");
  Logger.log(searchResult);
  return searchResult;
};



/**
 * Get account total axies.
 * 
 * @param {string} ethAddress An ethereum address.
 *
 * @return {number} Total axie count by ethereum address.
 * @customfunction
 */
function axieTotalByAddress(ethAddress) {
  return Ai.getMyAxies({address: ethAddress}).totalAxies;
};


/**
 * Check Small love potion inventory.
 * Allows to get total Love potion for given ETH Address. 
 *
 * @param {string} ethAddress ethereum address
 * @customfunction
 */
function axieTotalAddressSLP(ethAddress) {
  return Ai.getSmallLoveP(ethAddress).total;
}

/**
 * get Body Parts
 * Provide data about all body-parts
 * 
 * @return {array} List of all parts.
 * @customfunction
 */
function axieGetBodyParts() {
  
  var parts = new Array(),
      response = Ai.getBodyParts();
  
  
  response.forEach(function(part) {
    parts.push(bodyTemp_(part));
  });
  
  
  addHeader_(showHead, parts, bodyHeadTemp_());
  
  return symmetric2DArray_(parts);
};

/////////////////////////////////////Axies markets/////////////////////////////////////


/** 
 * Get axies floor price (Default).
 * @customfunction
 */
function axiePriceFloor() {
  
  var stage = 4,
      p = {offset: 0, sale: "true", sorting: "lowest_price", stage: stage},
      cheapestAxieValue = (Ai.getAllAxies(p).axies[0].auction.buyNowPrice / div);
  
  return Number(cheapestAxieValue).toFixed(4);
}


/** 
 * Get petite floor price.
 * @customfunction
 */
function axiePricePetiteFloor() {
  
  var stage = 3,
      p = {offset: 0, sale: "true", sorting: "lowest_price", stage: stage},
      cheapestPetiteValue = (Ai.getAllAxies(p).axies[0].auction.buyNowPrice / div);
  
  return Number(cheapestPetiteValue).toFixed(4);
}


/** 
 * Get  virgin axie floor price.
 * @customfunction
 */
function axiePriceVirginFloor() {
  
  function virginOnly(a) { if(a.breedCount === 0) return a };
  
  function clearEmptyVals(n) { return n !== "" }; 
  
  var virgins = pagination_(Ai.getAllAxies, {offset: 0, sale: "true", sorting: "lowest_price", stage: 4}, "axies", "totalAxies", 12, virginOnly),
      cheapestVirgin = virgins.filter(clearEmptyVals)[0], //get cheapest adult virgin
      cheapestVirginValue = (cheapestVirgin.auction.buyNowPrice / div);
 
  return Number(cheapestVirginValue).toFixed(4); 
}


/** 
 * Get floor price for special axies
 * works only for 1part_mystic, title(origin, meo%20corp), region(japan)
 * 
 * @param {string} propValue Value of the property to search by. e.g:
 *                           mystic, origin, meo%20corp, japan.
 * @param {string} propertyN Name of the property to search by. Leave empty for mystic and origin. e.g:
 *                           title, region.
 * @customfunction
 */
function axiePriceSpecial(propValue, propertyN) {
  
  var stage = 4,
      p = {offset: 0, sale: "true", sorting: "lowest_price", stage: stage};
  
  //default query.
  if(!propValue || propValue === "origin") p.title ="origin";
  else if(propValue === "mystic") p.num_mystic = 1;
  else p[propertyN] = propValue;
   
  
  var cheapestAxieValue = (Ai.getAllAxies(p).axies[0].auction.buyNowPrice / div);
  
  return Number(cheapestAxieValue).toFixed(4);
}





/////////////////////////////////////Battles/////////////////////////////////////

/**
 * Check charm
 * Allows to get data about charm (Bean's Blessing) for given ETH Address.
 * Will return true or false if its is activated or not.
 *
 * @param {string} ethAddress ethereum address.
 * @customfunction
 */
function axieBtlCharm(ethAddress) {
  return Ai.getCharm(ethAddress).isCharmActivated;
};



/**
 * Activity Points:
 * Allows to get data about activity points for given Axies. Can request multiple ID's at once.
 *
 * @param {number} axies This parametter is a restParam, just add more parametters separated by comas holding the different axie ids.
 * @customfunction
 */
function axieBtlActivityPoints(axies) { //can also use array of ids when used in google-app-script.
  
  var arr = new Array(),
      result = new Array();
  
  restParam_(1, arguments, arr);
  Logger.log(arr);
  
  
  var response = Ai.getActivityPoints(arr);
  
  response.forEach(function(axie) {
    result.push([axie.axieId, axie.activityPoint]);
  });
  
  
  addHeader_(showHead, result, ["Axie id", "Activity points"]);
  
  return symmetric2DArray_(result);
};



/**
 * Get Leaderboard
 * Allows to get leaderboard data for given ETH Address. Shows top 30 players + given address if outside of top 30.
 *
 * @param {string} ethAddress ethereum address.
 * @customfunction
 */
function axieBtlLeaderboard(ethAddress) {
  
  var response = Ai.getLboard(ethAddress),
      result = new Array();
  
  response.forEach(function(user){
    result.push(lboardTemp_(user));
  });
  
  addHeader_(showHead, result, lboardHeadTemp_());
  return symmetric2DArray_(result);
};



/**
 * Get my Teams.
 * Allows to get data about teams from profile.
 *
 * @param {string} ethAddress Your ethereum address.
 * @param {number} count The number of team to retreive. Defaulted at 1000.
 * @param {number} offset Number of teams to skip.
 * @param {string} no_limit Add "no_limit" if you want all your teams.
 * @customfunction
 */
function axieGetMyTeams(ethAddress, count, offset, no_limit) {

  var p = new Object(),
      result = new Array();
  
  //Build parametter object
  if(ethAddress) p.address = ethAddress;
  
  p.count = count ? count: 1000; //offset default to zero.
  
  p.offset = offset ? offset: 0; //offset default to zero.
  
  if(no_limit) p.no_limit = no_limit;
    
  var response = Ai.getTeams(p);
  
  
  response.teams.forEach(function(team) {
    result.push(teamTemp_(team));
  });
  
  
  addHeader_(showHead, result, teamHeadTemp_());
  
  return symmetric2DArray_(result);
};



/**
 * Team
 * Allows to get data about a team.
 *
 * @param {string} team Id of the team to retreive data for.
 * @customfunction
 */
function axieGetTeam(teamId) {
  
    var result = [],
        response = Ai.getTeam(teamId);
  
  result.push(teamTemp_(response));
    
  addHeader_(showHead, result, teamHeadTemp_());
  
  return result;
};





/////////////////////////////////////Lunancia/////////////////////////////////////

/**
 * Marketplace
 * Allows to get data about items on land marketplace.
 *
 * @param {number} offset Number of items to skip
 * @param {number} count Number of items to retreive
 * @param {string} sorting Sort by highest_price, lowest_price, highest_price, lowest_id.
 * @param {string} search Search for a land, item, itemAlias. Category or item alias (eg - p3a is requesting MakerDao Bronze items)
 * @param {string} type Filter by type of item: savannah, forest, arctic, mystic, genesis.
 * @param {string} rarity Filter by rarity: common, rare, epic, mystic.
 * @customfunction
 */
function axieLandMarket(offset, count, sorting, search, type, rarity) {
  
  var p = {},
      result = [];
  
  
  p.offset = offset ? offset: 0; //offset default to zero.
  if(count) p.count = count;
  if(sorting) p.sorting = sorting;
  if(search) p.item_name = search;
  if(type) p.type = type;
  if(rarity) p.rarity = rarity;
  
  Logger.log(p)
  var response = Ai.getMarket(p);
  
  response.results.forEach(function(e) {
    
    if(e.assetType === "land") {
      result.push(landTemp_(e));
    } else if(e.assetType === "item") {
      result.push(itemTemp_(e));
    };
  });
  Logger.log(response.total);
  
  addHeader_(showHead, result, landMarketHeadTemp_());
  return symmetric2DArray_(result);  
};



/**
 * Marketplace bundles
 * Allows to get data about items on land marketplace.
 *
 * @param {number} offset Number of items to skip
 * @param {number} count Number of items to retreive
 * @param {string} sorting Sort by highest_price, lowest_price, highest_price, lowest_id.
 * @param {string} search Search for a land, item, itemAlias. Category or item alias (eg - p3a is requesting MakerDao Bronze items)
 * @param {string} type Filter by type of item: savannah, forest, arctic, mystic, genesis.
 * @param {string} rarity Filter by rarity: common, rare, epic, mystic.
 * @customfunction
 */
function axieLandMarketBundles(offset, count, sorting, search, type, rarity) {
  
  var p = {},
      result = [];
  
  
  p.offset = offset ? offset: 0; //offset default to zero.
  if(count) p.count = count;
  if(sorting) p.sorting = sorting;
  if(search) p.item_name = search;
  if(type) p.type = type;
  if(rarity) p.rarity = rarity;
  
  var response = Ai.getMarketBundles(p);
  Logger.log(response);
  
  if(showHead) result = bundleHeadTemp_();
  
  response.results.forEach(function(bundle) {
    result = bundleTemp_(bundle, result);
  });
  
  Logger.log(response.total);
  
  return symmetric2DArray_(result);  
};





/////////////////////////////////////Others/////////////////////////////////////

/**
 * Breeding Calculator
 *   Get link to breeding calculator.
 *
 * @param {numder} sireId
 * @param {number} matronId
 * @customfunction
 */
function axiePrintFreakCalcUrl(sireId, matronId) {
  return ("https://freakitties.github.io/axie/calc.html?sireId="+ sireId+ "&matronId="+ matronId);
}



/**
 * Check if an axie is breedable.
 * It calculate the total of potions required to breed for an axie pair and tell you if you have enought.
 * 
 * @param {number} axie1 The Id of the sire to verify if breedable.Can also be an axie object.
 * @param {number} axie2 The Id of the matron to verify if breedable.Can also be an axie object.
 * @param {string} ethAddress You ethereum address in case potion total and axie data are needed.
 * @param {number} lovePTotal (OPTIONAL) Your total number of potion.
 * @customfunction
 */
function axieCheckBreedable(axie1,axie2, ethAddress, lovePTotal) {
  
  if(typeof(axie1) === "object") {
    
    var ax1 = axie1,
        ax2 = axie2;
    
  } else if(typeof(axie1) === "number") {
    
    var ax1 = Ai.getSingleAxie(axie1),
        ax2 = Ai.getSingleAxie(axie2);
  };
  
  if(ax.stage <4) return false;
  
  
  var ax1BC = ax1.breedCount,
      ax2BC = ax2.breedCount;
  
  if(typeof(lovePTotal) === "number")  var lpt = lovePTotal;
  else if(!lovePTotal) var lpt = Ai.getSmallLoveP(ethAddress);

  var lpCost = (axieCountLPCost(ax1BC) + axieCountLPCost(ax2BC));
  
  if(lpCost <= lpt) return true;
  else return false;
};



/**
 * Check if an axie is breedable.
 * It calculate the total of potions required to breed for an axie pair and tell you if you have enought.
 * 
 * @param {number} brdCntAx1 The BreedCount of the sire to check.
 * @param {number} brdCntAx2 The BreedCount of the matron to check.
 * @param {number} lovePTotal Your total number of potion.
 * @customfunction
 */
function axieCheckBreedableSimple(brdCntAx1, brdCntAx2, lovePTotal) {
  
  if (typeof(brdCntAx1) !== "number" || typeof(brdCntAx2) !== "number") return "";
 
  var lpCost = axieCountLPTC(brdCntAx1, brdCntAx2);
  
  if(lpCost <= lovePTotal) return true;
  else return false;
};



/**
 * Count total potion required for 2 axies to breed.
 * LPTC = Love Potion Total Cost
 * 
 * @param {number} brdCntAx1 The BreedCount of the sire to check.
 * @param {number} brdCntAx2 The BreedCount of the matron to check.
 * @customfunction
 */
function axieCountLPTC(brdCntAx1, brdCntAx2) {
  
  if(validateN_(brdCntAx1) && validateN_(brdCntAx2)) {
    
    var lpCost = (axieCountLPCost(brdCntAx1) + axieCountLPCost(brdCntAx2));
    return lpCost;
  } 
  else return "";
};


/**
 * Count total potion required for a axie.
 * 
 * @param {number} breedcount The BreedCount of the axie to check.
 * @customfunction
 */
function axieCountLPCost(breedcount) {
  
  var pc = 0; //potion cost
  
  if(breedcount < 1) {
    pc += 100;
    
  } else if(breedcount < 2) {
    pc += 200;
    
  } else if(breedcount < 3) {
    pc += 300;
    
  } else if(breedcount < 4) {
    pc += 500;
    
  } else if(breedcount < 5) {
    pc += 800;
    
  } else if(breedcount < 6) {
    pc += 1300;
    
  } else if(breedcount < 7) {
    pc += 2100;
  };
  
  return pc;
};





/////////////////////////////////////libG-axie-api-wrapper/////////////////////////////////////
/*
 @customfunction
*/



/**
 * Uri Map - To store api end points
 */
var um_ = {
  //roots
  r: "https://axieinfinity.com",
  r2: "https://lunacia.skymavis.com/game-api",
  rv1: "https://api.axieinfinity.com/v1",
  rv2: "https://axieinfinity.com/api/v2",
  // axie inventory and info on parts //uses api v2
  ax: {
    axies: "/axies", //add:  + "/AXIE_ID" to get a single axie
    bodyPrts: "/body-parts",
    byAddr: "/addresses",//add:  + "/ETH_ADDRESS/axies" to get a list of your axies.
    smallLoveP: "/clients" //add /ETH_ADDRESS/items/1"
  },
  //battle operation and data // Uses api v1
  btl: {
    //Ethereum account battle data
    profile: "/battle/accounts", // add: + "/ETH_ADDRESS"
    //Charm rel data
    charm: "/battle/battle/check-charm", // add: + "/ETH_ADDRESS"
    //Axies activity point count
    activity: "/battle/battle/activity-point",
    //Queue a team
    queue: "/battle/battle/queue",
    //remaining practice matches count
    practice: "/battle/dynamicBattle/practice-quota",
    //get count on pending challenges
    pendingPractice: "/challenge/pending/",
    //Leaderboard
    lBoard: "/battle/history/leaderboard",
    //Battle history
    hstRanked: "/battle/history/matches",
    hstPrac: "/battle/challenge/matches",
    //Axie teams data
    teams: "/battle/teams", // add: + "/TEAM_ID" //to get a specific team data.
    //Queue team
    queue: "/battle/battle/queue",
    //Update team
    upd: "/battle/teams/update",
    //Delete team
    del: "/battle/teams/delete",
    //Pending battles
    pendingBtl: "/battle/teams/pending", // add: + "/ETH_ADDRESS"
  },
  //Lunacia lands
  land: {
    acc: "/account-api/account/profile",
    //List of plots owned by profile
    plots: "/land-api/profile/land", // add: + "/ACCOUNT_ID"
    //Inventory
    inv: "/land-api/profile/inventory", // add: + "/ACCOUNT_ID"
    //Land marketplace
    market: "/marketplace-api/query-assets",
    chests: "/land-api/remaining-chests"
  }
};

var param_err_ethAdrr = "You must provide a valid ethereum address as a string. e.g. \"0x72b786ff9ef6d56a2b2dddcfff9bf78f353b145b\".",
    param_err_obj = "There is something missing in your param object. Refer to https://pacxiu.github.io/AxieInfinityAPI/#update-team for more information.",
    param_err_teamId = "You must provide a valid team Id as a string. e.g. \"fc6fa716-c578-4ab1-8ad6-9386477cbfb0\"."
      +"\nYou can find it in the url, when editing a team or by calling getTeams().",
    param_err_accId = "You must provide a valid account id as a number. e.g. 549.\n" +
      "You can find it using the land profile api call.";




/////////////////////////////////////Utils/////////////////////////////////////

/**
 * Rest parametter
 *
 * @param {number} maxParam Number of defined params and/or index of your rest param.
 * @param {arguments variable} args Simply pass the arguments variable of your parent function.
 * @param {array} containerArray The array that will store values of extending params.
 *
 * @return {array} Return an array of values to work with.
 */
function restParam_(maxParam, args, containerArray) {
  if(args.length > maxParam) {
    for(var i = maxParam -1; i < args.length; i++) {
//      Logger.log(args[i])
      containerArray.push(args[i]);
    };

    return containerArray;
  };
};



/**
* Turn object to query string\
*
* @param {object} obj Supply an paramter object.
* @param {boolean} start indicate if you are starting a new query string or appending to one.
* @return {string} query string to append at the end of an uri.
*/
function obj2queryStr_(obj, start) {
//  Logger.log("converting object to query string.");
  var queryS = "";
  
  if(obj) {
    //parametters properties
    var props = Object.keys(obj);
//    Logger.log(props);
    if(start) {
      if(Array.isArray(obj[props[0]])) {
        queryS += ("?" +props[0] +"=" +obj[props[0]][0]);
        obj[props[0]][0].shift();
        
        obj[props[0]].forEach(function(value) {
          queryS += ("&" +props[0] +"=" + value);
          
          //      Logger.log(queryS);
          return queryS;
        });
      } else {
        queryS += ("?" +props[0] +"=" +obj[props[0]]);
      }
      props.shift();
    };
    
    if (props.length >= 1) {
      
      props.forEach(function(prop) {
        if(Array.isArray(obj[prop])) {
          
          obj[prop].forEach(function(value) {
            queryS += ("&" +prop +"=" + value);
            
            //      Logger.log(queryS);
            return queryS;
          });
        } else {
          queryS += ("&" +prop +"=" +obj[prop]);
        };
        //      Logger.log(queryS);
        return queryS;
      });
    };
  };
//  Logger.log(queryS);
  return queryS;
};


/**
 * Process request to public api.
 *
 * @param {string} url
 *
 * @return {Object} response
 */
function pubReq_(url) {
  try {
    var headers = {
        'content-Type': 'application/json'
      },
      params = {
        'method': 'get',
        'headers': headers,
        'muteHttpExceptions': true
      },
      result = UrlFetchApp.fetch(url, params),
      response = JSON.parse(result.getContentText());
    
    return response;

  } catch(e) {
    Logger.log(e);
    return "\n error: " + e;
  };
};


/////////////////////////////////////Axies/////////////////////////////////////

/**
 * get Simgle Axie
 * Provide data about a defined axie.
 *
 * @param {number} axie the ID of the axie that you want data for.
 * @return {object} response with an array of all axies in obj.axies
 */
function getSingleAxie(axie) {

  if (!axie || isNaN(axie)) {
    return "getSingle() error.\n You must provide a valide AXIE_ID. E.g. 27777 as a number.";
  };

  var url = (um_.rv2 +um_.ax.axies),
      request = url +"/" +axie.toString(),
      response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * get Multiple Axies
 * Provide data about a defined list of axies.
 *
 * @param {number} axies the list of ID.Each id as a param or an array of id.
 * @return {array} response an array of object by axie.
 */
function getMultiAxies(axies) {
  var axieIds = [],
      result = [];
  if(arguments.length > 1) {
  restParam_(1, arguments, axieIds);

  } else if (Array.isArray(axies)) {
    if(Array.isArray(axies[0])) {
      axieIds = axies.join().split(","); 
    } else {axieIds = axies; };
  };

  axieIds.forEach(function(id) {
    if(id) {
      var data = getSingleAxie(id);
      result.push(data);
    } else { result.push("")};
  });

//  Logger.log(result);
  return result;
}



/**
 * get All Axies
 * Provide data about all axies
 *   can be used with multiple params in addtion.
 *
 * @param {object} p parametters inclue many possibilities like pagination,
 *        sorting by parts, breeadable or not, etc.
 * @return {object} response with an array of all axies in obj.axies
 */
function getAllAxies(p) {
  var url = (um_.rv2 +um_.ax.axies),
      start = true;

  var queryStr = obj2queryStr_(p, start),
      request = (url +queryStr);

//  Logger.log(request);
  var response = pubReq_(request);

  //url sample:
  // https://axieinfinity.com/api/v2/axies
  //    ?mystic=true&offset=0&part=back-hermit

  // Logger.log(response);
  return response;
}



/**
 * get Body Parts
 * Provide data about all body-parts
 *
 * @return {array} response: an array of all parts as objects.
 */
function getBodyParts() {
  var url = um_.rv2 +um_.ax.bodyPrts,
      request = url;
      response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * get By Address
 * Provide data about all axies for given ethereum address.
 *
 * @param {string} ethAddress ethereum address
 * @param {object} p parametters inclue many possibilities like pagination,
 *        sorting by parts, breeadable or not, etc.\
 *
 * @return {object} containing an array of all axies and their data.
 */
function getMyAxies(p) {

  //safe checks:
  if (!p.address || typeof(p.address) !== "string") {
    return "getMyAxies() error.\n" +param_err_ethAdrr;
  };

  var url = (um_.rv2 +um_.ax.byAddr +"/" +p.address +um_.ax.axies),
      start = true;

  
  var queryStr = obj2queryStr_(p, start),
      request = (url +queryStr)
//  Logger.log(request);
  var response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * Check Small love potion data
 * Allows to get data about Love potion for given ETH Address. 
 * (Total owned, blockchain related data, etc.)
 * @param {string} ethAddress ethereum address
 *
 * @return {object} response object.
 */
function getSmallLoveP(ethAddress) {

  //safe checks.
  if (!ethAddress || typeof(ethAddress) !== "string") {
    return "getSmallLovePCount() error.\n" +param_err_ethAdrr;
  };

  var url = (um_.r2 +um_.ax.smallLoveP +"/" +ethAddress.toLowerCase() +"/items/1"),
      request = url,
      response = pubReq_(request);
  
  Logger.log(url)

  // Logger.log(response);
  return response;
}



/////////////////////////////////////Battles/////////////////////////////////////
/**
 * Check charm
 * Allows to get data about charm (Bean's Blessing) for given ETH Address.
 *
 * @param {string} ethAddress ethereum address
 *
 * @return {object} response object.
 */
function getCharm(ethAddress) {

  //safe checks.
  if (!ethAddress || typeof(ethAddress) !== "string") {
    return "getCharm() error.\n" +param_err_ethAdrr;
  };

  var url = um_.rv1 +um_.btl.charm +"/" +ethAddress,
      request = url,
      response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * Activity Points:
 * Allows to get data about activity points for given Axies. Can request multiple ID's at once.
 *
 * @param {number or array} axies a single or an array of axie ID.
 *
 * @return {array} an array containing object by axie.
 */
function getActivityPoints(axies) {

  //safe checks.
  if(!Array.isArray(axies) && isNaN(axies)) {
    return "getActivityPoints() error.\nYou must provide a valide axie Id as a number or an array of axie IDs, e.g. 27706 or [ ..., 27706, 27777].";
  };

  if(Array.isArray(axies)) {
    var url = um_.rv1 +um_.btl.activity +"?axieId=" +axies[0];

    axies.shift();

    axies.forEach(function(axie) {
      url += ("&axieId=" +axie);

      //      Logger.log(url);
      return url;
    });

  } else {
    var url = um_.rv1 +um_.btl.activity  +"?axieId=" +axies;
  };

  var request = url,
      response = pubReq_(request);
  // Logger.log(response);
  return response;
}



/**
 * Leaderboard
 * Allows to get leaderboard data for given ETH Address. Shows top 30 players + given address if outside of top 30.
 *
 * @param {string} ethAddress ethereum address.
 *
 * @return {array} array cointaining object by profile.
 */
function getLboard(ethAddress) {

  //safe checks
  if (ethAddress && typeof(ethAddress) !== "string") {
    return "getLboard() error.\n" +param_err_ethAdrr;
  };

  var url = um_.rv1 +um_.btl.lBoard,
      request = url;

  if (ethAddress) request += ("?address=" +ethAddress);

  var response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * Battle Profile:
 * Allows to get data about Ethereum Profile.
 *
 * @param {string} ethAddress ethereum address.
 *
 * @return {object} response object.
 */
function getBattleProfile(ethAddress) {

  //safe checks
  if (!ethAddress || typeof(ethAddress) !== "string") {
    return "getProfile() error.\n" +param_err_ethAdrr;
  };

  var url = um_.rv1 +um_.btl.profile +"/" +ethAddress,
       request = url;

  var response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * Teams
 * Allows to get data about teams from profile.
 *
 * @param {object} p parametter object, include all desired params.
 *               Mandatory params:
 *                  Ethereum address
 *                  count. Number of team to request
 *               Other params: offset default is 0, no_limit.
 *
 * @return {object} response object.
 */
function getTeams(p) {

  //safe checks
  if (!p.address || typeof(p.address) !== "string") {
    return "getTeams() error.\n" +param_err_ethAdrr +" In your parametter object.";
  };
  if (!p.offset) {
    p.offset = 0;
  };
  if (!p.count) {
    return "getTeams() error.\n You must provide a count parametter indicating the number of teams to request. e.g. count: 99";
  };


  var url = um_.rv1 +um_.btl.teams +"/",
      queryS = obj2queryStr_(p, true),
      request = url +queryS,
      response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/**
 * Team
 * Allows to get data about a team.
 *
 * @param {string} team provide a team id.
 *
 * @return {object} response object.
 */
function getTeam(teamID) {

  //safe checks
  if (!teamID || typeof(teamID) !== "string") {
    return "getTeam() error.\n" +param_err_teamId;
  };

  var url = um_.rv1 +um_.btl.teams,
      request = url +"/" +teamID;

  var response = pubReq_(request);

  // Logger.log(response);
  return response;
}



/////////////////////////////////////Lunancia/////////////////////////////////////
/**
 * Remaining Chests:
 * Allows to get data about remaining chests in land presale.
 *
 * @return {object}
 */
function getChests() {
  var url = (um_.r +um_.land.chests),
      request = url,
      response = pubReq_(request);

  // Logger.log(response);
  return response;
};



/**
 * Marketplace
 * Allows to get data about items on land marketplace.
 *
 * @param {object} p query params object
 * @return {object}
 */
function getMarket(p) {
  var url = (um_.r +um_.land.market),
      queryStr = obj2queryStr_(p, true),
      request = (url +queryStr),
      response = pubReq_(request);

  //  Logger.log(response);
  return response;
};


/**
 * Marketplace bundles
 * Allows to get data about items on land marketplace.
 *
 * @param {object} p query params object
 * @return {object}
 */
function getMarketBundles(p) {
  var url = um_.r +um_.land.market +"/bundles",
    queryStr = obj2queryStr_(p, true),
      request = url +queryStr,
        response = pubReq_(request);

  //  Logger.log(response);
  return response;
};





/////////////////////////////////////Templates/////////////////////////////////////

//just a list of parameter names to build objects and stuff in script.
var axieSearchParams = ["offset", "display", "sale", "sorting", "stage", "class", "pureness", "region", "title", "mystic", "num_mystic", "part"];

/**
Templates for object to spreadsheet friendly arrays.
turn an objects in and array
generate headers
etc.
**/
var axieHeadTemp_ = function() {
     return ["Image","Id","Name","Class","Title","Axie stage","Level","Experience","Breedable",
             "breedcount","Hp","Speed","Skill","Morale",
             "Eyes >> name","class","stage",
             "Ears >> name","class","stage",
             "Mouth >> name","class","stage", "Move > name", "type", "attack", "defense", "accuracy", "description",
             "Horn >> name","class","stage", "Move > name", "type", "attack", "defense", "accuracy", "description",
             "Back  >> name","class","stage", "Move > name", "type", "attack", "defense", "accuracy", "description",
             "Tail >> name","class","stage", "Move > name", "type", "attack", "defense", "accuracy", "description", 
             "Owner","Sire","MatronId","Birth date", "Auction type","Actual sell price","End price","Days left"];
};


var axieTemp_ = function(a) {
  var axStats = [];
  
  function addEffect(axie, partIndex) {
    if(axie.parts[partIndex].moves[0].effects[0]) {
      return (axie.parts[partIndex].moves[0].effects[0].name +", " +axie.parts[partIndex].moves[0].effects[0].description);
    } else return "";
  };
  
  
  //Base axie data
  if(a.stage < 3) {
    //stage 1 egg and 2 larva
    axStats = [ a.image , ('https://marketplace.axieinfinity.com/axie/'+ a.id), a.name, "",
               a.title, a.stage, a.level, "", "", "" , "", "", "", "",
               "", "", "",
               "", "", "",
               "", "", "", "", "", "", "", "", "", 
               "", "", "", "", "", "", "", "", "", 
               "", "", "", "", "", "", "", "", "", 
               "", "", "", "", "", "", "", "", "",
               ('https://marketplace.axieinfinity.com/profile/'+ a.owner), ('https://marketplace.axieinfinity.com/axie/'+ a.sireId), ('https://marketplace.axieinfinity.com/axie/'+ a.matronId),
               (Utilities.formatDate(new Date(a.birthDate * 1000), timeZone, "dd-MM-yyyy'_'HH:mm"))];
  } else if(a.stage < 4) {
    
    //stage 3 petite and 4 adult
    axStats = [ a.image , ('https://marketplace.axieinfinity.com/axie/'+ a.id), a.name, a.class,
               a.title, a.stage, a.level, "", false, "",
               a.stats.hp, a.stats.speed, a.stats.skill, a.stats.morale,
               a.parts[0].name, a.parts[0].class, a.parts[0].stage,
               a.parts[1].name, a.parts[1].class, a.parts[1].stage,
               a.parts[2].name, a.parts[2].class, a.parts[2].stage, a.parts[2].moves[0].name, a.parts[2].moves[0].type, a.parts[2].moves[0].attack, a.parts[2].moves[0].defense, a.parts[2].moves[0].accuracy, addEffect(a, 2),
               a.parts[3].name, a.parts[3].class, a.parts[3].stage, a.parts[3].moves[0].name, a.parts[3].moves[0].type, a.parts[3].moves[0].attack, a.parts[3].moves[0].defense, a.parts[3].moves[0].accuracy, addEffect(a, 3),
               a.parts[4].name, a.parts[4].class, a.parts[4].stage, a.parts[4].moves[0].name, a.parts[4].moves[0].type, a.parts[4].moves[0].attack, a.parts[4].moves[0].defense, a.parts[4].moves[0].accuracy, addEffect(a, 4),
               a.parts[5].name, a.parts[5].class, a.parts[5].stage, a.parts[5].moves[0].name, a.parts[5].moves[0].type, a.parts[5].moves[0].attack, a.parts[5].moves[0].defense, a.parts[5].moves[0].accuracy, addEffect(a, 5),
               ('https://marketplace.axieinfinity.com/profile/'+ a.owner), ('https://marketplace.axieinfinity.com/axie/'+ a.sireId), ('https://marketplace.axieinfinity.com/axie/'+ a.matronId),
               (Utilities.formatDate(new Date(a.birthDate * 1000), timeZone, "dd-MM-yyyy'_'HH:mm"))];
  } else {
    //Stage 4 adult
    axStats = [ a.image , ('https://marketplace.axieinfinity.com/axie/'+ a.id), a.name, a.class,
               a.title, a.stage, a.level, a.exp, a.breedable, a.breedCount,
               a.stats.hp, a.stats.speed, a.stats.skill, a.stats.morale,
               a.parts[0].name, a.parts[0].class, a.parts[0].stage,
               a.parts[1].name, a.parts[1].class, a.parts[1].stage,
               a.parts[2].name, a.parts[2].class, a.parts[2].stage, a.parts[2].moves[0].name, a.parts[2].moves[0].type, a.parts[2].moves[0].attack, a.parts[2].moves[0].defense, a.parts[2].moves[0].accuracy, addEffect(a, 2),
               a.parts[3].name, a.parts[3].class, a.parts[3].stage, a.parts[3].moves[0].name, a.parts[3].moves[0].type, a.parts[3].moves[0].attack, a.parts[3].moves[0].defense, a.parts[3].moves[0].accuracy, addEffect(a, 3),
               a.parts[4].name, a.parts[4].class, a.parts[4].stage, a.parts[4].moves[0].name, a.parts[4].moves[0].type, a.parts[4].moves[0].attack, a.parts[4].moves[0].defense, a.parts[4].moves[0].accuracy, addEffect(a, 4),
               a.parts[5].name, a.parts[5].class, a.parts[5].stage, a.parts[5].moves[0].name, a.parts[5].moves[0].type, a.parts[5].moves[0].attack, a.parts[5].moves[0].defense, a.parts[5].moves[0].accuracy, addEffect(a, 5),
               ('https://marketplace.axieinfinity.com/profile/'+ a.owner), ('https://marketplace.axieinfinity.com/axie/'+ a.sireId), ('https://marketplace.axieinfinity.com/axie/'+ a.matronId),
               (Utilities.formatDate(new Date(a.birthDate * 1000), timeZone, "dd-MM-yyyy'_'HH:mm"))];
  };
  //additional contextual data:
  if(a.auction) {
    axStats.push(a.auction.type, a.auction.buyNowPrice /div, a.auction.endingPrice /div, Number(a.auction.timeLeft/86400).toFixed(2));
  };
  return axStats;
};


     //template for Axie invetory sheet in Breeding planner Spreadsheet 
var axieTemp2_ = function(a) {
  var axStats = [];
  
  function addEffect(axie, partIndex) {
    if(axie.parts[partIndex].moves[0].effects[0]) {
      return (axie.parts[partIndex].moves[0].effects[0].name +", " +axie.parts[partIndex].moves[0].effects[0].description);
    } else return "";
  };
  
  //Base axie data
  if(a.stage < 3) {//stage 1 egg and 2 larva
    axStats = [('=IMAGE(\"' +a.image +'\"; 1)'), ('=HYPERLINK(\"https://marketplace.axieinfinity.com/axie/'+ a.id+'\"; '+a.id+ ')'), a.name, "",
               "", "", "", "", "", "", "", "", (Utilities.formatDate(new Date(a.birthDate * 1000), timeZone, "dd-MM-yyyy'_'HH:mm")),
               "", "",
               "", "",
               "", "", "", "", "", "", "", "",
               "", "", "", "", "", "", "", "",
               "", "", "", "", "", "", "", "",
               "", "", "", "", "", "", "", ""];
  } else if(a.stage < 4) {//stage 3 petite and 4 adult
    axStats = [('=IMAGE(\"' +a.image +'\"; 1)'), ('=HYPERLINK(\"https://marketplace.axieinfinity.com/axie/'+ a.id+'\"; '+a.id+ ')'), a.name, a.class,
               a.title, a.level, "", "", a.stats.hp, a.stats.speed, a.stats.skill, a.stats.morale, (Utilities.formatDate(new Date(a.birthDate * 1000), timeZone, "dd-MM-yyyy'_'HH:mm")),
               a.parts[0].name, a.parts[0].class,
               a.parts[1].name, a.parts[1].class,
               a.parts[2].name, a.parts[2].class, a.parts[2].moves[0].name, a.parts[2].moves[0].type, a.parts[2].moves[0].attack, a.parts[2].moves[0].defense, a.parts[2].moves[0].accuracy, addEffect(a, 2),
               a.parts[3].name, a.parts[3].class, a.parts[3].moves[0].name, a.parts[3].moves[0].type, a.parts[3].moves[0].attack, a.parts[3].moves[0].defense, a.parts[3].moves[0].accuracy, addEffect(a, 3),
               a.parts[4].name, a.parts[4].class, a.parts[4].moves[0].name, a.parts[4].moves[0].type, a.parts[4].moves[0].attack, a.parts[4].moves[0].defense, a.parts[4].moves[0].accuracy, addEffect(a, 4),
               a.parts[5].name, a.parts[5].class, a.parts[5].moves[0].name, a.parts[5].moves[0].type, a.parts[5].moves[0].attack, a.parts[5].moves[0].defense, a.parts[5].moves[0].accuracy, addEffect(a, 5)];
  } else {//Stage 4 adult
    axStats = [('=IMAGE(\"' +a.image +'\"; 1)'), ('=HYPERLINK(\"https://marketplace.axieinfinity.com/axie/'+ a.id+'\"; '+a.id+ ')'), a.name, a.class,
               a.title, a.level, a.exp, a.breedCount, a.stats.hp, a.stats.speed, a.stats.skill, a.stats.morale, (Utilities.formatDate(new Date(a.birthDate * 1000), timeZone, "dd-MM-yyyy'_'HH:mm")),
               a.parts[0].name, a.parts[0].class,
               a.parts[1].name, a.parts[1].class,
               a.parts[2].name, a.parts[2].class, a.parts[2].moves[0].name, a.parts[2].moves[0].type, a.parts[2].moves[0].attack, a.parts[2].moves[0].defense, a.parts[2].moves[0].accuracy, addEffect(a, 2),
               a.parts[3].name, a.parts[3].class, a.parts[3].moves[0].name, a.parts[3].moves[0].type, a.parts[3].moves[0].attack, a.parts[3].moves[0].defense, a.parts[3].moves[0].accuracy, addEffect(a, 3),
               a.parts[4].name, a.parts[4].class, a.parts[4].moves[0].name, a.parts[4].moves[0].type, a.parts[4].moves[0].attack, a.parts[4].moves[0].defense, a.parts[4].moves[0].accuracy, addEffect(a, 4),
               a.parts[5].name, a.parts[5].class, a.parts[5].moves[0].name, a.parts[5].moves[0].type, a.parts[5].moves[0].attack, a.parts[5].moves[0].defense, a.parts[5].moves[0].accuracy, addEffect(a, 5)]; 
  };
  return axStats;
};


//Body-part template
var bodyHeadTemp_ = function(a) {
  return ["Part id", "Name", "Type", "Class", "Special genes"];
};
var bodyTemp_ = function(a) {
  return [a.partId, a.name, a.type, a.class, a.specialGenes];
};




//Leaderboard 
var lboardHeadTemp_ = function() {
  return ["address", "name", "rank", "wins", "losses", "draws", "rating"];
}
var lboardTemp_ = function(a) {
  return [a.address, a.name, a.rank, a.wins, a.losses, a.draws, a.rating];
};




//Battle teams
var teamHeadTemp_ = function() {
  //21 data point
  return [ "Link", "owner", "teamId", "name", 
          "teamMember1 axieId", "part1", "part2", "part3", "part4", "position", 
          "teamMember2 axieId", "part1", "part2", "part3", "part4", "position", 
          "teamMember3 axieId", "part1", "part2", "part3", "part4", "position"];
};
var teamTemp_ = function(a) {
  return ['https://axieinfinity.com/team/' +a.teamId, a.owner, a.teamId, a.name, 
          'https://marketplace.axieinfinity.com/axie/'+ a.teamMembers[0].axieId, a.teamMembers[0].moveSet[0].part, a.teamMembers[0].moveSet[1].part, a.teamMembers[0].moveSet[2].part, a.teamMembers[0].moveSet[3].part, a.teamMembers[0].position, 
          'https://marketplace.axieinfinity.com/axie/'+ a.teamMembers[1].axieId, a.teamMembers[1].moveSet[0].part, a.teamMembers[1].moveSet[1].part, a.teamMembers[1].moveSet[2].part, a.teamMembers[1].moveSet[3].part, a.teamMembers[1].position, 
          'https://marketplace.axieinfinity.com/axie/'+ a.teamMembers[2].axieId, a.teamMembers[2].moveSet[0].part, a.teamMembers[2].moveSet[1].part, a.teamMembers[2].moveSet[2].part, a.teamMembers[2].moveSet[3].part, a.teamMembers[2].position];
};




//Land market places
var landMarketHeadTemp_ = function() {
  return ["assetType", "sortingId", "realTokenId", "tokenId", "owner",
          "alias", "name", "type", "rarity", "landType", "row",
          "col", "description", "effects", "link",
          "listingIndex", "startingPrice",
          "currentPrice", "endingPrice", "Days left"];
};


var bundleHeadTemp_ = function() {
  return [
    ["Owner", "Listing index", "Starting price", "Current price", "Ending price", "Started on", "Finish on", "Days left"],
    ["      Item list --->","assetType", "realTokenId", "tokenId", "alias", "name", "type", "rarity", "row", "col", "description", "effects"]];
};


var bundleTemp_ = function(a, result) {
  //Bundle and onwer data
  result.push([a.owner, a.listingIndex, a.startingPrice /div, a.currentPrice /div, a.endingPrice /div, 
               Utilities.formatDate(new Date(a.startingTimestamp * 1000), timeZone, "dd-MM-yyyy'_'HH:mm"), Utilities.formatDate(new Date(a.endingTimestamp * 1000), timeZone, "dd-MM-yyyy'_'HH:mm"),
               Number(a.timeLeft/86400).toFixed(2)]);
  //Items data
  a.items.forEach(function(e) {
    if(e.assetType === "land") {
      var land = ["", e.assetType, e.realTokenId, "-",
                  "-", "-", e.landType, "-", e.row,
                  e.col, "-", "-"];
      result.push(land);
    } else if(e.assetType === "item") {
      var item = ["", e.assetType, e.realTokenId, e.tokenId,
                  e.alias, e.name, e.type, e.rarity, "-",
                  "-", e.description, e.effects];
      result.push(item);
    };
  });
  
  return result;
};


var itemTemp_ = function(a) {
  var item = [a.assetType, a.sortingId, a.realTokenId, a.tokenId, a.owner,
              a.alias, a.name, a.type, a.rarity, "-", "-",
              "-", a.description, a.effects, 'https://land.axieinfinity.com/item/'+ a.alias+ '/'+ a.sortingId];
  
  if(a.startingPrice) {
    item.push(a.listingIndex, a.startingPrice /div, a.currentPrice /div, a.endingPrice /div, Number(a.timeLeft/86400).toFixed(2));
  };
  
  return item
};


var landTemp_ = function(a) {
  var land = [a.assetType, a.sortingId, a.realTokenId, "-", a.owner,
              "-", "-", "-", "-", a.landType, a.row,
              a.col, "-", "-", 'https://land.axieinfinity.com/land/'+ a.row+ '/'+ a.col];
  
  if(a.startingPrice) {
    land.push(a.listingIndex, a.startingPrice /div, a.currentPrice /div, a.endingPrice /div, Number(a.timeLeft/86400).toFixed(2));
  };
  
  return land;
};





/////////////////////////////////////Anons/////////////////////////////////////
/*******************************************************************************
This file contain customFunction I made, feel free to copy them if you like what
you see.
*******************************************************************************/


/**
 * Rest parametter
 *
 * @param {number} maxParam Number of defined params and/or index of your rest param.
 * @param {arguments variable} args Simply pass the arguments variable of your parent function.
 * @param {variable} container The array that will store values of extending params.
 *
 * @return {array} Return an array of values to work with.
 */
function restParam_(maxParam, args, container) {
  
  if(args.length > maxParam) {
    Logger.log("loopings args");
    
    for(var i = maxParam -1; i < args.length; i++) {
      Logger.log(args[i]);
      
      if(args[i]) container.push(args[i]);
    }; 
    
  } else if (args.length == maxParam) {
    Logger.log("Only one arg");
    Logger.log(args[args.length -1]);
    
    container = args[args.length -1];
  }
  
  Logger.log("log results")
  Logger.log(container);
  Logger.log("type of container: " + typeof(container));
  
  return container;
};



function pagination_(source, p, arrayId, totalId, paginationOffset, modifier, maxItem) {
  
  var pBackup = JSON.stringify(p), // original param.
      response = source(p), //call to data source.
      tot = response[totalId], //total items found.
      lmtReached = 0; // little variance trigger on final msg.
  
  
  maxItem = !maxItem ? 1000 : maxItem; /** Default max item. 
  (tested up to 2414 items, took very long to run and doesnt work from spreadsheet 
  but in script it works.)*/
  
  Logger.log("%s Items will be processed or less.", maxItem);
  
  
  function processItems(response, arrayId, modifier, containerArray, itemLimit){
    
    for(var i = 0; i < response[arrayId].length; i++) {
      if(containerArray.length >= itemLimit) break;
      
      if(!modifier) containerArray.push(response[arrayId][i]);
      else {
        
        var item = modifier(response[arrayId][i])
        if(!item) item = "";
        
        containerArray.push(item);
      }
    };
    
    return containerArray;
  };
  
  
  var containerArray = new Array();
  
  if(tot < paginationOffset) {
    
    Logger.log("Less then %s items found", paginationOffset);
    Logger.log("%s items found", tot);
    
    processItems(response, arrayId, modifier, containerArray, maxItem);
  } else {
    
    Logger.log("More then %s items found", paginationOffset);
    Logger.log("%s items found", tot);
    
    while (tot > containerArray.length) {
      
      //Google limit control. will lod and add to spreadsheet a advise msg.
      if(containerArray.length >= maxItem) {
        
        var limit = (maxItem +" item limit reached.\n Limit to avoid breaking google quotas, exceed run time limit, set in function pagination_ in utils/anons.gs");
        
        Logger.log(limit);
        
        containerArray.push([limit]);
        lmtReached ++;
        
        break;
      };
      
      processItems(response, arrayId, modifier, containerArray, maxItem);
      
      if(tot <= containerArray.length) break;
      
      p = JSON.parse(pBackup);
      p.offset = containerArray.length;
      
      response = source(p);
    }; 
  };
  
  if(Array.isArray(containerArray[0])) {
    
    var endRow = [containerArray.length - lmtReached, tot, "This is the items you've retreived so far and the total item found. You can start a new request and set offset param to this number and continue."];
    if(containerArray.length - lmtReached === tot) endRow.push("Search successful");
    
    containerArray.push(endRow);
    
    Logger.log("Finished pagination.");
  }
  
  return containerArray;
};



/**
 * make sure your rest param is at the end of your propertyNameList
 */
function argsToObj_(expectedArgCount,propertyNameList, arguments) {
  
  var p = {},
      lastArgAr = restParam_(expectedArgCount, arguments, new Array());
  
  //Build parametter object
  for(var i = 0; i < propertyNameList.length; i++) {
    
    //If last property;
    if(i === propertyNameList.length -1 && lastArgAr) { 
      
      Logger.log("setting last param")
      Logger.log(typeof(lastArgAr));
      
      p[propertyNameList[i]] = lastArgAr; 
      
      break; 
     
    } else if(i === propertyNameList.length -1 && !lastArgAr) {
      
      Logger.log("no last param to set")
      p[propertyNameList[i]] = "";
      
      break;
      
    } else if(arguments[i]) {
      
      p[propertyNameList[i]] = arguments[i];
    }
  };
  
  Logger.log(p);
  return p;
};



/**
* Turn object to query string\
*
* @param {object} obj Supply an paramter object.
* @param {boolean} start indicate if you are starting a new query string or appending to one.
* @return {string} query string to append at the end of an uri.
*/
function obj2queryStr_(obj, start) {
  
  var queryS = "";
  
  if(obj) {
    
    //parametters properties
    var props = Object.keys(obj);
    Logger.log(props);
    
    if(start) {
      if(Array.isArray(obj[props[0]])) {
        
        queryS += ("?" +props[0] +"=" +obj[props[0]][0]);
        
        obj[props[0]][0].shift();
        
        obj[props[0]].forEach(function(value) {
          queryS += ("&" +props[0] +"=" + value);
          
          //      Logger.log(queryS);
          return queryS;
        });
        
      } else {
        queryS += ("?" +props[0] +"=" +obj[props[0]]);
      }
      
      props.shift();
    };
    
    if (props.length >= 1) {
      
      props.forEach(function(prop) {
        
        if(Array.isArray(obj[prop])) {
          
          obj[prop].forEach(function(value) {
            
            queryS += ("&" +prop +"=" + value);
            
            //      Logger.log(queryS);
            return queryS;
          });
          
        } else {
          queryS += ("&" +prop +"=" +obj[prop]);
        };
        
        //      Logger.log(queryS);
        return queryS;
      });
    };
  };
  
  Logger.log(queryS);
  return queryS;
};



// Is a valid numerical value. exclude null.
function validateN_(number) {
  
  if (number === null) return false;
  return (!isNaN(number) && number !== ""); //
};


/**
 * If checked value DOES NOT match with any of the values
 * in the array return true.
 * (function originaly created to check if a value 
 * -        is in the exception list on an other interator function.)
 */
function chkAbsence_(array, value2check) {
  
  if(!array) return true ; //nothing to check in;

  var res = array.every(function (a) { return a !== value2check });
  //  Logger.log("checkIfNoMatch:\n result: "+res);
  return res;
};

/** 
 *
 *
 */
function checkPresence_(arr, val) {
  
  return arr.some(function(arrVal) {
    return val === arrVal;
  });
};



/**
 * Function to make sure rounding does not crash with toFixed().
 * Will only apply toFixed when possible else will return entry raw.
 */
function myToFixed_(number, decimal) {
  
  if (validateN_(number)) return Number(number).toFixed(decimal);
  else return number;
};



function cleanObj(obj) { //   https://stackoverflow.com/a/286162/9588601
  for (var propName in obj) { 
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") delete obj[propName];
  }
};