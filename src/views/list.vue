<template>
  <v-container>
    <h2>Список сниппетов</h2>
    <h3>Поддерживается распознавание следующих языков программирования:</h3>
    
    <!-- Languages block -->
    <v-card id="lang_list">
      
      <code class='lang_tile' v-bind:id='lang'
            v-for='(lang, index) in allowed_languages' v-bind:key='index'>
        <div><h3>{{ index+1}}.{{ lang }}</h3>
             <p>Фрагментов: {{ langs_stats[lang].amount }}</p>
             <p>Доля: {{ langs_stats[lang].percent }}%</p>
        </div>
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
              
                <v-card-title>
                  <h3>{{ index+1 }}. {{ name }}</h3>
                  <span class='born_date'>Создан {{ snippet.date.substring(0, 19) }}</span>
                </v-card-title>

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

/******************************************************************************************/

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
  },

/******************************************************************************************/

  methods: {
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
              // allowed languages list extraction
              this.$store.commit('SetAllowedLanguages', data_object.allowed_languages);

              // languajes statistics extraction
              let langstat = Object.assign({}, data_object.languages);
              for (let lang of data_object.allowed_languages) {
                if (!langstat[lang]) {
                  langstat[lang] = {"amount": 0,
                                   "percent": 0,}
                }
              }
              this.$store.commit('SetLangsStats', langstat);

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
  // When page loads, call for data.
  beforeMount: function() {
    this.get_data(this.$store.state.actual_page);
  },
};
</script>

/******************************************************************************************/

<style scoped lang='less'>
// Declaring variables
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
  width: 125px;
  height: 65px;
  margin: 5px;
  vertical-align: middle;
  text-align: center;
  background: @blue-background;
  color: @gray-text;
  div {
    display: inline-block;
    margin-top: 5px;
  }
  h3 {
    text-align: left;
  }
  p {
    margin: 0;
    text-align: left;
    font-weight: 100;
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
  .born_date {
    //display: inline-block;
    margin-left: auto;
  }
}
</style>
