<template>
  <v-container>
    <h2>Список сниппетов</h2>
    <h3>Поддерживается распознавание следующих языков программирования:</h3>
    
    <!-- Languages block -->
    <v-card id="lang_list">
      <code class='lang_tile' v-for='(lang, index) in allowed_languages' v-bind:key='index'
            @mouseenter='tooltip_show_func' @mouseleave='tooltip_show_func'>
        <div>{{ index+1}}. {{ lang }}</div>
        <!--v-tooltip bottom attach='.lang_tile' v-model='actual_page'>
          <span>This is tooltip</span>
        </v-tooltip-->
      </code>
    </v-card>
    
    <!-- Snippets list block -->
    <div id='snippets_list'>
      
      <v-pagination v-model='actual_page'
                    :length='pages'
                    v-on:input='get_data(actual_page)'
                    color='blue darken-2'></v-pagination>

      <v-layout d-block>
        <!-- Snippet's block, multiplied by v-for -->
        <v-flex v-for='(snippet, name, index) in snippets_obj' v-bind:key='snippet.id'>  
              
          <div class='card'>
            <v-card>
              <a class='snippet_ref' v-bind:href='snippet.reference'>
              
                <v-card-title><h3>{{ index+1 }}. {{ name }}</h3></v-card-title>

                <v-divider></v-divider>

                <v-flex dense>

                  <div class='card_description'>
                    <h4>Описание:</h4>
                    <span>{{ snippet.description }}</span>
                  </div>

                  <v-divider></v-divider>

                  <div class='card_preview'>
                    <h4>Превью:</h4>
                    <code>{{ snippet.preview }}</code>
                  </div>

                </v-flex>
              </a>
            </v-card>
          </div>

        </v-flex>
      </v-layout>

      <v-pagination v-model='actual_page'
                    :length='pages'
                    v-on:input='get_data(actual_page)'
                    color='blue darken-2'></v-pagination>
    </div> 

  </v-container>
</template>

<script type="text/javascript">
export default {
name: 'snippets_list',
  data() {
    return {
      // All data in the store
    }
  },
  computed: {
    // For pagination
    actual_page: {
      get() {return this.$store.state.actual_page},
      set(value) {this.$store.commit('SetActualPage', value)},
    },
    pages: {
      get() {return this.$store.state.pages},
    },
    // For snippets list
    snippets_obj: {
      get() {return this.$store.state.snippets_obj; },
    },
    // For languages statistics
    allowed_languages : {
      get() {return this.$store.state.allowed_languages},
    },
    langs_stats: {
      get() {return this.$store.state.langs_stats},
    },
    tooltip_show: {  // For showing statictics in tooltips. Project.
      get() {return this.$state.state.tooltip_show},
    },
  },
  methods: {
    // Languages statistics.
    tooltip_show_func() {
      this.$store.commit('TooltipInvert');
    },
    // Main method, getting all data from back.
    get_data(page) {
      // create request config.
      const get_list_conf = {
          method: 'get',
          url: `/?page=${page}`,
        };
      // send request and handle answer.
      this.axios(get_list_conf)
          .then((response) => {
            // answer is JSON object: 
            // {
            // "pages": "number of pages",
            // "allowed_languages": "[languages_list]",
            // "languages": {
            //        "lang_name1": {"amount": "N", "percent": "M", },
            //        "lang_nameN": {"amount": "N", "percent": "M", }, 
            //              },
            // "snippets": {
            //        "snippet_nameN": {"id': N,
            //                          # "name": "string",  - this field is commented for a while
            //                          "description": "string",
            //                          "reference": "string",
            //                          "preview": "string",
            //                          "date": "date", },
            //              }
            // }
            if (response.status == 200) {
              // Converting object from JSON
              let data_object = JSON.parse(response.data);
              console.log('data_object: ', data_object);
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
  // Whel page loads, call for data.
  beforeMount: function() {
    this.get_data(this.$store.state.actual_page);
  },
};
</script>

<style lang='less'>
// Declaring variables
@light-gray: #D6D6d6;      // for borders
@main-color: #3581de;
@gray-text: #616161;
@blue-background: #e3f2fd;

// Declaring mixins.
.border-style(@radius, @col) {
  border: 1px solid @col;
  border-radius: @radius;
}
// Languages list
#lang_list{
  max-width: 700px;
  margin: 0 auto 20px;
  padding: 5px;
}
.lang_tile {
  display: inline-block;
  width: 120px;
  height: 30px;
  margin: 5px;
  vertical-align: middle;
  text-align: center;

  background: @blue-background;
  color: @gray-text;
  div {
    display: inline-block;
    margin-top: 5px;
  }
}

// snippets list.
#snippets_list {
  margin: 0 auto;
  max-width: 700px;

  .card {
    margin: 20px 0;
    code {
      color: @gray-text;
      background: @blue-background;
      width: 100%;
    }
  }
  .card_description{
    text-align: left;
    padding: 10px;
  }
  .card_preview {
    text-align: left;
    padding: 10px;
  }
  .snippet_ref {
    text-decoration: none;
    color: black;
  }
}
</style>
