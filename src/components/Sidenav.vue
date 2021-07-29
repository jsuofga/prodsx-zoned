<template>

  <div class="side-nav">
   
    <ul id="slide-out" class="sidenav">
  
        <div class="sourcePreview" v-bind:style="{ backgroundImage: 'url(' + bg_image + ')'}">

        </div>
        <li><a>Preview Video Input {{this.sourceNames[parseInt(this.input)-1]}}</a></li>
        <li><div class="divider"></div></li>
        <li @click= "inputSelect(index)" class = 'videoInputSelects' v-for="(item, index) in sourceNames" :key="index">
          <div class = "inputPreviewItem"><a class="waves-effect inputIcon"><i class="material-icons" >visibility</i>{{item}}</a></div>
          <div class = "inputSendItem valign-wrapper"><a @click= "send(index)" class="waves-effect waves-light btn "><i class="material-icons right">play_arrow</i>Select</a></div>
        </li>
       <li v-if= "rxSelected != 'all'" class = "btn-power"><a @click= "tvPower('off')" class="waves-effect waves-light red white-text "><i class="material-icons white-text ">power_settings_new</i>TV OFF</a></li>
       <li v-if= "rxSelected != 'all'" class = "btn-power"><a @click= "tvPower('on')" class="waves-effect waves-light green white-text "><i class="material-icons white-text ">power_settings_new</i>TV ON</a></li>
    </ul>
   
      
  </div>
</template>

<script>

