<template>
  <div id="app">
    <Navbar
     v-bind:tvNamesZones= "tvNamesZones"

    
    />
    <Sidenav 
      @msg-inputSelected = "Set_inputSelected"
      v-bind:vwStatus= "vwStatus" 
      v-bind:vwConfigs = "vwConfigs"
      v-bind:vwSelected = "vwSelected"
      v-bind:sourceNames= "sourceNames" 
      v-bind:rxSelected= "rxSelected"
      v-bind:tvNamesZones= "tvNamesZones"
    /> 
    <router-view
       @msg-vwStatus = "Set_VideoWallStatus"
       @msg-vwConfigs = "Set_vwConfigs"
       @msg-vwSelected = "Set_vwSelected"
       @msg-zoneNames = "Set_zoneNames"
       @msg-tvNamesZones = "Set_tvNamesZones"
       @msg-zoneSelected= "Set_zoneSelected"
       @msg-sourceNames = "Set_sourceNames"
       @msg-rxSelected = "Set_rxSelected"
       
    
       v-bind:inputSelected= "inputSelected" 
       v-bind:vwConfigs = "vwConfigs"
       v-bind:vwSelected = "vwSelected"
       v-bind:vwStatus= "vwStatus"
       v-bind:zoneNames= "zoneNames" 
       v-bind:sourceNames= "sourceNames" 
       v-bind:tvNames= "tvNames" 
       v-bind:zones= "zones"
       v-bind:zonesId= "zonesId"
       v-bind:tvNamesZones= "tvNamesZones"
       v-bind:zoneSelected = "zoneSelected"
    />
  </div>
</template>

<script>
import M from 'materialize-css'
import Navbar from '@/components/Navbar'
import Home from '@/components/Home'
import Sidenav from '@/components/Sidenav'
import VideowallConfig from '@/components/VideowallConfig'
import Videowall2x2 from '@/components/Videowall2x2'
import Videowall2x3 from '@/components/Videowall2x3'
import Videowall3x3 from '@/components/Videowall3x3'
import Videowall1x3 from '@/components/Videowall1x3'
import Name_zones from '@/components/Name_zones'
import Name_inputs from '@/components/Name_inputs'
import Name_outputs from '@/components/Name_outputs'
import Zone from '@/components/Zone'


export default {
  name: 'App',
  components:{
    Navbar,
    Home,
    Sidenav,
    VideowallConfig,
    Videowall2x2,
    Videowall2x3,
    Videowall3x3,
    Videowall1x3,
    Name_zones,
    Name_inputs,
    Name_outputs,
    Zone,

  },
  Sidenavwatch:{

  },
  data () {
    return {
        inputSelected :{source:'', toggle:''},
        vwConfigs:'', //[{name:'',vwType:, baseID:,endID:endID, hw:, vh:},...]
        vwSelected:'',  // 
        vwStatus:  {vwMode:'', rxSelected: '' }, // Tracks which mode and which rx has been clicked {vwMode:mode, rxSelected: ''})
        zoneNames: [],
        sourceNames:[],
        tvNames:[],
        zones:[],  
        zonesId:[], 
        tvNamesZones:[],  //[{rxId: 1,name:TV1,zoneId: 2,zone:vip room},{rxId: 2,name:TV2,zoneId: 2,zone:vip room},...]
        zoneSelected: 1,
        rxSelected: 1, 
    }
},

  methods:{
    Set_VideoWallStatus(payload){
      this.vwStatus = payload
      console.log('chris',this.vwStatus)
    },
    Set_inputSelected(payload){
      this.inputSelected.source = payload.source
      this.inputSelected.toggle = !this.inputSelected.toggle 
    },
    Set_vwConfigs(payload){
      this.vwConfigs = payload
   },
    Set_vwSelected(payload){
      this.vwSelected = payload
   },
   Set_zoneNames(payload){
     //console.log('zoneName Payload', payload)
     this.zoneNames = payload
   }, 
   Set_tvNamesZones(payload){
      this.tvNamesZones = payload
      // clear arrays before re-pushing 
        this.tvNames = []
        this.zones = []
        this.zonesId = []

     payload.forEach((item,index)=>{
        this.tvNames.push(item.name)
        this.zones.push(item.zone)
        this.zonesId.push(item.zoneId)
     })
   },
  Set_zoneSelected(payload){
        this.zoneSelected = payload.zoneId
  }, 
  Set_sourceNames(payload){
        this.sourceNames = payload
  },  
  Set_rxSelected(payload){
        this.vwStatus.vwMode = 0
        this.vwStatus.rxSelected = payload
        this.rxSelected = payload  
  },
   
  readFromTx(){
        // videoWalls
        fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam g vwConfigs_DB")
        .then(response => response.text())
        .then((data) => {
            // console.log(data)
            let vwConfigs_JSON = data.replace(/([\s\w.-]+)/g,'"$1"') //Add in the double " " quotation marks to make it in JSON format valid
            let vwConfigs_OBJ = JSON.parse(vwConfigs_JSON)
            this.vwConfigs = vwConfigs_OBJ
            console.log('This is vwConfigs',this.vwConfigs)
        })
        //zoneNames
        fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam g zoneNames_DB")
        .then(response => response.text())
        .then((data) => {
            //console.log(data)
            let zoneNames_JSON = data.replace(/([\s\w.-]+)/g,'"$1"') //Add in the double " " quotation marks to make it in JSON format valid
            let zoneNames_OBJ = JSON.parse(zoneNames_JSON)
            this.zoneNames = zoneNames_OBJ 
            console.log('This is zoneNames',this.zoneNames)
        })
        //tvNamesZones_DB
        fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam g tvNamesZones_DB")
        .then(response => response.text())
        .then((data) => {
            //console.log(data)
            let tvNamesZones_JSON = data.replace(/([\s\w.-]+)/g,'"$1"') //Add in the double " " quotation marks to make it in JSON format valid
            let tvNamesZones_OBJ = JSON.parse(tvNamesZones_JSON)
            this.tvNamesZones = tvNamesZones_OBJ 
            this.tvNamesZones.forEach((item,index)=>{
            this.tvNames.push(item.name)
            this.zones.push(item.zone)
            this.zonesId.push(item.zoneId)
            })
             console.log('This is tvNamesZones',this.tvNamesZones)
        })
        //sourceNames_DB
        fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam g sourceNames_DB")
        .then(response => response.text())
        .then((data) => {
            //console.log(data)
            let sourceNames_JSON = data.replace(/([\s\w.-]+)/g,'"$1"') //Add in the double " " quotation marks to make it in JSON format valid
            let sourceNames_OBJ = JSON.parse(sourceNames_JSON)
            this.sourceNames= sourceNames_OBJ 
            console.log('This is sourceNames',this.sourceNames)
        })
    }
    
  },

  //Lifecycle Hooks
  mounted () {
    M.AutoInit() //Materialize Init
    this.readFromTx()
  },

}

</script>

<style >

#app {
  box-sizing: border-box; 
  background-color: #2c3e50;
  height:100vh
}
 
</style>
