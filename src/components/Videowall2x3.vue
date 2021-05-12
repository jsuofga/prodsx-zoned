<template>

 <div class="videowall">
      
     <h5 class = 'white-text'>{{vwConfigs[vwSelected].name}}</h5>
     <div class = 'container'>
        
          <div v-if = "vw_mode === 2323 " class = "vw2x3" v-bind:style="{ backgroundImage: 'url(' + bg_image + ')'}"> 
              <div class = "grid-item sidenav-trigger" data-target="slide-out" @click = "displaySelect(0)" v-bind:class="{active: vwActive[0].state}"><div class ='pin'><button @click='Set_VW_mode(2322)' class="roundBtn ">2x2</button></div> {{parseInt(vwConfigs[vwSelected].baseID)}}</div>
              <div class = "grid-item sidenav-trigger" data-target="slide-out" @click = "displaySelect(1)" v-bind:class="{active: vwActive[1].state}">{{parseInt(vwConfigs[vwSelected].baseID)+1}}</div>
              <div class = "grid-item sidenav-trigger" data-target="slide-out" @click = "displaySelect(2)" v-bind:class="{active: vwActive[2].state}">{{parseInt(vwConfigs[vwSelected].baseID)+2}}</div>
              <div class = "grid-item sidenav-trigger" data-target="slide-out" @click = "displaySelect(3)" v-bind:class="{active: vwActive[3].state}">{{parseInt(vwConfigs[vwSelected].baseID)+3}}</div>
              <div class = "grid-item sidenav-trigger" data-target="slide-out" @click = "displaySelect(4)" v-bind:class="{active: vwActive[4].state}"><div class = 'pin'><button @click='Set_VW_mode(2300)' class="roundBtnOff"><i class="material-icons">grid_on</i></button></div>{{parseInt(vwConfigs[vwSelected].baseID)+4}}</div>
              <div class = "grid-item sidenav-trigger" data-target="slide-out" @click = "displaySelect(5)" v-bind:class="{active: vwActive[5].state}"><div class = 'pin'><button @click='Set_VW_mode(2323)' class="roundBtn">2x3</button></div>{{parseInt(vwConfigs[vwSelected].baseID)+5}}</div>
          </div>

          <div v-else-if = "vw_mode === 2300 " class = "vw2x3" >
              <div class = "grid-item sidenav-trigger Q-1" data-target="slide-out" @click = "displaySelect(0)" v-bind:class="{active: vwActive[0].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[0] + ')'}"><div class ='pin'><button @click='Set_VW_mode(2322)' class="roundBtn ">2x2</button></div> {{parseInt(vwConfigs[vwSelected].baseID)}}</div>
              <div class = "grid-item sidenav-trigger Q-2" data-target="slide-out" @click = "displaySelect(1)" v-bind:class="{active: vwActive[1].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[1] + ')'}">{{parseInt(vwConfigs[vwSelected].baseID)+1}}</div>
              <div class = "grid-item sidenav-trigger Q-3" data-target="slide-out" @click = "displaySelect(2)" v-bind:class="{active: vwActive[2].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[2] + ')'}">{{parseInt(vwConfigs[vwSelected].baseID)+2}}</div>
              <div class = "grid-item sidenav-trigger Q-4" data-target="slide-out" @click = "displaySelect(3)" v-bind:class="{active: vwActive[3].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[3] + ')'}">{{parseInt(vwConfigs[vwSelected].baseID)+3}}</div>
              <div class = "grid-item sidenav-trigger Q-5" data-target="slide-out" @click = "displaySelect(4)" v-bind:class="{active: vwActive[4].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[4] + ')'}"><div class = 'pin'><button @click='Set_VW_mode(2300)' class="roundBtnOff"><i class="material-icons">grid_on</i></button></div>{{parseInt(vwConfigs[vwSelected].baseID)+4}}</div>
              <div class = "grid-item sidenav-trigger Q-6" data-target="slide-out" @click = "displaySelect(5)" v-bind:class="{active: vwActive[5].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[5] + ')'}"><div class = 'pin'><button @click='Set_VW_mode(2323)' class="roundBtn">2x3</button></div>{{parseInt(vwConfigs[vwSelected].baseID)+5}}</div>
          </div>

          <div v-else-if = "vw_mode === 2322"  class = "vw2x3_2x2mode" >
                  <div class = "grid-item sidenav-trigger Q-1245 " data-target="slide-out" @click = "displaySelect(0)"  v-bind:class="{active: vwActive[0].state}" v-bind:style="{ backgroundImage: 'url(' + bg_image + ')'}">{{parseInt(vwConfigs[vwSelected].baseID)}}</div>
                  <div class = "grid-item sidenav-trigger Q-3" data-target="slide-out" @click = "displaySelect(2)" v-bind:style="{ backgroundImage: 'url(' + bg_images[2] + ')'}" >{{parseInt(vwConfigs[vwSelected].baseID)+2}}</div>
                  <div class = "grid-item sidenav-trigger Q-6" data-target="slide-out" @click = "displaySelect(5)" v-bind:style="{ backgroundImage: 'url(' + bg_images[5] + ')'}"  ><div class = 'pin'><button @click='Set_VW_mode(2323)' class="roundBtn">2x3</button></div>{{parseInt(vwConfigs[vwSelected].baseID)+5}}</div>
          </div>


      </div>

        <!-- Floating Action Button -->
        <div class="fixed-action-btn">
            <a @click = "stopSnapShot" class="btn-floating btn-large blue">
              <router-link to="/"><i class="large material-icons">home</i></router-link>
            </a>
        </div>

