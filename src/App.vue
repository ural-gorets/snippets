<template>
  <div id="app">
    <h1 id="title">Snippets Collection</h1>
    <div id="nav">
      <router-link to="/"><span>Home</span></router-link>
      <router-link to="/list"><span>Snippets list</span></router-link>
      <router-link to="/upload"><span>Upload snippet</span></router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
//Variables declaration
@main-color: #3581de;
@default-color: #2c3e50;

#title {
  font: 45px  Arial, Verdana, 'times new roman';
  font-weight: 800;
  text-align: right;
  line-height: 0;
  color: @main-color;
  padding: 10px 30px 10px 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @default-color;

}
#nav {
  padding: 15px;
  background: @main-color;

  span {
    padding: 15px 10px;
    color: white;
    &:hover {
      background: white;
      color: @main-color;
    }
  }

  a {
    font-weight: bold;
    color: @default-color;
    text-decoration: none;
    &.router-link-exact-active {
      span {
        background: white;
        color: @main-color;
      }
    }
  }
}
</style>
