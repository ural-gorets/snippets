<template>
  <div class="about">
    <!-- Container of whole snippet. -->
    <div id='show_container'>
      <!-- Snippet's info -->
      <v-card>
        <!-- title and languages-->
        <v-card-title class='pt-2 pl-4 pr-4 pb-0'>
          <h1>{{ snippet.name }}</h1>
          <div id='lang_tile_container'>
            <code class='code' id='lang_tile'
            v-for='(lang, index) in snippet_languages' v-bind:key='index'>{{ lang }}</code>
          </div>
        </v-card-title>
        <!-- Reference-->
        <v-card-text class='pb-3 pt-2'>
          <div v-if='snippet.public_flag'>Сниппет доступен по ссылке:</div>
          <div v-else-if='!snippet.public_flag'>Это скрытый сниппет. Он доступен ТОЛЬКО по данной ссылке.<br> Сохраните её любым удобным способом.</div>
          <code class='code' id='reference'>{{ app_url }}/show/{{ this.$route.params.snip }}</code> 
        </v-card-text>

        <v-divider></v-divider>
        <!-- Description-->
        <v-card-text class='pt-2 pl-4 pr-4 pb-0'>
          <div id='desk_header'><b>Описание:</b></div>
          <div id='date'>Сниппет добавлен {{ creation_date }}</div>
        </v-card-text>
        <v-card-text class='pt-0 pl-4 pr-4 pb-2'>
          <div id='desk_text'>{{ snippet.description }}</div>
        </v-card-text>
      </v-card>
      
      <!-- fragments -->
      <v-card class='mt-3' v-for='(file, name, index) in files' v-bind:key='index'>
        <v-card-title>
          <h2 class='fragment_header'>{{ index+1 }}. {{ name }}</h2>
          <div id='lang_tile_container'>
            <code class='code' id='fragment_lang_tile'>{{ file.lang }}</code>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <highlight-code class='fragment_code' v-bind:lang='file.lang.toLowerCase()'>
            {{ file.data }}
          </highlight-code>
        </v-card-text>
      </v-card>

    </div>

  </div>
</template>

/******************************************************************************************/

<script type="text/javascript">
export default {
name: 'snippet',
  data() {
    return {
      // All data in the store
    }
  },
  computed: {
    snippet: {
      get() {return this.$store.state.snippet},
    },
    files: {
      get() {return this.$store.state.files},
    },
    creation_date() {
      if (this.$store.state.snippet.born_date) {
        return this.$store.state.snippet.born_date.substring(0, 19);
      }
      else {
        return '';
      }
    },
    snippet_languages() {
      let languages = new Set();
      for (let file in this.$store.state.files) {
        languages.add(this.$store.state.files[file].lang);
      }
      return languages;
    },
    app_url() {
      console.log('location.origin: ', location.origin);
      return location.origin;
    },
  },

/******************************************************************************************/

  methods: {
    // Main method, downloads all data from back.
    get_snippet_data() {
      // create request config.
      const get_snippet_conf = {
          method: 'get',
          url: `/snippet/${this.$route.params.snip}`,
        };
      // send request and handle answer.
      this.axios(get_snippet_conf)
          .then((response) => {
            // answer is JSON object: 
            // {
            // "snippet": {
            //               "name": string,
            //        "description": string,
            //          "born_date": date and time as string,
            //        "public_flag": boolean,
            //            },
            //  "files" {
            //         "fragment_name N": {            // "No files" if there no any one fragment.
            //                       "name": string,
            //                       "type": string,   // types: file, reference, text_form
            //                       "lang": string,
            //                       "data": string,
            //                      },
            //          },        
            // }
            if (response.status == 200) {
              // Converting object from JSON
              let data_object = JSON.parse(response.data);
              // snippet info extraction
              this.$store.commit('SetSnippet', data_object.snippet);
              // Snippet's files extraction
              this.$store.commit('SetFiles', data_object.files);
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
    },
  },
  // When page loads, call for data.
  beforeMount: function() {
    this.get_snippet_data();
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

#show_container {
  max-width: 700px;
  margin: 20px auto;
  // title and languages
  #lang_tile_container {
    position: absolute;
    width: 95%;
    text-align: right;
  }
  #lang_tile {
    margin: 0 3px;
    display: inline-block;

  }
  .code {
      color: @gray-text;
      background: @blue-background;
  }
  // snippet description
  #desk_text {
    text-align: left;
  }
  #desk_header {
    display: inline-block;
    width: 50%;
    text-align: left;
  }
  #date {
    display: inline-block;
    width: 50%;
    text-align: right;
  }
  // fragments
  .hljs {
    width: 100%;
    text-align: left;
    background: @blue-background;
  }

  .fragment_header {
    text-align: left;
    padding-left: 20px
  }
  #fragment_lang_tile {
    line-height: 30px;
    height: 30px;
    vertical-align: middle;
  }
}

</style>