</div>

</template>

<script>

import Sidenav from './Sidenav.vue'
export default {
  components: { Sidenav },
  name: 'videowall2x3',
  props: ["inputSelected","vwConfigs","vwSelected"],
  data () {
    return {
        vw_mode: 2323 ,//2322 = 2x2, 2323 =2x3, 2300 = single displays
        vwActive : [{state:false},{state:false},{state:false},{state:false},{state:false},{state:false}],
        bg_image: "",
        bg_images: [0,1,2,3,4,5],
        counter:1,
        doChangeBackground:true
    }
  },
  computed:{

  },
watch:{
    inputSelected: {
        handler:function(){
            // this.counter = 1
            this.doChangeBackground = true
            clearInterval(this.snapShot)
            this.snapShot =  setInterval(this.changeBackgroundImage,3000)
   
            setTimeout(()=>{
                this.vwActive = [{state:false},{state:false},{state:false},{state:false},{state:false},{state:false}]
            }, 100)
        },
        deep:true,
    }
  },
  methods:{

    Set_VW_mode(_mode){
      this.vw_mode = _mode
      console.log('vw mode = ' + this.vw_mode)
      this.doChangeBackground = false
      this.$emit('msg-vwStatus',{vwMode:this.vw_mode, rxSelected: ''}) // Video wall mode

      if(this.vw_mode == 2323){
        event.stopPropagation() // stops bubbling up 
        for( let i=0;i<=5; i++){
          this.vwActive[i].state = true
        }
      }else if (this.vw_mode == 2322) {
         event.stopPropagation() // stops bubbling up 
        this.vwOff()
        this.bg_image = ``  //blank
        for( let i=0;i<=5; i++){
          this.vwActive[i].state = false
        }
        for(let i=0;i<=1; i++){
          this.vwActive[i].state = true
        }
        for(let i=3;i<=4; i++){
          this.vwActive[i].state = true
        }
      }else if(this.vw_mode == 2300){
        event.stopPropagation() // stops bubbling up 
        this.vwOff()
        for( let i=0;i<=5; i++){
        this.vwActive[i].state = true
        
        }
      }
    },
    displaySelect(_display){
        this.$emit('msg-vwStatus',{vwMode:this.vw_mode, rxSelected: parseInt(this.vwConfigs[this.vwSelected].baseID) + _display}) //
        this.doChangeBackground = false
    },
    vwOff(){
        let rxId = this.vwConfigs[this.vwSelected].baseID
        for(let i = 0;i<=5;i++) {
          // Turn off video wall
          fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=vw:off`)
          if(this.vw_mode == 2300){
            // Switch 2x3 displays to TX1, TX2, TX3, TX4
            fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:00${i+1}`)
            rxId++
          }else{
            rxId++
          }

        }
  },
    changeBackgroundImage(){
      //  console.log('counter',this.counter)
      //  console.log(this.vwConfigs)
        console.log(this.vw_mode)

        if(this.vw_mode == 2323){
           console.log('snap shot 2323')
            let rxId = this.vwConfigs[this.vwSelected].baseID
             fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
             this.bg_images[0,1,2,3,4,5] = `http://172.31.3.${rxId}/images/capture.jpg?d=${Date.now()}`
             this.bg_image = `http://172.31.3.${rxId}/images/capture.jpg`+ '?d=' + Date.now();

        }else if(this.vw_mode == 2300){
            console.log('snap shot 2300')
            console.log('counter',this.counter)
            let rxId = this.vwConfigs[this.vwSelected].baseID
            this.vwActive = [{state:false},{state:false},{state:false},{state:false},{state:false},{state:false}]

            if(this.counter <= 5 ){
            fetch(`http://172.31.3.${rxId-1 + this.counter}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
            this.bg_images[this.counter-1] = `http://172.31.3.${rxId-1 + this.counter}/images/capture.jpg?d=${Date.now()}`
            this.counter++

            }else{
             fetch(`http://172.31.3.${rxId-1 + this.counter}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              this.bg_images[this.counter-1] = `http://172.31.3.${rxId-1 + this.counter}/images/capture.jpg?d=${Date.now()}`
              this.counter = 1
            }
        }else if(this.vw_mode == 2322){
            console.log('snap shot 2322')
            console.log("counter is ", this.counter)
            console.log(this.vwActive)
            this.vwActive = [{state:true},{state:true},{state:false},{state:true},{state:true},{state:false}]
            let rxId = this.vwConfigs[this.vwSelected].baseID
            //Set rxID for 2x2 capture (not sequential). Only need to take 3 snap shots
              if(this.counter == 1){
                rxId = parseInt(this.vwConfigs[this.vwSelected].baseID)
              }else if(this.counter == 2){
                rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) + 2
              }else if(this.counter == 3 ){
                rxId = parseInt(this.vwConfigs[this.vwSelected].baseID) + this.counter + 2
              }

            // Send Capture Commands for the 2x2 vw
            if(this.counter == 1 ){
              if(this.doChangeBackground){
                this.vwActive = [{state:false},{state:false},{state:false},{state:false},{state:false},{state:false}]
                console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
                fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
                this.bg_images[0,1,3,4] = `http://172.31.3.${rxId}/images/capture.jpg?d=${Date.now()}`
                this.bg_image = `http://172.31.3.${rxId}/images/capture.jpg?d=${Date.now()}`
                this.counter++
              }else{
                //Do nothing
                console.log('do nothing')
                this.counter++
              }

            }else if(this.counter ==2){
              console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              this.bg_images[2] = `http://172.31.3.${rxId}/images/capture.jpg?d=${Date.now()}`
              this.counter++

            }else if(this.counter ==3 ){
              console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              this.bg_images[this.counter + 2] = `http://172.31.3.${rxId}/images/capture.jpg?d=${Date.now()}`
              this.counter = 1  //reset counter to 1
              

            } else{}
           
            
        }else{}
    
    },
    determine_snapshot_mode(){
       //Check vw_max_row,vw_max_column for top left RX and top right RX . 0,0 = (mode =2300) ; 1,3 = ( mode = 2323)
       let rx1_vw_max_row = '' //top left rx of 2x3 vw
       let rx1_vw_max_column = '' //top left rx of 2x3 vw
       let rxId = parseInt(this.vwConfigs[this.vwSelected].baseID)

       fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=astparam g vw_max_row`)
       .then(response => response.text())
       .then((data) => {console.log(data)
          rx1_vw_max_row  = parseInt(data)
          fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=astparam g vw_max_column`)
          .then(response => response.text())
          .then((data) => {console.log(data)
              rx1_vw_max_column = parseInt(data)
              if(rx1_vw_max_row == 0 && rx1_vw_max_column == 0){
                this.vw_mode = 2300 //single displays
                console.log(this.vw_mode)
              }else if(rx1_vw_max_row == 1 && rx1_vw_max_column == 2) {
                this.vw_mode = 2323 // 2x3 big screen
                console.log(this.vw_mode)
              }else if(rx1_vw_max_row == 1 && rx1_vw_max_column == 1) {
                this.vw_mode = 2322 //2x2 video wall mode
                console.log(this.vw_mode)
              }
          })
       })

    },
    stopSnapShot(){
        clearInterval(this.snapShot)
    }

  },


  //Life Cycle Hooks
  mounted(){
    M.AutoInit() // For Materialize to work!
  },
  created(){
    this.determine_snapshot_mode()  //Determine snapshot mode
    this.snapShot =  setInterval(this.changeBackgroundImage,3000)
    console.log('this is 2x3',this.vwConfigs)
  },
  beforeDestroy(){
     //alert('destroyed-videowall2x3.vue')
     clearInterval(this.snapShot)
  }

}
</script>

