<template>
  <div>  
    <div id="app">
      <h1 id="title">Snippets Collection</h1>
      <div id="nav">
        <router-link to="/"><span>Snippets list</span></router-link>
        <router-link to="/upload"><span>Upload snippet</span></router-link>
      </div>
    </div>

    <v-app>
      <v-content>
        <router-view/>
      </v-content>
    </v-app>
    
    <notifications v-bind:msg_list='message_list' />
  </div>
</template>

/******************************************************************************************/

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      // Here stored messages for Notifications component.
      message_list: this.$store.state.notes_list,   
    }
  }
}
</script>

/******************************************************************************************/

<style lang="less">
//Variables declaration
@main-color: #1e88e5;  //#3581de;
@default-color: #2c3e50;
@back-gray: #fafafa;

#title {
  font: 45px  Arial, Verdana, 'times new roman';
  font-weight: 800;
  text-align: right;
  color: @main-color;
  padding: 10px 30px 10px 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @default-color;
  background: @back-gray;

}
#nav {
  padding: 15px;
  background: @main-color;

  span {
    padding: 15px 10px;
    color: white;
    &:hover {
      background: @back-gray;
      color: @main-color;
    }
  }

  a {
    font-weight: bold;
    color: @default-color;
    text-decoration: none;
    &.router-link-exact-active {
      span {
        background: @back-gray;
        color: @main-color;
      }
    }
  }
}
</style>

