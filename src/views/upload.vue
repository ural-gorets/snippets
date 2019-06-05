<template>
  <div id='container'>
    <!-- Here will be usage instruction for form. -->
    <div id="form_description">
      <h2>Форма создания сниппета.</h2>
      <div>
        Вы можете сохранять фрагменты кода в текстовом поле ввода, загружать файлы из вашей системы или ввести ссылки на текстовые файлы на сторонних ресурсах.<br>
        Публичные сниппеты отображаются в списке и кликабельны,
        скрытые - на отображаются, и доступны только при введении ссылки вида: <b>/snippet/{snippet_name}</b> only.<br> Пожалуйста, указывайте язык программирования для каждого фрагмента кода. Синтаксис следующих языков распознается системой: PYTHON, PHP, JAVASCRIPT, HTML, CSS. 
      </div>
    </div>

<!-- Upload form itself. -->
    <form @submit.prevent="">
      <!-- Snippet's name -->
      <div id='name'>
        <label>Название сниппета:<br>
        <input type='text' class="name_and_description" placeholder='Название сниппета' 
        v-model="snippet_name">
        </label>
      </div>

  <!-- Snippets description -->
      <div id='description'>
        <label>Описание сниппета:<br>
        <textarea id='description_textarea' class="name_and_description" 
        placeholder='Здесь опишите функционал сниппета и инструкции по использованию.'
        v-model="snippet_descript">
        </textarea>
        </label>
      </div>

  <!-- Privacy selector -->
      <div id='privacy_selector'>
        <label>Приватность:<br>
        
        <input type='radio' name = 'privacy' value='true' checked v-model="public_flag">

        <span id='left_span'>Публичный</span>
        <input type='radio' name = 'privacy' value='' v-model="public_flag">
        <span>Скрытый</span>
        </label>
      </div>

  <!-- Field for snippet input as text. -->
      <div id="text_field_div">
        <label>Введите заголовок и текст фрагмента:<br>
        <input type='text' placeholder='Заголовок фрагмента' v-model='text_field_header'>
        <!--input type='text' v-model='text_lang_field'-->

        <span id='text_lang_title'>язык программирования: </span>
        <select id='text_lang_select' v-model='text_lang_field'>
          <option value='' selected>не выбран</option>
          <option value='Python'>Python</option>
          <option value='Javascript'>Javascript</option>
          <option value='HTML'>HTML</option>
          <option value='CSS'>CSS</option>
          <option value='SQL'>SQL</option>
          <option value='PHP'>PHP</option>
          <option value='Perl'>Perl</option>
          <option value='Ruby'>Ruby</option>
          <option value='Shell'>Shell</option>

        </select>

        <textarea id="text" placeholder='Текст фрагмента' v-model="text_field_cont"></textarea>
        </label>

        <!-- Button "add fragment" -->
        <button id='ref_add_but' class='ref_buttons' @click="addText">Добавить фрагмент</button>
        <!-- Button "remove reference" -->
        <button id='ref_clear_but' class='ref_buttons' @click="removeText">Удалить фрагмент</button>
        <!-- Fragments list -->
        <ul id='refs_list'>
          <li v-for='title in this.$store.state.text_headers_arr'>{{ title }}</li>
        </ul>
      </div>

  <!-- Field for snippet input as files, uploaded from user's browser. -->
      <span id="file_field_span" class='lower_row'>
        <div id="file_header">
          Выберите текстовый файл для загрузки.<br>
          Перед загрузкой файла укажите язык программирования.
        </div>
        <!--input type='text' class='lower_row_lang' v-model='file_lang_field'-->

        <span id='file_lang_title'>язык программирования: </span>
        <select v-model='file_lang_field'>
          <option value='' selected>не выбран</option>
          <option value='Python'>Python</option>
          <option value='Javascript'>Javascript</option>
          <option value='HTML'>HTML</option>
          <option value='CSS'>CSS</option>
          <option value='SQL'>SQL</option>
          <option value='PHP'>PHP</option>
          <option value='Perl'>Perl</option>
          <option value='Ruby'>Ruby</option>
          <option value='Shell'>Shell</option>
        </select>

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

  <!-- Field for snippet input as references to text files. -->
      <span id="ref_field_span" class='lower_row'>
        <!-- Field for reference input -->
        <label>Введите ссылку на текстовый файл:<br>
        <!--input type='text' class='lower_row_lang' v-model='ref_lang_field'-->
        
        <span id='ref_lang_title'>язык программирования: </span>
        <select v-model='ref_lang_field'>
          <option value='' selected>не выбран</option>
          <option value='Python'>Python</option>
          <option value='Javascript'>Javascript</option>
          <option value='HTML'>HTML</option>
          <option value='CSS'>CSS</option>
          <option value='SQL'>SQL</option>
          <option value='PHP'>PHP</option>
          <option value='Perl'>Perl</option>
          <option value='Ruby'>Ruby</option>
          <option value='Shell'>Shell</option>
        </select>
        
        <input type="text" id="ref" placeholder='Ссылка на файл' v-model="ref_field_cont">
        </label>
        <!-- Button "add reference" -->
        <button id='ref_add_but' class='ref_buttons' @click="addRef">Добавить ссылку</button>
        <!-- Button "remove reference" -->
        <button id='ref_clear_but' class='ref_buttons' @click="removeRef">Удалить ссылку</button>
        <!-- Here will be uploaded refs list. -->
        <ul id='refs_list'>
          <li v-for='name in this.$store.state.refs_arr'>{{ name }}</li>
        </ul>

      </span>

      <button id="btn_upload" @click="upload"><b>Схоронить</b></button>

    </form>
  </div>
