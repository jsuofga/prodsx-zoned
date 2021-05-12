<template>

  <div class="zone">
         <div class = "preview tvPreview"  v-bind:style="{ backgroundImage: 'url(' + bg_image + ')'}">
            <div id = 'rx-title'><h5 class = "black-text valign-wrapper">{{tvSelected}}</h5></div>
         </div>

      <!-- RX buttons section -->
          <div class = 'grid-container'>
            <div v-for="(item, index) in tvsInZone" :key="index" class='grid-item'>
                <div data-target="slide-out" @click= "rxSelected(item)" class="rx-btn-large sidenav-trigger center-align"  style= 'color:black'><small>{{item.name}}</small><small  class = 'rx-id'>{{item.rxId}}</small></div>
                <div class = 'feedbackRX'>{{RxFeedback[index]}}</div>
            </div>
          </div>

        <!-- Floating Action Button -->
          <div class="fixed-action-btn ">
              <a id = 'homeBtn' class="btn-floating btn-large  blue">
                <router-link to="/"><i class="large material-icons ">home</i></router-link>
              </a>
          </div>

  </div>
</template>

<script>

export default {
  name: 'Zone',
  props:['zoneNames','tvNames','tvNamesZones','zones',"sourceNames","zoneSelected"],
  data () {
    return {
      zoneTVs:[],    // list all rx/tvs in zone name: (...)
      RxFeedback: [],  //  TX channel each RX is switched to
      rx: 1  , // rx selected. 1,2,.....
      tvSelected: '',    // name of tv
      bg_image: ''
    }
  },
  computed:{
      tvsInZone: function(){
         // Filter all the TVs that are in Zone
         this.zoneTVs = this.tvNamesZones.filter((item,index) => item.zoneId == this.zoneSelected )
          console.log(`displays in zone${this.zoneSelected} are`,this.zoneTVs)
          return (this.zoneTVs)
      },
  },
  methods:{
    firstRxIdInZone: function(){
        // Filter all the TVs that are in Zone
          this.zoneTVs = this.tvNamesZones.filter((item,index) => item.zoneId == this.zoneSelected)
          console.log('First RX is ', this.zoneTVs[0].rxId)
          this.rx = this.zoneTVs[0].rxId
          this.tvSelected = this.zoneTVs[0].name
    },

    rxSelected(item){
        this.rx = item.rxId 
        this.tvSelected = item.name
        //console.log(tvSelected)
        this.$emit('msg-rxSelected', parseInt(item.rxId)) // rx  = 1,2,3
    },
     RxChSelect(){
        this.zoneTVs.forEach((item,index)=>{
          fetch(`http://172.31.3.${this.zoneTVs[index].rxId}/cgi-bin/query.cgi?cmd=astparam g ch_select`)
            .then( res => {
                return res.text()
            })
            .then( data => {
                //console.log(data)
                this.RxFeedback[index] = this.sourceNames[parseInt(data)-1]
                this.RxFeedback = JSON.parse(JSON.stringify(this.RxFeedback )) //convert the object of Vue to normal object!  Very strange. Solution suggested by Evan You
            })
        })
     },
      changeBackgroundImage(){
          fetch(`http://172.31.3.${this.rx}/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 60 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg`)
          this.bg_image = `http://172.31.3.${this.rx}/images/capture.jpg`+ '?d=' + Date.now();
    },
  },

  // Life Cycle Hooks
  mounted(){
    M.AutoInit() // For Materialize to work!

  },
  created(){
    this.firstRxIdInZone()
    let getRxStatus = setInterval(this.RxChSelect,10000)
    this.snapShot = setInterval(this.changeBackgroundImage,2500)
  },
    beforeDestroy(){
     clearInterval(this.getRxStatus)
     clearInterval(this.snapShot)
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.zone{
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width:100%;
  height:100vh;
  box-sizing: border-box;
  background-color: rgb(28,28,30);
}
.preview{
  /* border:1px solid green; */
  width:50%;

}
.grid-container {
  color:white;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  justify-content: center;
  align-items:start ;
  grid-gap: 5px;
  width:90%;
  height:65vh;
  position: relative;
  /* border:1px solid red  */
}
.grid-item{
  display:flex;
  flex-direction: column;
  align-items: center;
  /* border:1px solid green; */
}
.rx-btn-large{
  background-color:white;
  border-radius: 4px;
  width:100%;
  padding:12px;
  position:relative;

}
.rx-id{
  position:absolute;
  color:black;
  top:5px;
  right: 5px
}

small{
    text-transform: capitalize;
    color:black
}
span{
  position:absolute;
  color:grey;
  padding:0px;
  top:-20px;
  right:0px;
  transform: scale(.7);
}
.btn-large:hover{
  background-color:#2196f3  !important ;
  color:white !important;
}
.modal-footer{
  display:flex;
  justify-content: center;
  align-items:center;
  /* border:1px solid red */

}
.tvPreview{
  background-image: url("../assets/images/capture.jpg");
  background-size: cover;
  margin:5px;
  width: 512px;
  height:384px;
  display:flex;
  justify-content: center;
  align-items:center;
  border:1px solid #2c3e50;
  border-radius:5px;
  position:relative
}
#rx-title{
  position:absolute;
  display:flex;
  justify-content: center;
  top:0px;
  background-color: rgb(255,255,255);
  width:30%;
  height:30px;
  text-transform: uppercase;
}


</style>