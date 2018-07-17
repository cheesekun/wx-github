<template>
  <div>
    <button onclick="myFunction()">Show Snackbar</button>
    <div id="snackbar">Some text some message..</div>
  </div>
</template>

<script>
  export default {
    methods: {
      myFunction () {
        var x = document.getElementById("snackbar")
        x.className = "show"
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000)
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './message.scss';
</style>
