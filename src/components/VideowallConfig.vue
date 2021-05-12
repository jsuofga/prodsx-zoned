<template>
  <div class="video-wall-config box">

      <form >
            <h5>Create Video Walls</h5>

            <div  class = 'field' >
                <div class = 'vwType' >
                    <label class="center-align"><strong>Select Type</strong> </label>
                    <div class = 'vwSelect'>
                        <p>
                            <label>
                                <input @click= "set_vwType('2x2')" name="group1" type="radio"/>
                                <span>2x2 <i class="material-icons" >border_all</i></span>
                            </label>
                        </p>
                        <p>
                              <label>
                                <input @click= "set_vwType('3x3')" name="group1" type="radio"/>
                                <span>3x3 <i class="material-icons" >grid_on</i></span>
                            </label>

                        </p>
                        <p>
                            <label>
                                <input @click= "set_vwType('2x3')" name="group1" type="radio"/>
                                <span>2x3<i class="material-icons" >view_module</i> </span>
                            </label>
                        </p>
                       <p>
                            <label>
                                <input @click= "set_vwType('1x3')" name="group1" type="radio"/>
                                <span>1x3<i class="material-icons" >view_column</i>clockwise</span>
                            </label>

                       </p>

                    </div>
                </div>
             </div>

             <div class= "field">
                 <select v-model= "selected">
                        <option value="" >Set Base RX ID</option>
                        <option v-for= "(item,index) in rxIds" :key= "index" >{{item+1}}</option>
                 </select>
                 <div class = "center-align"> <button v-on:click = "add" class="waves-effect green waves-light btn"> <i class="material-icons left">arrow_downward</i>Add</button></div>
             </div>

         <div class = 'listDiv'>
                   <div class = "gridItem" v-for="(item,index) in videoWalls" :key= "index"  >
                      <label class = "chip">
                        {{videoWalls[index].vwType}}
                      </label>
                      <div>
                        <label>Bezel-W {{100-videoWalls[index].hw}}% , H {{100-videoWalls[index].vh}}%</label>
                      </div>
                      <div>
                        <label>RX ID  {{videoWalls[index].baseID}} to {{videoWalls[index].endID}} </label>
                      </div>

                      <!-- <label> RX ID  {{videoWalls[index].baseID}} to {{videoWalls[index].endID}}  </label> -->
                      <input class = 'inputFont' v-bind:class = "errorFeedback" type="text" v-model = "vwNames[index]"  placeholder="Enter Video Wall Name"  maxlength="10" >
                      <span class = "edit"><i class="material-icons " v-on:click= "openModal(index)">settings_overscan</i></span>
                      <span class = "trash"><i class="material-icons" v-on:click= "trash(index)">delete_forever</i></span>

                  </div>
          </div>

          <div class="right-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn">Cancel</button>
                <button v-on:click = "save" class="waves-effect waves-light btn blue">Update/Save</button>
          </div>

      </form>

        <!-- Modal Structure -->
    <div id="modal" class="modal">
            <div class="modal-content-admin">
                <h5 class = "center-align">Bezel Adjust</h5>
              <form action="#" >
                 <label>Horizontal Bezel Adust (Viewable H/ Total H)</label>
                  <p class="range-field" >
                    <input  type="range" min="90" max="100" v-model= "hWidths[vwEditIndex]">
                  </p>
                  <p>{{hWidths[vwEditIndex]}}%</p>
                <label>Vertical Bezel Adust (Viewable V/ Total V)</label>
                 <i class="material-icons ">height</i>
                  <p class="range-field" >
                    <input type="range" min="90" max="100" v-model= "vHeights[vwEditIndex]" >
                  </p>
                  <p>{{vHeights[vwEditIndex]}}%</p>
              </form>
            </div>

            <div class="modal-footer">
                <a @click= "closeModal" class="modal-close waves-effect waves-light btn red">Cancel</a>
                <a @click= "submit" class="modal-close waves-effect waves-light btn blue ">Submit</a>
            </div>
    </div>

  </div>

</template>

<script>