<style scoped>
.videowall{
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* border:1px solid orange; */

}
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height:47vh;
    width: 90%;
    /* border:1px solid blue; */
}
.vw2x3{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    height:100%;
    background-size: cover;
    /* background-image: url("../assets/images/capture.jpg");  */
    /* background-image: url("http://172.31.3.91/images/capture.jpg"); */
}
.vw2x3_2x2mode{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    height:100%;
}

.grid-item{
   border:2px solid #2c3e50;
   color:white;
   display:flex;
   justify-content:flex-end;
   align-items: flex-end;
   cursor: pointer;
}
.pin{
  display:flex;
  position:absolute;
   /* border:1px solid orange; */
}
.roundBtn{
  background-color: #43a047;
  color:white;
  padding:15px;
  border:0px;
  border-radius: 20%;
  position:relative;
  top:25px;
  left:30px;

}
.roundBtnOff{
  background-color:red;
  color:white;
  padding:15px;
  border:0px;
  border-radius: 20%;
  position:relative;
  top:30px;
  left:-135px;

}
.active{
   background-color: blue
}
.Q-1245{
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  /* background-image: url("../assets/images/capture.jpg");   */
  background-size: cover;
  
}
.Q-1,.Q-2,.Q-3,.Q-4,.Q-5,.Q-6,.Q-7,.Q-8,.Q-9{
  /* background-image: url("../assets/images/capture.jpg");  */
  background-size: cover;
}


</style>
