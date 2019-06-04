<template>
  <div id='notes-container'>

    <transition-group name='notes-animate' tag='div'>
    <div v-for='message in msg_list' :key='message.id'>
      <!-- This vvvvv creates class name with one of 4 message types at the end -->
      <div v-bind:class='"note-message-" + message.type' @click='closeNotification(message.id)'>
        <h2>{{ message.text }}</h2>
      </div>
    </div>
    </transition-group>

  </div>
</template>


<script>
export default {
  name: 'Notifications',
  props: {
    msg_list: Array     // Array with notification messages.
  },
  methods: {
    closeNotification (message_id) {
    // Removes message from list, and window dissapears.
      this.$store.commit('DeleteNote', message_id);
    }
  }
}
</script>


<style lang='less'>
  // Declaring color variables.
  @red-note: #b3d4fc;       // for error messages   f75454
  @yellow-note: #fb8c00;    // for alert messages   fcf588
  @blue-note: #2196f3;      // for info messages    a0e9f2
  @green-note: #4caf50;     // for ok messages  82ed84
  @ight-gray: #D6D6d6;      // for borders

  // Declaring mixins.
  .button-coloring(@color) {
    color: @color - 80%;
    border: 1px solid @color - 80%;
    background: @color - 20%;
    &:hover {
      background: @color - 35%;
      color: @color - 90%;
    };
  }

  //animation
  .notes-animate-enter-active, {
    transition: opacity 200ms ease;
  }
  .notes-animate-leave-active {
    transition: opacity 1000ms ease;
  }
  .notes-animate-enter, .notes-animate-leave-to {
    opacity: 0;
  }

  #notes-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-end;
    position: fixed;
    right: 0;
    top: 0%;
    width: 350px;
    overflow: hidden;

    h2 {
      cursor: default;
    }
    
    button {
      height: 25px;
      position: absolute;
      border-radius: 15px;
      top: 7px;
      right: 7px;
    }

    // Common styles for all notes
    .note-message-ok,
    .note-message-info,
    .note-message-alert,
    .note-message-error, {
      position: relative;
      border-radius: 15px;
      margin-bottom: 10px;
      margin-right: 10px;
      padding: 15px 10px 10px 10px;
      //transition-property: opacity;
      //transition-duration: 1000ms;
      //transition-timing-function: ease;
    }
    .note-message-ok {
      // This color determines all window colors.
      background: @green-note;     
      button {
        .button-coloring($background);
      }
    }
    .note-message-info {
      background: @blue-note;
      button {
        .button-coloring($background);
      }
    }
    .note-message-alert {
      background: @yellow-note;
      button {
        .button-coloring($background);
      }
    }
    .note-message-error {
      background: @red-note;
      button {
        .button-coloring($background);
      }
    }
  }
</style>
