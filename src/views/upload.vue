<template>
  <div id='container'>
    <!-- Here will be usage instruction for form. -->
    <div id="form_description">
      <h2>Snippet creation form.</h2>
      <div>
        You can enter text into field, select file to upload from your system and enter reference to file at remote server.<br>
        Public snippet appears in snippets list and clickable, 
        private snippet accessible through input reference like <b>/snippet/{snippet_name}</b> only.<br> Please specify the programming language for each snippet's fragment. Following languages are supported by system: PYTHON, PHP, JAVASCRIPT, HTML, CSS,
      </div>
    </div>

<!-- Upload form itself. -->
    <form @submit.prevent="">
      <!-- Snippet's name -->
      <div id='name'>
        <label>Snippet's name:<br>
        <input type='text' class="name_and_description" v-model="snippet_name">
        </label>
      </div>

  <!-- Snippets description -->
      <div id='description'>
        <label>Snippet's description:<br>
        <textarea id='description_textarea' class="name_and_description" v-model="snippet_descript"></textarea>
        </label>
      </div>

  <!-- Privacy selector -->
      <div id='privacy_selector'>
        <label>Privacy:<br>
        <input type='radio' name = 'privacy' value='true' checked v-model="public_flag">
        <span id='left_span'>Public</span>
        <input type='radio' name = 'privacy' value='' v-model="public_flag">
        <span>Private</span>
        </label>
      </div>

  <!-- Field for snippet input as text. -->
      <div id="text_field_div">
        <label>Input fragment's title and text here:<br>
        <input type='text' v-model='text_field_header'>
        <input type='text' v-model='text_field_lang'>
        <textarea id="text" v-model="text_field_cont"></textarea>
        </label>
        <!-- Button "add fragment" -->
        
        <button id='ref_add_but' class='ref_buttons' @click="addText">Add fragment</button>
        <!-- Button "remove reference" -->
        <button id='ref_clear_but' class='ref_buttons' @click="removeText">Remove fragment</button>
        <!-- Fragments list -->
        <ul id='refs_list'>
          <li v-for='title in text_headers_arr'>{{ title }}</li>
        </ul>
      </div>

  <!-- Field for snippet input as files, uploaded from user's browser. -->
      <span id="file_field_span" class='lower_row'>
        <div id="file_header">Select text file to upload</div>
        <input type='text' class='lower_row_lang' v-model='file_lang_field'>
        <!-- button "Add file" -->
        <div id='add_file_div' class='file_buttons'>
          <label>
            <input type="file" id="file_input" v-on:change="handleFile($event)">
            <span id='filename_span'>Add file</span>
          </label>
        </div>
        <!-- Button "Remove file" -->
        <button id='file_clear_but' class='file_buttons' @click="removeFile">Remove file</button>
        <!-- Here will be uploaded files list. -->
        <ul id='files_list'>
          <li v-for='name in files_arr'>{{ name }}</li>
        </ul>
      </span>

  <!-- Field for snippet input as references to text files. -->
      <span id="ref_field_span" class='lower_row'>
        <!-- Field for reference input -->
        <label>Input your reference to text file here:<br>
        <input type='text' class='lower_row_lang' v-model='ref_lang_field'>
        <input type="text" id="ref" v-model="ref_field_cont">
        </label>
        <!-- Button "add reference" -->
        <button id='ref_add_but' class='ref_buttons' @click="addRef">Add reference</button>
        <!-- Button "remove reference" -->
        <button id='ref_clear_but' class='ref_buttons' @click="removeRef">Remove reference</button>
        <!-- Here will be uploaded refs list. -->
        <ul id='refs_list'>
          <li v-for='name in refs_arr'>{{ name }}</li>
        </ul>

      </span>

      <!-- Button for uploading filled form. -->
      <div v-if='no_data_flag'> 
        There is no data to upload.
      </div>
      <button id="btn_upload" @click="upload"><b>Upload</b></button>

    </form>
  </div>
</template>

/*******************************************************************************/

