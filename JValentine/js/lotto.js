"use strict"
let WeirdMeetup = {
  tmpmembers: [],
  members: [],
  gift: [],
  doMemberInsert: () => {
    const memberListArr = WeirdMeetup.tmpmembers;
    openDB.transaction(function (tx) {
      tx.executeSql('SELECT COUNT(rowid) FROM weirdMeetup_MemberList', [], (tx, results) => {
        if (results.rows[0]['COUNT(rowid)'] > 0) {
          if (window.confirm('과거 회원 데이터가 데이터베이스에 입력되어 있습니다. 과거 데이터를 삭제하시겠습니까??')) {
            alert('과거 회원 데이터가 삭제 되고 새로운 데이터가 입력이 됩니다.');
            tx.executeSql('DELETE FROM weirdMeetup_MemberList');
            return;
          } else {
            alert('입력 취소');
            return;
          }
        }
      }, (tx) => {
        tx.executeSql('CREATE TABLE weirdMeetup_MemberList (email, slackid, giftflag, giftdesc)');
      });
    });
    for (var i = 0; i < memberListArr.length; i++) {
      let tmpEmail = memberListArr[i],
        slackID = '',
        giftFlag = 0,
        giftCode = null;
      if (tmpEmail === 'email') {
        continue;
      }
      openDB.transaction((tx) => {
        tx.executeSql('INSERT INTO weirdMeetup_MemberList (email, slackid, giftflag, giftdesc) VALUES ("' + tmpEmail + '", "' + slackID + '", '+ giftFlag +' ,'+ giftCode+ ')');
      });
    }
    WeirdMeetup.doMemberSelect();
  },
  doCVSFileRead: () => {
    const files = document.getElementById('csvfile').files,
      file = files[0],
      reader = new FileReader();
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    reader.onload = function(event) {
      WeirdMeetup.tmpmembers = event.target.result.split('\r\n');
      WeirdMeetup.doMemberInsert();
    };
    reader.readAsText(file);
  },
  doMemberSelect:() => {
    const memberTable = document.getElementById('member_list');
    memberTable.getElementsByTagName('tbody')[0].innerHTML = '';
    openDB.transaction((tx) => {
      tx.executeSql('SELECT rowid, email FROM weirdMeetup_MemberList', [], (tx, results) => {
        var tmplistData = results.rows;
        for (let i = 0; i < tmplistData.length; i++) {
          WeirdMeetup.members.push({idx: tmplistData[i].rowid, email: tmplistData[i].email, giftflag: false});
          let newRow = memberTable.children[1].insertRow(-1);
          let idxCell = newRow.insertCell(0);
          let emailCell = newRow.insertCell(1);
          let idxText  = document.createTextNode(tmplistData[i].rowid);
          let emailText  = document.createTextNode(tmplistData[i].email);
          idxCell.appendChild(idxText);
          emailCell.appendChild(emailText);
        }
      }, (tx) => {
        alert('멤버 디비 데이터를 입력 하여 주십시오.');
      });
    });
  },
  hideUserListHideShow: (el) => {
    if ($('#member_list').is(":visible") === true) {
      $('#member_list').hide();
      el.innerText = '유저 목록 보기';
    } else if ($('#member_list').is(":visible") === false) {
      $('#member_list').show();
      el.innerText = '유저 목록 감추기';
    }
  },
  doGiftListInsert: () => {
    const giftlist = $('#giftinsert').val().split('\n');
    let countError = false;

    for (let i = 0; i < giftlist.length; i++) {
      let count = giftlist[i].split(',')[1].trim();
      const num_check=/^[0-9]*$/;
      if (!num_check.test(count)) {
        alert('수량은 숫자만 입력 가능 합니다.');
        countError = true;
        return;
      }
    }

    const insertRun = () => {
      if (countError === false) {
        for (let i = 0; i < giftlist.length; i++) {
          let product = giftlist[i].split(',')[0].trim(),
            count = giftlist[i].split(',')[1].trim(),
            winner = '';
          openDB.transaction((tx) => {
            tx.executeSql('INSERT INTO weirdMeetup_GiftList (product, count, remain_count, winner) VALUES ("' + product + '", "' + count + '", "' + count + '", "")', [], (tx, results) => {
            });
          });
        }
        WeirdMeetup.giftModeChange('lotto');
      }
    };

    openDB.transaction(function (tx) {
      tx.executeSql('SELECT COUNT(rowid) FROM weirdMeetup_GiftList', [], (tx, results) => {
        var test = results.rows;
        if (results.rows[0]['COUNT(rowid)'] > 0) {
          if (window.confirm('과거 선물 데이터가 데이터베이스에 들어있습니다. 과거 데이터를 삭제하시겠습니까?')) {
            alert('과거 선물 데이터가 삭제 되고 새로운 데이터가 입력이 됩니다.');
            tx.executeSql('DELETE FROM weirdMeetup_GiftList');
            insertRun();
            return;
          } else {
            alert('입력 취소');
            return;
          }
        }
      }, (tx) => {
        tx.executeSql('CREATE TABLE weirdMeetup_GiftList (product, count, remain_count, winner)');
        insertRun();
      });
    });
  },
  giftModeChange: (mode) => {
    if (mode === 'insert') {
      $('#insertMode').show();
      $('#lottoMode').hide();
    } else if (mode === 'lotto') {
      $('#insertMode').hide();
      $('#lottoMode').show();
      WeirdMeetup.getGiftList();
    }
  },
  getGiftList: () => {
    openDB.transaction((tx) => {
      tx.executeSql('SELECT rowid, product, count, remain_count, winner FROM weirdMeetup_GiftList', [], (tx, results) => {
        var tmplistData = results.rows;
        if (tmplistData.length === 1) {
          alert('입력된 선물 데이터가 존재하지 않습니다.');
          return;
        } else {
          WeirdMeetup.gift = [];
          for (let i = 0; i < tmplistData.length; i++) {
            WeirdMeetup.gift.push({idx: tmplistData[i].rowid, gift: tmplistData[i].product, count: tmplistData[i].count, remain_count: tmplistData[i].remain_count, winner: tmplistData[i].winner});
          }
          WeirdMeetup.drawLottoPanel();
        }
      }, (tx) => {
        alert('경품 디비 데이터를 입력 하여주십시오.');
      });
    });
  },
  drawLottoPanel: () => {
    const lottoPanel = $('#lottoMode');
    $('#lottoMode').empty();
    for (let i = 0; i < WeirdMeetup.gift.length; i++) {
      const tmpLine = WeirdMeetup.gift[i],
        giftIdx = tmpLine.idx,
        gift = tmpLine.gift,
        count = tmpLine.count,
        winner = tmpLine.winner,
        winnerlength = winner === '' ? 0 : winner.split(',').length,
        remaincount = count - winnerlength;
      lottoPanel.append(
        $('<div></div>').addClass('panel panel-default')
          .append(
            $('<div></div>')
              .addClass('panel-heading')
              .append(
                $('<span></span>')
                  .addClass('panel-title')
                  .attr('id', 'gift_' + giftIdx + 'title')
                  .text(giftIdx + '. ' + gift + '( 수량: ' + count + ' 개) ' + '( 남은 수량: ' + remaincount + ' 개)')
              )
              .append(
                $('<div></div>')
                  .addClass('btn-group pull-right')
                  .append(
                    $('<a></a>')
                      .addClass('btn btn-default btn-sm')
                      .text('추첨!')
                    .on({
                      click: () => {
                        WeirdMeetup.doLotto(giftIdx, gift);
                      }
                    })
                  )
                  .append(
                    $('<a></a>')
                      .addClass('btn btn-default btn-sm')
                      .text('재추첨!')
                      .on({
                        click: () => {
                          WeirdMeetup.doReLotto(giftIdx, gift);
                        }
                      })
                  )
              )
          )
          .append(
            $('<div></div>')
              .addClass('panel-body')
              .attr('id', 'gift_' + giftIdx + 'winner')
              .text(winner)
          )
      )
    }
    lottoPanel.append(
      $('<button></button>')
        .attr('type', 'type')
        .addClass('btn btn-default')
        .text('추첨 결과 백업하기')
        .on({
          click: () => {
            WeirdMeetup.doLottdExport();
          }
        })
    );
    lottoPanel.append (
        $('<a></a>')
          .css('display', 'none')
          .attr('id', 'exportDataDown')
    )

  },
  doLotto: (giftIdx, gift) => {
    const winner = WeirdMeetup.members[Math.floor(Math.random() * WeirdMeetup.members.length)],
      giftList = WeirdMeetup.gift;
    if (WeirdMeetup.gift[giftIdx - 1].remain_count < 1) {
      alert('남은 경품이 존재하지 않습니다.')
      return;
    }
    if (winner.giftflag === true) {
      WeirdMeetup.doLotto(giftIdx);
    } else if (winner.giftflag === false) {
      WeirdMeetup.members[winner.idx - 1].giftflag = true;
      WeirdMeetup.gift[giftIdx - 1].winner = WeirdMeetup.gift[giftIdx - 1].winner === ''? winner.email:WeirdMeetup.gift[giftIdx - 1].winner + ', ' + winner.email;
      WeirdMeetup.gift[giftIdx - 1].remain_count = parseInt(WeirdMeetup.gift[giftIdx - 1].remain_count) - 1;
      openDB.transaction(function (tx) {
        tx.executeSql('UPDATE weirdMeetup_MemberList SET giftflag = 1 WHERE rowid = ' + winner.idx, [], (tx, results) => {
          var test = results.rows;
        });
        tx.executeSql('UPDATE weirdMeetup_GiftList SET winner = "' + WeirdMeetup.gift[giftIdx - 1].winner + '" WHERE rowid = ' + giftIdx, [], (tx, results) => {
          var test = results.rows;
        });
        tx.executeSql('UPDATE weirdMeetup_GiftList SET remain_count = "' + WeirdMeetup.gift[giftIdx - 1].remain_count + '" WHERE rowid = ' + giftIdx, [], (tx, results) => {
          var test = results.rows;
        });
      });
      $('#gift_' + giftIdx + 'title').text(giftList[giftIdx - 1].idx + '. ' + giftList[giftIdx - 1].gift + '( 수량: ' + giftList[giftIdx - 1].count + ' 개) ' + '( 남은 수량: ' + giftList[giftIdx - 1].remain_count + ' 개)');

      if ($('#gift_' + giftIdx + 'winner').text() !== '') {
        $('#gift_' + giftIdx + 'winner').append(', ' + winner.email);
      } else {
        $('#gift_' + giftIdx + 'winner').append(winner.email);
      }
    }
  },
  doReLotto: (giftIdx, gift) => {
    if (WeirdMeetup.gift[giftIdx - 1].winner === '') {
      alert('아직 추첨된 사람이 존재하지 않습니다.');
      return;
    }
    openDB.transaction((tx) => {
      tx.executeSql('SELECT winner FROM weirdMeetup_GiftList WHERE rowid=' + giftIdx, [], (tx, results) => {
        var tmplistData = results.rows;
        for (let i = 0; i < tmplistData.length; i++) {
          if (tmplistData[i].winner === '') {
            alert('아직 추첨된 사람이 존재하지 않습니다.');
            return;
          } else {
            let winnerList = tmplistData[i].winner.split(', ');
            let deletedMember = winnerList[winnerList.length - 1];
            winnerList.splice(winnerList.length - 1, 1);
            WeirdMeetup.gift[giftIdx - 1].winner = winnerList.join(', ');
            WeirdMeetup.gift[giftIdx - 1].remain_count = parseInt(WeirdMeetup.gift[giftIdx - 1].remain_count) + 1;

            $('#gift_' + giftIdx + 'title').text(WeirdMeetup.gift[giftIdx - 1].idx + '. ' + WeirdMeetup.gift[giftIdx - 1].gift + '( 수량: ' + WeirdMeetup.gift[giftIdx - 1].count + ' 개) ' + '( 남은 수량: ' + WeirdMeetup.gift[giftIdx - 1].remain_count + ' 개)');
            $('#gift_' + giftIdx + 'winner').text(WeirdMeetup.gift[giftIdx - 1].winner);
            WeirdMeetup.doLotto(giftIdx, gift);
          }
        }
      }, (tx) => {
        alert('경품 디비 데이터를 입력 하여주십시오.');
      });
    });
  },
  doLottdExport: () => {
    let exportData = [];
    openDB.transaction((tx) => {
      tx.executeSql('SELECT rowid, product, count, remain_count, winner FROM weirdMeetup_GiftList', [], (tx, results) => {
        var tmplistData = results.rows;
        if (tmplistData.length === 1) {
          alert('입력된 선물 데이터가 존재하지 않습니다.');
          return;
        } else {
          for (let i = 0; i < tmplistData.length; i++) {
            let winnerList = tmplistData[i].winner.split(',');
            for (let j = 0; j < winnerList.length; j++) {
              if (winnerList[j] != '') {
                let tmpPrintText = '상품 ' + tmplistData[i].product + ' - ' + (j + 1) + ' - ' + winnerList[j] + '\r\n';
                exportData.push(tmpPrintText);
              }
            }
            WeirdMeetup.gift.push({idx: tmplistData[i].rowid, gift: tmplistData[i].product, count: tmplistData[i].count, remain_count: tmplistData[i].remain_count, winner: tmplistData[i].winner});
          }
          const blob = new Blob(exportData, {type: "text/plain;charset=utf-8"}),
            url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.style = "display: none";
          a.href = url;
          a.download = 'export_data.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      }, (tx) => {
        alert('경품 디비 데이터를 입력 하여주십시오.');
      });
    });
  }
};
