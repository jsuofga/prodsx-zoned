<template>
  <div class="name-zones box ">
      <form >
            <h5>Device List | <span class ='right-align'>{{deviceListDump.length}} Devices Found</span> </h5>

      <table class = 'striped centered'>

          <thead>
            <tr>
                <th>Device</th> 
                <th>Host Name</th>
                <th>MAC</th>
                <th>MCU Version</th>
                <th>Firmware Build</th>
                <th>Firmware Version</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for= "(item,index) in deviceListDump" :key="index" >
              <td v-if = "deviceListDump[index].is_host == 'y' "  @click = 'openURL(deviceListDump[index].ip)'><small class = 'warning' v-if= "deviceIPduplicate[index] === true " >Duplicate IP!</small><a class="waves-effect waves-light blue btn-small"><i class="material-icons left"></i>TX | {{deviceListDump[index].ip}} </a> </td>
              <td v-else @click = 'openURL(deviceListDump[index].ip)' ><small class = 'warning' v-if= "deviceIPduplicate[index] === true " >Duplicate IP!</small> <a class="waves-effect waves-light orange btn-small"><i class="material-icons left"></i>RX | {{deviceListDump[index].ip}}</a></td>
              <td>{{deviceListDump[index].host_name.replace("ast3-","").replace("gateway","").replace("client","")}}</td>
              <td>{{deviceListDump[index].mac}}</td>
              <td>{{deviceListDump[index].mcu_version}}</td>
              <td>{{deviceListDump[index].fw_build}}</td>
              <td>{{deviceListDump[index].fw_version}}</td>
              <td><a @click = "open_index_fw(deviceListDump[index].ip)" class="waves-effect waves-light btn-small disabled"><i class="material-icons left">get_app</i>firmware</a></td>
            </tr>

          </tbody>
      </table>
          <div v-if = 'showProgressBar' class="progress">
              <div class="indeterminate"></div>
              
          </div>
          <div class="field center-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn ">Cancel</button>
                <button v-on:click = "scan" class="waves-effect waves-light btn blue">Scan</button>
          </div>

      </form>

  </div>

</template>

<script>

