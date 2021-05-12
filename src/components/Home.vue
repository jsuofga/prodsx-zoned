<template>
 <div class="home">
    
      <div v-if= "oneZoneOnly === 0" class = "welcome">
        <h3>Welcome</h3>
        <h3>Goto settings to add displays to system</h3>
      </div>
      <div v-else-if= "oneZoneOnly === 1" class = "single-zone" >
          <div @click= "showZone(item,index)" class = "waves-effect waves-light roundBtn btn-large" v-for="(item,index) in zoneNamesToDisplay" :key="index">{{zoneNamesToDisplay[index]}}</div>
          <div @click= "switchAll" data-target="slide-out" class="waves-effect waves-light roundBtn btn-large sidenav-trigger">ALL TVs</div>
      </div>
      <div v-else class = "zone" >
          <div @click= "showZone(item,index)" class = "waves-effect waves-light roundBtn btn-large" v-for="(item,index) in zoneNames" :key="index">{{zoneNames[index]}}</div>
          <div @click= "switchAll" data-target="slide-out" class="waves-effect waves-light roundBtn btn-large sidenav-trigger"><i class="material-icons">all_inclusive</i>ALL</div>
     </div>

      <!-- Video Wall Section -->
     <div id="video-wall-section"  v-if= "videoWallExist" >
          <h4 class= "item center-align">Video Walls</h4>
          <div @click = "videowallSelect(index)" v-for="(item,index) in vwConfigs" :key="index" class = "waves-effect waves-light vwBtn btn-large">{{vwConfigs[index].name}}</div>
     </div>

     <!-- Floating Action Button -->
    <div class="fixed-action-btn ">
        <a class="btn-floating btn-large teal">
            <small class = 'preset'>Presets</small>
        </a>
        <ul>
            <li @click= 'switchPreset(1)'><a class="btn-floating orange"><i class="material-icons">looks_one</i></a></li>
            <li @click= 'switchPreset(2)'><a class="btn-floating blue"><i class="material-icons">looks_two</i></a></li>
            <li @click= 'switchPreset(3)'><a class="btn-floating purple"><i class="material-icons">looks_3</i></a></li>
            <li @click= 'switchTvOnOff(0)'><a class="btn-floating red"><i class="material-icons">power_settings_new</i></a></li>
            <li @click= 'switchTvOnOff(1)'><a class="btn-floating green"><i class="material-icons">power_settings_new</i></a></li>
        </ul>
    </div>

</div>

</template>

<script>

