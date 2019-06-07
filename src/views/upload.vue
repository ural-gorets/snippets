<template>
  <div>
    <!-- Here will be usage instruction for form. -->
    <div id="form_description">
      <v-card>
        <v-card-title centered>
          <h2>Форма создания сниппета.</h2>
        </v-card-title>
        <div id='description_text'>
          <div class='description_paragraph'>
            На соответствующих вкладках вы можете сохранять фрагменты кода в текстовом поле ввода, загружать файлы из вашей системы или ввести ссылки на текстовые файлы на сторонних ресурсах.
          </div>
          <div class='description_paragraph'>
            Пожалуйста, указывайте язык программирования для каждого фрагмента кода. Системой распознается синтаксис следующих языков: PYTHON, PHP, RUBY, PERL, JAVASCRIPT, HTML, CSS, SQL, SHELL.
          </div>
        </div>
      </v-card>
    </div>


    <div id='tabs_container'>
      <v-card height='580px'
              >
        
        <v-tabs v-model='current_tab'
                slider-color='blue darken-2'
                centered
                class='pb-1'>

          <v-card-title>
          <v-tab>
            <span>Описание</span>
          </v-tab>

          <v-tab>
            <span>Ввод текста</span>
          </v-tab>

          <v-tab>
            <span>Файлы</span>
          </v-tab>

          <v-tab>
            <span>Ссылки</span>
          </v-tab>
          </v-card-title>

          <!--v-divider></v-divider-->
          
          <v-tabs-items v-model='current_tab'>
            <!-- ############# Description ################# -->
            <v-tab-item :transition='false' :reverse-transition='false'>
              <form id='description_form'>
                
                <v-flex class='mt-2 mx-3'>
                  <v-text-field label='Название сниппета'
                                placeholder='Введите название'
                                v-model='snippet_name'
                                box>
                  </v-text-field>
                </v-flex>

                <v-flex class='mx-3'>
                  <v-textarea label='Описание сниппета'
                              placeholder='Здесь опишите функционал сниппета и инструкции по использованию.'
                              v-model='snippet_descript'
                              box>
                  </v-textarea>
                </v-flex>

                <v-flex class='mx-3'>
                  <v-radio-group v-model='public_flag'
                                 row>
                    
                    <div class='radio_item'>
                    <v-radio label='Публичный'
                             value='true'>
                    </v-radio>
                    </div>

                    <div>
                    <v-radio label='Скрытый'
                             value=''>
                    </v-radio>
                    </div>

                  </v-radio-group>
                  <div id='public_description'>
                    Публичные сниппеты отображаются в списке и кликабельны,
                    скрытые - не отображаются, и доступны только по ссылке вида: <b>http://{hostname}/show/{secret_snippet_name}</b>.
                  </div>
                </v-flex>

              </form>
            </v-tab-item>
            
            <!-- #########################3 Text ########################## -->
            <v-tab-item :transition='false' :reverse-transition='false'>
              <form id='text_form'>
                
                <v-flex class='mt-2 mx-3'>
                  <v-text-field label='Заголовок фрагмента'
                                placeholder='Введите заголовок'
                                v-model='text_field_header'
                                box>
                  </v-text-field>
                </v-flex>

                <v-flex class='mx-3'>
                  <v-textarea label='Текст фрагмента'
                              placeholder='Введите текст'
                              v-model='text_field_cont'
                              box>
                  </v-textarea>
                </v-flex>

                <!-- Language select field -->
                <v-flex class='mt-2 mx-3'>
                  <v-select v-model='text_lang_field'
                            :items='languages'
                            label='Язык программирования'
                            solo>
                  </v-select>
                </v-flex>


                <!-- Button "add fragment" -->
                <button class='ref_buttons' @click="addText">Добавить фрагмент</button>
                <!-- Button "remove reference" -->
                <button id='ref_clear_but' class='ref_buttons' @click="removeText">Удалить фрагмент</button>

                <!-- Fragments list -->
                <ul id='refs_list'>
                  <li v-for='title in this.$store.state.text_headers_arr'>{{ title }}</li>
                </ul>

              </form>
            </v-tab-item>
            
            <!-- ######################### Files ########################## -->
            <v-tab-item :transition='false' :reverse-transition='false'>
              <form id='files_form'>
                <div id="file_header">
                  <h3>Выберите текстовый файл для загрузки.</h3>
                  <p>Перед загрузкой файла укажите язык программирования.</p>
                </div>
                
                <!-- Language select field -->
                <v-flex class='mt-2 mx-3'>
                  <v-select v-model='file_lang_field'
                            :items='languages'
                            label='Язык программирования'
                            solo>
                  </v-select>
                </v-flex>




                <!-- Field for snippet input as files, uploaded from user's browser. -->
                <span id="file_field_span" class='lower_row'>
                  
                  <!-- button "Add file" -->
                  <div id='add_file_div' class='file_buttons'>
                    <label>
                      <input type="file" id="file_input" v-on:change="handleFile($event)">
                      <span id='filename_span'>Добавить файл</span>
                    </label>
                  </div>
                  <!-- Button "Remove file" -->
                  <button id='file_clear_but' class='file_buttons' @click="removeFile()">Удалить файл</button>
                  <!-- Here will be uploaded files list. -->
                  <ul id='files_list'>
                    <li v-for='name in this.$store.state.files_arr'>{{ name }}</li>
                  </ul>
                </span>

              </form>
            </v-tab-item>
            
            <!-- ###################### references ######################### -->
            <v-tab-item :transition='false' :reverse-transition='false'>
              <form id='references_form'>

                <div id="ref_header">
                  <h3>Введите ссылку на текстовый файл.</h3>
                </div>

                <v-flex class='mt-2 mx-3'>
                  <v-text-field label='Ссылка'
                                placeholder='Введите ссылку'
                                v-model='ref_field_cont'
                                box>
                  </v-text-field>
                </v-flex>

                <!-- Language select field -->
                <v-flex class='mt-2 mx-3'>
                  <v-select v-model='ref_lang_field'
                            :items='languages'
                            label='Язык программирования'
                            solo>
                  </v-select>
                </v-flex>

                
                  <!-- Button "add reference" -->
                  <button id='ref_add_but' class='ref_buttons' @click="addRef">Добавить ссылку</button>
                  <!-- Button "remove reference" -->
                  <button id='ref_clear_but' class='ref_buttons' @click="removeRef">Удалить ссылку</button>
                  <!-- Here will be uploaded refs list. -->
                  <ul id='refs_list'>
                    <li v-for='name in this.$store.state.refs_arr'>{{ name }}</li>
                  </ul>
                </span>

              </form>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>

        <button id="btn_upload" @click="upload"><b>Схоронить</b></button>

      </v-card>
    </div>


  </div>
