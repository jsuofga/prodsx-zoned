<template>

 <div class="videowall">
    <h5 class = 'white-text'>{{vwConfigs[vwSelected].name}}</h5>

     <div class = 'container'>
        <div  v-if = 'vw_mode === 2201 ' class = "vw2x2" v-bind:style="{ backgroundImage: 'url(' + bg_image + ')'}">
          <div class = "grid-item sidenav-trigger" data-target="slide-out"  v-bind:class="{my_active: vwActive[0].state}"><div class = 'pin'><button @click= "Set_VW_mode(2201)"  class="roundBtn" ><i class="material-icons ">crop_din</i></button></div><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)}}</div></div></div>
          <div class = "grid-item sidenav-trigger" data-target="slide-out"  v-bind:class="{my_active: vwActive[1].state}"><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)+1}}</div></div></div>
          <div class = "grid-item sidenav-trigger" data-target="slide-out"  v-bind:class="{my_active: vwActive[2].state}"><div class = 'pin'><button @click= "Set_VW_mode(2200)" class="roundBtnOff"><i class="material-icons">border_all</i></button></div><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)+2}}</div></div></div>
          <div class = "grid-item sidenav-trigger" data-target="slide-out"  v-bind:class="{my_active: vwActive[3].state}"><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)+3}}</div></div></div>
        </div>

        <div v-else class = "vw2x2">
          <div @click= "displaySelect(0)" class = "grid-item sidenav-trigger Q-1" data-target="slide-out" v-bind:class="{my_active: vwActive[0].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[0] + ')'}"><div class = 'pin'><button @click= "Set_VW_mode(2201)" class="roundBtn" ><i class="material-icons">crop_din</i></button></div><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)}}</div></div></div>
          <div @click= "displaySelect(1)" class = "grid-item sidenav-trigger Q-2" data-target="slide-out" v-bind:class="{my_active: vwActive[1].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[1] + ')'}"><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)+1}}</div></div></div>
          <div @click= "displaySelect(2)" class = "grid-item sidenav-trigger Q-3" data-target="slide-out" v-bind:class="{my_active: vwActive[2].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[2] + ')'}"><div class = 'pin'><button @click= "Set_VW_mode(2200)" class="roundBtnOff"><i class="material-icons">border_all</i></button></div><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)+2}}</div></div></div>
          <div @click= "displaySelect(3)" class = "grid-item sidenav-trigger Q-4" data-target="slide-out" v-bind:class="{my_active: vwActive[3].state}" v-bind:style="{ backgroundImage: 'url(' + bg_images[3] + ')'}" ><div class = 'rxLabel-outer'><div class = 'rxLabel'>{{parseInt(vwConfigs[vwSelected].baseID)+3}}</div></div></div>
        </div>
     </div>
       <!-- Floating Action Button -->
      <div class="fixed-action-btn">
          <a @click = "stopSnapShot" class="btn-floating btn-large blue">
            <router-link to="/"><i class=" material-icons">home</i></router-link>
          </a>
      </div>

</div>

</template>

