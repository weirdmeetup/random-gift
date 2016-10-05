(function () {
  if(!window.openDatabase) {
    alert("This browser not support WebSQL. Please use another browser");
  }
})();
// ENV
const dbSize = 5 * 1024 * 1024; // 5MB
const openDB = window.openDatabase("weirdMeetup", "1.0", "weirdMeetup", dbSize, () => {
  console.log('db successfully opened or created');
});
$( document ).ready(() => {
  WeirdMeetup.doMemberSelect();
});