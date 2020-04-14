$(function (){
  function notation(num) {
    if (notationForm == 0) {
      if (num <= 1) {
        return num.toFixed(3);
      } else {
        notationLevel = Math.floor(Math.log10(num)/3);
        notationSpace = Math.floor(Math.log10(num)%3);
        notationFixed = (num / 1000 ** notationLevel).toFixed(3 - notationSpace) ;
        if (notationLevel < 11) {
          return notationFixed + ' ' + standardNotation[notationLevel];
        } else {
          return notationFixed + ' ' + standardNotation2[(notationLevel-11) % 10] + standardNotation3[Math.floor((notationLevel-11) / 10)];
        }
      }
    } else {
      if (num >= 1e5) {
        return (num/(10**(Math.floor(Math.log10(num))))).toFixed(3) + 'e' + Math.floor(Math.log10(num));
      } else {
        return num.toFixed(2);
      }
    }
  }
  function copyToClipboard(val) {
    var t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = val;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
  }
  function makeSave() {
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
  }
  function gameSave() {
    var date = new Date();
    date.setDate(date.getDate() + 2000);
    var willCookie = "";
    willCookie += "saveData=";
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    willCookie += JSON.stringify(saveFile);
    willCookie += ";expires=" + date.toUTCString();
    document.cookie = willCookie;
  }
  function gameLoad() {
    var cookies = document.cookie.split(";");
    for(var i in cookies) {
      if(cookies[i].search('saveData') != -1) {
        const savedFile = JSON.parse(decodeURIComponent(cookies[i].replace('saveData' + "=", "")));
        dataCopy = JSON.parse(JSON.stringify(resetData));
        Object.assign(dataCopy, savedFile);
        for (var i = 0; i < varData.length; i++) {
          this[varData[i]] = dataCopy[i];
        }
        debugStr = dataCopy;
      }
    }
  }
  function gameReset() {
    for (var i = 0; i < varData.length; i++) {
      this[varData[i]] = resetData[i];
    }
    gameSave();
    location.reload();
  }
  function gameDisplay() {
    playerStatus();
    monsterStatus();
    loot();
    weapon();
    translateFun();
    tokenShop();
    tokenBuffCalc();
    playerUnlock();
    masteryQuest();
    mastery();
    otherworldy();
    $('#playtime').html(function (index,html) {
      return 'Total Play Time: ' + playtime.toFixed(3) + 'h';
    });
  }
  function playerStatus() {
    stageUnlocked = Math.floor((playerLevel-1)/10)+1;
    if (playerExp >= playerExpNeed) {
      if (meta == 0 && playerLevel < 101) {
        playerExp = playerExp - playerExpNeed;
        playerLevel = playerLevel + 1;
        playerExpNeed = 3.2**playerLevel*10;
        $("#playerLevel").attr({
          'class' : 'levelup'
        });
        $("#playerExp").attr({
          'class' : 'levelup'
        });
        setTimeout(function(){
          $("#playerLevel").attr({
            'class' : 'levelup2'
          });
          $("#playerExp").attr({
            'class' : 'levelup2'
          });
        }, 1000);
      } else if (meta == 1) {
        playerExp = playerExp - playerExpNeed;
        playerLevel = playerLevel + 1;
        playerExpNeed = 3.5**playerLevel*10;
        $("#playerLevel").attr({
          'class' : 'levelup'
        });
        $("#playerExp").attr({
          'class' : 'levelup'
        });
        setTimeout(function(){
          $("#playerLevel").attr({
            'class' : 'levelup2'
          });
          $("#playerExp").attr({
            'class' : 'levelup2'
          });
        }, 1000);
      }
    }
    $('#playerLevel').html(function (index,html) {
      return 'Level ' + playerLevel;
    });
    $('#playerExp').html(function (index,html) {
      if (meta == 0 && playerLevel < 101) {
        expPer = (playerExp / playerExpNeed * 100).toFixed(2);
        return ' - ' + notation(playerExp) + '/' + notation(playerExpNeed) + ' EXP (' + expPer + '%)';
      } else if (meta == 0) {
        playerExp = 0;
        playerLevel = 101;
        return ' - Max Power'
      } else if (meta == 1) {
        expPer = (playerExp / playerExpNeed * 100).toFixed(2);
        return ' - ' + notation(playerExp) + '/' + notation(playerExpNeed) + ' EXP (' + expPer + '%)';
      }
    });
    $('#coin').html(function (index,html) {
      return notation(coin) + ' coin (+' + notation(cps) + '/s)';
    });
    $('#token').html(function (index,html) {
      return notation(token) + ' token (' + tokenTimer.toFixed(1) + 's)';
    });
    setTimeout(function(){
      $('.totalCombatStatus').html(function (index,html) {
        if (playerLevel < 71 || otherworldyCount == 1) {
          return 'Total Status<br>Dmg: ' + notation(upgradeBuff00R*playerDmg*tokenBuff0N*masteryBuff00R*artifactOverBoost[1]) + '<br>' + 'Hit/s: ' + (playerHitPS+1);
        } else {
          return 'Total Status<br>Dmg: ' + notation(upgradeBuff00R*playerDmg*tokenBuff0N*masteryBuff00R*artifactOverBoost[1]*monsterWeakness) + ' (Weakness: x' + monsterWeakness.toFixed(2) + ')<br>' + 'Hit/s: ' + (playerHitPS+1);
        }
      });
    }, 10);
  }
  function playerUnlock() {
    if (playerLevel >= 101 || otherworldyCount >= 1) {
      $('.mainMenu').css('width', '12.499999%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 79.999%;' );
      $('#fieldWarp > span:eq(1)').show();
      $('#masteryWarp > .skillLine:eq(2)').show();
      $('#coin').show();
      $('#mainNav > div:eq(6)').show();
      $('#mainNav > div:eq(5)').show();
      $('#mainNav > div:eq(4)').show();
    } else if (playerLevel >= 71) {
      $('.mainMenu').css('width', '12.499999%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 79.999%;' );
      $('#fieldWarp > span:eq(1)').show();
      $('#masteryWarp > .skillLine:eq(2)').show();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').show();
      $('#mainNav > div:eq(5)').show();
      $('#mainNav > div:eq(4)').show();
    } else if (playerLevel >= 31) {
      $('.mainMenu').css('width', '14.285713%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 79.999%;' );
      $('#fieldWarp > span:eq(1)').show();
      $('#masteryWarp > .skillLine:eq(2)').hide();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').hide();
      $('#mainNav > div:eq(5)').show();
      $('#mainNav > div:eq(4)').show();
    } else if (playerLevel >= 11) {
      $('.mainMenu').css('width', '16.666666%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 99.999%;' );
      $('#fieldWarp > span:eq(1)').hide();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').hide();
      $('#mainNav > div:eq(5)').hide();
      $('#mainNav > div:eq(4)').show();
    } else {
      $('.mainMenu').css('width', '19.999999%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 99.999%;' );
      $('#fieldWarp > span:eq(1)').hide();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').hide();
      $('#mainNav > div:eq(5)').hide();
      $('#mainNav > div:eq(4)').hide();
    }
    if (true) {

    }
  }
  function monsterStatus() {
    $("#monster").css('background-image', 'url(monster/' + monsterNow + '.png)');
    $('#monLevel').html(function (index,html) {
      return 'Lv ' + monsterNow;
    });
    $('#monsterStatus').html(function (index,html) {
      return monName[monsterNow] + ' (hp: ' + notation(monsterHp) + '/' + notation(monsterHpM) + ')';
    });
  }
  function loot() {
    switch (translateNum) {
      case 0:
        translateTxt = 'EXP Bottle'
        break;
      case 1:
        translateTxt = '경험치 병'
        break;
    }
    $('#EXPBottleQ').html(function (index,html) {
      return translateTxt + ' - ' + lootQuantity[1];
    });
    switch (translateNum) {
      case 0:
        translateTxt = 'Mysterious Chest'
        break;
      case 1:
        translateTxt = '의문의 상자'
        break;
    }
    $('#mysteryChestQ').html(function (index,html) {
      return translateTxt + ' - ' + lootQuantity[2];
    });
    switch (translateNum) {
      case 0:
        translateTxt = 'Tier'
        break;
      case 1:
        translateTxt = '티어'
        break;
    }
    $('#tierLootMark').html(function (index,html) {
      return translateTxt + ' ' + lootPage;
    });
    a = 1;
    while(a <= 4){
      $("#tierLoot > .lootItem:eq(" + (a-1) + ") > .lootName").html(function (index,html) {
        return lootName[(lootPage - 1)*4 + a] + ' - ' + lootQuantity[(lootPage - 1)*4 + a + 2];
      });
      $("#tierLoot > .lootItem:eq(" + (a-1) + ") > .lootImg").attr({
        'style' : 'background-image: url(loot/' + ((lootPage - 1)*4 + a) + '.png);'
      });
      a++;
    }
  }
  function weapon() {
    a = 1;
    while(a <= 5){
      weaponNum = (weaponPage - 1) * 5 + a;
      if (weaponLevel[weaponNum] >= 1) {
        if (weaponLevel[weaponNum] != 999) {
          weaponRank = Math.floor((weaponLevel[weaponNum]/100)+1);
        } else {
          weaponRank = 11;
        }
        $(".weaponBg > .weapon:eq(" + (a-1) + ")").attr({
          'src' : 'weapon/' + weaponNum + '.png'
        });
        $("#weaponWarp > .weaponBg:eq(" + (a-1) + ")").attr({
          'style' : 'background-image: url(rank/' + weaponRank + '.png);'
        });
      } else {
        $(".weaponBg > .weapon:eq(" + (a-1) + ")").attr({
          'src' : 'weapon/0.png'
        });
        $("#weaponWarp > .weaponBg:eq(" + (a-1) + ")").attr({
          'style' : 'background-image: url(etc/mystery_weapon.png);'
        });
      }
      a++;
    }
  }
  function ldmD() {
    if (ldm == 0) {
      $('#LDM').html(function (index,html) {
        return 'Enable Low Detail Mod';
      });
    } else {
      $('#LDM').html(function (index,html) {
        return 'Disable Low Detail Mod';
      });
    }
  }
  function gotWeaponCalc(num, quantity) {
    if (quantity > 0) {
      if (weaponLevel[num] < 999) {
        if (weaponLevel[num] + quantity > 999) {
          quantity = 999 - weaponLevel[num];
        }
        weaponLevel[num] = weaponLevel[num] + quantity;
        playerDmg = playerDmg + ((num*2)**(1+(num*2)/5)*10)/(1+(num*2)**3)*quantity;
        collectedWeapon = collectedWeapon + quantity;
        if (weaponLevel[num] == 999) {
          switch (translateNum) {
            case 0:
              translateTxt = 'reached 999Level!'
              break;
            case 1:
              translateTxt = '999레벨 달성!'
              break;
          }
          strA = '<span class="maxLv">' + weaponName[num] + ' ' + translateTxt + ' +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num] + '</span>'
          token = token + 10;
        } else {
          switch (translateNum) {
            case 0:
              translateTxt = 'level up!'
              break;
            case 1:
              translateTxt = '획득!'
              break;
          }
          if (num%5 == 0) {
            strA = '<span class="rare">' + weaponName[num] + ' ' + translateTxt + ' +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num] + '</span>'
          } else {
            strA = weaponName[num] + ' ' + translateTxt + ' +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num];
          }
        }
        extraStstusSet(strA);
      }
      playerStatus();
    }
  }
  function extraStstusSet(str) {
    a = 8;
    while (a >= 0) {
      extraStatus[a+1] = extraStatus[a]
      a--;
    }
    extraStatus[0] =  '- '+ str;
    d = 0;
    extraStatusStr = '';
    while (d <= 9) {
      extraStatusStr = extraStatusStr + extraStatus[d] + '<br>';
      d++;
    }
    $('#extraStatus').html(function (index,html) {
      return extraStatusStr;
    });
  }
  function hitMonster(dmg) {
    monsterHp = monsterHp - dmg*tokenBuff0N*masteryBuff00R*artifactOverBoost[1]*monsterWeakness*upgradeBuff00R;
    if (monsterHp <= 0) {
      monsterWeakness = 1;
      gotLoot = (1+artifactOverBoost[5]);
      artiCh = 1;
      if (Math.random() < 1-masteryBuff01R) {
        gotLoot = gotLoot * 2;
      }
      if (rareMob == 1) {
        gotLoot = gotLoot * 100;
      }
      if (upgradeBuff10R == -1) {
        gotLoot = gotLoot * 3;
      }
      playerExp = playerExp + Math.random()*(tokenBuff3N**(monsterNow))*tokenBuff2N*masteryBuff02*gotLoot*artifactOverBoost[2]*upgradeBuff01R;
      luck = Math.floor(Math.random()*100);
      if (playerLevel >= 31 || otherworldyCount >= 1) {
        if (monsterNow < 101) {
          if (upgradeBuff11R != 1) {
            mobKilled[monsterNow] += 1*masteryBuff20R+artifactOverBoost[9]+upgradeBuff11R;
          } else {
            mobKilled[monsterNow] += 1*masteryBuff20R+artifactOverBoost[9];
          }
        } else {
          if (brokeUniverse == 0) {
            extraStstusSet('<span class="brokeUniv">You Broke Universe! (Unlocked Otherworldy)</span>');
          }
          brokeUniverse = 1;
        }
      }
      loot1Chance = 100-(50+(stagePage-1)*3);
      if (0 <= luck &&  luck < 50+(stagePage-1)*3) {

      } else if (50+(stagePage-1)*3 <= luck && luck < (50+(stagePage-1)*3+loot1Chance*(1-(((monsterNow-1)%5))*0.25))) {
        lootNum = (Math.ceil(monsterNow/5)*2)+1;
        lootQuantity[lootNum] = lootQuantity[lootNum] + gotLoot;
        if (menuPage == 0) {
          switch (translateNum) {
            case 0:
              translateTxt = 'You got '
              translateTxt2 = ''
              translateTxt3 = 'Have '
              translateTxt4 = ''
              break;
            case 1:
            translateTxt = ''
            translateTxt2 = ' 획득'
            translateTxt3 = ''
            translateTxt4 = '개 보유'
              break;
          }
          if (stageUnlocked == stagePage && stagePage != 11) {
            extraStstusSet(translateTxt + lootName[lootNum-2] + '' + translateTxt2 + '! (' + translateTxt3 + lootQuantity[lootNum] + translateTxt4 + ')');
          }
        }
        loot();
      } else if (50+(stagePage-1)*3+loot1Chance*(1-(((monsterNow-1)%5))*0.25) <= luck && luck < 100) {
        lootNum = (Math.ceil(monsterNow/5)*2)+2;
        lootQuantity[lootNum] = lootQuantity[lootNum] + gotLoot;
        if (menuPage == 0) {
          switch (translateNum) {
            case 0:
              translateTxt = 'You got '
              translateTxt2 = ''
              translateTxt3 = 'Have '
              translateTxt4 = ''
              break;
            case 1:
            translateTxt = ''
            translateTxt2 = ' 획득'
            translateTxt3 = ''
            translateTxt4 = '개 보유'
              break;
          }
          if (stageUnlocked == stagePage && stagePage != 11) {
            extraStstusSet(translateTxt + lootName[lootNum-2] + '' + translateTxt2 + '! (' + translateTxt3 + lootQuantity[lootNum] + translateTxt4 + ')');
          }
        }
        loot();
      }
      summonMonster();
      masteryQuest();
      if (playerLevel >= 71 && Math.random() < gotLoot*masteryBuff22R*0.0003/(1.7**artifactQuantity[stagePage]) && stagePage != 11) {
        gotArtifact(stagePage);
      }
      if (playerLevel >= 71 && Math.random() < gotLoot*masteryBuff22R*0.00003/(1.7**artifactQuantity[((stagePage-1)*3)+10+Math.floor((monsterNow-(stagePage-1)*10)/5)+1]) && stagePage != 11) {
        gotArtifact(Math.floor(((stagePage-1)*3)+10+Math.floor((monsterNow-(stagePage-1)*10)/5))+1);
      }
      if (playerLevel >= 71 && Math.random() < gotLoot*artifactOverBoost[12]*masteryBuff23R*0.000005*(4**(stagePage-8)) && stagePage >= 8) {
        gotArtifact(100);
      }
    }
    monsterStatus();
    playerStatus();
    $("#monsterHpProgress").attr({
      'value' : monsterHp / monsterHpM
    });
    $('#monsterHpProgressNum').html(function (index,html) {
      return (monsterHp / monsterHpM * 100).toFixed(2) + '%';
    });
  }
  function summonMonster() {
    if (stagePage != 11) {
      if (stagePage*10 <= playerLevel) {
        monsterNow = Math.floor(Math.random()*10)+1+(stagePage-1)*10;
      } else {
        monsterNow = Math.floor(Math.random()*(playerLevel-(stagePage-1)*10))+1+(stagePage-1)*10;
      }
    } else {
      monsterNow = 101;
    }
    monsterHpCalc();
    monsterStatus();
  }
  function monsterHpCalc() {
    extraMonsterHp = 1;
    if (monsterNow >= 71) {
      extraMonsterHp = (100**((monsterNow-70)/10));
      if (monsterNow >= 101) {
        extraMonsterHp = extraMonsterHp**2.8*10;
      }
      if (monsterNow >= 201) {
        extraMonsterHp = extraMonsterHp**1.1*10;
      }
    }
    if (masteryBuff10R != 1 && Math.random() < masteryBuff10) {
      $("#monLevel").attr({
        'style' : 'rareMob'
      });
      rareMob = 1;
      monsterHpM = (((monsterNow**(1+monsterNow/5)*10)*(1+30/(monsterNow/100+1))/10-0.7)*80)*extraMonsterHp;
      monsterHp = monsterHpM;
      if (stageUnlocked-1 <= stagePage) {
        extraStstusSet('<span class="rareMob">Rare Monster Appeared! (' + monsterNow + ' Lv)</span>');
      }
    } else {
      $("#monLevel").attr({
        'style' : ' '
      });
      rareMob = 0;
      monsterHpM = ((monsterNow**(1+monsterNow/5)*10)*(1+30/(monsterNow/100+1))/10-0.7)*extraMonsterHp;
      monsterHp = monsterHpM;
    }
  }
  function stageChange() {
    summonMonster();
    $("#fieldWarp").attr({
      'style' : 'background-image: url(bg/world' + stagePage + '.png);'
    });
    $('#stageNum').html(function (index,html) {
      return stagePage;
    });
    if (stagePage < 10) {
      $("#monsterStatus").attr({
        'class' : ' '
      });
      $("#monsterHpProgressNum").attr({
        'class' : ' '
      });
      $("#tCS").attr({
        'class' : 'totalCombatStatus black'
      });
    } else  {
      $("#monsterStatus").attr({
        'class' : 'spaceText'
      });
      $("#monsterHpProgressNum").attr({
        'class' : 'spaceText'
      });
      $("#tCS").attr({
        'class' : 'totalCombatStatus black spaceText'
      });
    }
  }
  function lootChange() {
    $('#lootNum').html(function (index,html) {
      return lootPage;
    });
    loot();
  }
  function weaponChange() {
    $('#weaponNum').html(function (index,html) {
      return weaponPage;
    });
    weapon();
  }
  function tokenShop() {
    tokenBuffCalc();
    $('#tokenDisplay').html(function (index,html) {
      return 'You Have ' + token.toFixed(0) + ' Tokens'
    });
    $('#tokenBuff1').html(function (index,html) {
      if (tokenUpgradeCap[0] != tokenUpgrade[0]) {
        return 'x' + tokenBuff0N.toFixed(1) + ' -> x'+ tokenBuff0L.toFixed(1)
      } else {
        return 'x' + tokenBuff0N.toFixed(1)
      }
    });
    $('#tokenBuff2').html(function (index,html) {
      if (tokenUpgradeCap[1] != tokenUpgrade[1]) {
        return 'x' + tokenBuff1N + ' -> x'+ tokenBuff1L
      } else {
        return 'x' + tokenBuff1N
      }
    });
    $('#tokenBuff3').html(function (index,html) {
      if (tokenUpgradeCap[2] != tokenUpgrade[2]) {
        return 'x' + tokenBuff2N.toFixed(1) + ' -> x'+ tokenBuff2L.toFixed(1)
      } else {
        return 'x' + tokenBuff2N.toFixed(1)
      }
    });
    $('#tokenBuff4').html(function (index,html) {
      if (tokenUpgradeCap[3] != tokenUpgrade[3]) {
        return '^' + tokenBuff3N + ' -> ^'+ tokenBuff3L
      } else {
        return '^' + tokenBuff3N
      }
    });
    $('#tokenBuff5').html(function (index,html) {
      if (tokenUpgradeCap[4] != tokenUpgrade[4]) {
        return tokenBuff4N + '% -> '+ tokenBuff4L + '%'
      } else {
        return tokenBuff4N + '%'
      }
    });
    $('#tokenBuff6').html(function (index,html) {
      if (tokenUpgradeCap[5] != tokenUpgrade[5]) {
        return tokenBuff5N.toFixed(3) + 's -> '+ tokenBuff5L.toFixed(3) + 's'
      } else {
        return tokenBuff5N.toFixed(3) + 's'
      }
    });
    $('#tokenBuff7').html(function (index,html) {
      if (tokenUpgradeCap[6] != tokenUpgrade[6]) {
        return tokenBuff6N + '/s -> '+ tokenBuff6L + '/s'
      } else {
        return tokenBuff6N + '/s'
      }
    });
    $('#tokenBuy1').html(function (index,html) {
      if (tokenUpgrade[0] != tokenUpgradeCap[0]) {
        return 'Buy (' + tokenUpgradePrice[0] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenBuy2').html(function (index,html) {
      if (tokenUpgrade[1] != tokenUpgradeCap[1]) {
        return 'Buy (' + tokenUpgradePrice[1] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenBuy3').html(function (index,html) {
      if (tokenUpgrade[2] != tokenUpgradeCap[2]) {
        return 'Buy (' + tokenUpgradePrice[2] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenBuy4').html(function (index,html) {
      if (tokenUpgrade[3] != tokenUpgradeCap[3]) {
        return 'Buy (' + tokenUpgradePrice[3] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenBuy5').html(function (index,html) {
      if (tokenUpgrade[4] != tokenUpgradeCap[4]) {
        return 'Buy (' + tokenUpgradePrice[4] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenBuy6').html(function (index,html) {
      if (tokenUpgrade[5] != tokenUpgradeCap[5]) {
        return 'Buy (' + tokenUpgradePrice[5] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenBuy7').html(function (index,html) {
      if (tokenUpgrade[6] != tokenUpgradeCap[6]) {
        return 'Buy (' + tokenUpgradePrice[6] + ' Token)'
      } else {
        return 'Maxed!'
      }
    });
    $('#tokenLevel1').html(function (index,html) {
      return tokenUpgrade[0]
    });
    $('#tokenLevel2').html(function (index,html) {
      return tokenUpgrade[1]
    });
    $('#tokenLevel3').html(function (index,html) {
      return tokenUpgrade[2]
    });
    $('#tokenLevel4').html(function (index,html) {
      return tokenUpgrade[3]
    });
    $('#tokenLevel5').html(function (index,html) {
      return tokenUpgrade[4]
    });
    $('#tokenLevel6').html(function (index,html) {
      return tokenUpgrade[5]
    });
    $('#tokenLevel7').html(function (index,html) {
      return tokenUpgrade[6]
    });
    $('#tokenName1').html(function (index,html) {
      return tokenUpgradeName[0]
    });
    $('#tokenName2').html(function (index,html) {
      return tokenUpgradeName[1]
    });
    $('#tokenName3').html(function (index,html) {
      return tokenUpgradeName[2]
    });
    $('#tokenName4').html(function (index,html) {
      return tokenUpgradeName[3]
    });
    $('#tokenName5').html(function (index,html) {
      return tokenUpgradeName[4]
    });
    $('#tokenName6').html(function (index,html) {
      return tokenUpgradeName[5]
    });
    $('#tokenName7').html(function (index,html) {
      return tokenUpgradeName[6]
    });
  }
  function tokenBuffCalc() {
    tokenBuff0N = 1 + tokenUpgrade[0]*0.2;
    tokenBuff0L = 1 + (tokenUpgrade[0]+1)*0.2;
    tokenBuff1N = (1 + (tokenUpgrade[1]**1.1)/5).toFixed(1);
    tokenBuff1L = (1 + ((tokenUpgrade[1]+1)**1.1)/5).toFixed(1);
    tokenBuff2N = 1 + tokenUpgrade[2]*0.1;
    tokenBuff2L = 1 + (tokenUpgrade[2]+1)*0.1;
    if (upgradeBuff03R != 1) {
      tokenBuff3N = (2.8 + upgradeBuff03R + tokenUpgrade[3]*0.01).toFixed(2);
      tokenBuff3L = (2.8 + upgradeBuff03R + (tokenUpgrade[3]+1)*0.01).toFixed(2);
    } else {
      tokenBuff3N = (2.8 + tokenUpgrade[3]*0.01).toFixed(2);
      tokenBuff3L = (2.8 + (tokenUpgrade[3]+1)*0.01).toFixed(2);
    }
    tokenBuff4N = 1 + tokenUpgrade[4];
    tokenBuff4L = 1 + (tokenUpgrade[4]+1)*1;
    tokenBuff5N = 600*0.9**tokenUpgrade[5];
    tokenBuff5L = 600*0.9**(tokenUpgrade[5]+1);
    tokenBuff6N = tokenUpgrade[6];
    tokenBuff6L = (tokenUpgrade[6]+1);
    playerHitPS = tokenBuff6N;
  }
  function masteryQuest() {
    if (totalToken < token) {
      totalToken = token;
    }
    $('#masteryQuest > div:eq(0)').html(function (index,html) {
      return 'Player Level (' + playerLevel + '/' + (masteryCompeleted[0]*5+35) + ')';
    });
    if (playerLevel >= (masteryCompeleted[0]*5+35)) {
      $('#masteryQuest > span:eq(0)').attr('class', 'buySkillPointY');
    } else {
      $('#masteryQuest > span:eq(0)').attr('class', 'buySkillPointN');
    }
    $('#masteryQuest > div:eq(1)').html(function (index,html) {
      return 'Collect Token (' + totalToken.toFixed(0) + '/' + (1000*2**masteryCompeleted[1]) + ')';
    });
    if (totalToken >= (1000*2**masteryCompeleted[1])) {
      $('#masteryQuest > span:eq(1)').attr('class', 'buySkillPointY');
    } else {
      $('#masteryQuest > span:eq(1)').attr('class', 'buySkillPointN');
    }
    totTokenUpgrede = 0;
    for (var i = 0; i < tokenUpgrade.length; i++) {
      totTokenUpgrede += tokenUpgrade[i];
    }
    $('#masteryQuest > div:eq(2)').html(function (index,html) {
      return 'Token Upgrade (' + totTokenUpgrede + '/' + (100*(masteryCompeleted[2]+1)) + ')';
    });
    if (totTokenUpgrede >= (100*(masteryCompeleted[2]+1))) {
      $('#masteryQuest > span:eq(2)').attr('class', 'buySkillPointY');
    } else {
      $('#masteryQuest > span:eq(2)').attr('class', 'buySkillPointN');
    }
    for (var i = 3; i < 13; i++) {
      if (masteryCompeleted[((stagePage-1)*10+i)] < 1 || (upgradeBuff12R == -1 && meta == 1)) {
        $('#masteryQuest > div:eq(' + i + ')').html(function (index,html) {
          $('#masteryQuest > div:eq(' + i + ')').show();
          $('#masteryQuest > span:eq(' + i + ')').show();
          $('#masteryQuest > br:eq(' + i + ')').show();
          return 'Monster Lv' + ((stagePage-1)*10+i-2) + ' (' + mobKilled[((stagePage-1)*10+i-2)].toFixed(0) + '/' + ((1000+500*(stagePage-1))*1.3**(masteryCompeleted[((stagePage-1)*10+i)])).toFixed(0) + ')';
        });
        if (mobKilled[((stagePage-1)*10+i-2)] >= ((1000+500*(stagePage-1))*1.3**(masteryCompeleted[((stagePage-1)*10+i)])).toFixed(0)) {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointY');
        } else {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointN');
        }
      } else {
        $('#masteryQuest > div:eq(' + i + ')').hide();
        $('#masteryQuest > span:eq(' + i + ')').hide();
        $('#masteryQuest > br:eq(' + i + ')').hide();
      }
    }
    for (var i = 13; i < 18; i++) {
      if (masteryCompeleted[((stagePage-1)*5+i)+90] < 1 ||  (upgradeBuff12R == -1 && meta == 1)) {
        $('#masteryQuest > div:eq(' + i + ')').html(function (index,html) {
          $('#masteryQuest > div:eq(' + i + ')').show();
          $('#masteryQuest > span:eq(' + i + ')').show();
          $('#masteryQuest > br:eq(' + i + ')').show();
          return 'Weapon Nr' + ((stagePage-1)*5+i-12) + ' (' + (weaponLevel[((stagePage-1)*5+i-12)] + '/' + (999*(masteryCompeleted[((stagePage-1)*5+i)+90]+1)**2)) + ')';
        });
        if (weaponLevel[((stagePage-1)*5+i-12)] >= 999*(masteryCompeleted[((stagePage-1)*5+i)+90]+1)**2) {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointY');
        } else {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointN');
        }
      } else {
        $('#masteryQuest > div:eq(' + i + ')').hide();
        $('#masteryQuest > span:eq(' + i + ')').hide();
        $('#masteryQuest > br:eq(' + i + ')').hide();
      }
    }
  }
  function mastery() {
    masteryBuff00 = (playerLevel >= 30) ? (playerLevel - 30)*0.05 + 2 : 2;
    masteryBuff01 = 0.5;
    masteryBuff02 = collectedWeapon/9990 + 1;
    masteryBuff03 = (playerLevel >= 30) ? (playerLevel - 30)*0.15 + 2 : 2;
    masteryBuff10 = 0.01;
    masteryBuff11 = 0.02;
    masteryBuff12 = (playerLevel >= 30) ? (playerLevel - 30)*0.5 + 5 : 5;
    masteryBuff13 = 0.99;
    masteryBuff20 = 3;
    masteryBuff21 = Number(tokenBuff1N);
    masteryBuff22 = 2;
    masteryBuff23 = 2;
    $('#skillPoint').html(function (index,html) {
      return 'You Have ' + playerSP + ' Skill Point';
    });
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        eval('masteryBuff' + i + j + 'R = (masteryBought[' + (i*4+j) + '] == 1) ? masteryBuff' + i + j + ' : 1');
        $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ') > p:eq(0)').html(function (index,html) {
          if (i*4+j != 7) {
            return masteryInfo[i*4+j] + '<br>' + ((eval('masteryBuff' + i + j) >= 1) ? "x" + eval('masteryBuff' + i + j).toFixed(2) : (eval('masteryBuff' + i + j)*100).toFixed(0) + "%");
          } else {
            return masteryInfo[i*4+j];
          }
        });
        $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ') > p:eq(1)').html(function (index,html) {
          return masteryPrice[i*4+j] + ' SP';
        });
        if (masteryBought[i*4+j] == 1) {
          $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ')').attr({
            'class' : 'skillSel skillY'
          });
        } else if (masteryPrice[i*4+j] <= playerSP) {
          $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ')').attr({
            'class' : 'skillSel skillM'
          });
        } else {
          $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ')').attr({
            'class' : 'skillSel skillN'
          });
        }
      }
    }
  }
  function artifact() {
    artifactOverBoost = ['0', 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 2, 1];
    for (var i = 1; i < artifactQuantity.length; i++) {
      effNum = artifactEffect[i];
      artifactOverBoost[effNum] += (artifactQuantity[i]*artifactEffectPow[i]);
    }
    artiStr = '';
    for (var i = 1; i < artifactOverBoost.length; i++) {
      if (i == 1 || i == 2 || i == 4 || i == 6 || i == 7 || i == 8 || i == 11 || i == 12) {
        artiStr += artiBuffNameStr[i-1] + ': x' + artifactOverBoost[i].toFixed(2) + '<br>';
      } else if (i == 3) {
        artiStr += artiBuffNameStr[i-1] + ': +' + artifactOverBoost[i].toFixed(2) + '%<br>';
      } else if (i == 5 || i == 9) {
        artiStr += artiBuffNameStr[i-1] + ': +' + artifactOverBoost[i].toFixed(2) + '<br>';
      } else if (i == 10) {
        artiStr += artiBuffNameStr[i-1] + ': +x' + artifactOverBoost[i].toFixed(2) + '<br>';
      }
    }
    $('#overallArtifact').html(function (index,html) {
      return artiStr;
    });
    for (var i = 0; i < 51; i++) {
      if (artifactQuantity[i] >= 1) {
        $(".artifactBg:eq(" + (i-1) + ")").attr({
          'style' : 'background-image: url(rank/' + artifactQuantity[i] + '.png);'
        });
        $(".artifact:eq(" + (i-1) + ")").attr({
          'src' : 'artifact/' + i + '.png'
        });
      } else {
        $(".artifactBg:eq(" + (i-1) + ")").attr({
          'style' : 'background-image: url(etc/mystery_weapon.png);'
        });
        $(".artifact:eq(" + (i-1) + ")").attr({
          'src' : 'artifact/0.png'
        });
      }
    }
  }
  function otherworldy() {
    $('#transcensionDisplay').html(function (index,html) {
      return 'You Have ' + tp + ' Transcension Point';
    });
    upgradeBuff00 = 1+otherworldyCount*3*((otherworldyCount*2.5)**Math.sqrt(Math.floor(otherworldyCount/100)));
    upgradeBuff01 = 1+tp/3;
    upgradeBuff02 = -1;
    upgradeBuff03 = 0.01*upgradeBought[3];
    upgradeBuff10 = 3;
    upgradeBuff11 = upgradeBought[5]*2;
    upgradeBuff12 = -1;
    upgradeBuff13 = -1;
    upgradeBuff20 = -1;
    upgradeBuff21 = -1;
    upgradeBuff22 = -1;
    upgradeBuff23 = 2**upgradeBought[11];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        eval('upgradeBuff' + i + j + 'R = (upgradeBought[' + (i*4+j) + '] >= 1) ? upgradeBuff' + i + j + ' : 1');
        $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ') > p:eq(0)').html(function (index,html) {
          if (eval('upgradeBuff' + i + j) != -1 && i*4+j != 3 && i*4+j != 5) {
            return upgradeInfo[i*4+j] + '<br>' + ((eval('upgradeBuff' + i + j) >= 1) ? "x" + eval('upgradeBuff' + i + j).toFixed(2) : (eval('upgradeBuff' + i + j)*100).toFixed(0) + "%");
          } else if (i*4+j == 3 || i*4+j == 5) {
            return upgradeInfo[i*4+j] + '<br> +' + eval('upgradeBuff' + i + j).toFixed(2);
          } else {
            return upgradeInfo[i*4+j];
          }
        });
        $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ') > p:eq(1)').html(function (index,html) {
          return upgradeCost[i*4+j] + ' TP';
        });
        if (upgradeBought[i*4+j] >= 1) {
          a = i*4+j;
          if (a == 0 || a == 1 || a == 2 || a == 4 || a == 6 || a == 7 || a == 8 || a == 9 || a == 10) {
            $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ')').attr({
              'class' : 'upgradeSel upgradeY'
            });
          } else {
            if (upgradeCost[i*4+j] <= tp) {
              $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ')').attr({
                'class' : 'upgradeSel upgradeM'
              });
            } else {
              $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ')').attr({
                'class' : 'upgradeSel upgradeN'
              });
            }
          }
        } else if (upgradeCost[i*4+j] <= tp) {
          $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ')').attr({
            'class' : 'upgradeSel upgradeM'
          });
        } else {
          $('.upgradeLine:eq(' + i + ') > .upgradeSel:eq(' + j + ')').attr({
            'class' : 'upgradeSel upgradeN'
          });
        }
      }
    }
    if (playerLevel >= 101 && brokeUniverse >= 1 && meta == 0 && upgradeBuff02R == -1) {
      $('#metaButton').attr({
        'class' : 'meY'
      });
    } else {
      $('#metaButton').attr({
        'class' : 'meN'
      });
    }
    if (playerLevel >= 101 && brokeUniverse >= 1) {
      $('#transcensionButton').attr({
        'class' : 'trY'
      });
      $('#transcensionButton').html(function (index,html) {
        return 'Go to other world (' + (2+(playerLevel-100)**2*upgradeBuff23R) + ' TP)!';
      });
    } else {
      $('#transcensionButton').attr({
        'class' : 'trN'
      });
      $('#transcensionButton').html(function (index,html) {
        return 'Go to other world (0 TP)!';
      });
    }
  }
  function translateFun() {
    for (var i = 0; i < toTranslate.length; i++) {
      translateString = toTranslate[i] + ' = ' + toTranslate[i] + translate[translateNum]
      eval(translateString);
    }
    $('#translate').html(function (index,html) {
      return translate[translateNum];
    });
  }
  function setPopup(msg) {
    setTimeout(function() {
      $('#popupLayer').html(function (index,html) {
        return msg;
      });
  		$('#popupLayer').css({
  			"top": divTop,
  			"left": divLeft,
  			"position": "absolute"
  		}).show();
      var timerId1 = setTimeout(function() {
        $('#popupLayer').hide();
      }, 1000);
    }, 0);
  }
  function setDmg(msg) {
    if (ldm == 0) {
      setTimeout(function() {
        $('#popupDmg').html(function (index,html) {
          return '-' + notation(msg) + ' hp';
        });
    		$('#popupDmg').css({
    			"top": divTop,
    			"left": divLeft,
    			"position": "absolute"
    		}).show();
        var timerId1 = setTimeout(function() {
          $('#popupDmg').hide();
        }, 100);
      }, 0);
    }
  }
  function setToken(msg) {
    if (ldm == 0) {
      setTimeout(function() {
        $('#popupToken').html(function (index,html) {
          return '+' + notation(msg) + ' token';
        });
    		$('#popupToken').css({
    			"top": divTop,
    			"left": divLeft,
    			"position": "absolute"
    		}).show();
        var timerId1 = setTimeout(function() {
          $('#popupToken').hide();
        }, 500);
      }, 0);
    }
  }
  function gotArtifact(num) {
    if (num == 100) {
      lootQuantity[2]++;
      extraStstusSet('<span class="gotChest">You got an Chest!</span>');
    }
    if (artifactQuantity[num] != 11) {
      artifactQuantity[num]++;
      if (disableMessage = 0) {
        extraStstusSet('<span class="gotArtifact">You got an Artifact: ' + artifactName[num] + '</span>');
      }
    }
  }
  function lv0Skip() {
    for (var i = 0; i < varData.length; i++) {
      this[varData[i]] = resetData[i];
    }
  }
  function lv11Skip() {
    playerLevel = 11;
    stageUnlocked = 2;
    token = 200;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];
  }
  function lv31Skip() {
    playerLevel = 31;
    stageUnlocked = 4;
    token = 5000;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];
  }
  function lv71Skip() {
    playerLevel = 71;
    stageUnlocked = 8;
    token = 100000;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];
  }
  function lv101Skip() {
    playerLevel = 101;
    stageUnlocked = 11;
    token = 500000;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
    ];
  }
  $("#mainNav > div").click(function () {
    a = $("#mainNav > div").index(this);
    menuCheck = 0;
    switch (a) {
      case 3:
        if (playerLevel >= 11 || otherworldyCount >= 1) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 11 + ' ' + popupMsg[2]);
        }
        break;
      case 4:
        if (playerLevel >= 31 || otherworldyCount >= 1) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 31 + ' ' + popupMsg[2]);
        }
        break;
      case 5:
        if (playerLevel >= 71 || otherworldyCount >= 1) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 71 + ' ' + popupMsg[2]);
        }
        break;
      case 6:
        if (brokeUniverse >= 1 || otherworldyCount >= 1) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[3]);
        }
        break;
      default:
        menuCheck = 1;
    }
    if (menuCheck == 1) {
      $("#menusWarp > div").hide();
      $("#menusWarp > div:eq(" + a + ")").show();
      menuPage = $("#mainNav > div").index(this);
      gameDisplay();
    }
  });
  $(".lootItem").click(function () {
    setTimeout( function (){
      loot();
      playerStatus();
    }, 0);
  });
  $("#EXPBottleC").click(function () {
    if (1 == 2) {
      if (lootQuantity[1] >= 1) {
        if (lootQuantity[1] < bulkOpen) {
          bulk = lootQuantity[1];
        } else {
          bulk = bulkOpen;
        }
        lootQuantity[1] = lootQuantity[1] - bulk;
        a = 1;
        while (a <= bulk) {
          playerExp = playerExp + Math.random()*playerExpNeed/(3*((playerLevel+1)**1.2))/5*bulk;
          a++;
        }
      }
    } else {
      setPopup('Comming Soon');
    }
  });
  $("#tierLoot > span").click(function () {
    a = $("#tierLoot > span").index(this);
    b = (lootPage - 1)*4 + a + 3;
    if (lootQuantity[b] >= 1) {
      if (lootQuantity[b] < bulkOpen) {
        bulk = lootQuantity[b]
      } else {
        bulk = bulkOpen;
      }
      lootQuantity[b] = lootQuantity[b] - bulk;
      c = 1;
      gotWeapon = [0, 0, 0];
      luckP = 0;
      if (masteryBuff11R != 1) {
        luckP = masteryBuff11R*100;
      }
      while (c <= bulk) {
        luck = Math.floor(Math.random()*100);
        if ((b-2)%2 == 1) {
          if (0 <= luck && luck< 20+(lootPage-1)*2) {
            playerExp = playerExp + Math.random()*(2.8**((b-2)*2))*tokenBuff2N*masteryBuff02*artifactOverBoost[2]*upgradeBuff01R;
          } else if (20+(lootPage-1)*2-luckP <= luck && luck < 85+(lootPage-1)-luckP) {
            gotWeapon[0]++;
          } else if (85+(lootPage-1)-luckP <= luck && luck < 98-luckP) {
            gotWeapon[1]++;
          } else if (98-luckP <= luck && luck <= 100 && a == 3) {
            lootQuantity[1] = lootQuantity[1] + Math.floor(Math.random()*(5+(b-3)));
            gotWeapon[2]++;
          }
        } else {
          if (0 <= luck && luck< 20+(lootPage-1)*2) {
            playerExp = playerExp + Math.random()*(2.8**(b*2))*tokenBuff2N*masteryBuff02*artifactOverBoost[2]*upgradeBuff01R;
          } else if (20+(lootPage-1)*2-luckP <= luck && luck < 85+(lootPage-1)-luckP) {
            gotWeapon[0]++;
          } else if (85+(lootPage-1)-luckP <= luck && luck < 98-luckP) {
            gotWeapon[1]++;
          } else if (98-luckP <= luck && luck <= 100 && a == 3) {
            lootQuantity[1] = lootQuantity[1] + Math.floor(Math.random()*(5+(b-3)));
            gotWeapon[2]++;
          }
        }
        c++;
      }
      if ((b-2)%2 == 1) {
        lootCo = a;
        gotWeaponCalc(((lootPage-1)*5+1+lootCo), gotWeapon[0]);
        gotWeaponCalc(((lootPage-1)*5+2+lootCo), gotWeapon[1]);
        gotWeaponCalc(((lootPage)*5), gotWeapon[2]);
      } else {
        lootCo = a;
        gotWeaponCalc(((lootPage-1)*5+1+lootCo), gotWeapon[0]);
        gotWeaponCalc(((lootPage-1)*5+lootCo), gotWeapon[1]);
        gotWeaponCalc(((lootPage)*5), gotWeapon[2]);
      }
    }
  });
  $("#weaponWarp > .weaponBg").click(function () {
    a = (weaponPage-1)*5 + $("#weaponWarp > .weaponBg").index(this) + 1;
    if (weaponLevel[a] != 999) {
      weaponRank = Math.floor((weaponLevel[a]/100)+1);
    } else {
      weaponRank = 11;
    }
    if (weaponLevel[a] >= 1) {
      $('#weaponName').html(function (index,html) {
        return weaponName[a] + ' +' + weaponLevel[a];
      });
      $("#weaponName").attr({
        'class' : 'rank' + weaponRank
      });
      $('#totalWeaponStatus').html(function (index,html) {
        return 'Dmg: ' + notation(((a*2)**(1+(a*2)/5)*10)/(1+(a*2)**3)*weaponLevel[a]);
      });
    }
  });
  $("#monster").click(function () {
    $('.monsterMove').css("bottom", (Math.random()-0.5)*10 + 'px');
    $('.monsterMove').css("right", (Math.random()-0.5)*10 + 'px');
    setTimeout(function(){
      $('.monsterMove').css("bottom", 0);
      $('.monsterMove').css("right", 0);
    }, 50);
    infDmg = 1;
    if (Math.random() < artifactOverBoost[3]/100) {
      infDmg = infDmg*artifactOverBoost[4];
    }
    infDmg = infDmg*playerDmg*tokenBuff1N*(Math.random()*0.4+0.8);
    hitMonster(infDmg);
    setDmg(infDmg*tokenBuff0N*masteryBuff00R*artifactOverBoost[1]*monsterWeakness*upgradeBuff00R);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < tokenBuff4N) {
      token += 1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8];
      totalToken += 1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8];
      setToken(1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8]);
    }
  });
  $("#popupDmg").click(function () {
    $('.monsterMove').css("bottom", (Math.random()-0.5)*10 + 'px');
    $('.monsterMove').css("right", (Math.random()-0.5)*10 + 'px');
    setTimeout(function(){
      $('.monsterMove').css("bottom", 0);
      $('.monsterMove').css("right", 0);
    }, 50);
    infDmg = 1;
    if (Math.random() < artifactOverBoost[3]/100) {
      infDmg = infDmg*artifactOverBoost[4];
    }
    infDmg = infDmg*playerDmg*tokenBuff1N*(Math.random()*0.4+0.8);
    hitMonster(infDmg);
    setDmg(infDmg*tokenBuff0N*masteryBuff00R*artifactOverBoost[1]*monsterWeakness*upgradeBuff00R);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < tokenBuff4N) {
      token += 1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8];
      totalToken += 1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8];
      setToken(1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8]);
    }
  });
  $("#popupToken").click(function () {
    $('.monsterMove').css("bottom", (Math.random()-0.5)*10 + 'px');
    $('.monsterMove').css("right", (Math.random()-0.5)*10 + 'px');
    setTimeout(function(){
      $('.monsterMove').css("bottom", 0);
      $('.monsterMove').css("right", 0);
    }, 50);
    infDmg = 1;
    if (Math.random() < artifactOverBoost[3]/100) {
      infDmg = infDmg*artifactOverBoost[4];
    }
    infDmg = infDmg*playerDmg*tokenBuff1N*(Math.random()*0.4+0.8);
    hitMonster(infDmg);
    setDmg(infDmg*tokenBuff0N*masteryBuff00R*artifactOverBoost[1]*monsterWeakness*upgradeBuff00R);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < tokenBuff4N) {
      token += 1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8];
      totalToken += 1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8];
      setToken(1*masteryBuff03R*artifactOverBoost[6]*artifactOverBoost[8]);
    }
  });
  $("#stageL").click(function () {
    if (stagePage > 1) {
      stagePage = stagePage - 1;
      stageChange();
      masteryQuest();
    }
  });
  $("#stageR").click(function () {
    if (stagePage < stageUnlocked && stagePage < 11) {
      stagePage = stagePage + 1;
      stageChange();
      masteryQuest();
    } else if (stagePage >= 11) {
      setPopup(popupMsg[0]);
    } else {
      setPopup(popupMsg[1] + ' ' + ((stagePage*10)+1) + ' ' + popupMsg[2]);
    }
  });
  $("#masteryQuest > span").click(function () {
    a = $("#masteryQuest > span").index(this);
    strA = 0;
    if (a == 0) {
      if (playerLevel >= (masteryCompeleted[0]*5+35)) {
        masteryCompeleted[0]++;
        playerSP += 3;
        strA = 3;
      }
    } else if (a == 1) {
      if (totalToken >= (1000*2**masteryCompeleted[1])) {
        masteryCompeleted[1]++;
        playerSP += 2;
        strA = 2;
      }
    } else if (a == 2) {
      if (totTokenUpgrede >= (100*(masteryCompeleted[2]+1))) {
        masteryCompeleted[2]++;
        playerSP += 2;
        strA = 2;
      }
    } else if (3 <= a && a <= 12) {
      if (mobKilled[((stagePage-1)*10+a-2)] >= ((1000+500*(stagePage-1))*1.3**(masteryCompeleted[((stagePage-1)*10+a)])).toFixed(0) && (masteryCompeleted[((stagePage-1)*10+a)] < 1 || upgradeBuff12R == -1)) {
        masteryCompeleted[(stagePage-1)*10+a]++;
        playerSP += 1;
        strA = 1;
      }
    } else if (13 <= a && a <= 16) {
      if (weaponLevel[((stagePage-1)*5+a-12)] >= 999*(masteryCompeleted[((stagePage-1)*5+a)+90]+1)**2 && (masteryCompeleted[((stagePage-1)*5+a)+90] < 1 || upgradeBuff12R == -1)) {
        masteryCompeleted[((stagePage-1)*5+a)+90]++;
        playerSP += 1;
        strA = 1;
      }
    } else if (a == 17) {
      if (weaponLevel[((stagePage-1)*5+a-12)] >= 999*(masteryCompeleted[((stagePage-1)*5+a)+90]+1)**2 && (masteryCompeleted[((stagePage-1)*5+a)+90] < 1 || upgradeBuff12R == -1)) {
        masteryCompeleted[((stagePage-1)*5+a)+90]++;
        playerSP += 3;
        strA = 3;
      }
    }
    if (strA > 0) {
      extraStstusSet('<span class="sp">You Got ' + strA + ' SP (Have ' + playerSP + ')</span>');
    }
    masteryQuest();
  });
  $("#lootL").click(function () {
    if (lootPage > 1) {
      lootPage = lootPage - 1;
      lootChange();
    }
  });
  $("#lootR").click(function () {
    if (lootPage < stageUnlocked && lootPage < 10) {
      lootPage = lootPage + 1;
      lootChange();
    }
  });
  $("#weaponL").click(function () {
    if (weaponPage > 1) {
      weaponPage = weaponPage - 1;
      weaponChange();
    }
  });
  $("#weaponR").click(function () {
    if (weaponPage < stageUnlocked && weaponPage < 10) {
      weaponPage = weaponPage + 1;
      weaponChange();
    }
  });
  $("#bulk1").click(function () {
    bulkOpen = 1;
  });
  $("#bulk2").click(function () {
    bulkOpen = 10;
  });
  $("#bulk3").click(function () {
    bulkOpen = 100;
  });
  $("#bulk4").click(function () {
    bulkOpen = 1000;
  });
  $("#bulk5").click(function () {
    bulkOpen = 10000000;
  });
  $("#resetButton").click(function () {
    if(confirm("Reset game?") == true){
      gameReset();
    }
    else{
      return ;
    }
  });
  $("#exportButton").click(function () {
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    copyToClipboard(btoa(JSON.stringify(saveFile)));
    alert('exported!');
  });
  $("#importButton").click(function () {
    var inputedSaveN = prompt('Import Save', '');
    var inputedSave = atob(inputedSaveN);
    if (inputedSave != null && inputedSave != '') {
      var cookies = document.cookie.split(";");
      const savedFile = JSON.parse(inputedSave);
      dataCopy = JSON.parse(JSON.stringify(resetData));
      Object.assign(dataCopy, savedFile);
      setTimeout(function(){
        for (var i = 0; i < varData.length; i++) {
          this[varData[i]] = dataCopy[i];
        }
      }, 0);
    }
  });
  $("#translate").click(function () {
    translateNum++;
    if (translateNum > translate.length-1) {
      translateNum = 0;
    }
    translateFun();
  });
  $("#codeButton").click(function () {
    inputedCode = prompt('Enter Code', '');
    if (inputedCode == 'DEVskip121') {
      lv0Skip();
      lv11Skip();
      extraStstusSet('<span class="devCode">You used DEV code. (Level 11)</span>');
    } else if (inputedCode == 'DEVskip961') {
      lv0Skip();
      lv31Skip();
      extraStstusSet('<span class="devCode">You used DEV code. (Level 31)</span>');
    } else if (inputedCode == 'DEVskip5041') {
      lv0Skip();
      lv71Skip();
      extraStstusSet('<span class="devCode">You used DEV code. (Level 71)</span>');
    } else if (inputedCode == 'DEVskip10201') {
      lv0Skip();
      lv101Skip();
      extraStstusSet('<span class="devCode">You used DEV code. (Level 101)</span>');
    } else if (inputedCode == 'DEVsp') {
      playerSP = 9999;
      extraStstusSet('<span class="devCode">You used DEV code. (9999 SP)</span>');
    } else if (inputedCode == 'DEVtoken') {
      token = 1e25;
      extraStstusSet('<span class="devCode">You used DEV code. (1e25 token)</span>');
    } else if (inputedCode == 'DEVnull') {
      setInterval( function (){
        $('*').css("color", 'red');
      }, 10);
      setInterval( function (){
        $('*').css("color", 'blue');
      }, 15);
      extraStstusSet('<span class="devCode">You used DEV code. (lol)</span>');
    } else if (inputedCode == 'DEVchest') {
      lootQuantity[2] = 9999;
      extraStstusSet('<span class="devCode">You used DEV code. (999 chest)</span>');
    }
    switch (inputedCode) {
      case 'secret':
        if (codeEnterd[0] == 0) {
          codeEnterd[0]++;
          totalCode++;
          playerLevel++;
          token += 10000;
          extraStstusSet('<span class="code">Code:secret, You got a Level and 10k tokens (' + totalCode + ')</span>');
        }
        break;
      case 'first code':
        if (codeEnterd[1] == 0) {
          codeEnterd[1]++;
          totalCode++;
          playerLevel++;
          token += 10000;
          extraStstusSet('<span class="code">Code:first code, You got a Level and 10k tokens (' + totalCode + ')</span>');
        }
        break;
      case 'Code':
        if (codeEnterd[2] == 0) {
          codeEnterd[2]++;
          totalCode++;
          playerLevel++;
          token += 10000;
          extraStstusSet('<span class="code">Code:code, You got a Level and 10k tokens (' + totalCode + ')</span>');
        }
        break;
      case 'some chest':
        if (codeEnterd[3] == 0) {
          codeEnterd[3]++;
          totalCode++;
          lootQuantity[2] += 2;
          extraStstusSet('<span class="code">Code:some chest, You got 2 chests (' + totalCode + ')</span>');
        }
        break;
      case 'opps!':
        if (codeEnterd[4] == 0) {
          codeEnterd[4]++;
          totalCode++;
          lootQuantity[2] += 700;
          extraStstusSet('<span class="code">Code:opps!, You got 700 chests (' + totalCode + ')</span>');
        }
        break;
      case 'another chest':
        if (codeEnterd[5] == 0) {
          codeEnterd[5]++;
          totalCode++;
          lootQuantity[2] += 5;
          extraStstusSet('<span class="code">Code:another chest, You got 5 chests (' + totalCode + ')</span>');
        }
        break;
      case 'bonus':
        if (codeEnterd[6] == 0) {
          codeEnterd[6]++;
          totalCode++;
          lootQuantity[2] += 10;
          extraStstusSet('<span class="code">Code:bonus, You got 10 chests (' + totalCode + ')</span>');
        }
        break;
    }
  });
  $("#changeNotation").click(function () {
    notationForm++;
    if (notationForm > 1) {
      notationForm = 0;
    }
  });
  $("#LDM").click(function () {
    if (ldm == 0) {
      ldm++;
    } else {
      ldm--;
    }
    ldmD();
  });
  $("#tokenBulkOpen > div").click(function () {
    a = $("#tokenBulkOpen > div").index(this);
    switch (a) {
      case 0:
        tokenBulk = 1;
        break;
      case 1:
        tokenBulk = 10;
        break;
      case 2:
        tokenBulk = 100;
        break;
      case 3:
        tokenBulk = 1000;
        break;
    }
  });
  $(".tokenList").click(function () {
    clickedA = $("#tokenShopList > .tokenList").index(this);
  });
  $(".tokenBuy").click(function () {
    setTimeout(function() {
      for (var i = 0; i < tokenBulk; i++) {
        if (tokenUpgradePrice[clickedA] <= token && tokenUpgradeCap[clickedA] > tokenUpgrade[clickedA]) {
          token = token - tokenUpgradePrice[clickedA];
          tokenUpgrade[clickedA]++;
          switch (clickedA) {
            case 0:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+tokenUpgrade[clickedA]+3).toFixed(0));
              break;
            case 1:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+tokenUpgrade[clickedA]*2).toFixed(0));
              break;
            case 2:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+10+tokenUpgrade[clickedA]*4).toFixed(0));
              break;
            case 3:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]*1.7).toFixed(0));
              break;
            case 4:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+(tokenUpgrade[clickedA])**1.5+1).toFixed(0));
              break;
            case 5:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]*1.2).toFixed(0));
              tokenTimer = tokenBuff5N;
              break;
            case 6:
              tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+100).toFixed(0));
              break;
          }
          tokenShop();
          playerStatus();
        }
      }
    }, 0);
  });
  $(".skillSel").click(function () {
    a = $(".skillLine > .skillSel").index(this);
    if (masteryBought[a] != 1) {
      if (playerSP >= masteryPrice[a]) {
        playerSP -= masteryPrice[a];
        masteryBought[a] = 1;
      }
    } else {
      playerSP += masteryPrice[a];
      masteryBought[a] = 0;
    }
    mastery();
  });
  $(".artifactBg").click(function () {
    a = ($(".artifactBg").index(this)+1);
    if (artifactQuantity[a] >= 1) {
      $('#artifactName').html(function (index,html) {
        return artifactName[a] + ' +' + artifactQuantity[a];
      });
      $("#artifactName").attr({
        'class' : 'rank' + artifactQuantity[a]
      });
      $('#aArtifactStatus').html(function (index,html) {
        i = artifactEffect[a];
        if (i == 1 || i == 2 || i == 4 || i == 6 || i == 7 || i == 8 || i == 11 || i == 12) {
          return artiBuffNameStr[i-1] + ': +x' + (artifactQuantity[a]*artifactEffectPow[a]).toFixed(2);
        } else if (i == 3) {
          return artiBuffNameStr[i-1] + ': +' + (artifactQuantity[a]*artifactEffectPow[a]).toFixed(2) + '%';
        } else if (i == 5 || i == 9) {
          return artiBuffNameStr[i-1] + ': +' + (artifactQuantity[a]*artifactEffectPow[a]).toFixed(2);
        } else if (i == 10) {
          return artiBuffNameStr[i-1] + ': +x' + (artifactQuantity[a]*artifactEffectPow[a]).toFixed(2);
        } else {
          return 'Comming Soon...'
        }
      });
    }
  });
  $("#mysteryChestC").click(function () {
    disableMessage = 0;
    if (lootQuantity[2] >= 1 && playerLevel >= 71) {
      if (lootQuantity[2] >= 1) {
        if (lootQuantity[2] < bulkOpen) {
          bulk = lootQuantity[2];
        } else {
          bulk = bulkOpen;
        }
        if (bulk >= 100) {
          disableMessage = 1;
        }
        lootQuantity[2] = lootQuantity[2] - bulk;
        g = 1;
        while (g <= bulk) {
          luck = Math.random();
          if (luck < 0.1) {
            luck2 = Math.floor(Math.random()*3+1);
            luck3 = Math.floor(Math.random()*stageUnlocked+1);
            gotArtifact(10+luck2+(luck3-1)*3);
          } else {
            luck2 = Math.floor(11-Math.pow(Math.random()*100, 1/2));
            gotArtifact(40+luck2);
          }
          luck4 = Math.random();
          token += (luck4*0.4+0.8)*10000000;
          totalToken += (luck4*0.4+0.8)*10000000;
          g++;
        }
        artifact();
        disableMessage = 0;
      }
    } else if (lootQuantity[2] >= 1 && playerLevel < 71) {
      setPopup('Need at least 71 lever to open Chest');
    }
  });
  $("#transcensionButton").click(function () {
    if (brokeUniverse >= 1 && playerLevel >= 101) {
      tp += 2+(playerLevel-100)**2*upgradeBuff23R;
      playerLevel = 1;
      playerExp = 0;
      playerExpNeed = 10;
      token = 0;
      playerHitPS = 0;
      collectedWeapon = 0;
      weaponMastery = 0;
      playerDmg = 1;
      weaponLevel = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      lootQuantity = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      tokenUpgrade = [0, 0, 0, 0, 0, 0, 0];
      tokenUpgradePrice = [3, 5, 10, 50, 5, 10, 100];
      mobKilled = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      brokeUniverse = 0;
      masteryCompeleted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      playerSP = 0;
      masteryBought = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      totalToken = 0;
      artifactQuantity = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      meta = 0;
      monsterNow = 1;
      monsterHpCalc();
      otherworldyCount++;
      artifact();
      gameDisplay();
      otherworldy();
    }
  });
  $("#metaButton").click(function () {
    if (1 == 2) {
      if (brokeUniverse >= 1 && playerLevel >= 101 && meta == 0) {
        weaponLevel = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        lootQuantity = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        masteryCompeleted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        artifactQuantity = ['0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        meta = 1;
        otherworldy();
      }
    } else {
      setPopup('Comming Soon!')
    }
  });
  $(".upgradeSel").click(function () {
    a = $(".upgradeLine > .upgradeSel").index(this);
    if (a == 0 || a == 1 || a == 2 || a == 4 || a == 6 || a == 7 || a == 8 || a == 9 || a == 10) {
      if (tp >= upgradeCost[a] && upgradeBought[a] == 0) {
        tp -= upgradeCost[a];
        upgradeBought[a] = 1;
      }
    } else {
      if (tp >= upgradeCost[a]) {
        tp -= upgradeCost[a];
        upgradeBought[a]++;
        switch (a) {
          case 3:
            upgradeCost[a] = upgradeCost[a]*4;
            break;
          case 5:
            upgradeCost[a] = upgradeCost[a]*2;
            break;
          case 11:
            upgradeCost[a] = upgradeCost[a]*5;
            break;
        }
      }
    }
    otherworldy();
  });
  $('*').click(function(e){
    if (ldm == 0) {
      var sWidth = window.innerWidth;
  		var sHeight = window.innerHeight;
  		var oWidth = $('.popupLayer').width();
  		var oHeight = $('.popupLayer').height();
  		divLeft = e.clientX + 10;
  		divTop = e.clientY - 50;
  		if( divLeft + oWidth > sWidth ) divLeft -= oWidth;
  		if( divTop + oHeight > sHeight ) divTop -= oHeight;
  		if( divLeft < 0 ) divLeft = 0;
  		if( divTop < 0 ) divTop = 0;
    }
	});

  playerLevel = 1;
  stageUnlocked = 1;
  monsterWeakness = 1;
  monsterDefeated = 0;
  playerExp = 0;
  playerExpNeed = 10;
  playerSP = 0;
  token = 0;
  ldm = 0;
  ldmCount = 5;
  meta = 0;
  totalToken = 0;
  artiCh = 1;
  coin = 0;
  cps = 0;
  monsterNow = 1
  collectedWeapon = 0;
  weaponMastery = 0;
  stagePage = 1;
  lootPage = 1;
  weaponPage = 1;
  menuPage = 0;
  weaponSelect = 0;
  playerDmg = 1;
  playerHitPS = 1;
  bulkOpen = 1;
  tokenBulk = 1;
  translateNum = 0;
  ehhhhhhhhhhh = '이예ㅔㅔㅔㅔㅔ';
  debugStr = 0;
  brokeUniverse = 0;
  otherworldyCount = 0;
  tp = 0;
  rareMob = 0;
  extraStatus = ['', '', '', '', '', '', '', '', '', ''];
  tokenTimer = 600;
  playtime = 0;
  totalCode = 0;
  notationForm = 0;
  tokenBuff1N = 1;
  mastery();
  artifact();
  otherworldy();
  monsterHpCalc();

  $("#menusWarp > div").hide();
  $("#menusWarp > div:eq(0)").show();
  gameLoad();
  ldmD();
  setTimeout(function(){
    gameDisplay();
  }, 0);

  extraStstusSet('<span class="discord"><a href="https://discord.gg/wkdVQxT" target="_blank">Join My Discord Server!</a></span>');
  rand = Math.floor(Math.random()*4);
  extraStstusSet(extraStatusTips[rand]);
  setTimeout(function(){
    $('#warpAll2').show();
    $("#warpAll").attr({
      'style' : 'background-image: url(bg/white.png);'
    });
    artifact();
  }, 3000);
  setInterval( function (){
    playtime += 2.7777777777e-6;
    hitMonster(playerDmg/100*(playerHitPS+1)*masteryBuff21R*((artifactOverBoost[3]*artifactOverBoost[4]/100)+1));
    if (masteryBuff13R != 1 && Math.random() < (1 + tokenUpgrade[4])/10000) {
      token += 1*masteryBuff03R*(1 + tokenUpgrade[6])*artifactOverBoost[6]*artifactOverBoost[8];
      totalToken += 1*masteryBuff03R*(1 + tokenUpgrade[6])*artifactOverBoost[6]*artifactOverBoost[8];
    }
    tokenTimer = tokenTimer - 0.01;
    if (tokenTimer > 600*0.9**tokenUpgrade[5]) {
      tokenTimer = 600*0.9**tokenUpgrade[5];
    }
    if (tokenTimer <= 0) {
      token += 1*masteryBuff03R*masteryBuff12R*artifactOverBoost[6]*artifactOverBoost[7];
      totalToken += 1*masteryBuff03R*masteryBuff12R*artifactOverBoost[6]*artifactOverBoost[7];
      tokenTimer = tokenBuff5N;
      tokenShop();
    }
    if (monsterWeakness < artifactOverBoost[11]) {
      monsterWeakness += artifactOverBoost[10]/100;
    } else {
      monsterWeakness = artifactOverBoost[11];
    }
    playerStatus();
  }, 10);
  setInterval( function () {
    artifact();
  }, 10000);
  setInterval( function (){
    if (ldm == 0 || ldmCount == 0) {
      ldmCount = 5;
      gameSave();
      gameDisplay();
    } else {
      ldmCount--;
    }
  }, 1000);
});
