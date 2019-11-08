/*global axios */
/*global Vue */
var app = new Vue({
  el: '#app',
  data: {
    docs: [],
    words : "",
    file : "",
    saved : true,
    currentFile : "",
  },
  created: function() {
    this.updateFiles();
    console.log(this.docs);
      

  },
  watch: {
    words(value, oldvalue) {
        this.saved = false;
    },
  },
  methods: {
    async saveAs(){
        if (this.file == "" && this.currentFile == ""){
            this.file = prompt("Please enter file name", "");
        }
        if (this.file == "" || this.file == null){
            return;
        }
        let docsMap = this.docs.map(item => {
            return item.name;
        });
        let index = docsMap.indexOf(this.file);
        if(index != -1){
            if(!confirm("Are you sure you want to overwirte " + this.file)){
                return;
            }
        }
        this.currentFile = this.file;
        await this.save();
    },
    async save() {
        if(this.currentFile == "README.txt"){
            alert("Cannot Change or Delete README");
            return;
        }
        if (this.currentFile == ""){
            this.saveAs();
            return;
        }
        console.log("in save");
        let docsMap = this.docs.map(item => {
            return item.name;
        });
        this.file = this.currentFile;
        let index = docsMap.indexOf(this.file);
        if(index != -1){
            await this.deleteFileNoComfirm();
        }
        try {
        const response = await axios.post("/saveDocument", {
          name: this.currentFile,
          text: this.words,
        });
        alert("Saved to " + this.currentFile);
        this.file = "";
        this.saved = true;
        this.updateFiles();
      } catch (error) {
        console.log(error);
        alert("Error Saving to " + this.currentFile);
      }
        
    },
    async updateFiles(){
        try{
        const response = await axios.get("/getDocuments");
            this.docs = response.data;
        }catch(error){
            console.log(error);
            alert("Error Getting Files");
        }
    },
    async loadFile(){
        if (this.file == ""){
            this.file = prompt("Please enter file name", "");
        }
        if (this.file == "" || this.file == null){
            return;
        }
        console.log("DOCS");
        console.log(this.docs);
        let docsMap = this.docs.map(item => {
            return item.name;
        });
        let i = docsMap.indexOf(this.file);
        this.words = this.docs[i].text;
        this.currentFile = this.file;
        this.file = "";
        this.saved = true;
    },
    async deleteFile(){
        if(this.file == "README.txt"){
            alert("Cannot Change or Delete README");
            return;
        }
        console.log("IN DELETE");
        if(!confirm("Are you sure you want to delete " + this.file)){
            return;
        }
        let docsMap = this.docs.map(item => {
            return item.name;
        });
        let index = docsMap.indexOf(this.file);
        try {
            const response = await axios.put("/deleteFile", {
            index: index,
        });
        alert("Deleted " + this.file);
        this.file = "";
        this.updateFiles();
      } catch (error) {
        console.log(error);
        alert("Error Deleting " + this.file);
      }
    },
    async deleteFileNoComfirm(){
        console.log("IN DELETE");
        let docsMap = this.docs.map(item => {
            return item.name;
        });
        let index = docsMap.indexOf(this.file);
        try {
            const response = await axios.put("/deleteFile", {
            index: index,
        });
        this.file = "";
        this.updateFiles();
      } catch (error) {
        console.log(error);
        alert("Error Deleting " + this.file);
      }
    },
    async newFile(){
        if (!this.saved){
            if (confirm("Would you like to save first?")){
                this.save();
            }
        }
        this.words = "";
        this.currentFile = "";
        this.file = "";
        this.saved = true;
    },
    async saveTemp(){
        console.log("in temp" + this.words);
        const response = await axios.post("/saveTemp", {
          text: this.words,
        });
    }
  }
});