<script type="text/javascript">
export default {

  data() {
    return {
      // For whole snippet.
      snippet_name: '',
      snippet_descript: '',
      public_flag: 'true',
      // For text input field.
      text_field_header: 'Title',
      text_field_lang: 'Language',
      text_field_cont: 'Content',
      text_headers_arr: [],
      text_lang_arr: [],
      text_cont_arr: [],
      // For reference selection.
      ref_field_cont: 'Reference',
      ref_lang_field: 'Language',
      refs_arr: [],
      refs_lang_arr: [],
      // For file selection.
      files_arr: [],   // For output selected filenames 
      file_lang_field: 'Language',
      file_lang_arr: [],
      file_content: [],    // Contains data from selected files.

      no_data_flag: false,
    };
  },

  methods: {
    
    addText() {
      this.text_headers_arr.append(this.text_field_header);
      this.text_lang_arr.append(this.text_field_lang);
      this.text_cont_arr.append(this.text_field_cont);

      this.text_field_header = 'Title';
      this.text_field_lang = 'Language';
      this.text_field_cont = 'Text';
    },
    
    removeText() {
      this.text_headers_arr.pop();
      this.text_lang_arr.pop();
      this.text_cont_arr.pop();
    },

    handleFile(evt) {
      /* Reads data from selected text file and save it in variable. */
      this.files_arr.push(evt.target.files[0].name);
      this.file_lang_arr.push(this.file_lang_field);
      const reader = new FileReader();
      reader.onload = (event) => { // evt
        this.file_content.push(event.target.result);
        //console.log(this.file_content);
      };
      reader.readAsText(evt.target.files[0]);
    },
    
    removeFile() {
      /* Remove last file from upload files arr and it's data from content arr. */
      this.files_arr.pop();
      this.file_lang_arr.pop();
      this.file_content.pop();
    },
    
    addRef() {
      /* Adds ref to the end of refs array. */
      if (this.ref_field_cont.slice(0,4).toLowerCase() == 'http') {
        this.refs_arr.push(this.ref_field_cont);
        this.refs_lang_arr.push(this.ref_lang_field);
        this.ref_field_cont = 'Referencee';
      }
    },
    
    removeRef() {
      /* Removes last ref from the refs array. */
      this.refs_arr.pop();
      this.refs_lang_arr.pop();
    },
    
    upload() {
      /* Handle data from form and then upload it to the server. */
      // checks data presence
      let cond1 = this.files_arr.length != 0;
      let cond2 = this.refs_arr.length != 0;
      let cond3 = this.text_headers_arr.length != 0;

      // if there are some data.
      if (cond1 || cond2 || cond3) {
        let formData = new FormData();
        formData.append('name', this.snippet_name);
        formData.append('description', this.snippet_descript);
        formData.append('public_flag', this.public_flag);

        // if there are uploaded files
        if (cond1) {
          // Adds filenames and files content to FormData object.
          formData.append('filenames', this.files_arr);
          formData.append('files_languages', this.file_lang_arr);
          formData.append('files_content', this.file_content);
        }
        
        // if there are references
        if (cond2) {
          formData.append('refs', this.refs_arr);
          formData.append('refs_languages', this.refs_lang_arr);
        }
        // if there is text in textarea
        if (cond3) {
          formData.append('text_headers', this.text_headers_arr);
          formData.append('text_languages', this.text_lang_arr);
          formData.append('text', this.text_cont_arr);
        }

        // Set the config for request.
        let upload_conf = {
          method: 'post',
          url: '/upload',
          headers: {'Content-Type': 'multipart/form-data',},
          data: formData,
        }
        // Sends request with FormData object to the server.
        this.axios(upload_conf)
          .then(response => {
            // Handle answer from server.
            console.log('Request received section.');
            console.log(response.data['message']);
          })
          .catch(error => {console.log('Something goes wrong:', error);});
        console.log('Request sended');
      }
      else {
        // If there no any data, sets flag to show message about it.
        this.no_data_flag = true;
        setTimeout(() => {this.no_data_flag = false}, 6000);
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
  .border-style(10px, @main-color);
  position: relative;
  width: 90%;
  margin: 20px auto 0;
  padding-top: 10px;

  // For all input fields in form.
  input,
  textarea {
    font: 14px sans-serif;
    color: black;
    text-align: left;
    margin-top: 1em;
    background: white;
    .border-style(5px, @light-gray);
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

// For row with file uoload and reference input
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
  label {
    display: block;
    margin-top: 10px;
  }
  ul {
    text-align: left;
    padding-left: 10%;
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
  input {
    display: inline-block;
    margin: 10px 10px 0;
    width: 45%;
  }
}
</style>
