import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Notifications
    notes_id: 1,
    notes_list: [],           // to store notes for notification system.

    // upload
    // Form headers
    snippet_name: '',
    snippet_descript: '',
    public_flag: 'true',
    // Text field
    text_field_header: '',
    text_headers_arr: [],
    text_lang_field: '',
    text_field_cont: '',
    text_obj: {},
    // File field
    file_lang_field: '',
    files_arr: [],
    files_obj: {},
    // References field
    ref_lang_field: '',
    ref_field_cont: '',
    refs_arr: [],
    refs_obj: {},
    // Upload button
    upload_btn_disabled: 0,

    // Snippets list
    actual_page: 1,
    pages: 1,
    allowed_languages: [],
    langs_stats: {},
    snippets_obj: {},
    // languages block on snippets list

    // Snippet page
    snippet: {},
    files: {},
  },

/******************************************************************************************/

  mutations: {
  // upload form
    // form headers
    SetSnippetName(state, name) {
      state.snippet_name = name;
    },
    SetSnippetDescript(state, descript) {
      state.snippet_descript = descript;
    },
    SetPublicFlag(state, flag) {
      state.public_flag = flag;
    },
    // Text input field
    SetTextFieldHeader(state, header) {
      state.text_field_header = header;
    },
    SetTextFieldLang(state, lang) {
      state.text_lang_field = lang;
    },
    SetTextFieldCont(state, cont) {
      state.text_field_cont = cont;
    },
    AddToTextObj(state) {
      /*Adds to text object content of all 3 fields:
      header, language, content*/
      let text_cont = {};
      text_cont.language = state.text_lang_field;
      text_cont.content = state.text_field_cont;

      state.text_obj[state.text_field_header] = Object.assign(
          {}, text_cont);
      state.text_headers_arr.push(state.text_field_header);
    },
    RemoveFromTextObj(state, index) {
      //delete state.text_obj[state.text_headers_arr.pop()];
      delete state.text_obj[state.text_headers_arr.splice(index, 1)];
    },
    ResetTextObj(state) {
      state.text_obj = {};
    },
    // Files field
    SetFileLangField(state, lang) {
      state.file_lang_field = lang;
    },
    AddToFilesObj(state, payload) {
      /*payload contains fields:
      name, content, language*/
      let file_cont = {};
      file_cont.language = payload.language;
      file_cont.content = payload.content

      state.files_arr.push(payload.name);

      state.files_obj[payload.name] = Object.assign({}, file_cont);
    },
    RemoveFromFilesObj(state, index) {
      //delete state.files_obj[state.files_arr.pop()];
      delete state.files_obj[state.files_arr.splice(index, 1)];
    },
    ResetFilesObj(state) {
      state.files_obj = {};
    },
    // References field
    SetRefLangField(state, lang) {
      state.ref_lang_field = lang;
    },
    SetRefFieldCont(state, ref) {
      state.ref_field_cont = ref;
    },
    AddToRefsObj(state) {
      state.refs_obj[state.ref_field_cont] = state.ref_lang_field;
      state.refs_arr.push(state.ref_field_cont);
    },
    RemoveFromRefsObj(state, index) {
      //delete state.refs_obj[state.refs_arr.pop()];
      delete state.refs_obj[state.refs_arr.splice(index, 1)];
    },
    ResetRefsObj(state) {
      state.refs_obj = {};
    },
    // Upload button.
    SwitchUploadBtn(state, value) {
      state.upload_btn_disabled = value;
    },

    //Notification system  
    AddNote(state, message_object) {   
    // Adds new messages to display in notifications.
      let note_delay = 15000;            // note's window living time in milliseconds.
      let message_obj = {
        'id': state.notes_id,
        'text': message_object.text,
        'type': message_object.type,     // there are 4 types: 'ok', 'info', 'alert', 'error'.
        // Args of setTimeuot(): callable function; delay in ms; args for function.
        'timer': setTimeout(this.commit, note_delay, 'DeleteNote', state.notes_id),
      };
      state.notes_list.push(message_obj);
      state.notes_id++;
    },
    DeleteNote(state, id) {
    // Delets messages displayed in notifications.
      let obj = state.notes_list.find(note => note.id == id);
      if (obj && obj != -1) {
        state.notes_list.splice(obj, 1);
      }
    },
  // Snippets list
    SetActualPage(state, page_value) {
      state.actual_page = page_value;
    },
    SetPages(state, pages) {
      state.pages = pages;
    },
    SetAllowedLanguages(state, langs) {
      state.allowed_languages = langs;
    },
    SetLangsStats(state, langs) {
      state.langs_stats = Object.assign({}, langs);
    },
    SetSnippetsObj(state, snippets) {
      state.snippets_obj = Object.assign({}, snippets);
    },
  // Snippet page
    SetSnippet(state, snip) {
      state.snippet = Object.assign({}, snip);
    },
    SetFiles(state, files) {
      state.files = Object.assign({}, files);
    },
  },
  actions: {

  },
});