export default {
    name: 'Device_list',
    props:[],
    watch:{

    },
    data(){
        return{
           deviceListDump :[],
           deviceList_ip:[],
           showProgressBar:false,
           deviceIPduplicate: []
        }
    },
    computed:{

    },
    methods: {

      openURL(_url){
          window.open(`http://${_url}`);
      },
      open_index_fw(_url){
          window.open(`http://${_url}/index_fw.html`);
      },
      scan(){
        //e.preventDefault()
      //  M.toast({ html: `Scanning for Devices`, classes: "rounded blue" });
        this.showProgressBar = true
        this.deviceList_ip = []
   
        this.getDeviceList()
        .then(data => {
          this.getFirmwareVersionAndMAC()
          .then(data =>{ this.findDuplicateIP()})
        })

      },
      async getDeviceList(){
          this.deviceListDump = []
         // get node_list -j info
            const hostname = window.location.hostname
            // console.log(hostname)
            //const response= await fetch(`http://172.31.2.1/cgi-bin/query.cgi?cmd=node_list%20-j`)
            const response= await fetch(`http://${hostname}/cgi-bin/query.cgi?cmd=node_list%20-j`)
            const data = await response.text()

            //Process string input. 1)remove first{ and ,}' //remove first{ and ,} 2) extact all items between {}
            let testString = data.slice(1,-2)  //remove first{ and last }'
            let regex = /{\s*([^}]+)\s*}/g ;  // get all items in between {}
            let matched = testString.match(regex)  // array of value that match the regex [ ]
            console.log('matched',matched)
           // push matched items into array as objects
             matched.forEach((item,index) =>{
                this.deviceListDump.push(JSON.parse(item))
            })
              console.log('deviceListDump',this.deviceListDump)
             this.deviceListDump.forEach((item,index)=>{
                  this.deviceList_ip.push(item.ip)
             })
    
      },
      async getFirmwareVersionAndMAC(){
          console.log('iplist',this.deviceList_ip)

        // get firmware versions

            for (let [index,ip] of this.deviceList_ip.entries()) {
              // get Aspeed firmware versions
                let indexOfIP = this.deviceListDump.findIndex( my_ip => my_ip.ip == `${ip}`)
                console.log('index of ip',indexOfIP)
                const responseVersion = await fetch(`http://${ip}/cgi-bin/query.cgi?cmd=cat%20/etc/version`)
                const dataVersion= await responseVersion.text()
                //console.log(data)
                let deviceSummary = {}
                let resultVersion = dataVersion.replace(/[\n\r]/g, ',');  //remove CR with ,
                resultVersion = resultVersion.split(",").slice(5,-2) // convert string into array of substrings
               // console.log(result)
                this.deviceListDump[indexOfIP].fw_build = `${resultVersion[0]}`
                this.deviceListDump[indexOfIP].fw_version = `${resultVersion[1]}`
                console.log('updated dump', this.deviceListDump)

              // get Microchip MCU firmware versions
                const responseMcuVersion = await fetch(`http://${ip}/cgi-bin/query.cgi?cmd=cat%20/etc/mcu_version`)
                const dataMcuVersion= await responseMcuVersion.text()
                dataMcuVersion = dataMcuVersion.replace(/[\n\r]/g, '');  //remove CR 
                console.log(dataMcuVersion)
                this.deviceListDump[indexOfIP].mcu_version = dataMcuVersion

              // get MAC address by using 'astparam dump ro'command
                const responseDumpRo = await fetch(`http://${ip}/cgi-bin/query.cgi?cmd=astparam%20dump%20ro`)
                const dataDumpRo= await responseDumpRo.text()
                let resultDumpRo = dataDumpRo.replace(/[\n\r]/g, ',');  //remove CR with ,
                resultDumpRo = resultDumpRo.split(",")// convert string into array of substrings
                //console.log('dump ro', resultDumpRo)
                 // remove all items in array not contain 'ethaddr'
                let ethaddrOnly = resultDumpRo.filter(item => item.includes('ethaddr'))
                //console.log(ethaddrOnly)
                this.deviceListDump[indexOfIP].mac = ethaddrOnly[0].replace("ethaddr=","")
            }
              // Sort By IP
                this.deviceListDump = this.deviceListDump.sort(function(a, b) {
                    var A = a.ip.toUpperCase(); // ignore upper and lowercase
                    var B = b.ip.toUpperCase(); // ignore upper and lowercase
                    if (A < B) {
                      return -1; //A comes first
                    }
                    if (A > B) {
                      return 1; // B comes first
                    }
                      return 0;  // names must be equal

                  });

            this.showProgressBar = !this.showProgressBar
            return 'done'
      },
      findDuplicateIP(){
            
          const count = {}
          const duplicateIPs = []

          this.deviceList_ip.forEach(item => {
              if (count[item]) {
                count[item] +=1
                return
              }
              count[item] = 1
          })

          for (let prop in count){
              if (count[prop] >=2){
                  duplicateIPs .push(prop)
              }
          }

          // update with 'duplicate' in this.deviceListDump
          this.deviceListDump.forEach((device,index) =>{
              this.$set(this.deviceIPduplicate, index, false)
           
             duplicateIPs.forEach(item =>{
                if(item == device.ip){
                 // console.log('device',index,'is a duplicate')
                  this.$set(this.deviceIPduplicate, index, true)
  
              
                  
                }
             })
          })

          if(duplicateIPs.length > 0){
            alert('There are duplicate IP assigned to devices!')
           
          }
          console.log('Finally', this.deviceListDump)
          
  },

    cancel(e){
        e.preventDefault()
        this.$router.push({name:'home'})
    },
    
  },
 
  //Life Cycle Hooks
    mounted(){
        M.AutoInit() // For Materialize to work!
        window.scrollTo(0, 0) //Top of page
    },
    created(){
    
    }

}

</script>

<style scoped>

.box{
   display: flex;
   justify-content: center;
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
.btn{
  margin: 30px;
}
.gridItem{
  padding:5px;
  position:relative;
  border:1px solid lightgray;
  margin:1px;
  border-radius: 4px;
}

.warning{
  color:red;
}

.ok{
  border-left:5px solid green;
}
</style>