<script>
export default {
  name: 'videowall2x2',
  props: ["inputSelected","vwConfigs","vwSelected"],

  data () {
    return {
        vwActive : [{state:false},{state:false},{state:false},{state:false}],
        vw_mode: 2200, //2201 = 2x2 mode, 2200 = single displays
        bg_image: '',
        bg_images: [0,1,2,3],
        counter:1,
    }
  },
  watch:{
    inputSelected: {
        handler:function(){
            this.counter = 1
            setTimeout(()=>{
                this.vwActive = [{state:false},{state:false},{state:false},{state:false}]
            }, 3000)
        },
        deep:true,
    }
  },
  methods:{
     Set_VW_mode(_mode){
      this.vw_mode = _mode
      this.$emit('msg-vwStatus',{vwMode:this.vw_mode, rxSelected: ''}) // Video wall mode

      if(this.vw_mode == 2201){ // 2x2 video wall 
       // event.stopPropagation() // stops bubbling up
        for( let i=0;i<=3; i++){
          this.vwActive[i].state = true
        }
      }else {  // individual displays
        event.stopPropagation() // stops bubbling up
        this.vwOff()
        for( let i=0;i<=3; i++){
            this.vwActive[i].state = false
        }
      }
    },
    vwOff(){
        let rxId = this.vwConfigs[this.vwSelected].baseID
        for(let i = 0;i<=3;i++) {
          // Turn off video wall
          fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=vw:off`)
          // Switch 2x2 displays to TX1, TX2, TX3, TX4
          fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=rxswitch:00${i+1}`)
          rxId++
        }
        
    },
    displaySelect(_display){        
        this.$emit('msg-vwStatus',{vwMode:this.vw_mode, rxSelected: parseInt(this.vwConfigs[this.vwSelected].baseID) + _display}) //
    },
    changeBackgroundImage(){
       console.log('counter',this.counter)
       console.log(this.vwConfigs)
        if(this.vw_mode === 2201){
            let rxId = this.vwConfigs[this.vwSelected].baseID
            fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
            this.bg_image = `http://172.31.3.${rxId}/images/capture.jpg`+ '?d=' + Date.now();

        }else{

            let rxId = this.vwConfigs[this.vwSelected].baseID
            this.vwActive = [{state:false},{state:false},{state:false},{state:false}]
            if(this.counter <= 3 ){
              fetch(`http://172.31.3.${rxId-1 + this.counter}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              this.bg_images[this.counter-1] = `http://172.31.3.${rxId-1 + this.counter}/images/capture.jpg?d=${Date.now()}`
              this.counter++

            }else{
              fetch(`http://172.31.3.${rxId-1 + this.counter}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
              this.bg_images[this.counter-1] = `http://172.31.3.${rxId-1 + this.counter}/images/capture.jpg?d=${Date.now()}`
              this.counter = 1
            }
        }
    },
    determine_snapshot_mode(){

       //Check vw_max_row,vw_max_column for top left RX and top right RX . 0,0 = (mode =2200) ; 1,1 = ( mode = 2201)
       let rx1_vw_max_row = '' //top left rx of 2x2 vw
       let rx1_vw_max_column = '' //top left rx of 2x2 vw
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
                this.vw_mode = 2200
                console.log(this.vw_mode)
              }else if(rx1_vw_max_row == 1 && rx1_vw_max_column == 1) {
                this.vw_mode = 2201
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
    this.snapShot = setInterval(this.changeBackgroundImage,3000)

  },
  beforeDestroy(){
     //alert('destroyed-videowall2x2.vue')
     clearInterval(this.snapShot)
  }
}
</script>

<style scoped>
.videowall{
  display:flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  background-color: rgb(28,28,30);
  height:100vh;
}
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height:60vh;
    width: 90%;
}
.vw2x2{
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    height:100%;
    background-size: cover;
}
.grid-item{
   border:2px solid #2c3e50 ;
   color:white;
   display:flex;
   justify-content:flex-end;
   align-items: flex-end;
   cursor: pointer;
}
.rxLabel-outer{
  display:flex;
  justify-content: center;
  width: 100%
}
.rxLabel{
   color:white
}
.pin{
  display:flex;
  position:absolute;
}
.roundBtn{
  background-color: #43a047;
  color:white;
  padding:15px;
  border:0px;
  border-radius: 20%;
  position:relative;
  top:30px;
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
  left:25px;
}
.my_active{
  background-color: blue
}
.Q-1,.Q-2,.Q-3,.Q-4{
  background-size: cover;
}
#bezelAdjust{
  margin-top: 50px;
  display:flex;
  justify-content: center;
  cursor: pointer;
}
.modal-content-admin{
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction:column
}
form{
  width:80%
}
i{
  transform: scale(1)
}

</style>