export default {
    name: 'VideowallConfig',
    props:[],
    watch:{

    },
    data(){
        return{
            rxIds: [...Array(100).keys()],
            vwType: '',
            selected: '',
            vwNames:[],
            videoWalls: [],
            default_hw_vh: 95,
            vwEditIndex: '',
            vHeights:[],
            hWidths:[],
            errorFeedback:'',
            optionsSelected: 'selected'
        }
    },

    methods: {
     set_vwType(_vwType){
        this.vwType = _vwType
     },
      add(e){
        e.preventDefault()
        let endID = ''
        if(this.vwType == '2x2'){
            endID = parseInt(this.selected) + 3
        }else if(this.vwType  == '3x3'){
            endID = parseInt(this.selected) + 8
        }else if(this.vwType  == '2x3'){
            endID = parseInt(this.selected) + 5
        }else if(this.vwType  == '1x3'){
            endID = parseInt(this.selected) + 2
        }
        this.videoWalls.push({name:'',vwType:this.vwType, baseID: parseInt(this.selected) ,endID:endID, hw:this.default_hw_vh, vh:this.default_hw_vh})
        this.vwNames.push('')
        this.hWidths.push(this.default_hw_vh)
        this.vHeights.push(this.default_hw_vh)

      },
      trash(index){
        this.videoWalls.splice(index,1)
        this.vwNames.splice(index,1)
      },
      edit(index){
        console.log(index)
      },
    save(e){
          e.preventDefault()
          if(this.vwNames.includes('')){
               alert("Enter a unique name for each Video Wall")
          }else{
            this.videoWalls.forEach((item,index)=>{
                  this.videoWalls[index].name = this.vwNames[index]
                  this.videoWalls[index].vh = this.vHeights[index]
                  this.videoWalls[index].hw = this.hWidths[index]
            })
          console.log(this.videoWalls)
          // Write to TX1 and save as 'vwConfigs_DB'
          fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam s vwConfigs_DB " + JSON.stringify(this.videoWalls))
          .then(function(data) {
              // Save
              fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam save")
              .then(function(data) {
                  alert('Saved to TX1 Database');
              })
          })
            this.$emit('msg-vwConfigs',this.videoWalls) //
            this.$router.push({ name: `home`})
          }
    },
    readFromTx(){
        fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam g vwConfigs_DB")
        .then(response => response.text())
        .then((data) => {
           // console.log(data)
            let videoWalls_JSON = data.replace(/([\s\w.-]+)/g,'"$1"') //Add in the double " " quotation marks to make it in JSON format valid
            let videoWalls_OBJ = JSON.parse(videoWalls_JSON)
            console.log(videoWalls_OBJ)
            this.videoWalls = videoWalls_OBJ

            // derive vwNames from videoWalls
            this.videoWalls.forEach((item,index)=>{
                  this.vwNames.push(this.videoWalls[index].name)
                  this.hWidths.push(this.videoWalls[index].hw)
                  this.vHeights.push(this.videoWalls[index].vh)
            })
        })

    },
    cancel(e){
      this.$emit('msg-vwConfigs',this.videoWalls) //
      this.$router.push({ name: `home`})
    },
    openModal(index){
        this.vwEditIndex = index
        this.modalInstance.open();
    },
    closeModal(){
        this.modalInstance.close();
    },
    submit(){
      this.videoWalls.forEach((item,index)=>{
        // this.videoWalls[index].name = this.vwNames[index]
        this.videoWalls[index].vh = this.vHeights[index]
        this.videoWalls[index].hw = this.hWidths[index]
      })

    }
  },
  //Life Cycle Hooks
    mounted(){
        M.AutoInit() // For Materialize to work!
        window.scrollTo(0, 0) //Top of page

        this.readFromTx()

        const modal = document.getElementById('modal')
        this.modalInstance = M.Modal.init(modal);

        var elems  = document.querySelectorAll("input[type=range]");
        M.Range.init(elems);

    }
}

</script>

<style scoped>

.container{
  display: flex;
  width:90%;
  /* justify-content: center; */
  align-items: center;
}
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
  width:70%;
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
  grid-template-columns:repeat(4, 1fr);
  width:80%;
  /* position:relative;
  margin:10px */
}
.gridItem{
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
    transform: scale(.9);
    
}
.edit{
    position:absolute;
    right: 30px;
    top: 2px;
    cursor: pointer;
    color: black;
    transform: scale(.9);
}
.vwType{
  display:flex;
  flex-direction:column;
  justify-content: center;
  width:100%;
  margin-bottom:20px;
}
.vwSelect{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  border:1px solid lightgray;
  border-radius: 4px;
  width:100%;
}


</style>