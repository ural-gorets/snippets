<template>
  <div class="about">
    <h2>Список сниппетов</h2>
    <p>Поддерживаются следующие языки программирования:</p>
    <div class="lang_list"></div>
  </div>
</template>

<script type="text/javascript">
export default {
name: 'snippets_list',
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    get_data(page) {
      // create request config.
      const get_list_conf = {
          method: 'get',
          url: `/?page=${page}`,
        };
      // send request and handle answer.
      this.axios(get_list_conf)
          .then((response) => {
            console.log('Response from the API received.');
            // Handle answer from server.
            // answer is JSON object: 
            // {
            // "pages": "number of pages",
            // "allowed_languages": "[languages_list]",
            // "languages": {"lang_name1": 
            //                 {"amount": "N", "percent": "M", },
            //               "lang_nameN":
            //                 {"amount": "N", "percent": "M", }, },
            // "snippet_nameN": {"id': N,
            //                   "description": "string",
            //                   "reference": "string",
            //                   "preview": "string",
            //                   "date": "date", },
            // }
            if (response.status == 200) {
              // создать в HTML секции динамические объекты на основе созданных переменных.

              // Convert object from JSON
              let data_object = JSON.parse(response.data);
              // allowed languages list extraction
              this.$store.commit('SetAllowedLanguages', data_object.allowed_languages);
              // languajes statistics extraction
              this.$store.commit('SetLangsStats', data_object.languages);
              // pages amount extraction
              this.$store.commit('SetPages', data_object.pages);
              // snippets list extraction
              this.$store.commit('SetSnippetsObj', data_object.snippets);
              
            }
          })
          .catch((error) => {
            console.log(error);
            let from = error.response.data.message.indexOf("DETAIL:");
            let by = error.response.data.message.indexOf("\n", from);
            let message_object = {
              'text': error.response.data.message.substring(from+8, by),
              'type': 'error',
            }
            this.$store.commit('AddNote', message_object);
            //console.log('Something goes wrong:', error.response.data.message); 
          });
          console.log('Request to the API sent.');

    },
  },
  beforeMount: function() {
    this.get_data(this.$store.state.actual_page);
  },

};
</script>

<style lang='less'>
// Declaring variables
@light-gray: #D6D6d6;      // for borders
@main-color: #3581de;

// Declaring mixins.
.border-style(@radius, @col) {
  border: 1px solid @col;
  border-radius: @radius;
}


</style>