</template>

/******************************************************************************************/

<script type="text/javascript">
export default {
  name: 'upload',
  data() {
    return {
      /* vvv FOR TABS vvv */
      languages: ['Python', 'PHP', 'Ruby', 'Perl', 'Javascript',
                  'HTML', 'CSS', 'SQL', 'Shell',],
      current_tab: 0,


      /* ^^^ FOR TABS ^^^ */
    }
  },

  computed: {
    
    /* vvv FOR TABS vvv */




    /* ^^^ FOR TABS ^^^ */


    // Form headers
    snippet_name: {
      get() {return this.$store.state.snippet_name; },
      set(value) {this.$store.commit('SetSnippetName', value); },
    },
    snippet_descript: {
      get() {return this.$store.state.snippet_descript; },
      set(value) {this.$store.commit('SetSnippetDescript', value); },
    },
    public_flag: {
      get() {return this.$store.state.public_flag; },
      set(value) {this.$store.commit('SetPublicFlag', value); },
    },

    // Text input field
    text_field_header: {
      get() {return this.$store.state.text_field_header; },
      set(value) {this.$store.commit('SetTextFieldHeader', value); },
    },
    text_lang_field: {
      get() {return this.$store.state.text_lang_field; },
      set(value) {this.$store.commit('SetTextFieldLang', value); },
    },
    text_field_cont: {
      get() {return this.$store.state.text_field_cont; },
      set(value) {this.$store.commit('SetTextFieldCont', value); },
    },

    // Files field
    file_lang_field: {
      get() {return this.$store.state.file_lang_field; },
      set(value) {this.$store.commit('SetFileLangField', value); },
    },
    // References field
    ref_lang_field: {
      get() {return this.$store.state.ref_lang_field; },
      set(value) {this.$store.commit('SetRefLangField', value); },
    },
    ref_field_cont: {
      get() {return this.$store.state.ref_field_cont; },
      set(value) {this.$store.commit('SetRefFieldCont', value); },
    },
  },

/******************************************************************************************/

  methods: {

    /* vvv FOR TABS vv */




    /* ^^^ FOR TABS ^^^ */


    addText() {
      let cond1 = Boolean(this.text_field_header);
      let cond2 = Boolean(this.text_field_cont);
      
      if (cond1 && cond2) {
        this.$store.commit('AddToTextObj');
      
        this.$store.commit('SetTextFieldHeader', '');
        this.$store.commit('SetTextFieldLang', '');
        this.$store.commit('SetTextFieldCont', '');
      }
      else {
        let message_object = {
          'text': 'Текст или заголовок не введен.',
          'type': 'alert',
        }
        this.$store.commit('AddNote', message_object);
      }
    },

    removeText() {
      this.$store.commit('RemoveFromTextObj');
    },

    handleFile(evt) {
      /* Reads data from selected text file and save it in variable. */
      const reader = new FileReader();
      reader.onload = (event) => {
        
        let file_cont = {}
        file_cont.name = evt.target.files[0].name;
        file_cont.content = event.target.result;
        file_cont.language = this.file_lang_field;

        this.$store.commit('AddToFilesObj', file_cont);
        this.file_lang_field = '';
      };
      reader.readAsText(evt.target.files[0]);
    },

    removeFile() {
      /* Remove last file from upload files arr and it's data from content arr. */
      this.$store.commit('RemoveFromFilesObj');
    },

    addRef() {
      /* Adds ref to the end of refs array. */
      if (this.ref_field_cont.slice(0, 4).toLowerCase() == 'http') {
        this.$store.commit('AddToRefsObj');
        this.$store.commit('SetRefLangField', '');
        this.$store.commit('SetRefFieldCont', '');
      }
      else {
        let message_object = {
          'text': 'Это не похоже на ссылку.',
          'type': 'alert',
        }
        this.$store.commit('AddNote', message_object);
      }
    },

    removeRef() {
      /* Removes last ref from the refs array. */
      this.$store.commit('RemoveFromRefsObj');
    },

    upload() {
      /* Handle data from form and then upload it to the server. */
      // checks data presence
      const cond1 = this.$store.state.files_arr.length != 0;
      const cond2 = this.$store.state.refs_arr.length != 0;
      const cond3 = this.$store.state.text_headers_arr.length != 0;

      const cond4 = Boolean(this.snippet_name);
      const cond5 = Boolean(this.snippet_descript);

      // if there are some data.
      if (cond4 && cond5 && (cond1 || cond2 || cond3)) {
        let formData = new FormData();
        
        let snippet_info = {
          'name': this.snippet_name,
          'description': this.snippet_descript,
          'public_flag': Boolean(this.public_flag),
        }
        formData.append('info', JSON.stringify(snippet_info));

        // if there are uploaded files
        if (cond1) {
          // Adds files to FormData object.
          formData.append('files', JSON.stringify(this.$store.state.files_obj));
        }

        // if there are references
        if (cond2) {
          formData.append('refs', JSON.stringify(this.$store.state.refs_obj));
        }
        // if there is text in textarea
        if (cond3) {
          formData.append('text', JSON.stringify(this.$store.state.text_obj));
        }

        // Set the config for request.
        const upload_conf = {
          method: 'post',
          url: '/upload',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        };
        // Sends request with FormData object to the server.
        this.axios(upload_conf)
          .then((response) => {
            // Handle answer from server.
            // parsing json
            let data_object = JSON.parse(response.data);
            // type of note-message: ok, info, alert, error
            let msg_type;
            if (response.status == 201) {
              msg_type = 'ok'
            }
            else if (response.status == 500) {
              msg_type = 'error'
            }
            else if (response.status == 406) {
              msg_type = 'alert'
            }

            let message_object = {
              'text': data_object.message,
              'type': msg_type,
            }
            this.$store.commit('AddNote', message_object);
            // redirect to the snippets page if cuccess.
            if (response.status == 201) {
              this.$router.push(`/show/${data_object.reference}`);
            }
          })
          .catch((error) => {
            let from = error.response.data.message.indexOf("DETAIL:");
            let by = error.response.data.message.indexOf("\n", from);
            let message_object = {
              'text': error.response.data.message.substring(from+8, by),
              'type': 'error',
            }
            this.$store.commit('AddNote', message_object);
            //console.log('Something goes wrong:', error.response.data.message); 
          });
      } 
      else {
        // If some data are missing.
        let message_object = {
          'text': 'Не все данные введены.',
          'type': 'alert',
        }
        this.$store.commit('AddNote', message_object);
      }
    },
  },
};
</script>