export default {
  name: 'Sidenav',
  props:["vwConfigs","vwSelected","vwStatus","sourceNames","rxSelected","tvNamesZones"],
  data () {
    return {
          change:false,
          bg_image:'',
          input: 1,
    }
  },
  computed:{
    // a computed getter
    videoWallType: function () {
      // return vwType for video wall selected fro home page
      return  this.vwConfigs[this.vwSelected].vwType
    }
  
  },
  methods:{
      inputSelect(index){ 
          this.input = index + 1
          this.$emit('msg-inputSelected',{source:this.input}) // 
          if(this.input < 10){
            this.input = `00${this.input}`

          }else{
             this.input = `0${this.input}`
          }
      },
      send(index){
         this.inputSelect(index)
         console.log(this.vwStatus)
        //  console.log(this.vwStatus.vwMode)
        // Single RX  , non video wall mode
          if(this.vwStatus.vwMode == 0){

             if( this.vwStatus.rxSelected == 'all'){
                  this.tvNamesZones.forEach((item,index)=>{
                    console.log(`http://172.31.3.${index+1}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${index+1}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  })
             }else{
                  console.log(`http://172.31.3.${this.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  fetch(`http://172.31.3.${this.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
             }
         
          }
          //Video Wall 3x3 Modes
          else if(this.vwStatus.vwMode  == 3300){
              M.toast({ html: `3x3 independent MODE`, classes: "rounded blue"})
              this.vwOff(this.switchSingleDisplay())
  
          }else if(this.vwStatus.vwMode  == 3322){
              M.toast({ html: `3x3 2x2 MODE`, classes: "rounded blue"})
              this.vwOff(this.switch2x2In3x3())

          }else if(this.vwStatus.vwMode  == 3323){
              M.toast({ html: `3x3 2x3 MODE`, classes: "rounded blue"})
              this.vwOff(this.switch2x3In3x3())
          
          }else if(this.vwStatus.vwMode  == 3333){
              M.toast({ html: `3x3 3x3 MODE`, classes: "rounded blue"})
              this.vwOff(this.switch3x3())
      
          //Video Wall 2x2 Modes
          }else if(this.vwStatus.vwMode == 2201 ){  // show as a 2x2 Big screen
              M.toast({ html: `2x2 2x2 MODE`, classes: "rounded blue"})
              this.vwOff(this.switch2x2())
            
          }else if(this.vwStatus.vwMode ==2200){ // show 2x2 independent screens
              M.toast({ html: `2x2 independent MODE`, classes: "rounded blue"})
              this.vwOff(this.switchSingleDisplay())

          //Video Wall 1x3 Modes
          }else if(this.vwStatus.vwMode ==1301){// show 1x3 independent screens
               M.toast({ html: `1x3MODE`, classes: "rounded blue"})
              this.vwOff(this.switch1x3())
          }

          //Video Wall 2x3 Modes
          else if(this.vwStatus.vwMode  == 2300){
              M.toast({ html: `2x3 independent MODE`, classes: "rounded blue"})
              this.vwOff(this.switchSingleDisplay())
  
          }else if(this.vwStatus.vwMode  == 2322){
              M.toast({ html: `2x3 2x2 MODE`, classes: "rounded blue"})
              this.vwOff(this.switch2x2In2x3())

          }else if(this.vwStatus.vwMode  == 2323){
              M.toast({ html: `2x3 2x3 MODE`, classes: "rounded blue"})
              this.vwOff(this.switch2x3())
          
          }else{

          }

      },

      vwOff(callback){
        let rxId = this.vwConfigs[this.vwSelected].baseID
        for(let i = 0;i<=8;i++) {
         // fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=vw:off`)
          rxId++
        }   
        callback()      
      },
      switchSingleDisplay(){
        let delay = 2000; //ms
        setTimeout((()=>{
          if(this.vwStatus.rxSelected != ''){
              console.log(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
              fetch(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
          }
        }),delay)
      },
      switch2x2(){
        let delay = 2000; //ms
        setTimeout((()=>{
            let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
            let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
            let rxId= this.vwConfigs[this.vwSelected].baseID
            for( let row = 0; row<=1; row++){
                for( let column = 0; column<=1 ; column++){
                  console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_1%3Be%20e_vw_enable_1_1_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                  fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_1%3Be%20e_vw_enable_1_1_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
              rxId++
                }
            }
        }),delay)
      },
      switch2x3(){
        let delay = 2000; //ms
        setTimeout((()=>{
            let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
            let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
            let rxId= this.vwConfigs[this.vwSelected].baseID
            for( let row = 0; row<=1; row++){
                for( let column = 0; column<=2 ; column++){
                  console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_2%3Be%20e_vw_enable_1_2_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                  fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_2%3Be%20e_vw_enable_1_2_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
              rxId++
                }
            }
        }),delay)
      },
  
      switch3x3(){
        let delay = 2000; //ms
        setTimeout((()=>{
              let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
              let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
              let rxId= this.vwConfigs[this.vwSelected].baseID
              for( let row = 0; row<=2; row++){
                  for( let column = 0; column<=2 ; column++){
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_2_2%3Be%20e_vw_enable_2_2_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_2_2%3Be%20e_vw_enable_2_2_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                rxId++
                  }
              }
        }),delay)

      }, 
      switch2x2In2x3(){
        let delay = 2000; //ms
        setTimeout((()=>{
              let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
              let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
              let rxId = '';
              const rxSelected = parseInt(this.vwStatus.rxSelected)
              const baseId = parseInt(this.vwConfigs[this.vwSelected].baseID)
     
            // 1. switch RXbaseID 1-4 to input 
            // 2. set to 2x2 VM 
            // Check display selected is the video wall
            if( rxSelected == baseId ){
              
                for( let row = 0; row<=1; row++){
                  for( let column = 0; column<=1 ; column++){
                    if(row == 0 && column ==0){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID)
                    }else if(row == 0 && column ==1){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) +1
                    }else if(row == 1 && column ==0){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) +3
                    }else if(row == 1 && column ==1){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) +4
                    }
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_1%3Be%20e_vw_enable_1_1_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_1%3Be%20e_vw_enable_1_1_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
               
                  }
              }

            }else{
             
                // Don't switch 2x2 video if non video wall displays selected
            }
         
            // 3. Switch any single display 
                if(this.vwStatus.rxSelected != ''){
                    console.log(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
          }
        }),delay)

      },
      switch2x2In3x3(){
        let delay = 2000; //ms
        setTimeout((()=>{
              let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
              let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
              let rxId = '';
              const rxSelected = parseInt(this.vwStatus.rxSelected)
              const baseId = parseInt(this.vwConfigs[this.vwSelected].baseID)
     
            // 1. switch RXbaseID 1-4 to input 
            // 2. set to 2x2 VM 
            // Check display selected is the video wall
            if( rxSelected == baseId ){
              
                for( let row = 0; row<=1; row++){
                  for( let column = 0; column<=1 ; column++){
                    if(row == 0 && column ==0){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID)
                    }else if(row == 0 && column ==1){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) +1
                    }else if(row == 1 && column ==0){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) +3
                    }else if(row == 1 && column ==1){
                      rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) +4
                    }
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_1%3Be%20e_vw_enable_1_1_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_1%3Be%20e_vw_enable_1_1_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
               
                  }
              }

            }else{
             
                // Don't switch 2x2 video if non video wall displays selected
            }
         
            // 3. Switch any single display 
                if(this.vwStatus.rxSelected != ''){
                    console.log(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
          }
        }),delay)

      },
      switch2x3In3x3(){
        let delay = 2000; //ms
        setTimeout((()=>{
              let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
              let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
              let rxId = parseInt(this.vwConfigs[this.vwSelected].baseID)
              const rxSelected = parseInt(this.vwStatus.rxSelected)
              const baseId = parseInt(this.vwConfigs[this.vwSelected].baseID)
             
            // 1. switch RXbaseID 1-6 to input
            // 2. set to 2x3 VM mode
            if( rxSelected == baseId ){
                for( let row = 0; row<=1; row++){
                  for( let column = 0; column<=2 ; column++){
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_2%3Be%20e_vw_enable_1_2_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                    fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_1_2%3Be%20e_vw_enable_1_2_${row}_${column}%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_refresh_pos_idx_${row}_${column}`)
                    rxId++
                  }
                }
              
            }else{
               // Don't switch 2x3 video if non video wall displays selected
            }
 
            // 3. Switch any single display 
            if(this.vwStatus.rxSelected != ''){
                console.log(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                fetch(`http://172.31.3.${this.vwStatus.rxSelected}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
            }
        }),delay)

      },
      switch1x3(){
        let delay = 2000; //ms
        setTimeout((()=>{
            let _vw = (this.vwConfigs[this.vwSelected].hw*2).toString()
            let _vh = (this.vwConfigs[this.vwSelected].vh).toString()
            let rxId= this.vwConfigs[this.vwSelected].baseID
            //ClockWise Rotation
            for( let row = 2; row>=0 ; row--){
                  console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_0_2%3Be%20e_vw_enable_2_0_${row}_0%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_rotate_6`)
                  fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:${this.input}`)
                  fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=e%20e_vw_pos_layout_0_2%3Be%20e_vw_enable_2_0_${row}_0%3Be%20e_vw_moninfo_${_vw}_200_${_vh}_100%3Be%20e_vw_rotate_6`)
                   rxId++
            }
        }),delay)
      },
      changeBackgroundImage(){
        //Show TX Preview
        fetch(`http://172.31.2.${this.input}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
        this.bg_image = `http://172.31.2.${this.input}/images/capture.jpg?d=${Date.now()}`
    },

    // TV On or Off via CeC
    tvPower(_onOff){
      //console.log('vw selected is',this.vwSelected)
      let cec_off = `cec_send 20:36` 
      let cec_on = `cec_send 20:04`

      if(this.vwSelected === ''){
          if(_onOff == 'off'){
              //console.log(`http://172.31.3.${this.rxSelected}/cgi-bin/query.cgi?cmd=${cec_off}`)
              fetch(`http://172.31.3.${this.rxSelected}/cgi-bin/query.cgi?cmd=${cec_off}`)
              M.toast({ html: `TV off`, classes: "rounded red"})
          }else{
              //console.log(`http://172.31.3.${this.rxSelected}/cgi-bin/query.cgi?cmd=${cec_on}`)
                fetch(`http://172.31.3.${this.rxSelected}/cgi-bin/query.cgi?cmd=${cec_on}`)
                M.toast({ html: `TV on`, classes: "rounded green"})
          }
      }else {
       
          let startRX = this.vwConfigs[this.vwSelected].baseID
          let endRX = this.vwConfigs[this.vwSelected].endID
          if(_onOff == 'off'){
              for(let i=startRX;i<=endRX;i++ ){
                 console.log(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=${cec_off}`)
                 fetch(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=${cec_off}`)
              }
              M.toast({ html: `TV off`, classes: "rounded red"})
          }else{
              for(let i=startRX;i<=endRX;i++ ){
                  console.log(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=${cec_on}`)
                  fetch(`http://172.31.3.${i}/cgi-bin/query.cgi?cmd=${cec_on}`)
              }
              M.toast({ html: `TV on`, classes: "rounded green"})
          }
        
      }
  
    }
 
  },
  mounted(){
    M.AutoInit() // For Materialize to work!

  },
  created(){
    // Start Snap Shot Preview capture
    this.snapshot = setInterval(this.changeBackgroundImage,2500) 
  },


}
</script>

<style scoped>
li{
  /* border:1px solid red; */
}
.videoInputSelects{
  display:flex;
  flex-direction: row;
}
.inputPreviewItem {
  display:flex;
  justify-content: flex-start;
  align-content: center;
  border:1px solid grey;
  border-radius:5px;
  margin-top:5px;
  margin-bottom:5px;
  width:50%;
}
.inputSendItem{
  display:flex;
  justify-content: center;
  align-content: center;
  width:50%;
}
.inputIcon{
   color: grey;
   vertical-align: center;
   font-size: 20px !important;
}
.sourcePreview{
  background-image: url("../assets/images/capture.jpg");
  background-size: cover;
  margin:5px;
  height:20%;
  display:flex;
  justify-content: center;
  align-items:center;
}
.btn{
background-color:#2196f3
}
.btn-power{
  margin:20px
}

</style>