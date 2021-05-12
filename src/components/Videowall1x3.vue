<template>
 
 <div class="videowall">
      
     <h5 class = 'white-text'>{{vwConfigs[vwSelected].name}}</h5>
     <div class = 'container'>

        <div class = "vw1x3 sidenav-trigger" data-target="slide-out"  @click= "displaySelect()"  v-bind:style="{ backgroundImage: 'url(' + bg_image + ')'}" >
          <div class = "grid-item" v-bind:class="{active: vwActive[0].state}">{{parseInt(vwConfigs[vwSelected].baseID)}}</div>
          <div class = "grid-item" v-bind:class="{active: vwActive[1].state}">{{parseInt(vwConfigs[vwSelected].baseID)+1}}</div>
          <div class = "grid-item" v-bind:class="{active: vwActive[2].state}">{{parseInt(vwConfigs[vwSelected].baseID)+2}}</div>
        </div>  

      </div>

       <!-- Floating Action Button -->
      <div class="fixed-action-btn">
          <a class="btn-floating btn-large blue">
            <router-link to="/"><i class="large material-icons">home</i></router-link>
          </a>
      </div>

</div>

</template>

<script>
export default {
  name: 'videowall1x3',
  props: ["inputSelected","vwConfigs","vwSelected"],
  data () {
    return {
        vwActive : [{state:false},{state:false},{state:false}],
        vw_mode:1301, // 13 =1x3
        bg_image: '',
    }
  },
  computed:{

  },
  watch:{
    inputSelected: {
        handler:function(){
            setTimeout(()=>{
                this.vwActive = [{state:false},{state:false},{state:false}]
            }, 3000)
        },
        deep:true,
    }
  },
  methods:{
    displaySelect(){
        this.vwActive = [{state:true},{state:true},{state:true}]
        this.$emit('msg-vwStatus',{vwMode:this.vw_mode, rxSelected: parseInt(this.vwConfigs[this.vwSelected].baseID)}) //
    },

    vwOff(){
      let rxId = this.vwConfigs[this.vwSelected].baseID
      for(let i = 0;i<=2;i++) {
         console.log(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=vw:off`)
         fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=vw:off`)
         id++
      }         
  },
    changeBackgroundImage(){
      let rxId = this.vwConfigs[this.vwSelected].baseID
      fetch(`http://172.31.3.${rxId}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
      this.bg_image = `http://172.31.3.${rxId}/images/capture.jpg`+ '?d=' + Date.now();
      // this.bg_image = 'url("https://images.unsplash.com/photo-1601758063890-1167f394febb?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1291&q=80")'
          
    }

  },

  //Life Cycle Hooks
  mounted(){
     M.AutoInit() // For Materialize to work!
  },
  created(){
    this.snapShot = setInterval(this.changeBackgroundImage,3000)
  },
  beforeDestroy(){
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
    height:70vh;
    width: 90%;
    /* border:1px solid blue; */
}
.vw1x3{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 100%;
    height:100%;
    background-size: cover;
}
.grid-item{
   border:2px solid #2c3e50;
   color:white;
   display:flex;
   justify-content:flex-end;
   align-items: flex-end;
   cursor: pointer;
}
.active{
  background-color: blue
}


</style>