export default {
  name: 'Home',
  props: ['vwConfigs','zones','zonesId','zoneNames','tvNames', 'tvNamesZones'],

  data () {
    return {
      zoneNamesToDisplay: [],
      preset:[],
    }
  },
  computed:{
      oneZoneOnly: function(){
       
          this.zoneNamesToDisplay = [...new Set(this.zoneNames)]
      
          if(this.zoneNamesToDisplay.length == 0){
           return (0)
         }else if (this.zoneNamesToDisplay.length == 1){
           return (1)
         }
         else{
           return (false)
         }
      },
      videoWallExist: function(){
        if(this.vwConfigs.length == 0){
          return (false)
        }else{
          return(true)
        }

      }
  },
  methods:{
    test(){
      console.log("vwConfigs length", this.vwConfigs.length)
    },
    emit_vw_show(type){
       // console.log(type)
      // this.$emit('msg-vw-show', {vwType:type})
      // this.$router.push({ name: `videowall`})
    },
    videowallSelect(index){
      let type = this.vwConfigs[index].vwType
      this.$emit('msg-vwSelected', index)
      if(type == '2x2'){
        this.$router.push({ name: `videowall2x2`})
      }else if (type == '3x3'){
        this.$router.push({ name: `videowall3x3`})
      }else if(type == '1x3'){
        this.$router.push({ name: `videowall1x3`})
      }else if(type == '2x3'){
        this.$router.push({ name: `videowall2x3`})
      } else{
        
      }
    },
    showZone(item,index){
        let zone = index+1
        this.$emit('msg-zoneSelected', {zoneId: zone})
        this.$router.push({ name: `zone`})
    },
    switchAll(){
       this.$emit('msg-rxSelected', 'all')
    },
    switchPreset(preset){
        //alert(`switch preset ${preset}`)
        M.toast({ html: `Switch preset ${preset}`, classes: "rounded red"})
        // get preset from TX
        fetch(`http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam g preset${preset}_DB`)
        .then(response => response.text())
        .then((data) => {
            //console.log(data)
            let preset_JSON = data.replace(/([\s\w.-]+)/g,'"$1"') //Add in the double " " quotation marks to make it in JSON format valid
            let preset_OBJ = JSON.parse(preset_JSON)
            this.preset= preset_OBJ 
            console.log('This is preset',this.preset)
            // Send preset switch commands to all RX units
               this.preset.forEach((item,index)=>{
                 console.log(`http://172.31.3.${index+1}/cgi-bin/query.cgi?cmd=rxswitch:${item}`)
                 fetch(`http://172.31.3.${index+1}/cgi-bin/query.cgi?cmd=rxswitch:${item}`)

               })
        })    
      },
      switchTvOnOff(_onoff){

          if(_onoff == 0){
            M.toast({ html: `Switching off displays via CEC`, classes: "rounded red"})
               // Send CEC Off command to displays
               this.tvNamesZones.forEach((item,index)=>{
                 console.log(`http://172.31.3.${this.tvNamesZones[index].rxId}/cgi-bin/query.cgi?cmd=cec_send 20:36`)
                 fetch(`http://172.31.3.${this.tvNamesZones[index].rxId}/cgi-bin/query.cgi?cmd=cec_send 20:36`)
               })
              // Send CEC Off command to video wall displays
              this.vwConfigs.forEach((item,index)=>{
                 let firstRx = this.vwConfigs[index].baseID
                 let lastRx = this.vwConfigs[index].endID
                  for(let i = firstRx; i<= lastRx; i++){
                    console.log(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=cec_send 20:36`)
                    fetch(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=cec_send 20:36`)
                  }
              })             

          }else if(_onoff == 1){
             M.toast({ html: `Switching on displays via CEC`, classes: "rounded green"})
              // Send CEC Oncommand to displays
              this.tvNamesZones.forEach((item,index)=>{
                console.log(`http://172.31.3.${this.tvNamesZones[index].rxId}/cgi-bin/query.cgi?cmd=cec_send 20:04`)
                fetch(`http://172.31.3.${this.tvNamesZones[index].rxId}/cgi-bin/query.cgi?cmd=cec_send 20:04`)
              
              })
              // Send CEC On command to video wall displays
               this.vwConfigs.forEach((item,index)=>{
                 let firstRx = this.vwConfigs[index].baseID
                 let lastRx = this.vwConfigs[index].endID
                  for(let i = firstRx; i<= lastRx; i++){
                    console.log(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=cec_send 20:04`)
                    fetch(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=cec_send 20:04`)
                  }
              })             
          }
     },
  },

  //Life Cycle Hooks
  mounted(){
        M.AutoInit() // For Materialize to work!
        console.log("vwConfigs length", this.vwConfigs.length)
  }

}
</script>

<style scoped>
.home{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height:100vh;
  position:absolute;
  box-sizing: border-box; 
  background-color: rgb(28,28,30);

}
.welcome{
  color:white;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position:relative;
  top:-10%;
}
.single-zone{
    display: grid;
    grid-template-columns: repeat(2,auto);
    grid-column-gap: 50px;
    justify-content: center;
    align-items: center;
    /* height:100vh; */
    height:50vh;
    /* border:1px solid red ; */
}
.zone{
    display: grid;
    grid-template-columns: repeat(4,auto);
    grid-column-gap: 25px;
    justify-content: center;
    align-items: center;
    height:50vh;
    padding-left:50px;
    padding-right:25px
}
.roundBtn{
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   /* border:3px solid white; */
   font-size: 2rem;
   height:180px;
   width:180px;
   border-radius: 50%;
  /* // background-color: rgb(28,28,30) ; */
  background-color: #2c3e50;
}
.roundBtn:hover,.vwBtn:hover {
  background-color:#2196f3 !important;
}
#video-wall-section{
  display: grid;
  grid-template-columns: repeat(4,auto);
  justify-items: center;
  align-items: center;
  grid-column-gap: 25px;
  padding-left:50px;
  border-radius: 10px;
  /* border:1px solid red; */
}
 #video-wall-section :first-child{
  grid-column: 1 / -1;
  color:white;
  margin-right:50px; 
  /* border:1px solid orange; */
}
.vwBtn{
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   /* border:3px solid white; */
   font-size: 2rem;
   height:150px;
   width:150px;
   border-radius: 10px;
   background-color: #2c3e50; 
}

</style>