/******************************************************************************************/

<style scoped lang="less">

// Declaring variables
@light-gray: #D6D6d6;      // for borders
@main-color: #3581de;
@back-gray: #fafafa;
@blue-background: #e3f2fd;
@text-gray: #6b6b6b;

// Declaring mixins.
.border-style(@radius, @col) {
  border: 1px solid @col;
  border-radius: @radius;
}
.buttons-big-shadow() {
  box-shadow: 0 10px 15px 0 #ababab,
               -5px 10px 15px 0 #f2f2f2,
                5px 10px 15px 0 #f2f2f2;
}
.buttons-small-shadow() {
  box-shadow: 0 3px 4px 0px #ababab,
               -3px 3px 4px 0px #f2f2f2,
                3px 3px 5px 0 #f2f2f2;
}

/* vvv FOR TABS vvv */


#tabs_container {
  height: 700px;
  max-width: 700px;
  margin: 0 auto;
}

// For buttons.
  // Upload button
  #btn_upload {
    height: 40px;
    width: 200px;
    margin: 3px auto;
    font-size: 16px;
    .border-style(3px, @main-color);
    background: @main-color;
    color: white;
    .buttons-big-shadow();
    &:hover {
      background: white;
      color: @main-color;
    }
    &:active {
      background: white;
      color: @main-color;
      .buttons-small-shadow();
    }
  }
