"use strict"
let WeirdMeetup = {
  members: [],
  gift: [],
  /*doMemberInsert: () => {
    let me = this;
    const memberListArr = document.getElementById('csvlist').value.split('|');
    openDB.transaction(function (tx) {
      tx.executeSql('SELECT COUNT(rowid) FROM weirdMeetup_MemberList', [], (tx, results) => {
        var test = results.rows;
        if (results.rows[0]['COUNT(rowid)'] > 0) {
          if (window.confirm('Old Data inserted weirdMeetup_MemberList Database. Do you want delete old data?')) {
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
      let tmpIdx = i,
        tmpEmail = memberListArr[i],
        slackID = '',
        giftFlag = 0,
        giftCode = null;
      openDB.transaction((tx) => {
        tx.executeSql('INSERT INTO weirdMeetup_MemberList (email, slackid, giftflag, giftdesc) VALUES ("' + tmpEmail + '", "' + slackID + '", '+ giftFlag +' ,'+ giftCode+ ')');
      });
    }
    WeirdMeetup.doMemberSelect();
  },*/
  doMemberInsert: () => {
    /* Get the reference of the inpout element. */
    var files = document.getElementById('csvfile').files;

    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    /* Reading the first file selected. You can process other files similarly in loop. */
    var file = files[0];

    /* Instantiate the File Reader object. */
    var reader = new FileReader();

    /* onLoad event is fired when the load completes. */
    reader.onload = function(event) {
      console.log(event.target.result);
      // document.getElementById('content').textContent = ;
    };

    /* The readAsText method will read the file's data as a text string. By default the string is decoded as 'UTF-8'. */
    /*reader.readAsText(file);
    console.log(reader.readAsText(file));
    // WeirdMeetup.doMemberSelect();*/
  },
  doMemberSelect:() => {
    const memberTable = document.getElementById('member_list');
    console.log(memberTable.getElementsByTagName('tbody'));
    var test = memberTable.getElementsByTagName('tbody');
    memberTable.getElementsByTagName('tbody')[0].innerHTML = '';
    // memberTable.getElementsByTagName('tbody')[0].innerHTML('');

    openDB.transaction((tx) => {
      tx.executeSql('SELECT rowid, email FROM weirdMeetup_MemberList', [], (tx, results) => {
        var tmplistData = results.rows;
        for (let i = 0; i < tmplistData.length; i++) {
          WeirdMeetup.members.push({idx: tmplistData[i].rowid, email: tmplistData[i].email});
          let newRow = memberTable.children[1].insertRow(-1);
          let idxCell = newRow.insertCell(0);
          let emailCell = newRow.insertCell(1);
          let idxText  = document.createTextNode(tmplistData[i].rowid);
          let emailText  = document.createTextNode(tmplistData[i].email);
          idxCell.appendChild(idxText);
          emailCell.appendChild(emailText);
        }
      }, (tx) => {
        alert('멤버 디비 데이터 로드 실패');
      });
    });
  }
}