</template>

/*******************************************************************************/

<script type="text/javascript">
export default {
  name: 'upload',
  data() {
    return {
      // All variables in store.
    }
  },

  computed: {
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

  /********************************************************************************/

  methods: {

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
              'text': response.data.message,
              'type': msg_type,
            }
            this.$store.commit('AddNote', message_object);
          })
          .catch((error) => {
            let from = error.response.data.message.indexOf("DETAIL:");
            let by = error.response.data.message.indexOf("\n", from);
            let message_object = {
              'text': error.response.data.message.substring(from+8, by),
              //'text': error,
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

/*******************************************************************************/

<style lang="less">

// Declaring variables
@light-gray: #D6D6d6;      // for borders
@main-color: #3581de;

// Declaring mixins.
.border-style(@radius, @col) {
  border: 1px solid @col;
  border-radius: @radius;
}

form {
  // Form border
  .border-style(3px, @main-color);
  position: relative;
  width: 90%;
  margin: 20px auto;
  padding-top: 10px;

  // For all input fields in form.
  input,
  textarea,
  select {
    font: 14px sans-serif;
    color: black;
    text-align: left;
    margin-top: 1em;
    background: white;
    .border-style(5px, @light-gray);
  }
  select {
    appearance: none;
    //width: 43%;
  }

  // For "upload" button.
  #btn_upload {
    height: 40px;
    width: 200px;
    margin: 20px auto;
    font-size: 16px;
    .border-style(10px, @main-color);
    background: @main-color;
    color: white;
    &:hover {
      background: white;
      color: @main-color;
    }
  }
  // For inputs in 'name' and 'description' fields.
  .name_and_description {
    margin-bottom: 10px;
    width: 85%;
    min-width: 160px;
  }
  // For divs 'name', 'description', 'privacy_selector'.
  #name,
  #description,
  #privacy_selector {
    display: inline-block;
    vertical-align: top;
    width: 46%;
  }
  #description_textarea {
    height: 100px;
  }
  #privacy_selector {
    position: absolute;
    top: 80px;
    left: 4%;

    #left_span {
      padding-right: 10%;
    }
  }
}

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
  #file_header {
    margin-top: 10px;
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
.file_buttons,
.ref_buttons {
  display: inline-block;
  position: relative;
  width: 40%;
  min-width:100px;
  margin: 10px 15px 0;
  .border-style(10px, @main-color);
  background: @main-color;
  font: 14px sans-serif;
  color: white;
  &:hover {
    color: @main-color;
    background: white;
  }
}
#file_clear_but,
.ref_buttons {
  height: 40px;
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
