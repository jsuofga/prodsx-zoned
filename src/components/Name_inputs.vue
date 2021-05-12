<template>
  <div class="name-inputs box ">
     
      <form >
            <h5>Add Video Input </h5>
            <div class="field">
                <!-- <label for="Video Input"></label> -->
                <div class = 'inputDiv' > 
                      <input id = 'input' name="input" v-model= "sourceName" placeholder="Enter Name of Video Input to add" type="text" required maxlength="10">
                      <span class = "add"><i class="material-icons" v-on:click= "add">add</i></span>
                </div>
            </div>

          <div class = 'listDiv'>
                   <div class = "gridItem" v-for="(item,index) in sourceNames" :key="index">
                       <label class = "chip">
                        TX{{index+1}} 
                      </label>
                      <label >
                        IP-172.31.2.{{index+1}}
                      </label>
                      <!-- <label v-bind:for= "sourceNames[index]">Input{{index+1}}.</label> -->
                      <input class = 'inputFont' type="text" name = "sourceNames[index]" v-model= "sourceNames[index]" maxlength="10">
                      <span class = "trash"><i class="material-icons" v-on:click= "trash(index)">delete_forever</i></span>
                  </div>
          </div>

          <div class="field center-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn">Cancel</button>
                <button v-on:click = "save" class="waves-effect waves-light btn blue">Update/Save</button>
          </div>

      </form>

  </div>

</template>

<script>

export default {
    name: 'Name_inputs',
    props:['sourceNames'],
    watch:{
    //   sourceNames: function() {
    //       this.$emit('msg-sourceNamesUpdated',this.sourceNames)
    //   }
    },
    data(){
        return{
          sourceName:null
        }
    },
    methods: {
      
      add(){
        this.sourceNames.push(this.sourceName)
        this.sourceName = ''
      },
      trash(index){
        this.sourceNames.splice(index,1)
        //console.log(index)

      },
      save(e){
          e.preventDefault()
          M.toast({ html: `Saving updates`, classes: "rounded blue" });
 
        console.log(this.sourceNames)

        // Write to TX1 and save as 'sourceNames_DB'
          fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam s sourceNames_DB " + JSON.stringify(this.sourceNames))
          .then(function(data) {
              // Save
              fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam save")
              .then(function(data) {
                  alert('Saved to TX1 Database');
              })
          })
                 this.$emit('msg-sourceNames',this.sourceNames) //
                 this.$router.push({ name: `home`})
   
   
      },
      cancel(e){
          e.preventDefault()
          this.$router.push({name:'home'})
      }
  },
  //Life Cycle Hooks
    mounted(){
        M.AutoInit() // For Materialize to work!
        window.scrollTo(0, 0) //Top of page
    }
}   

</script>

<style scoped>

.box{
   display: flex;
   justify-content: center;
   /* border:1px solid red; */
   width:100%;
}
form{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius:10px;
  width:90%;

}
#input{
  border:1px solid lightgray;
  border-radius: 4px;
}
input[type=text]:focus{
  border-bottom: 1px solid #2196f3 !important ;
} 
.field{
  width:50%;
}
.btn{
  margin: 30px;
}
.feedback{
  color:red
}
.inputDiv{
    position:relative;
}
.listDiv{
  display:grid;
  grid-template-columns:repeat(10, 1fr);
  width:95%;
  position:relative;
  margin:10px
}
.gridItem{
  display:flex;
  flex-direction: column;
  padding:5px;
  position:relative;
  border:1px solid lightgray;
  margin:1px;
  border-radius: 4px;
}
.inputFont{
  font-size: 14px !important;
}
.add{
    position:absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
}
.trash{
    position:absolute;
    right: 2px;
    top: 2px;
    cursor: pointer;
    color: black;
    transform: scale(.8);
}
.chip{
    width: 70% !important
}

</style>