.file_buttons,
.ref_buttons {
  display: inline-block;
  position: relative;
  width: 40%;
  height: 40px;
  min-width:100px;
  margin: 10px 3%;
  .border-style(3px, @main-color);
  background: @main-color;
  font: 14px sans-serif;
  color: white;
  .buttons-big-shadow();
  &:hover {
    color: @main-color;
    background: white;
  }
  &:active {
      background: white;
      color: @main-color;
      .buttons-small-shadow();
    }
}



// Description
#form_description {
  max-width: 700px;
  margin: 20px auto;
  h2 {
    margin: 0 auto;
  }
  #description_text {
    width: 100%;
    padding: 8px;
  }
  .description_paragraph {
    margin-bottom: 10px;
  }
  .radio_item {
    //width: 500px;
    margin: 0 auto;
  }

}
#public_description {
  font-size: 15px;
  color: @text-gray;
  text-align: left;
}

// file and reference texts
#file_header,
#ref_header {
  color: @text-gray;
  text-align: left;
  margin: 0 20px;
  p {
    font-size: 15px;
  }
  h3 {
    font-size: 20px;
    margin-bottom: 20px
  }
}

form {
  .border-style(3px, @blue-background);
  background: @blue-background;
        // shift X,  shift Y, blur radius, stretch
  box-shadow: 0 2px 2px 0px #ababab,
             -2px 2px 2px 0px #f2f2f2,
              2px 2px 3px 0 #f2f2f2;
  //position: relative;
  width: 95%;
  height: 420px;
  margin: 20px auto 16px;
  padding-top: 10px;
}


  /* ^^^ FOR TABS ^^^ */


// For row with file upload and reference input
.lower_row {
  display: inline-block;
  vertical-align: top;
  margin-top: 30px;
  width: 46%;
}
.lower_row_lang {
  width: 80%;
}

// For file select field.
#file_field_span {
  ul {
    text-align: left;
    padding-left: 10%;
  }
  
  #file_lang_title {
    padding-right: 6%;
  }
  select {
    width: 43%;
  }
}
#file_input {
  display: none;
}

#add_file_div {
  height: 38px;
  label{
    display: block;
    width:100%;
    height: 100%
  }
  #filename_span {
    display: block;
    padding: 10px;
  }
}


// For reference field.
#ref_field_span {
  input {
    width: 84%;
    height: 20px;
  }
  #ref_lang_title {
    padding-right: 5%;
  }
  label {
    display: block;
    margin-top: 10px;
  }
  ul {
    text-align: left;
    padding-left: 10%;
  }
  select {
    width: 43%;
  }
}

// For textarea field.
#text_field_div {
  display: block;
  width: 100%;
  label {
    display: block;
    margin-top: 10px;
  }
  #text {
    width: 92%;
    height: 200px;
  }
  #text_lang_title {
    padding-right: 2%;
  }
  input {
    display: inline-block;
    margin: 10px 5% 10px 0;
    width: 48%;
  }
  select {
    width: 20%;
  }
}
</style>
